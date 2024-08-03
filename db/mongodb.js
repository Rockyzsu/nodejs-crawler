const mongoose = require("mongoose");

module.exports = {
  connect: (DB_URL) => {
    // DB_HOST 是一个常数

    mongoose.connect(DB_URL, {});
    // Log an error if we fail to connect
    mongoose.connection.on("error", (err) => {
      console.error(err);
      console.log(
        "MongoDB connection error. Please make sure MongoDB is running."
      );
      process.exit();
    });
  },

  close: () => {
    mongoose.connection.close();
  },
};
