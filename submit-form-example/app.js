function initialize() {
  initServiceWorker();
  initIndexedDb();
}

initialize();

function initServiceWorker() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then(register => {
        // sync registration here!
        document.getElementById('submit-form').addEventListener('submit', function(event) {
          event.preventDefault();
          addUserToIndexDB()
            .then(() => {
              console.log('Added Successfully!')
            }).catch(error => {
              console.log('Error: ' +  error)
            });
        })
        console.log('Registration has beend done!')
      }).catch(err => {
      console.log("Error while registration: ", err);
    });
  } else {
  }
}

let db;

function  initIndexedDb() {
  const openRequest = indexedDB.open("users", 2);
  openRequest.onupgradeneeded = event => {
    let thisDb = event.target.result;
    if (!thisDb.objectStoreNames.contains('user-store')) {
      console.log('Store needs to be created!');
      let objectStore = thisDb.createObjectStore('user-store', {keypath: 'id', autoIncrement: true });
    }
  }

  openRequest.onsuccess = event => {
    db = event.target.result;
    // if any error in the db object
    db.onerror = event => {
        console.log('Error in db: ' + event.target.errorCode);
        console.dir(event.target)
    }
   }
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
    let transaction = db.transaction(['user-store'], 'readwrite');

    let objectStore = transaction.objectStore('user-store');
    let request     = objectStore.add(user);

    transaction.oncomplete = event => resolve();

    transaction.onerror = event => {
      console.log('Error: ' + event.target.errorCode);
      reject(event.target.errorCode);
    }

    objectStore.openCursor.onsuccess = event => {
      const cursor = event.target.result;

      if (cursor)
        cursor.continue();
      else
        console.log('Done with the cursor!')
    }
  });
}



function readDataFromIndexedDB() {
  return new Promise(function(resolve, reject) {

  });
}

function checkOnlineStatus() {
  if (navigator.onLine) {
    return "online";
  } else {
    return "offline";
  }
}
