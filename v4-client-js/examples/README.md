Examples for the v4-Client Typescript client to place an order and query the dYdX chain.

## Development

`v4-client-js` uses node `v18` for development. You can use `nvm` to manage different versions of node.

```
nvm install
nvm use
nvm alias default $(nvm version) # optional
```

You can run the following commands to ensure that you are running the correct `node` and `npm` versions.

```
node -v # expected: v18.x.x (should match .nvmrc)
npm -v  # expected: 10.x.x (e.g. we use 10.2.4 here)
```

## Quickstart

### 1. Clone or fork the examples repo

```bash
git clone git@github.com:dydxfoundation/solutions-public.git
```

### 2. Go to one of the examples and Setup your mnemonic

- Go to `v4-client-js/examples`

```bash
cd v4-client-js/examples
```

- Copy the `.env.example` under `/src` and rename as `.env` file.
  Now make sure to fill in the following parameters:

```bash
# Network parameters
ADDRESS=your_dydx_address_here
MNEMONIC=your_mnemonic_here
NETWORK_TYPE=testnet # Use "mainnet" for main network
```

- For testnet, feel free to use `DYDX_TEST_MNEMONIC` from the official TS client library under `v4-client-js/examples/constants`.
- For Mainnet change `NETWORK_TYPE` to `mainnet` and fill in your own `ADDRESS` and `MNEMONIC`.

### 3a. Run the scripts with node

```bash
npm install
npm run build
```

You should now see a `/build` dir generated with JS files. We will use node to run these scripts

- Open a terminal to run the example orders.

```bash
node build/orderExample.js
```

- (OPTIONAL) Run the websocket to check orders for a given subaccount.

```bash
node build/websocketExample.js
```

### 3b. Run the scripts with ts-node

Alternatively you can run directly with ts-node for development purpose.

```bash
npm install
npm install typescript ts-node
```

- Open a terminal to run the example orders.

```bash
node build/orderExample.js
```

- (OPTIONAL) Run the websocket to check orders for a given subaccount.

```bash
node build/websocketExample.js
```
