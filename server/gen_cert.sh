#!/bin/sh

openssl genrsa -out private.pem 2048
openssl req -new -sha256 -key private.pem -out csr.pem
openssl x509 -req -in csr.pem -signkey private.pem -out cert.pem
rm csr.pem