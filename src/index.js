// @flow
import "babel-polyfill";
// TODO test
import CannelRepository from "./repository/channel";

const obj = {
  aaa: "aaaa",
  bbb: "bbbb"
};

(async () => {
  const repository = new CannelRepository();
  await repository.save(obj);

})();
