"use strict";
import "babel-polyfill";

class ElmentLocation {
  getElementLocation(element) {
    return element.getBoundingClientRect();
  }
}

export default ElmentLocation;
