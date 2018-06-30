// @flow
import jsonfile from "jsonfile";

type Config = {
  host: string,
  port: number,
  user: string,
  password: string,
  excludeIds: number[],
  lifeTime: number
};

export function config(): Promise<Config> {
  return new Promise((resolve, reject) => {
    const option = {
      encoding: "utf-8",
      reviver: null,
      throws: true,
    };
    jsonfile.readFile("config.json", option, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}