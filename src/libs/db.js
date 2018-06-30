// @flow
import jsonfile from "jsonfile";

export default class DB {
  path: string;
  encoding: string;

  constructor(path: string){
    // default setting
    this.path = path;
    this.encoding = "utf-8";
  }

  setEncoding(encoding: string): void {
    this.encoding = encoding;
  }

  write(data: any): Promise<void> {
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
