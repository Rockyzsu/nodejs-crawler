const axios = require("axios");
const cheerio = require("cheerio");
const parse = require("./parse.js");
require("dotenv").config();
const db = require("../db/mongodb");
const DB_URI = process.env.DB_URI;
console.log('=============')
console.log(DB_URI);
console.log('=============')

db.connect(DB_URI);
const { janDanModel, createDoc, janDanStop } = require("./models.js");

const log4js = require("log4js");
log4js.configure({
  appenders: {
    app: { type: "file", filename: "app_jack.log" },
  },
  categories: {
    default: { appenders: ["app"], level: "trace" },
    app: { appenders: ["app"], level: "trace" },
  },
});
const app_logger = log4js.getLogger("app");
app_logger.level = "tract";
app_logger.trace("App started");

axios.defaults.headers.common["User-Agent"] = "Googlebot/2.1 (+http://www.google.com/bot.html)";

const categories = {
  treehole: "https://jandan.net/treehole",
};
// const base_url = "https://jandan.net/treehole";

async function crawler(cate, count) {
  if (count < 0) {
    return;
  }
  const url = categories[cate]
  let response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const urls = $('a[title="Older Comments"]');

  ret = parse(response.data);
  for (let item of ret) {
    await dump_mongoDB(cate,item);
  }

  if (urls.length > 1) {
    let next_url = $(urls[1]).attr("href");
    next_url = "https:" + next_url;
    console.log(next_url);
    await crawler(next_url, count - 1); // 递归调用,获取全部数据
  }
}

async function dump_mongoDB(cate,obj) {
  // console.log(obj);
  obj.category = cate;
  // await createDoc(obj);
  console.log(obj);
  //   await janDanStop();
}

async function main() {
  const count = 30;
  for (let cate in categories) {
    await crawler(cate, count);
  }
  setTimeout(janDanStop, 30000);
}

main();
