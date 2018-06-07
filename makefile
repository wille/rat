install:
	cd app && yarn
	cd server && yarn

build:
	cd app && yarn build
	cd server && yarn build:natives
	cd client && make

	mkdir build
	cp -Rv app/dist server/dist client/bin build
