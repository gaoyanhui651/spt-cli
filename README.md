# spt-cli
> internet connection speed and ping and so on

## Install

ensure you have [Node.js](https://nodejs.org) version 8+ installed. Then run the following:

```bash
$ npm install -g speed-cli
```

## Usage

```bash
$ spt -h

  Usage: spt <command> [options]
  Options:
    -V, --version        output the version number
    -h, --help           output usage information

  Commands:
    test                 test network speet
    ip [options] [host]  get ip address the local or input host public or internal

```
  #### SubCmd Usage

  - test

  ```bash
  $ spt test -h
  Usage: spt test [options]

  test network speet

  Options:
    -b --bytes [boolean]  output the result in megabytes per second (MBps) (default: false)
    -t --time [number]    the maximum length (in ms) of a single test run (upload or download) (default: 3000)
    -p --proxy [url]      The proxy for upload or download, support http and https
    -h, --help            output usage information
  
  ```

  - list
  
  ```bash
    $ spt list -h
    Usage: spt list [options] [line]

  show network speet history

  Options:
    -c --clear [boolean]    clear all network speet history (default: false)
    -b --bytes [boolean]    output the result in megabytes per second (MBps) (default: false)
    -v --verbose [boolean]  output more detailed information (default: false)
    -h, --help              output usage information

  Examples:

      # 展示网络测速记录 默认最新的3条
      $ spt list

      # 展示 6条 网络测速详细记录
      $ spt list 6 -s

      # 清除所有的网络测速记录
      $ spt list -c
  ```

  - ip

  ```bash
  $ spt ip -h
  Usage: spt ip [options] [host]

  get ip address the local or input host public or internal

  Options:
    -t --type [type]  select network type (default: "all")
    -h, --help        output usage information

  Examples:

      # 获取本机的公网和局域网ip
      $ spt ip

      # 只获取本机的公网地址
      $ spt ip -t public

      # 获取指定网址的公网地址
      $ spt ip baidu.com
  ```

## Show your support

Give a ⭐️ if this project helped you!

## License

[MIT](https://github.com/gaoyanhui651/spt-cli/blob/master/LICENSE)