// @flow
import DB from "../libs/db";

export type Record = {
  id: number,
  name: string,
  usedTime: number,
};

export default class Channel {
  db: DB;

  constructor(){
    this.db = new DB("db/channels.json");
  }

  async save(channels: Record[]){
    await this.db.write(channels);
  }

  async getAll(): Promise<Record[]> {
    return await this.db.read();
  }
}
