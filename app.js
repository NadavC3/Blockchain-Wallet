const express = require("express");  
const app = express();  

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define routes
app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/html/index.html");
});
app.get("/index", function(req, res){
    res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/index2", function(req, res){
    res.sendFile(__dirname + "/public/html/index2.html");
});

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log("Listening on port", port);
});
