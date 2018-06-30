// @flow
import uniq from "lodash/uniq";
import TS3 from "./libs/ts3";
import Repository from "./repository/channel";
import type {Record} from "./repository/channel";

type TS3Channel = {
  id: number,
  name: string,
  active: boolean,
  pId: number
}

export default class Deleter {
  host: string;
  port: number;
  user: string;
  password: string;
  excludeIds: number[];
  lifeTime: number;
  current: number;

  constructor(host, port, user, password, excludeIds, lifeTime){
    this.host= host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.excludeIds = excludeIds;
    this.lifeTime = lifeTime;
    this.current = Date.now();
  }

  async _fetchTS3Channels(): TS3Channel[]{
    const ts3 = new TS3(this.host, this.port);
    ts3.open();
    await ts3.login(this.user, this.password);
    await ts3.use(1);
    const channels = await ts3.channels();
    await ts3.logout();
    ts3.close();
    return channels
      .map(({cid, pid, channel_name, total_clients}) => ({id: +cid, pId: +pid, name: channel_name, active: 0 < +total_clients}));
  }

  async _deleteChannels(channelIds: number[]){
    const ts3 = new TS3(this.host, this.port);
    ts3.open();
    await ts3.login(this.user, this.password);
    await ts3.use(1);
    await channelIds.forEach(async id => {
      await ts3.deleteChannel(id);
    });
    await ts3.logout();
    ts3.close();
  }

  async _fetchRegisteredChannels(): Promise<Record[]>{
    const repository = new Repository();
    return await repository.getAll();
  }

  generateTS3ActiveChannelIds(channels: TS3Channel[]): number[] {
    const ganaratedIds = [];
    const generater = (id: number) => {
      const activeChannel = channels.find(ch => ch.id === id);
      if(activeChannel && activeChannel.pId !== 0){
        ganaratedIds.push(activeChannel.pId);
        generater(activeChannel.pId);
      }
    };
    const activeChannels = channels.filter(({active}) => active);
    activeChannels.forEach(({id}) => {
      ganaratedIds.push(id);
      generater(id);
    });
    return uniq(ganaratedIds);
  }

  async init(registeredChannels: Record[], ts3Channels: TS3Channel[]): boolean {
    if (!registeredChannels || !Array.isArray(registeredChannels) || registeredChannels.length < 1) {
      const repository = new Repository();
      const activeChannels = ts3Channels.map(({id, name}) => ({id, name, usedTime: this.current}));
      await repository.save(activeChannels);
      return true;
    } else {
      return false;
    }
  }

  async delete(){
    const ts3Channels = await this._fetchTS3Channels();
    const registeredChannels = await this._fetchRegisteredChannels();

    if (await this.init(registeredChannels, ts3Channels)) return;

    const ts3ChannelIds = this.generateTS3ActiveChannelIds(ts3Channels);
    const registeredChannelIds = registeredChannels.filter(({usedTime}) => this.current < (usedTime + this.lifeTime)).map(({id}) => id);
    const spacerChannelIds = ts3Channels.filter(({name}) => name.match(/\[cspacer/)).map(({id}) => id);
    const activeIds = uniq([].concat(ts3ChannelIds, registeredChannelIds, spacerChannelIds, this.excludeIds));
    const deleteIds = ts3Channels
      .filter(({id}) => !activeIds.includes(id))
      .map(({id}) => id);

    await this._deleteChannels(deleteIds);

    const activeChannels = activeIds
      .map(saveId => {
        const registeredChannel = registeredChannels.find(({id}) => saveId === id);
        const channel = ts3Channels.find(({id}) => saveId === id) || registeredChannel;
        const isNotModify = !ts3ChannelIds.includes(saveId) && registeredChannelIds.includes(saveId);
        const usedTime = channel && isNotModify ? (registeredChannel ? registeredChannel.usedTime : this.current) : this.current;
        return channel && {
          id: channel.id,
          name: channel.name,
          usedTime: usedTime,
        };
      }).filter(elm => !!elm);
    const repository = new Repository();
    await repository.save(activeChannels);
  }
}
