// @flow
import {Client} from "teamspeak";

export default class TS3 {
  host: string;
  port: number;
  query: any;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  open(): void {
    this.query = new Client(this.host, this.port);
  }
 
  close(): void {
    this.query = null;
  }

  async use(serverId: number) {
    await this.query.send("use", "" + serverId);
  }

  async channels(): Promise<any> {
    return await this.query.send("channellist");
  }

  async deleteChannel(channelId: number) {
    await this.query.send("channeldelete", {cid: channelId + "", force: "0"});
  }

  async login(user: string, pass: string) {
    await this.query.authenticate(user, pass);
  }

  async logout() {
    await this.query.send("logout");
  }
}
