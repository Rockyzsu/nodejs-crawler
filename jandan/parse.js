const cheerio = require("cheerio");

function getCurrentTime() {
  currentDate = new Date();
  const timestamp = currentDate.getTime();
  const timezoneTimestamp = timestamp + 3600 * 8 * 1000;
  // 创建一个新的 Date 对象，表示当前时区时间
  const timezoneDate = new Date(timezoneTimestamp);
  return timezoneDate.toISOString();
}

function parse(content) {
  const $ = cheerio.load(content);
  let result = [];
  $("ol.commentlist > li").each(function () {
    let comment_id = $(this).attr("id");
    console.log("comment-id", comment_id);
    comment_id = comment_id.split("-")[1];
    console.log("id ", comment_id);
    let author = $(this).find("div.row > div.author > strong").text();
    let content = $(this).find("div.row > div.text > p").text();
    let vote = $(this)
      .find("div.row > div.jandan-vote > span.tucao-like-container > span")
      .text();

    result.push({
      comment_id: comment_id,
      author: author,
      content: content,
      vote: Number(vote),
      part: "treehole",
      updated: getCurrentTime(),
    });
  });
  return result;
}

module.exports = parse;
