// GLOBAL SELECT
const switchButtonAll = document.querySelectorAll(".toggle_container");
const categoryFilter = document.querySelectorAll(".form_filter");
const inputs = document.querySelectorAll("input");
const categoryInput = document.querySelector("input#category");
const locationInput = document.querySelectorAll("#location");
const dropdownContainer = document.querySelectorAll(".menu_container");
const limitInput = document.querySelectorAll("#limit");
const mainContainer = document.querySelector("main");
const submitButtons = document.querySelectorAll(".submit_button");
const headerHero = document.querySelector(".header_hero");
const categoryDetailsIcon = document.querySelectorAll(".category_details_icon");
const $map = document.querySelector("#map");
const resultContainer = document.querySelector(".search_result_block_content");
const searchResultTitle = document.querySelector(".search_result_main_title");
const placesYouLike = document.querySelector(".places_you_like_main_title");
const visitedCitiesFilters = document.querySelectorAll(
  ".visited_cities_filter"
);
const placesYouLikeWrapper = document.querySelector(".places_you_like_wrapper");
const deleteConfirmation = document.querySelector(".delete_confirmation");
const deleteTrashContainer = document.querySelector(".delete_trash_container");
// get the slider parent element
const visitedCitiesCounter = document.querySelector(".visited_cities_counter");
const visitedCitiesContainer = document.querySelector(".glide_visted_location");
const visitedCitiesTitile = document.querySelector(
  ".visited_location_main_title"
);
const placesYouLikeContainer = document.querySelector(
  ".glide_places_you_liked"
);
const favoriteFilter = document.querySelectorAll(".favorite_filter");
const favoriteVenueCounter = document.querySelector(".fovorite_venue_counter");
const fixForm = document.querySelector(".fix_search_form");
const dropdown = document.querySelectorAll(".menu_container");
const favoriteCounters = document.querySelectorAll(
  ".favorite_counter_container"
);
const currentFilterDetailsFixedForm = document.querySelector(
  ".current_filter_details_fixed_form"
);
const mapContainer = document.querySelector(".map_container");

const favoritePlacesContainer = document.querySelector(
  ".places_you_like_container"
);

// get cities container
const cityResultContainer = document.querySelectorAll(".location");
const resultMainContainer = document.querySelector(".search_result_container");
const searchResultCounter = document.querySelectorAll(
  ".search_result_counter_text"
);
const searchResultCategory = document.querySelectorAll(
  ".search_result_category_text"
);
const searchResultLocation = document.querySelectorAll(
  ".search_result_location_text"
);

const mainMessageToTheUser = document.querySelector(
  ".main_message_to_the_user"
);
const refineMessageButton = document.querySelector(".refine_message");

const cannotShowTheVenue = document.querySelector(".cannot_show_the_venue");

// SINGLE VIEW SELECTOR
const showTestimonials = document.querySelector(".testimony__button"),
  testimonyContainer = document.querySelector(".testimonials_container"),
  closeTimonialButton = document.querySelector(".close_testi_button"),
  singleVenueDetailsContainer = document.querySelector(".single_details_side"),
  singleVenueMap = document.querySelector("#single_map");

// END GLOBAL SELECT

// GLOBAL VARIABLE
// check to see if the user input only digit values
export const regex = /\D+/gi;

// this url allow the app tho retrieve data from apis that do not have a CROSS ORIGIN SHARING value in the response header
const cors_api_url = "https://cors-anywhere.herokuapp.com/";

// set the foursquare versionning date
const versionningDate = "20181231";

// this variable disable any HTML element
const disableHtmlElement = "disableElement";

// this class hide the alert message to the user
const alertMessageClass = "main_message_to_the_user_not_visible";

// keyName for the user filtered options from the search form
// this will help us save and retrieve data from the local storage
const userFilterOptionKeyname = "userFilterOption";

// loaded status keyname
const loadedVenuesStatus = "loadedVenuesStatus";

//set loader variables
const searchButonLoader = `
    <div class="lds-ellipsis_button">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
`;

const loaderSearchResultDetailsBlock = `
    <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
`;

const blockResultsLoader = `
    <p class="push_loader_text">Loading ... please wait</p>
    <div class="loader_on_search">
        <div class="lds-dual-ring"></div>
    </div>
`;

const mapLoader = `
        Loading the map ...
        <div class="loader_on_search">
            <div class="lds-dual-ring"></div>
        </div>
`;

const favoriteVenuesLoader = `
        <div class="loader_places_">
            <div class="loader_on_search">
                <div class="lds-dual-ring"></div>
            </div>
        </div>
`;

const favoriteVenuesErrorMessage = `
        <div class="loader_places_">
            <p class="fovorite_error_main">Your favorite list is empty.</p>
            <p class="fovorite_error_sub">All favorite places will appear here</p>
        </div>
`;

const visitedCitiesErrorMessage = `
        <div class="loader_places_">
            <p class="fovorite_error_main">Your Cities list is empty.</p>
            <p class="fovorite_error_sub">All visited cities will appear here. Please give a try</p>
        </div>
`;

const visitedCitiesKeyname = "visitedCitiesEplaces";

// single view variables
const hideTestimonialContaienr = "testimonials_container_hide";

// keyname when save a single venue id in the local storage
const singleVenueIdKeyName = "singleVenueId";

// GLOBAL VARIABLE

export {
  switchButtonAll,
  categoryFilter,
  inputs,
  dropdown,
  locationInput,
  dropdownContainer,
  limitInput,
  mainContainer,
  submitButtons,
  cors_api_url,
  versionningDate,
  headerHero,
  searchResultCounter,
  searchResultCategory,
  searchResultLocation,
  searchButonLoader,
  loaderSearchResultDetailsBlock,
  blockResultsLoader,
  mapLoader,
  disableHtmlElement,
  mainMessageToTheUser,
  alertMessageClass,
  refineMessageButton,
  userFilterOptionKeyname,
  resultContainer,
  categoryDetailsIcon,
  $map,
  searchResultTitle,
  fixForm,
  cityResultContainer,
  placesYouLike,
  currentFilterDetailsFixedForm,
  categoryInput,
  favoriteCounters,
  placesYouLikeContainer,
  favoriteVenueCounter,
  favoriteVenuesLoader,
  favoriteVenuesErrorMessage,
  favoriteFilter,
  visitedCitiesTitile,
  visitedCitiesFilters,
  visitedCitiesContainer,
  visitedCitiesCounter,
  deleteConfirmation,
  visitedCitiesErrorMessage,
  deleteTrashContainer,
  placesYouLikeWrapper,
  mapContainer,
  visitedCitiesKeyname,
  favoritePlacesContainer,
  resultMainContainer,
  loadedVenuesStatus,
  // single view export
  singleVenueIdKeyName,
  showTestimonials,
  testimonyContainer,
  hideTestimonialContaienr,
  closeTimonialButton,
  singleVenueDetailsContainer,
  singleVenueMap,
  cannotShowTheVenue
};
