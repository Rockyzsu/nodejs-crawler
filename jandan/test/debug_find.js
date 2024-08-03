require("dotenv").config();
const db = require("./mongodb");
const DB_URI = process.env.DB_URI;
db.connect(DB_URI);

const { janDanModel, createDoc, janDanStop } = require("./models.js");

async function findOne() {
  ret = await janDanModel
    .findOne({ comment_id: "5538618" }, "comment_id")
    .exec();
  console.log("is exist return ", typeof ret);
  console.log(ret);
  janDanStop()
}

findOne();
