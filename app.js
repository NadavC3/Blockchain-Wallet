const express = require("express");  
const app = express();  

app.get("/", function(req, res){
	res.sendFile(__dirname + "/index.html");
})


const port = 8000
app.listen(port);
console.log("Listening on port ",port);