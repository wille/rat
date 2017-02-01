BUILD=go build

default: web
	cd client && $(BUILD) -o ../client.exe
	cd command && $(BUILD) -o ../command.exe

web:
	tsc

cert:
	cd command && openssl genrsa -out private.key 1024
	cd command && openssl req -new -x509 -key private.key -out cert.pem -days 365

clean:
	cd client/screen/ && rm -f *.bmp *.jpg
	rm -f debug.bmp
	rm -f *.exe
	rm -f command/command client/client command/command.exe client/client.exe
	rm -f command/debug client/debug
