package main

import (
	"html/template"
	"log"
	"net/http"
	"strconv"
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

	funcMap := template.FuncMap{
		"GetOperatingSystemIcon": GetOperatingSystemIcon,
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("template.html").Funcs(funcMap).ParseFiles("web/template.html"))

		err := t.Execute(w, &Clients)

		if err != nil {
			panic(err)
		}
	})
	http.HandleFunc("/index", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("index.html").Funcs(funcMap).ParseFiles("web/index.html"))

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

	InitControlSocket()

	log.Fatal(http.ListenAndServeTLS("localhost:7777", "cert.pem", "private.key", nil))
}

func init() {
	InitPackets()
}
