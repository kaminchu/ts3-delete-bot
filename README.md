# ts3-delete-bot

TeamSpeak3 Channel Delete bot.

## なにこれ

TeamSpeak3を監視して利用のないチャンネルを消してくれるやつ

## Installation
`yarn`でよしなに
```
$ yarn install
$ yarn build
```

config.jsonを書き換える  
`excludeIds`:削除対象から外したいchannelのID  
`lifeTime`:ユーザーがどれだけ利用しないと削除するか(ミリ秒)
```
$ nano config.json
```

```json
{
  "host": "localhost",
  "port": 10011,
  "user": "serveradmin",
  "password": "xxxxxxxx",
  "excludeIds": [],
  "lifeTime": 2592000000
}
```

監視DBの作成
```
$ mkdir -p db
$ echo [] > db/channel.json
```

cronの登録  
※`node`の場所を`$ which node`などで確認しておくといいよ
```
$ crontab -e
```

```
*/5 *   *   *   *   /usr/local/bin/node  /path/to/index.js 1> /dev/null
```
