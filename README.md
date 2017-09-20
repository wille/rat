# Remote Administration Tool

[**Building**](BUILDING.md) **|** [**Manifest**](MANIFEST.md)


# GeoIP database

Download `GeoLite2-Country.mmdb.gz` [Maxmind](http://dev.maxmind.com/geoip/geoip2/geolite2/)
and ungzip it to the `command` folder

# Building behaviour

## Production
- Client will read configuration from [config.json](client/config.json)

## Development

- Client will read configuration from itself

# Tested systems

- **Windows**
	- Windows 10 Pro x64
- **macOS**
    - macOS 10.12 Sierra
	- Mac OS X 10.10 Yosemite
- **Linux**
    - Debian 9 stretch x64
	- Debian 8 jessie x64
