// 定义表结构
require("dotenv").config();
const db = require("../db/mongodb");
const DB_URI = process.env.DB_URI;
db.connect(DB_URI);

const mongoose = require("mongoose");
const doc = new mongoose.Schema({
  comment_id: {
    type: String,
    unique: true,
  },
  author: {
    type: String,
  },
  content: {
    type: String,
  },
  vote: {
    type: Number,
  },
  part: {
    type: String,
  },
  updated: {
    type: String,
  },
});

const janDanModel = mongoose.model("jandan_treehole", doc, "jandan_treehole");

async function isExist(comment_id_) {
  ret = await janDanModel.findOne({ comment_id: comment_id_ }, "comment_id").exec();
  // console.log("is exist return ", ret);
  return ret;
}
async function createDoc(obj) {
  if (await isExist(obj.comment_id)) {
    console.log("update:" + obj.comment_id);
    console.log(obj.updated);
    let ret_obj = await janDanModel.findOneAndUpdate({ comment_id: obj.comment_id }, { vote: obj.vote, updated: obj.updated }, { returnOriginal: false });
    return;
  }

  try {
    // console.log("inserted ", obj);
    await janDanModel.create(obj);
  } catch (e) {
    // console.log("dup");
    // console.log(e);
  }
}

async function janDanStop() {
  //   await mongoose.disconnect();
  await mongoose.connection.close();
}

module.exports = { janDanModel, createDoc, janDanStop };
