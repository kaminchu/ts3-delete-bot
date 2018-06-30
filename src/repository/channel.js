// @flow
import _ from "lodash";
import DB from "../libs/db";


type Record = {
  id: number,
  name: string,
  usedTime: number,
};

export default class Channel {
  db: DB;

  constructor(){
    this.db = new DB("db/channels.json");
  }

  async save(channels: Record[]): void {
    return await this.db.write(channels);
  }

  async getAll(): void {
    return await this.db.read();
  }
}