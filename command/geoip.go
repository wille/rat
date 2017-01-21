package main

import (
	"net"

	geoip2 "github.com/oschwald/geoip2-golang"
)

var (
	geoDatabase *geoip2.Reader
)

func init() {
	db, err := geoip2.Open("GeoLite2-Country.mmdb")
	geoDatabase = db

	if err != nil {
		panic(err)
	}
}

// GetCountry returns the country name and the country 2 char ISO code
// Returns empty strings if not found or something like localhost
func GetCountry(ip string) (string, string) {
	nip := net.ParseIP(ip)

	if nip == nil {
		panic("invalid ip")
	}

	country, err := geoDatabase.Country(nip)

	if err != nil {
		panic(err)
	}

	return country.Country.Names["en"], country.Country.IsoCode
}
