package main

import (
	"net/http"
	"os"
	"path"
	"rat/command/log"
)

func setup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Security-Policy", "default-src 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self' wss://*:*; img-src 'self' data:")
}

func init() {
	handler := func(h http.Handler) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			setup(w, r)
			h.ServeHTTP(w, r)
		}
	}

	http.HandleFunc("/download", func(w http.ResponseWriter, r *http.Request) {
		setup(w, r)

		if t, ok := transfers[r.FormValue("key")]; ok {
			if t.Download {
				_, err := os.Stat(t.Local)
				if err == os.ErrNotExist {
					w.WriteHeader(404)
					return
				}

				w.Header().Set("Content-Disposition", "attachment; filename="+path.Base(t.Remote))

				http.ServeFile(w, r, t.Local)
			} else {
				w.WriteHeader(400)
			}
		} else {
			w.WriteHeader(404)
		}
	})
	http.Handle("/static/", handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./web/static")))))
	http.Handle("/scripts/", handler(http.StripPrefix("/scripts/", http.FileServer(http.Dir("./web/scripts")))))
}

func startWebserver() {
	log.Println(http.ListenAndServeTLS(GlobalConfig.HTTPAddress, "cert.pem", "private.key", nil))
}
