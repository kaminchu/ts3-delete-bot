// @flow
import jsonfile from "jsonfile";

export default class DB {
  path: string;
  encoding: string;

  constructor(){
    // default setting
    this.path = "db.json";
    this.encoding = "utf-8";
  }

  setEncoding(encoding: string): void {
    this.encoding = encoding;
  }

  setPath(path: string): void {
    this.path = path;
  }

  write(data: Object): Promise<void> {
    return new Promise((resolve, reject) => {
      const option = {
        encoding: this.encoding, 
        replacer: null, 
        spaces: null,
      };
      jsonfile.writeFile(this.path, data, option, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  read(): Promise<Object> {
    return new Promise((resolve, reject) => {
      const option = {
        encoding: this.encoding, 
        reviver: null, 
        throws: true,
      };
      jsonfile.readFile(this.path, option, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

  }
}
