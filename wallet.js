// import ethers from 'ethers';
// import BIP39 from 'bip39';
// import axios from 'axios';
// import bitcoin from 'bitcoinjs-lib';

// NowNodes API endpoint
const API_URL = 'https://api.nownodes.io/coin-specific/';

//////////////////////////////////////////////
/*                  Create                  */
//////////////////////////////////////////////

// Function to create a new account
function createAccount(currency) {
    switch(currency) {
        case 'BTC':
            return createBitcoinAccount();
        case 'ETH':
            return createEthereumAccount();
        default:
            throw new Error('Unsupported currency');
    }
}



function createBitcoinAccount() {
    const privateKeyPair = bitcoin.ECPair.make();

    //private key
    //const privateKey = Bitcoin.ECPair.makeRandom();
    console.log("privateKey = ",privateKey);
    //public key
    const address = privateKey.getAddress();

    return {address, privateKey};
}



// Function to create a new Ethereum account
async function createEthereumAccount() {
    // Generate new wallet
    const wallet = ethers.Wallet.createRandom();

    // Get address and mnemonic
    const address = wallet.address;
    const mnemonic = wallet.mnemonic.phrase;
    const privateKey = wallet.privateKey;


    return { mnemonic, address, privateKey };
}



//////////////////////////////////////////////
/*                 Restore                  */
//////////////////////////////////////////////




// Function to restore an account
function restoreAccount(currency, mnemonic) {
    switch(currency) {
        case 'BTC':
            return restoreBitcoinAccount(mnemonic);
        case 'ETH':
            return restoreEthereumAccount(mnemonic);
        default:
            throw new Error('Unsupported currency');
    }
}

// Function to restore a Bitcoin account using mnemonic
function restoreBitcoinAccount(mnemonic) {
    // Derive seed from mnemonic
    const seed = bitcoin.mnemonicToSeedSync(mnemonic);

    // Derive root node
    const root = bitcoin.bip32.fromSeed(seed);

    // Derive account node (first account)
    const account = root.derivePath("m/44'/0'/0'/0/0");

    // Get address and private key
    const address = bitcoin.payments.p2pkh({ pubkey: account.publicKey }).address;
    const privateKey = account.toWIF();

    return { address, privateKey };
}

// Function to restore an Ethereum account using mnemonic
async function restoreEthereumAccount(mnemonic) {
    // Decrypt wallet with mnemonic and password
    const wallet = await ethers.Wallet.fromEncryptedJson(mnemonic, 'password');

    // Get address
    const address = wallet.address;

    return { address };
}



//////////////////////////////////////////////
/*                 Balance                  */
//////////////////////////////////////////////



// Function to check balance
async function checkBalance(currency, address) {
    switch(currency) {
        case 'BTC':
            return checkBitcoinBalance(address);
        case 'ETH':
            return checkEthereumBalance(address);
        default:
            throw new Error('Unsupported currency');
    }
}

// Function to check Bitcoin balance
async function checkBitcoinBalance(address) {
    try {
        const response = await axios.get(`${API_URL}BTC/balance`, {
            params: {
                address: address
            }
        });
        return response.data.balance;
    } catch (error) {
        throw new Error('Failed to fetch Bitcoin balance');
    }
}

// Function to check Ethereum balance
async function checkEthereumBalance(address) {
    try {
        const response = await axios.get(`${API_URL}ETH/balance`, {
            params: {
                address: address
            }
        });
        return response.data.balance;
    } catch (error) {
        throw new Error('Failed to fetch Ethereum balance');
    }
}



//////////////////////////////////////////////
/*                Transaction               */
//////////////////////////////////////////////



// Function to send transaction
async function sendTransaction(currency, senderPrivateKey, recipient, amount) {
    switch(currency) {
        case 'BTC':
            return sendBitcoinTransaction(senderPrivateKey, recipient, amount);
        case 'ETH':
            return sendEthereumTransaction(senderPrivateKey, recipient, amount);
        default:
            throw new Error('Unsupported currency');
    }
}


async function sendBitcoinTransaction(senderPrivateKey, recipient, amount) {
    try {
        // Fetch UTXOs (unspent transaction outputs)
        const utxosResponse = await axios.get(`${API_URL}BTC/utxo`, {
            params: {
                address: bitcoin.payments.p2pkh({ address: senderPrivateKey }).address
            }
        });
        const utxos = utxosResponse.data.utxos;

        // Create transaction builder
        const txb = new bitcoin.TransactionBuilder();
        
        // Add inputs
        for (const utxo of utxos) {
            txb.addInput(utxo.txid, utxo.vout);
        }

        // Add output
        txb.addOutput(recipient, amount);

        // Sign transaction
        for (let i = 0; i < utxos.length; i++) {
            txb.sign(i, bitcoin.ECPair.fromWIF(senderPrivateKey));
        }

        // Build and broadcast transaction
        const txHex = txb.build().toHex();
        const broadcastResponse = await axios.post(`${API_URL}BTC/broadcast`, {
            tx: txHex
        });

        return broadcastResponse.data;
    } catch (error) {
        throw new Error('Failed to send Bitcoin transaction');
    }
}

// Function to send Ethereum transaction
async function sendEthereumTransaction(senderPrivateKey, recipient, amount) {
    try {
        // Create provider
        const provider = new ethers.providers.JsonRpcProvider();

        // Decrypt wallet
        const wallet = await ethers.Wallet.fromEncryptedJson(senderPrivateKey, 'password');

        // Connect wallet to provider
        const connectedWallet = wallet.connect(provider);

        // Send transaction
        const tx = await connectedWallet.sendTransaction({
            to: recipient,
            value: ethers.utils.parseEther(amount.toString())
        });

        return tx.hash;
    } catch (error) {
        throw new Error('Failed to send Ethereum transaction');
    }
}






