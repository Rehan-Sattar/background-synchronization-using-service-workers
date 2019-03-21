function initialize() {
  initServiceWorker();
}

initialize();

function initServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then(register => {
        // sync registration here!
        console.log("Registration completed!");
      })
      .catch(err => {
        console.log("Error while registration: ", err);
      });
  } else {
  }
}

function saveDataToIndexDB() {
  return new Promise(function(resolve, reject) {
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;
    let about = document.getElementById("about").value;
    const user = {
      email,
      password,
      about
    };
    // indexed DB code here!
    const database = indexedDB.open("users");

    database.onsuccess = function(event) {
      const store = this.result
        .transaction("user-managment", "readwrite")
        .objectStore("user-object-store");
      store.add(user);
      resolve();
    };

    database.onerror = function(error) {
      reject(error);
    };
  });
}

function readDataFromIndexedDB() {
  return new Promise(function(resolve, reject) {});
}

function checkOnlineStatus() {
  if (navigator.onLine) {
    return "online";
  } else {
    return "offline";
  }
}
