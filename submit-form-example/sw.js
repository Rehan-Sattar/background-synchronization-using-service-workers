self.onsync = function(event) {
  if (event.tag === "submit-user-data") {
    event.waitUntil(syncIt());
  }
};

const syncIt = () => {
  return readDataFromIndexedDB()
    .then(data => {
      sendDataToServer(data);
    })
    .catch(err => err);
};

const readDataFromIndexedDB = () =>
  new Promise((resolve, reject) => {
    let db = indexedDB.open("users");
    db.onsuccess = e => {
      e.target.result
        .transaction(["user-store"])
        .objectStore("user-store")
        .getAll().onsuccess = event => resolve(event.target.result);
    };

    db.onerror = e => reject(e.target.errorCode);
  });

const sendDataToServer = response => {
  const { email, about } = response;

  let body = {
    name: email,
    job: about
  };
  return fetch(`https://reqres.in/api/users`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json());
};
