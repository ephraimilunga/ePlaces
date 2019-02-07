//import components and dependencies
import "babel-polyfill";
import HandleStorage from "./storage";
import ElmentLocation from "./getElementLocation";
import ClassRemover from "../components/classRemover";
import Validator from "../components/validator";
import { handleDisplayVenue } from "../components/getFavorite";
import GetCities from "../components/getVisitedCities";
import HereMaps from "../components/map";
import {
  headerHero,
  searchResultTitle,
  fixForm,
  inputs,
  dropdown,
  switchButtonAll,
  placesYouLike,
  currentFilterDetailsFixedForm,
  categoryInput,
  visitedCitiesTitile,
  $map,
  mapContainer,
  favoritePlacesContainer,
  singleVenueIdKeyName,
  testimonyContainer,
  hideTestimonialContaienr,
  cannotShowTheVenue
} from "./globalSelect";

//instantiate imported object
const handleSave = new HandleStorage();
const handleGetElementLocation = new ElmentLocation();
const handleClassRemove = new ClassRemover();
const handleValidator = new Validator();
const handleGetFavoriteVenues = handleDisplayVenue;
const handleVisitedCities = new GetCities();
const handleMap = new HereMaps();

class Switch {
  handleSwitchToggleMap() {
    // update the map container
    const venuesLatLng = handleSave.handleRetriveData("venuesLatLng") || [];

    // check to see if you have any latitude and longitude
    if (venuesLatLng && venuesLatLng.length > 0) {
      // clear the map container
      $map.innerHTML = "";

      // wait 1s
      setTimeout(() => {
        // display the venues on the map
        handleMap.load($map, venuesLatLng);
      }, 1000);
    }

    const searchContainer = document.querySelector(".search_result_wrapper");
    const searchResultBlock = document.querySelector(
      ".search_result_block_container"
    );
    const searchResultCotent = document.querySelector(
      ".search_result_block_content"
    );

    const switchButton = this;

    if (!switchButton.classList.contains("active")) {
      // remove the map to the right side and put it at he bottom
      searchContainer.classList.remove("search_result_wrapper_map_visible");
      searchResultBlock.classList.remove(
        "search_result_block_container_map_visible"
      );
      searchResultCotent.classList.remove(
        "search_result_block_content_map_visible"
      );

      // make the wrapper container more large
      searchContainer.classList.add("search_result_wrapper_map_not_visible");
      searchResultBlock.classList.add(
        "search_result_block_container_map_not_visible"
      );
      searchResultCotent.classList.add(
        "search_result_block_content_map_not_visible"
      );
    } else {
      // add the map to the right side and put it at he bottom
      searchContainer.classList.add("search_result_wrapper_map_visible");
      searchResultBlock.classList.add(
        "search_result_block_container_map_visible"
      );
      searchResultCotent.classList.add(
        "search_result_block_content_map_visible"
      );

      // make the wrapper container leff large to display the map to the right side
      searchContainer.classList.remove("search_result_wrapper_map_not_visible");
      searchResultBlock.classList.remove(
        "search_result_block_container_map_not_visible"
      );
      searchResultCotent.classList.remove(
        "search_result_block_content_map_not_visible"
      );
    }

    // remove or add the active state to all swith button
    switchButtonAll.forEach(button => button.classList.toggle("active"));
  }

  handleSwitchCategory() {
    const categoryFilter = document.querySelectorAll(".form_filter");
    const clickedCategoryId = this.dataset.filtername;

    categoryFilter.forEach(filter => {
      const classes = filter.classList;
      filter.dataset.filtername === clickedCategoryId
        ? classes.add("activeFilter")
        : classes.remove("activeFilter");
    });

    // set the header background to reflect the cliked category
    headerHero.setAttribute("id", `${clickedCategoryId}_bg`);

    // set the value of the category input to the clicked category name
    categoryInput.value = handleValidator.capitalize(clickedCategoryId);
  }

  showDropDown() {
    const inputId = this.getAttribute("name");
    const inputWidth = handleGetElementLocation.getElementLocation(this).width;

    dropdown.forEach(drop => {
      if (drop.classList.contains(inputId)) {
        drop.style.width = inputWidth + "px";
        drop.style.display = "block";

        // turn the chevron up and down
        inputs.forEach(input => {
          if (input.getAttribute("name") === inputId) {
            input.classList.remove("arrow_down");
            input.classList.add("arrow_up");
          } else {
            input.className = "arrow_down";
          }
        });
      } else {
        drop.style.display = "none";
      }
    });
  }

  handleSwitchFixSearchForm() {
    // get the distance from the top of the search result title and add 20 pixels
    // we added 20 pixels in order to give more time before the fix search  appear
    const elementOffsetTop = searchResultTitle.offsetTop + 20;

    // get the positon of element so that we can deside when to load the favorite places and visited cities
    const placesYouLikeLocation = placesYouLike.getBoundingClientRect();
    const visitedCitiesTitleLocation = visitedCitiesTitile.getBoundingClientRect();

    // get the percentage at which the favorite places title is.
    const placesYouLikePercentScrolledInViewport = handleValidator.isAtACertainPercentOfTheViewport(
      placesYouLikeLocation.bottom
    );

    // get the percentage at which the visited title is.
    const visitedCitiesPercentScrolledInViewport = handleValidator.isAtACertainPercentOfTheViewport(
      visitedCitiesTitleLocation.bottom
    );
    if (placesYouLikePercentScrolledInViewport < 67) {
      // hide the search result details in the fix search form
      currentFilterDetailsFixedForm.style.display = "none";

      // get favorite venues from the local storage and display them
      handleGetFavoriteVenues.handleFavorite("all");
    } else {
      // show the search result details in the fix search form
      currentFilterDetailsFixedForm.style.display = "block";
    }

    if (visitedCitiesPercentScrolledInViewport < 67) {
      handleVisitedCities.handleVisitedCities("all");
    }

    // stop the function from running if not necessary
    if (
      elementOffsetTop > window.scrollY &&
      fixForm.classList.contains("hide_fix_search_form")
    )
      return;
    if (
      elementOffsetTop < window.scrollY &&
      fixForm.classList.contains("show_fix_search_form")
    ) {
      return;
    }

    if (elementOffsetTop > window.scrollY) {
      handleClassRemove.handleRemoveClass(fixForm, "show_fix_search_form");
      handleClassRemove.handleAddClass(fixForm, "hide_fix_search_form");
    } else {
      handleClassRemove.handleRemoveClass(fixForm, "hide_fix_search_form");
      handleClassRemove.handleAddClass(fixForm, "show_fix_search_form");
    }

    // hide all dropdown
    dropdown.forEach(drop => (drop.style.display = "none"));

    // turn downn all chevron
    inputs.forEach(input => {
      if (input.classList.contains("arrow_up")) {
        handleClassRemove.handleAddClass(input, "arrow_down");
        handleClassRemove.handleRemoveClass(input, "arrow_up");
      }
    });
  }
}

export default Switch;

const handleSwitch = new Switch();

export { handleSwitch };
