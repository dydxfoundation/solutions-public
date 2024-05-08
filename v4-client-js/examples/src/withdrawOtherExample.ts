import { config } from 'dotenv';
import { EncodeObject } from '@cosmjs/proto-signing';
import { Method } from '@cosmjs/tendermint-rpc';
import Long from 'long';

import {
    BECH32_PREFIX,
    Network,
    LocalWallet,
    SubaccountInfo,
    ValidatorClient,
} from '@dydxprotocol/v4-client-js';

// Load environment variables
config();

async function test(): Promise<void> {

  const networkType = process.env.NETWORK_TYPE;
  let network;
  if (networkType === 'mainnet') {
    network = Network.mainnet();
  } else {
    network = Network.testnet();
  }
    
    const client = await ValidatorClient.connect(network.validatorConfig);
    console.log('**Client**');
    console.log(client);
    const TEST_RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS
    
    const mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error('MNEMONIC is not defined in the environment variables.');
    }
    const wallet = await LocalWallet.fromMnemonic(mnemonic, BECH32_PREFIX);
    console.log(wallet);
    const subaccount = new SubaccountInfo(wallet, 0);
    console.log('**Subaccount**');
    console.log(subaccount);

    const withdrawalAmount = process.env.WITHDRAWAL_AMOUNT;
    if (!withdrawalAmount) {
      throw new Error('WITHDRAWAL_AMOUNT is not defined in the environment variables.');
   }
    const amount = new Long(parseInt(withdrawalAmount, 10));

  const msgs: Promise<EncodeObject[]> = new Promise((resolve) => {
    const msg = client.post.composer.composeMsgWithdrawFromSubaccount(
      subaccount.address,
      subaccount.subaccountNumber,
      0,
      amount,
      TEST_RECIPIENT_ADDRESS,
    );

    resolve([msg]);
  });

  const totalFee = await client.post.simulate(
    subaccount.wallet,
    () => msgs,
    undefined,
  );
  console.log('**Total Fee**');
  console.log(totalFee);

  const amountAfterFee = amount.sub(Long.fromString(totalFee.amount[0].amount));
  console.log('**Amount after fee**');
  console.log(amountAfterFee);

  const tx = await client.post.withdraw(
    subaccount,
    0,
    amountAfterFee,
    TEST_RECIPIENT_ADDRESS,
    Method.BroadcastTxCommit,
  );
  console.log('**Withdraw and Send**');
  console.log(tx);
}

test()
  .then(() => {})
  .catch((error) => {
    console.log(error.message);
  });
