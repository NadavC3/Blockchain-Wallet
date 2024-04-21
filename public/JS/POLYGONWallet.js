function createSeed() {
    // Generate a random seed phrase
    const seed = lightwallet.keystore.generateRandomSeed();
	document.getElementById("seed").value = seed;
	generateAddresses(seed);
}

function generateAddresses(seedPhrase) {
    if (!seedPhrase) 
        seedPhrase = document.getElementById("seed").value;

    if (!isSeedValid(seedPhrase)) {
        displayMessage("Invalid seed phrase. Please enter a valid one.");
        return;
    }

    var totalAddresses = prompt("Enter the number of addresses to generate:");

    if (!isValidAddressCount(totalAddresses)) {
        displayMessage("Please enter a valid number of addresses.");
        return;
    }

    var password = generateRandomPassword();

    // Create a vault with the seed phrase and password
    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: seedPhrase
    }, function(err, keystore) {
        keystore.keyFromPassword(password, function(err, pwDerivedKey) {
            if (err) {
                displayMessage("Error: " + err);
            } else {
                keystore.generateNewAddress(pwDerivedKey, totalAddresses);
                var addresses = keystore.getAddresses();

                var web3 = new Web3(new Web3.providers.HttpProvider(' https://polygon-amoy.infura.io/v3/27e5347d75bb43d6b075a8bc998c48a0'));

                // Construct HTML for addresses
                var html = "";

                for (var i = 0; i < addresses.length; i++) {
                    var address = addresses[i];
                    var privateKey = keystore.exportPrivateKey(address, pwDerivedKey);
                    var balance = web3.eth.getBalance("0x" + address);

                    html += "<li>";
                    html += "<p><b>Address: </b>0x" + address + "</p>";
                    html += "<p><b>Private Key: </b>0x" + privateKey + "</p>";
                    html += "<p><b>Balance: </b>" + web3.fromWei(balance, "ether") + " MATIC</p>";
                    html += "</li>";
                }

                // Display addresses in the designated element
                document.getElementById("list").innerHTML = html;
            }
        });
    });
}


function isSeedValid(seedPhrase) {
    return lightwallet.keystore.isSeedValid(seedPhrase);
}

function isValidAddressCount(totalAddresses) {
    return Number.isInteger(parseInt(totalAddresses));
}

function generateRandomPassword() {
    return Math.random().toString();
}

function displayMessage(message) {
    document.getElementById("info").innerHTML = message;
}

function sendTransaction() {
    var seedPhrase = document.getElementById("seed").value;

    if (!isSeedValid(seedPhrase)) {
        displayMessage("Please enter a valid seed phrase.");
        return;
    }

    var password = generateRandomPassword();

    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: seedPhrase
    }, function (err, keystore) {
        keystore.keyFromPassword(password, function (err, pwDerivedKey) {
            if (err) {
                displayMessage("Error: " + err);
            } else {
                keystore.generateNewAddress(pwDerivedKey, 1);

                keystore.passwordProvider = function (callback) {
                    callback(null, password);
                };

                // Initialize web3 provider with keystore transaction signer
                var provider = new HookedWeb3Provider({
                    host: "https://polygon-amoy.infura.io/v3/27e5347d75bb43d6b075a8bc998c48a0",
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

//
//garlic fiction spare witness toy burger cry ability trash prize fine later
//
