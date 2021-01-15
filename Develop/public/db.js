let db;
// open "budget_db" database
const request = indexedDB.open("budget_db", 1);

request.onupgradeneeded = function(event) {
    // make new obj store for everything entered while offline
    const db = event.target.result; 
    db.createObjectStore("offline", { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("Ruh roh! Error " + event.target.errorCode);
};

function saveRecord(entry){
    const transaction = db.transaction(["offline"], "readwrite");
    const store = transaction.objectStore("offline");
    store.add(entry);
}