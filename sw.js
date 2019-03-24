// form database sync
self.onsync = function(event) {
  if (event.tag == "submit-info-form") {
    event.waitUntil(sendToServer());
  }
};

// image sync
self.addEventListener("sync", event => {
  if (event.tag === "fetch-image-data") {
    event.waitUntil(fetchPost());
  }
});

const fetchPost = () => {
  fetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(res => res.json())
    .then(post => {
      console.log(post);
    })
    .catch(err => console.log(err));
};
