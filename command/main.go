package main

import (
	"html/template"
	"log"
	"net/http"
)

func main() {
	config := Server{
		Address: "localhost:9999",
	}

	go Listen(&config)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("index.html").ParseFiles("templates/index.html", "templates/template.html"))
		err := t.Execute(w, &Clients)

		if err != nil {
			panic(err)
		}
	})
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Fatal(http.ListenAndServeTLS("localhost:8888", "cert.pem", "private.key", nil))
}

func init() {
	InitPackets()
}
