"use strict";
import "babel-polyfill";

/// ********* IMPORT MODULES ************* //
import SingleViewUI from "../components/singleviewUI";
import HandleFechApis from "../components/apisRequest";
import {
  showTestimonials,
  closeTimonialButton,
  singleVenueIdKeyName
} from "../components/globalSelect";
//****** INSTANTIATE MODULES ********* */
const handleUI = new SingleViewUI();
const apisRequest = new HandleFechApis();

// *********** EVENTS LISTENER *********** //
showTestimonials.addEventListener("click", handleUI.handleHideShowComment);
closeTimonialButton.addEventListener("click", handleUI.handleHideShowComment);

// Fetch the venue details when the page has finished loaded
window.addEventListener("DOMContentLoaded", () => {
  // get the venue id from the local stoage
  //const venueId = JSON.parse(localStorage.getItem(singleVenueIdKeyName));
  // call the method that fetch the venue details
  //apisRequest.handleFetchVenueDetails(venueId.id);
});

handleUI.handleDisplayVenueDetails();
