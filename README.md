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
	- Mac OS X 10.10 Yosemite
- **Linux**
	- Debian 8 x64
