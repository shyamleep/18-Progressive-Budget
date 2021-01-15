let db;
// open "budget_db" database
const request = indexedDB.open("budget_db", 1);

request.onupgradeneeded = function (event) {
    // make new obj store for everything entered while offline
    const db = event.target.result;
    db.createObjectStore("offline", { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function (event) {
    console.log("Ruh roh! Error " + event.target.errorCode);
};

function saveRecord(entry) {
    const transaction = db.transaction(["offline"], "readwrite");
    const store = transaction.objectStore("offline");
    store.add(entry);
};

function checkDatabase() {
    const transaction = db.transaction(["offline"], "readwrite");
    const store = transaction.objectStore("offline");
    const getAllEntries = store.getAll();

    getAllEntries.onsuccess = function () {
        if (getAllEntries.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAllEntries.result),
                headers: {
                    Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["offline"], "readwrite");
                    const store = transaction.objectStore("offline");
                    store.clear();
                })
        }
    }
};