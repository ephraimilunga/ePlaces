"use strict";
import "babel-polyfill";
import ElmentLocation from "./getElementLocation";
import ClassRemover from "../components/classRemover";
import Validator from "../components/validator";
import { regex, cors_api_url, cityResultContainer } from "./globalSelect";

// instantiate the object
const handleRemoveClass = new ClassRemover();
const handleValidate = new Validator();

// fetch cities
class getCities {
  constructor() {
    this.searchLoader = `
        <div class="loader_on_search">
            <div class="lds-dual-ring"></div>
        </div>
        `;
    this.notFoundMessage = `
    <div class="hint_container">
      <p class="main_hint">Oops ! city not found.</p>
      <p class="sub_hint">Please, double check the spelling.</p>
    </div>`;
  }

  async fetchCities() {
    //cityResultContainer.innerHTML = handleGetCities.searchLoader;

    const input = this;
    // CREDIT : Geobytes API is a private property of GEOBYTES
    // for more info on the api visit  http://gd.geobytes.com/
    const apiBaseUrl = `http://gd.geobytes.com/AutoCompleteCity?q=${
      input.value
    }&fulltext=”true”`;

    await fetch(cors_api_url + apiBaseUrl)
      .then(result => result.json())
      .then(data => handleUI.displayCity(data))
      .catch(e => {
        console.log(e);
      });
  }
}

// display fetched cities
class UI {
  displayCity(citiesObject) {
    cityResultContainer.forEach(
      container => (container.innerHTML = handleGetCities.searchLoader)
    );
    const cities = citiesObject;

    const city = cities
      .map(city => {
        if (city !== "%s" && city.length > 0) {
          const cityName = handleUI.extractCityCountry(city)[0];
          const countryName = handleUI.extractCityCountry(city)[
            handleUI.extractCityCountry(city).length - 1
          ];
          const cityInitial = handleUI.extractCityCountry(city)[
            handleUI.extractCityCountry(city).length - 2
          ];

          return `
            <li data-target="location" data-value="${city}">
                <div class="city_name" data-target="location" data-value="${city}">
                    <p data-target="location" data-value="${city}">${cityName}</p>
                </div>
                <div class="country_continent_name" data-target="location" data-value="${city}">
                    <p data-target="location" data-value="${city}">${cityInitial} - ${countryName}</p>
                </div>
            </li>
        `;
        }
      })
      .join("");

    let timeBeforDisplayingResult = setTimeout(() => {
      if (city && city.length !== 0 && city !== " ") {
        cityResultContainer.forEach(container => (container.innerHTML = city));
      } else {
        cityResultContainer.forEach(
          container => (container.innerHTML = handleGetCities.notFoundMessage)
        );
      }

      window.clearTimeout(timeBeforDisplayingResult);
    }, 100);
  }

  extractCityCountry(str) {
    return  str ? str.split(",") : "";
  }

  // fill in the input withe the selected city
  fillupTheForom(e) {
    if (!e.target.dataset.target) return;

    // get the clicked element id to target the corresponding input
    const targetId = e.target.dataset.target;
    const value = e.target.dataset.value;

    // set the value of the target input
    const targetInput = document.querySelectorAll(`input#${targetId}`);
    targetInput.forEach(input => (input.value = value));

    targetInput.forEach(input =>
      handleRemoveClass.handleRemoveClass(input, "arrow_up")
    );
    targetInput.forEach(input =>
      handleRemoveClass.handleAddClass(input, "arrow_down")
    );

    // remove the drop list list in the UI
    document
      .querySelectorAll(`.${targetId}`)
      .forEach(input => (input.style.display = "none"));
  }

  // handle event on the limit bounding input
  handleLimitInput(e) {
    // get he event type
    const eventType = e.type;
    //get the target input value
    const iValue = handleValidate.extractFirstNumber(e.target.value) * 1000;

    //get get the value length
    const valueLength = iValue.length;

    // get the error container
    const errorMessageContainer = document.querySelector(".errorMessage");

    // get the target input location (width, left, top, ...)
    const targetInputWidth = handleLocation.getElementLocation(this);

    // initialize error message message
    const onlyDigitsMessage = `
      <p class="main_error_title">Please ! </p>
      <p class="sub_error_title">Only digits are allowed.</p>
      <p class="sub_error_title">eg: 222, 400, 10000.</p>
    `;

    const greatNumber = `
      <p class="main_error_title">Please ! </p>
      <p class="sub_error_title">The number must be less than 100,000.</p>
    `;

    // if (iValue.match(regex)) {
    //   errorMessageContainer.style.width = targetInputWidth + "px";
    //   errorMessageContainer.style.display = "block";
    //   errorMessageContainer.innerHTML = onlyDigitsMessage;
    // } else {

    // }

    if (iValue > 100000) {
      errorMessageContainer.style.width = targetInputWidth.width + "px";
      errorMessageContainer.style.marginTop =
        targetInputWidth.top + targetInputWidth.height + "px";
      errorMessageContainer.style.marginLeft = targetInputWidth.left + "px";
      errorMessageContainer.style.display = "block";
      errorMessageContainer.innerHTML = greatNumber;
      errorMessageContainer.classList.add("errorMessageActive");

      //wait 3 second and display
      setTimeout(() => {
        errorMessageContainer.style.display = "none";
      }, 3000);
    } else {
      errorMessageContainer.style.display = "none";
      errorMessageContainer.innerHTML = "";
      errorMessageContainer.classList.remove("errorMessageActive");
    }

    // get the limit dropdown container
    const container = document.querySelector(`.${e.target.getAttribute("id")}`);

    // hide or show the limit dropdown if the user is typing manually the limit
    if (eventType === "input") {
      valueLength > 1
        ? (container.style.display = "none")
        : (container.style.display = "block");
    }
  }
}

// instantiate the UI object that is in charge of display cities to user
const handleUI = new UI();
// instntiate the cities objec
const handleGetCities = new getCities();
// instantiate the get element location
const handleLocation = new ElmentLocation();

// exporting object for external usage
export { getCities, UI };
