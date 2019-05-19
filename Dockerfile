FROM ubuntu:18.04

WORKDIR /tmp

RUN apt update
RUN apt install -y \
  curl \
  net-tools \
  gcc \
  git \
  libx11-dev \
  libxrandr-dev

RUN curl -L "https://golang.org/dl/go1.8.linux-amd64.tar.gz" > go.tgz
RUN tar -C /usr/local -xzvf go.tgz

ENV GOROOT=/usr/local/go
ENV PATH="${PATH}:${GOROOT}/bin"

WORKDIR ${GOROOT}/src/rat

COPY client client
COPY vendor client/vendor

WORKDIR client
RUN go build
RUN cp client config.json $HOME
RUN sed -i "s/127.0.0.1/`netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}'`/" config.json
CMD /bin/sh -c ./client
