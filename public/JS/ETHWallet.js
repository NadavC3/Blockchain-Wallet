function createSeed() {
    // Generate a random seed phrase
    const seed = lightwallet.keystore.generateRandomSeed();
    // Update the seed input field
	document.getElementById("seed").value = seed;
	// Call function to generate addresses
	generateAddresses(seed);
}

function generateAddresses(seedPhrase) {
    // Retrieve seed phrase from input or parameter
    if (!seedPhrase) 
        seedPhrase = document.getElementById("seed").value;

    // Validate the seed phrase
    if (!isSeedValid(seedPhrase)) {
        displayMessage("Invalid seed phrase. Please enter a valid one.");
        return;
    }

    // Prompt for the number of addresses to generate
    var totalAddresses = prompt("Enter the number of addresses to generate:");

    // Validate the input for the number of addresses
    if (!isValidAddressCount(totalAddresses)) {
        displayMessage("Please enter a valid number of addresses.");
        return;
    }

    // Generate a random password
    var password = generateRandomPassword();

    // Create a vault with the seed phrase and password
    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: seedPhrase
    }, function(error, keystore) {
        keystore.keyFromPassword(password, function(error, pwDerivedKey) {
            if (error) {
                displayMessage("Error: " + error);
            } else {
                // Generate new addresses
                keystore.generateNewAddress(pwDerivedKey, totalAddresses);
                var addresses = keystore.getAddresses();

                // Initialize Web3 instance
                var web3 = new Web3(new Web3.providers.HttpProvider(' https://sepolia.infura.io/v3/01caef0730b141f4af942cae097c2b73'));

                // Construct HTML for addresses
                var html = "";

                // Loop through generated addresses
                for (var i = 0; i < addresses.length; i++) {
                    var address = addresses[i];
                    var privateKey = keystore.exportPrivateKey(address, pwDerivedKey);
                    var balance = web3.eth.getBalance("0x" + address);

                    // Format HTML for each address
                    html += "<li>";
                    html += "<p><b>Address: </b>0x" + address + "</p>";
                    html += "<p><b>Private Key: </b>0x" + privateKey + "</p>";
                    html += "<p><b>Balance: </b>" + web3.fromWei(balance, "ether") + " ether</p>";
                    html += "</li>";
                }

                // Display addresses in the designated element
                document.getElementById("list").innerHTML = html;
            }
        });
    });
}


// Validate seed phrase
function isSeedValid(seedPhrase) {
    return lightwallet.keystore.isSeedValid(seedPhrase);
}

// Validate number of addresses
function isValidAddressCount(totalAddresses) {
    return Number.isInteger(parseInt(totalAddresses));
}

// Generate a random password
function generateRandomPassword() {
    return Math.random().toString();
}

// Display messages to the user
function displayMessage(message) {
    document.getElementById("info").innerHTML = message;
}

function sendTransaction() {
    // Retrieve seed phrase from input
    var seedPhrase = document.getElementById("seed").value;

    // Check if the seed phrase is valid
    if (!isSeedValid(seedPhrase)) {
        displayMessage("Please enter a valid seed phrase.");
        return;
    }

    // Generate a random password
    var password = generateRandomPassword();

    // Create a vault with the seed phrase and password
    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: seedPhrase
    }, function (error, keystore) {
        keystore.keyFromPassword(password, function (error, pwDerivedKey) {
            if (error) {
                displayMessage("Error: " + error);
            } else {
                // Generate a new address
                keystore.generateNewAddress(pwDerivedKey, 1);

                // Set password provider for keystore
                keystore.passwordProvider = function (callback) {
                    callback(null, password);
                };

                // Initialize web3 provider with keystore transaction signer
                var provider = new HookedWeb3Provider({
                    host: "https://sepolia.infura.io/v3/01caef0730b141f4af942cae097c2b73",
                    transaction_signer: keystore
                });

                var web3 = new Web3(provider);

                // Retrieve sender and recipient addresses, and ether value
                var from = document.getElementById("fromAddress").value;
                var to = document.getElementById("toAddress").value;
                var value = web3.toWei(document.getElementById("amount").value, "ether");

                // Send transaction
                web3.eth.sendTransaction({
                    from: from,
                    to: to,
                    gasLimit: '0xC350',
                    gasPrice: '80000000000',
                    value: value,
                    gas: '21000' 
                }, function (error, result) {
                    if (error) {
                        displayMessage("Error: " + error);
                    } else {
                        displayMessage("Transaction hash: " + result);
                    }
                });
            }
        });
    });
}
// get sepolia here
//https://cloud.google.com/application/web3/faucet/ethereum/sepolia

//
//veteran road swear letter upon crash clip minor ginger elder next cruel
//
