"use strict";
import "babel-polyfill";
import HandleStorage from "../components/storage";
import {
  locationInput,
  cors_api_url,
  versionningDate,
  submitButtons,
  disableHtmlElement,
  mainMessageToTheUser,
  alertMessageClass,
  userFilterOptionKeyname,
  searchResultCounter,
  searchResultCategory,
  searchResultLocation,
  loaderSearchResultDetailsBlock
} from "../components/globalSelect";
import Validator from "../components/validator";
import ClassRemover from "../components/classRemover";
import DisplayVenues from "../components/displayVenues";
import SingleViewUI from "../components/singleviewUI";

// instantiate objects
const handleStore = new HandleStorage();
const validate = new Validator();
const handleRemove = new ClassRemover();
const handleDisplayVenues = new DisplayVenues();
const handleSingleVenueUI = new SingleViewUI();

class HandleFechApis {
  constructor(category, city, limit, venuesId) {
    this.venuesId = venuesId;
    this.category = category;
    this.city = city;
    this.limit = limit;
  }

  async getUsertCurrentLocation() {
    // api keys (ipstack is a product built and maintained by apilayer | https://ipstack.com/)
    const ipToLocationKey = "?access_key=e7aaa4e45f3c7fae3204efd4c3f540a3";

    // api baseURL links
    const getIp = "https://api.ipify.org?format=json"; //https://www.ipify.org/
    const ipToLocation = "http://api.ipstack.com/";

    // get the user ip
    const ip = await fetch(getIp)
      .then(result => result.json())
      .then(data => data.ip)
      .catch(e => console.log(e.message));

    // get the user location information base on the ip
    return await fetch(`${ipToLocation}${ip}${ipToLocationKey}`)
      .then(result => result.json())
      .then(data => {
        //using destructuring we extract only needed keys
        const { city, region_code, country_name, latitude, longitude } = data;

        // concatenate the keys value to have one line location info
        const userCurrentCity = `${city}, ${region_code}, ${country_name}`;

        // set the object to be saved as the current user location
        let currentLocation = {
          city: userCurrentCity,
          lat: latitude,
          long: longitude
        };

        // stringify the current location object before to save
        currentLocation = JSON.stringify(currentLocation);

        // store the current user location in the local storage
        handleStore.handleSaveData("currentLocationEplaces", currentLocation);

        // set the value of the location input to the current user city
        locationInput.forEach(input => (input.value = userCurrentCity));
      })
      .catch(e => console.log(e.message));
  }

  async handleGetVenue() {
    // initialze user value
    const category = this.category;
    const cityValue = this.city;
    const limit = this.limit;

    // check to see if the city is type of object or a string
    let city = typeof cityValue === "object" ? cityValue.city : cityValue;

    // get the user lat and long api link
    const apiBaseURL = `http://gd.geobytes.com/GetCityDetails?fqcn=${city}`;

    // foursquare api (get the venues api);
    const foursquareKeyApi =
      "client_id=AOBANJKB3CNBFTYOITBPVH3U2MPLLBSVM04Y34OHVSE0DWUB&client_secret=QO1H1W0XPHNDCKEVNJ0ULMZ4CS3UN2OOAR4KOXSFWHJGWRQ5&";
    const venuesBaseURL = `https://api.foursquare.com/v2/venues/search?`;

    // fetch city / location coordoninate
    const cityCoordinate = await fetch(cors_api_url + apiBaseURL)
      .then(result => result.json())
      .then(data => data);

    await fetch(
      `${venuesBaseURL}${foursquareKeyApi}ll=${validate.isLatLongEmpty(
        cityCoordinate.geobyteslatitude,
        "lat"
      )},${validate.isLatLongEmpty(
        cityCoordinate.geobyteslongitude,
        "long"
      )}&query=${category}&radius=${limit}&intent=checkin&v=${versionningDate}`
    )
      .then(result => result.json())
      .then(data => {
        // remove the disable state to the submit button
        handleRemove.handleRemoveClass(submitButtons, disableHtmlElement);

        // change the innerHTML or text content in the submit button
        handleRemove.setInnerHtml(submitButtons, "Search");

        // check if the query returns 1 or more venues
        if (data.response.venues.length > 0) {
          //display loader to the user
          handleRemove.setInnerHtml(
            searchResultCounter,
            loaderSearchResultDetailsBlock
          );
          handleRemove.setInnerHtml(
            searchResultCategory,
            loaderSearchResultDetailsBlock
          );
          handleRemove.setInnerHtml(
            searchResultLocation,
            loaderSearchResultDetailsBlock
          );

          // display the venues
          const venuesList = data.response.venues;
          setTimeout(() => {
            handleDisplayVenues.venuesUI(venuesList);
          }, 2000);

          // create a object base on the user filter values
          const userFilterOptions = {
            category: category,
            city: city,
            limit: limit,
            resultCount: venuesList.length
          };

          // stringify the user filter values
          const userFilterData = JSON.stringify(userFilterOptions);

          //save the user filter values in the local storage
          handleStore.handleSaveData(userFilterOptionKeyname, userFilterData);
        } else {
          mainMessageToTheUser.innerHTML = `
            <div class="message_to_user_container">
            <div class="message_title_text">
                <p class="main_message_title">Sorry ! Nothing was found for <span class="highlight">${validate.capitalize(
                  category
                )}</span> in <span
                        class="highlight">${city}</span> within <span class="highlight">${validate.roundToPrecision(
            validate.mathOperations(limit, 100, "div"),
            1
          )}</span>km</p>
                <p class="sub_message_title">This means no venue in ${city} within ${validate.roundToPrecision(
            validate.mathOperations(limit, 100, "div"),
            1
          )}km has a profile</p>
                <p class="message_suggestion">Please, try to increase the bounds limit or refine your search</p>
            </div>
    
            <div class="message_action_button">
                <a href="#back_to_search" class="refine_message">Refine</a>
            </div>
        </div>
          `;

          handleRemove.handleRemoveClass(
            mainMessageToTheUser,
            alertMessageClass
          );
        }
      });
  }

  async handleFetchVenueDetails(venueId) {
    // api end point
    // https://api.foursquare.com/v2/venues/45e98bacf964a52080431fe3
    const endPoint = "https://api.foursquare.com/v2/venues/";

    // api keys
    const apiKeysAndVersion =
      "?client_id=AOBANJKB3CNBFTYOITBPVH3U2MPLLBSVM04Y34OHVSE0DWUB&client_secret=QO1H1W0XPHNDCKEVNJ0ULMZ4CS3UN2OOAR4KOXSFWHJGWRQ5&v=20190201";

    // fetch venue details

    console.log(venueId, `${endPoint}${venueId}${apiKeysAndVersion}`);
    await fetch(`${endPoint}${venueId}${apiKeysAndVersion}`)
      .then(result => result.json())
      .then(data => {
        handleSingleVenueUI.handleDisplayVenueDetails(data.response.venue);
      })
      .catch(e => console.log("Error: ", e));
  }
}

export default HandleFechApis;
