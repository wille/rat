BUILD=go build

default:
	cd client && $(BUILD) -o ../client.exe
	cd command && $(BUILD) -o ../command.exe

cert:
	cd command && openssl genrsa -out private.key 1024
	cd command && openssl req -new -x509 -key private.key -out cert.pem -days 365
