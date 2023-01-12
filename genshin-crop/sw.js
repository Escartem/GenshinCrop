self.addEventListener("install", function() {
	console.log("install")
})

self.addEventListener("activate", event => {
	console.log("activate")
})

self.addEventListener("fetch", function(event) {
	console.log("fetch", event.request)
})