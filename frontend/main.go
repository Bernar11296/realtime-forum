package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// if r.URL.Path != "/" {
		// 	http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		// 	return
		// }
		http.ServeFile(w, r, "index.html")
	})

	http.HandleFunc("/src/", func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL.Path[1:])
		w.Header().Set("Cache-Control", "max-age=0")
		w.Header().Set("Content-Type", "application/javascript")

		http.ServeFile(w, r, r.URL.Path[1:])
	})

	fmt.Printf("Server listening on port :4000...\n")
	http.ListenAndServe(":4000", nil)
}
