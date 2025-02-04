# MultiCurrency HD Wallet

## Overview
This is a MultiCurrency HD (Hierarchical Deterministic) wallet supporting two cryptocurrencies:
- **Ethereum**
- **Celo**

### Benefits of HD Wallet:
- **Security**: HD wallets generate all keys from a single seed, meaning a single backup secures all your future keys.
- **Convenience**: No need to manage multiple private keys. A single mnemonic phrase can generate multiple addresses.
- **Compatibility**: Supports Ethereum and Celo, allowing for easy cross-currency transactions.

## Technologies Used:
- **Node.js**
- **Express**
- **Web3.js**
- **HTML/CSS**

## How to Run:
1. Open terminal and run the command:  
   `node ./app.js`
2. Open your browser and navigate to:  
   [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Features:
MultiCurrency HD wallet supports two types of cryptocurrencies:
1. Ethereum
2. Celo

### Using the Wallet:
- **Generate Seed**: Click to generate a mnemonic phrase (seed).

  ![Generate Seed Screenshot](Screenshots/generate_seed.png)

- **Pre-generated Seed**: For demo purposes, use the following mnemonic:  
  `veteran road swear letter upon crash clip minor ginger elder next cruel`

- **Generate Addresses**: Enter your mnemonic phrase and click "Generate Addresses" to view addresses, private keys, and balances.

  ![Generate Seed Screenshot](Screenshots/generate_address.png)
  ![Generate Seed Screenshot](Screenshots/num_of_seeds.png)

### Sending Transactions:
1. Enter the "From Address" and "To Address".
2. Specify the amount of Ethereum or Celo to send.
3. Click "Send Transaction" and view the transaction hash.

  ![Generate Seed Screenshot](Screenshots/send.png)

### Updating Balances:
Refresh the address balances by clicking "Generate Addresses" again after a transaction.

### Switching Currency:
Navigate to the Celo page using the top navigation bar. You can reuse the same mnemonic to generate Celo addresses and send transactions.

  ![Generate Seed Screenshot](Screenshots/change_currency.png)
  ![Generate Seed Screenshot](Screenshots/celo.png)
