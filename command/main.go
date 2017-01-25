package main

import (
	"bufio"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/websocket"
)

type ClientPage struct {
	*Client
}

func NewSingle(client *Client) ClientPage {
	return ClientPage{client}
}

func main() {
	config := Server{
		Address: "localhost:9999",
	}

	go Listen(&config)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("index.html").ParseFiles("web/index.html", "web/template.html"))
		err := t.Execute(w, &Clients)

		if err != nil {
			panic(err)
		}
	})
	http.HandleFunc("/screen", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("screen.html").ParseFiles("web/screen.html", "web/template.html"))
		id, _ := strconv.Atoi(r.FormValue("id"))
		err := t.Execute(w, NewSingle(get(id)))

		if err != nil {
			panic(err)
		}
	})
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./web/static"))))
	http.Handle("/scripts/", http.StripPrefix("/scripts/", http.FileServer(http.Dir("./web/scripts"))))

	onConnected := func(ws *websocket.Conn) {
		defer func() {
			ws.Close()
		}()

		reader := bufio.NewReader(ws)
		sid, _ := reader.ReadString('\n')

		id, _ := strconv.Atoi(strings.Trim(sid, "\n"))
		client := get(id)
		fmt.Println("id:", id)

		if client != nil {
			for {
				ws.Write([]byte(client.GetEncodedScreen()))
				time.Sleep(time.Second)
			}
		}
	}
	http.Handle("/ssock", websocket.Handler(onConnected))

	log.Fatal(http.ListenAndServeTLS("localhost:7777", "cert.pem", "private.key", nil))
}

func init() {
	InitPackets()
}
