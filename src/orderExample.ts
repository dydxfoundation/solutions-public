import { config } from 'dotenv';
import {
  Network,
  CompositeClient,
  BECH32_PREFIX,
  LocalWallet,
  OrderFlags,
  SubaccountClient,
  OrderSide,
  OrderType,
  OrderExecution,
  OrderTimeInForce,
  IndexerClient,
} from '@dydxprotocol/v4-client-js';

import ordersParams from './human_readable_orders.json';

// Load environment variables
config();

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test(): Promise<void> {

  const networkType = process.env.NETWORK_TYPE;
  let network;
  if (networkType === 'mainnet') {
    network = Network.mainnet();
  } else {
    network = Network.testnet();
  }

  const client = await CompositeClient.connect(network);
  console.log('**Client**');
  console.log(client);

  const indexerClient = new IndexerClient(network.indexerConfig);

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
      throw new Error('MNEMONIC is not defined in the environment variables.');
  }

  const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
  console.log(wallet);

  const subaccount = new SubaccountClient(wallet, 0);

  for (const orderParams of ordersParams) {

    const clientId = 123; // set to a number, can be used by the client to identify the order
    const market = orderParams.market ?? 'BTC-USD';
    const type = OrderType[orderParams.type as keyof typeof OrderType]; // order type
    const side = OrderSide[orderParams.side as keyof typeof OrderSide]; // side of the order
    // TimeInForce indicates how long an order will remain active before it is executed or expires
    const timeInForce = OrderTimeInForce[orderParams.timeInForce as keyof typeof OrderTimeInForce];
    const goodTilTimeInSeconds1 = (timeInForce === OrderTimeInForce.GTT) ? 350 : 0;
    const execution = OrderExecution.DEFAULT;
    const price = orderParams.price ?? 10000;
    const size = orderParams.size ?? 0.01;
    const postOnly = orderParams.postOnly ?? false; // If true, order is post only
    const reduceOnly = orderParams.reduceOnly ?? false; // if true, the order will only reduce size

    try {
      const tx = await client.placeOrder(
        subaccount,
        market,
        type,
        side,
        price,
        size,
        clientId,
        timeInForce,
        goodTilTimeInSeconds1,
        execution,
        postOnly,
        reduceOnly,
      );
      console.log('**Order Tx**');
      console.log(tx);
    } catch (error) {
      console.log(error.message);
    }

    await sleep(5000);  // wait for placeOrder to complete

    const address = process.env.ADDRESS || 'dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art';
    console.log(address)
    const response = await indexerClient.account.getSubaccountOrders(address, 0);
    const orders = response;
    if (orders.length > 0) {
      const order0 = orders[0];
      console.log(order0);
      if (order0.status !== 'FILLED') {
        await sleep(300000);  // wait for placeOrder to complete

        const goodTillTimeInSeconds2 = 350;
        const orderFlags = OrderFlags.LONG_TERM;
        const goodTillBlock = 0;
        try {
          const tx = await client.cancelOrder(
            subaccount,
            clientId,
            orderFlags,
            market,
            goodTillBlock,
            goodTillTimeInSeconds2,
          );
          console.log('**Cancel Order Tx**');
          console.log(tx);

        } catch (error) {
          console.log(error.message);
        }
      }
    }
  }
}

test().then(() => {
}).catch((error) => {
  console.log(error.message);
});
