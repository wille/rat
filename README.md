# Remote Administration Tool

[![Travis](https://img.shields.io/travis/com/wille/rat?label=travis)](https://godoc.org/github.com/wille/rat)
[![GoDoc](https://godoc.org/github.com/wille/rat?status.svg)](https://godoc.org/github.com/wille/rat)
[![Go Report Card](https://goreportcard.com/badge/github.com/wille/rat)](https://goreportcard.com/report/github.com/wille/rat)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/wille/rat)](https://github.com/wille/rat)

[**Building**](BUILDING.md)

# GeoIP database

Download `GeoLite2-Country.mmdb.gz` [Maxmind](http://dev.maxmind.com/geoip/geoip2/geolite2/)
and ungzip it to the `command` folder

# Building behaviour

## Production

- Client will read configuration from [config.json](client/config.json)

## Development

- Client will read configuration from itself

# Tested systems

- **Windows** - Windows 10 Pro x64
- **macOS**
  - macOS 10.12 Sierra - Mac OS X 10.10 Yosemite
- **Linux**
  - Debian 9 stretch x64 - Debian 8 jessie x64
