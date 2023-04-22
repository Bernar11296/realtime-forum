package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	})

	http.HandleFunc("/src/", func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path[1:])

		w.Header().Set("Content-Type", "application/javascript")

		http.ServeFile(w, r, r.URL.Path[1:])
	})

	fmt.Printf("Server listening on port :8080...\n")
	http.ListenAndServe(":8080", nil)
}
