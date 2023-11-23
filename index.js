const { initializeServer } = require("./server");
require("dotenv").config();

const { server } = initializeServer();

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server Started at port ${process.env.PORT || 8080}`);
});
  