// @flow
import "babel-polyfill";
// TODO test
import DB from "./libs/db";

const obj = {
  aaa: "aaaa",
  bbb: "bbbb"
};

(async () => {
  const db = new DB();
  await db.write(obj);

  const result = await db.read();
  console.log(result);
})();
