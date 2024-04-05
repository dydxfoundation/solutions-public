import { config } from 'dotenv';
import { Network } from '@dydxprotocol/v4-client-js';
import { IncomingMessageTypes, SocketClient } from '@dydxprotocol/v4-client-js/build/src/clients/socket-client';

// Load environment variables
config();

function test(): void {
  const address = process.env.ADDRESS || 'dydx14zzueazeh0hj67cghhf9jypslcf9sh2n5k6art';
  console.log(address)

  const networkType = process.env.NETWORK_TYPE;
  let network;
  if (networkType === 'mainnet') {
    network = Network.mainnet();
  } else {
    network = Network.testnet();
  }

  const mySocket = new SocketClient(
    network.indexerConfig,
    () => {
      console.log('socket opened');
    },
    () => {
      console.log('socket closed');
    },
    (message) => {
      console.log(message);
      if (typeof message.data === 'string') {
        const jsonString = message.data as string;
        try {
          const data = JSON.parse(jsonString);
          if (data.type === IncomingMessageTypes.CONNECTED) {
            // mySocket.subscribeToMarkets(); // Check market prices
            mySocket.subscribeToSubaccount(address, 0);
            console.log(data);
          }
        } catch (e) {
          console.error('Error parsing JSON message:', e);
        }
      }
    },
  );
  mySocket.connect();
}

test();
