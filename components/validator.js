"use strict";
import "babel-polyfill";
import HandleStorage from "../components/storage";
import {
  singleVenueIdKeyName,
  cannotShowTheVenue
} from "../components/globalSelect";

// instantiate objects
const HandleStore = new HandleStorage();

// validator class
class Validator {
  isLatLongEmpty(value, target) {
    const newCoordinate = HandleStore.handleRetriveData("currentLocation");
    return value ? value : newCoordinate[target];
  }

  capitalize(str) {
    return str[0].toUpperCase() + str.substring(1);
  }

  /**
   *
   * @param {Number} value  the number to perform the calculation on
   * @param {Number} number  the number to be use as operant
   * @param {String} operator the string that specify the operation to perform (eg: div = division, add = addition, multi = multiplication, sub = substraction). if omitted the function return the give value
   */
  mathOperations(value, number, operator) {
    switch (operator) {
      case "add":
        return value + number;
        break;
      case "div":
        return value / number;
        break;
      case "multi":
        return value * number;
        break;
      case "sub":
        return value - number;
        break;

      default:
        return value;
        break;
    }
  }

  roundToPrecision(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  isFalsy(element, target) {
    if (target === "category") {
      return element ? element.name : "";
    }

    if (target === "icon") {
      return element ? element.icon.prefix + element.icon.suffix : "";
    }

    return element ? element : "";
  }

  isPlural(number, str) {
    return number > 1 ? str + "s" : str;
  }

  isInTheViewPort(element) {
    const elementLocation = element.getBoundingClientRect();

    return (
      elementLocation.top >= 0 &&
      elementLocation.left >= 0 &&
      elementLocation.right <=
        (window.innerWidth || document.documentElement.innerWidth) &&
      elementLocation.bottom <=
        (window.innerHeight || document.documentElement.innerHeight)
    );
  }

  isFavoriteGreatThanNine(number) {
    return number > 9 ? "9+" : number;
  }

  isInFavoriteList(id) {
    const favoriteVenuesFromLocalStodrage =
      HandleStore.handleRetriveData("storedFavoriteVenuesId") || [];

    if (favoriteVenuesFromLocalStodrage) {
      for (let e = 0; e < favoriteVenuesFromLocalStodrage.length; e++) {
        if (favoriteVenuesFromLocalStodrage[e].venue.id === id) {
          return "full_favorite.910f9482.svg";
        }
      }
    }
  }

  extractFirstNumber(number) {
    return number.match(/(^[0-9]*)/gi)[0];
  }
  //**
  /* the distance between a given element and the bottom of the screen (viewport)
   /* @param {Integer} elementDistanceFromTheButton 
   */
  isAtACertainPercentOfTheViewport(elementDistanceFromTheButton) {
    return Math.floor(
      (elementDistanceFromTheButton / window.innerHeight) * 100
    );
  }

  isThisValueInThatArrayObject(
    valueToFind,
    object,
    keyToSeachFromTheArrayObject
  ) {
    if (object.length > 0) {
      return object.some(
        item => item[keyToSeachFromTheArrayObject] === valueToFind
      );
    } else return false;
  }

  isValid(value) {
    return value ? vallue : "...";
  }

  //**
  /* Save the venue id to the local storage and redirect the user to the single view.
   /* This venue id will help display its details.
   /* @param {Event} e 
   */
  handllRedirection(e) {
    // get the clicked element
    const clickedElement = e.target;

    // get its id
    const clickedElementId = clickedElement.getAttribute("id");

    // save it to use on the single view page
    HandleStore.handleSaveData(
      singleVenueIdKeyName,
      JSON.stringify({ id: clickedElementId })
    );

    // redirect the user on the single view page
    //window.location.href = "http://localhost:1234/singleview.html";

    cannotShowTheVenue.classList.remove("cannot_show_the_venue_hide");

    setTimeout(() => {
      cannotShowTheVenue.classList.add("cannot_show_the_venue_hide");
    }, 5000);
  }
}

export default Validator;
