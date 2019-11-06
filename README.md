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

## License

[MIT](https://github.com/gaoyanhui651/spt-cli/blob/master/LICENSE)