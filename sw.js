self.onsync = function(event) {
  if (event.tag == 'example-sync') {
    event.waitUntil(sendToServer());
  }
};

// Index db data gathering wrapper.

function getAllLocalizedData() {
  return new Promise(function(resolve, reject) {
    const db = indexedDB.open('local-database');

    db.onsuccess = function(event) {
      this.result
        .transaction('local-database-store')
        .objectStore('local-database-store')
        .getAll().onsuccess = function() {
        resolve(event.target.result);
      };
    };

    db.onerror = function(error) {
      console.log(error);
      reject(error);
    };
  });
}
