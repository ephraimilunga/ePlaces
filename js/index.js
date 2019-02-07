/// import components and dependencies
"use strict";
import "babel-polyfill";
import Switch from "../components/switch";
import { getCities, UI } from "../components/getCities";
import HandleCloseDrop from "../components/closeFormDropdown";
import HandleFechApis from "../components/apisRequest";
import HandleStorage from "../components/storage";
import moduleName from "../components/classRemover";
import venuesLike from "../components/handleVenuesLike";
import Validator from "../components/validator";
import { handleDisplayVenue } from "../components/getFavorite";
import GetCities from "../components/getVisitedCities";
import {
  switchButtonAll,
  categoryFilter,
  inputs,
  locationInput,
  dropdownContainer,
  limitInput,
  mainContainer,
  submitButtons,
  searchButonLoader,
  mainMessageToTheUser,
  alertMessageClass,
  headerHero,
  favoriteCounters,
  favoriteFilter,
  visitedCitiesFilters,
  resultContainer,
  blockResultsLoader,
  resultMainContainer,
  loadedVenuesStatus
} from "../components/globalSelect";

/// end import components and dependencies

// INSTANTIATE OBJECTS
const swich = new Switch();
const fechCities = new getCities();
const handleUI = new UI();
const hanleCloseDropdown = new HandleCloseDrop();
const handleStoreData = new HandleStorage();
const apisRequestObject = new HandleFechApis();
const handleRemove = new moduleName();
const handleVenuesLike = new venuesLike();
const handleValidate = new Validator();
const handleGetFavorite = handleDisplayVenue;
const handleGetVisitedCities = new GetCities();
// END INSTANTIATE OBJECTS

//******* */ switch the map *********//
// get the switch element
switchButtonAll.forEach(button =>
  button.addEventListener("click", swich.handleSwitchToggleMap)
);

// ****** switch the category on the home search form
categoryFilter.forEach(filter =>
  filter.addEventListener("click", swich.handleSwitchCategory)
);

// ******* display the input's dropdown
inputs.forEach(input => input.addEventListener("focus", swich.showDropDown));

//******* */ fillup the city when the user type in
locationInput.forEach(input =>
  input.addEventListener("input", fechCities.fetchCities)
);

//*** */ get the cliked city value and fill the target input with that value
dropdownContainer.forEach(drop =>
  drop.addEventListener("click", handleUI.fillupTheForom)
);

//******* */ get the event on the limit field
limitInput.forEach(input =>
  input.addEventListener("focus", handleUI.handleLimitInput)
);
limitInput.forEach(input =>
  input.addEventListener("input", handleUI.handleLimitInput)
);

// ****** close all drop down when a user click on the main coainter
mainContainer.addEventListener("click", hanleCloseDropdown.closeDropdown);

// this function call the method in charge of fetching venues via APIs
function fetchCities() {
  // set the loaded status to true to avoid multiple loading
  handleStoreData.handleSaveData(
    loadedVenuesStatus,
    JSON.stringify({ status: true })
  );

  // display the loader to the user
  handleRemove.setInnerHtml(resultContainer, blockResultsLoader);

  // add a loader to the button
  submitButtons.forEach(button => (button.innerHTML = searchButonLoader));

  //desable the button to avoid multiple submitions
  submitButtons.forEach(button => button.classList.add("disableElement"));

  //get the user info from the input field
  const category = document.querySelector(".activeFilter");
  const city = document.querySelector("input#location");
  const limit = document.querySelector("input#limit");
  const limitHeaderHero = document.querySelector(".limit_on_header_hero");

  //*********** set the value for each option

  // get the category value from the dataset
  const categoryDatasetValue = category ? category.dataset.filtername : "food";

  //set category name value
  const categoryValue = categoryDatasetValue;

  // set city name value
  const cityValue =
    city.value !== null
      ? city.value
      : handleStoreData.handleRetriveData("currentLocation").city;

  // extract integer from the limit input value
  // and convert it in meters.
  const limitValueExtracted =
    handleValidate.extractFirstNumber(limit.value) * 1000 ||
    handleValidate.extractFirstNumber(limitHeaderHero.value) * 1000;

  //if the limit equal to 0 then set the it to 100km as default limit.
  const limitValue = limitValueExtracted > 0 ? limitValueExtracted : 100000;

  // set the value to the handle get venues object
  const sentDataToTheHandler = new HandleFechApis(
    categoryValue,
    cityValue,
    limitValue
  );
  sentDataToTheHandler.handleGetVenue();
}

// this function fetch venues for the current user location if he start scrolling without making a search
function isTheUserScrollWithoutSearching() {
  // check the loading status
  const loadedStatus = handleStoreData.handleRetriveData(loadedVenuesStatus);

  // stop the function from runnig if we have already loaded venues
  if (loadedStatus && loadedStatus.status) return;

  // get main search result contaienr poisition
  const mainResultContainerPosition = resultMainContainer.getBoundingClientRect()
    .bottom;

  // display currrent location venue if the user start scrolling
  const resultContainerScroll = handleValidate.isAtACertainPercentOfTheViewport(
    mainResultContainerPosition
  );

  if (resultContainerScroll < 190) {
    fetchCities();

    // set the loaded status to true to avoid multiple loading
    handleStoreData.handleSaveData(
      loadedVenuesStatus,
      JSON.stringify({ status: true })
    );
  }
}

// ***** handle user form submittion
submitButtons.forEach(button => button.addEventListener("click", fetchCities));

// get and save the user current location in the local storage
apisRequestObject.getUsertCurrentLocation();

// close the alert message when click one refine button
mainMessageToTheUser.addEventListener("click", e => {
  if (!e.target.classList.contains("refine_message")) return;
  handleRemove.handleAddClass(mainMessageToTheUser, alertMessageClass);

  // rove the loader
  handleRemove.setInnerHtml(
    resultContainer,
    "<p style='font-size: 40px' class='highlight'>Please, Try again ...</p>"
  );
});

document.addEventListener("DOMContentLoaded", function (e) {
  // images to set as background for the header hero section
  const heroImages = [
    "hero_first",
    "hero_second",
    "hero_third",
    "hero_fourth",
    "hero_six",
    "hero_seven",
    "hero_fifth"
  ];

  // get a random number to match an image from the images object
  const randomNumber = Math.floor(Math.random() * heroImages.length);

  // set the given image as background
  headerHero.setAttribute("id", heroImages[randomNumber]);

  // check to see if you have favorite venues in the localstorage
  const isFavoriteVanuesInLocalStorage = handleStoreData.handleRetriveData(
    "storedFavoriteVenuesId"
  );
  if (isFavoriteVanuesInLocalStorage) {
    // count the favorite venues
    const totalFavorite = handleVenuesLike.handleCountLikes(
      "storedFavoriteVenuesId"
    );

    // check if the favorite venues are more than 9
    // if they are more than 9 display 9+ otherwise display the extact number (eg: 9, 3, 2, 1, 0);
    const isTotalFavGreatThanNine = handleValidate.isFavoriteGreatThanNine(
      totalFavorite
    );

    //set the text of the favorite counter to the total liked venues
    handleRemove.setInnerHtml(favoriteCounters, isTotalFavGreatThanNine);

    // delete the loaded status
    handleStoreData.handleDeleteData(loadedVenuesStatus);
  }

  // delete the load favorite venues status
  // this to load favorite venue from the local storage
  // every time the user reloade the page
  handleStoreData.handleDeleteData("loadFavoriteStatus");

  // delete the load visited cities status
  // this help to load favorite venue from the local storage
  // every time the user reloade the page
  handleStoreData.handleDeleteData("visitedCitiesLoaded");
});

// listen on window scroll to show or hide the fixed search form
window.addEventListener("scroll", swich.handleSwitchFixSearchForm);
window.addEventListener("scroll", isTheUserScrollWithoutSearching);

// // /// listen for a click event on all favorite icons to set a venue liked or unliked
// favoriteIcon.forEach(icon =>
//   icon.addEventListener("click", handleVenuesLike.handleLikes)
// );

// listen for click on favorite places filters button
//and get venues that match the clicked filter button
favoriteFilter.forEach(filter =>
  filter.addEventListener("click", function () {
    handleRemove.handleActiveElement(
      favoriteFilter,
      "filter_Active",
      this.classList[0]
    );
    handleGetFavorite.handleFavorite(this.dataset.favoritecategory, "form");
  })
);

// listen for click on all visited cities filters
// and get venues that match
visitedCitiesFilters.forEach(filter =>
  filter.addEventListener("click", function () {
    handleRemove.handleActiveElement(
      visitedCitiesFilters,
      "filter_Active",
      this.classList[0]
    );
    handleGetVisitedCities.handleVisitedCities(
      this.dataset.favoritecategory,
      "form"
    );
  })
);

export { fetchCities };
