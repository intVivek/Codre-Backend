// Import the initializeServer function from the server file
const initializeServer = require("./server");

// Load environment variables from the .env file
require("dotenv").config();

// Initialize the server and get the server object
const { server } = initializeServer();

// Start listening on the specified port or default to 8080
server.listen(process.env.PORT || 8080, () => {
    console.log(`Server Started at port ${process.env.PORT || 8080}`);
});
