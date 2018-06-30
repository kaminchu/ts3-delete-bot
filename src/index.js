// @flow
import "babel-polyfill";

// TODO test
import * as Reader from "./libs/reader";
import Deleter from "./deleter";


(async () => {
  const config = await Reader.config();
  const deleter = new Deleter(
    config.host,
    config.port,
    config.user,
    config.password,
    config.excludeIds,
    config.lifeTime
  );
  await deleter.delete();
  process.exit(0);
})();

