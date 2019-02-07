// inport
"use strict";
import "babel-polyfill";

class HandleStorage {
  // data in local storage
  handleSaveData(keyName, object) {
    localStorage.setItem(keyName, object);
  }

  // retrive data from local storage
  handleRetriveData(keyName) {
    return JSON.parse(localStorage.getItem(keyName));
  }

  // detele data from the local storage
  handleDeleteData(keyName) {
    localStorage.removeItem(keyName);
  }
}

export default HandleStorage;
