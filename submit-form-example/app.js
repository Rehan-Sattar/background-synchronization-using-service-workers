function initialize() {
  initServiceWorker();
  initIndexedDb();
}

var db;
initialize();

function initServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then(register => {
        document
          .getElementById("submit-form")
          .addEventListener("submit", event => {
            event.preventDefault();
            addUserToIndexDB().then(() => {
              if (register.sync) {
                register.sync
                  .register("submit-user-data")
                  .catch(err => console.log(err));
              } else {
                checkInternet();
              }
            });
          });
      })
      .catch(err => {
        console.log("Error while registration: ", err);
      });
  }
}

function initIndexedDb() {
  const openRequest = indexedDB.open("users", 4);
  openRequest.onupgradeneeded = event => {
    let thisDb = event.target.result;
    if (!thisDb.objectStoreNames.contains("user-store")) {
      let objectStore = thisDb.createObjectStore("user-store", {
        keypath: "id",
        autoIncrement: true
      });
    }
  };

  openRequest.onsuccess = event => {
    db = event.target.result;
    // if any error in the db object
    db.onerror = event => {
      console.log("Error in db: " + event.target.errorCode);
    };
  };
}

// adding data to indexedDB
function addUserToIndexDB() {
  return new Promise(function(resolve, reject) {
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;
    let about = document.getElementById("about").value;

    const user = {
      email,
      password,
      about
    };

    /* saving to database here ... */
    let transaction = db.transaction(["user-store"], "readwrite");

    let objectStore = transaction.objectStore("user-store");
    let request = objectStore.add(user);

    transaction.oncomplete = event => resolve();

    transaction.onerror = event => {
      console.log("Error: " + event.target.errorCode);
      reject(event.target.errorCode);
    };

    objectStore.openCursor.onsuccess = event => {
      const cursor = event.target.result;

      if (cursor) cursor.continue();
      else console.log("Done with the cursor!");
    };
  });
}

// function sendDataToServer() {
//   readUserFromIndexedDB
//     .then(data => {
//       console.log(data);
//     })
//     .catch(err => console.log(err));
// }

function readUserFromIndexedDB() {
  return new Promise(function(resolve, reject) {
    const transaction = db.transaction(["user-store"]);
    const objStore = transaction.objectStore("user-store");

    const request = objStore.getAll();

    request.onsuccess = event => resolve(event.target.result);

    request.onerror = event => reject(event.target.errorCode);
  });
}

function sendData() {
  readUserFromIndexedDB()
    .then(function(response) {
      // fetch request here!
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });
}

function checkInternet() {
  event.preventDefault();
  if (navigator.onLine) {
    sendData();
  } else {
    alert(
      "You are offline! When your internet returns, we'll finish up your request."
    );
  }
}
