"use strict";
import "babel-polyfill";
import ClassRemover from "../components/classRemover";
import HandleStorage from "../components/storage";
import Validator from "../components/validator";
import venuesLike from "../components/handleVenuesLike";
import HereMaps from "../components/map";

import {
  searchResultCounter,
  searchResultCategory,
  searchResultLocation,
  userFilterOptionKeyname,
  resultContainer,
  categoryDetailsIcon,
  visitedCitiesKeyname,
  $map
} from "../components/globalSelect";

/// instantiate the object
const handleInnerHTMLChange = new ClassRemover();
const handleStore = new HandleStorage();
const validate = new Validator();
const handleVenuesLike = new venuesLike();
const handleMap = new HereMaps();

class DisplayVenues {
  venuesUI(data) {
    // set the array to old venue idsd
    const venueIds = [];

    // set the array to old venue latitude and longetude
    // for the later use to display them on the map.
    const venuesLatLng = [];

    // set the venues list array
    const venuesList = data;

    //console.log(venuesList);
    // get the user search detail from the local storage
    const userInfoDetail = handleStore.handleRetriveData(
      userFilterOptionKeyname
    );

    // save current venues in local storage
    handleStore.handleSaveData("currentVenues", JSON.stringify(venuesList));

    // distructure the search result object
    const { category, city, resultCount } = userInfoDetail;

    // displaly the result details to the user
    handleInnerHTMLChange.setInnerHtml(
      searchResultCounter,
      `${resultCount} ${validate.isPlural(resultCount, "Result")}`
    );
    handleInnerHTMLChange.setInnerHtml(
      searchResultCategory,
      validate.capitalize(category)
    );
    handleInnerHTMLChange.setInnerHtml(searchResultLocation, city);

    categoryDetailsIcon.forEach(icon =>
      icon.setAttribute(
        "src",
        `https://ephraimilunga.co.za/eweather/icons/${category}_red.svg`
      )
    );
    // display the venues to the user
    const venues = venuesList
      .map(venue => {
        // add all venues latitude and logitude to the array.
        venuesLatLng.push({
          lat: venue.location.lat,
          lng: venue.location.lng
        });

        // add ids to the venueIds array
        venueIds.push(venue.id);

        return `
            <div id="${
              venue.id
            }" data-category="${category}" class="venue_block_container">
                <div class="venue_image_container" style="background-image: url('https://source.unsplash.com/featured/?${category}')">
                    <div class="venue_set_favorite_container">
                        <img data-status="${
                          validate.isInFavoriteList(venue.id) ? "liked" : ""
                        }" class="favorite_icon" src="${validate.isInFavoriteList(
          venue.id
        ) || "favorite_home.eef3b794.svg"}" alt="">
                    </div>
                </div>
            
                <div class="venue_description_name_address">
                    <p class="venue_description">${validate.isFalsy(
                      venue.categories[0],
                      "category"
                    )}</p>
                    <p class="venue_name">${validate.isFalsy(venue.name)}</p>
                    <p class="venue_address">${validate.isFalsy(
                      venue.location.formattedAddress[0]
                    )} </p>
                    <p class="venue_sub_address">${validate.isFalsy(
                      venue.location.formattedAddress[1]
                    )}</p>
                </div>
            
                <div class="venue_distance_explore_button">
                    <div class="venue_distance">
                        <img src="distance_search.982581db.svg" alt="eplaces">
                        <p>${validate.isFalsy(
                          validate.roundToPrecision(
                            validate.mathOperations(
                              venue.location.distance,
                              1000,
                              "div"
                            ),
                            1
                          )
                        )}km</p>
                    </div>
                    <div class="venue_explore_button">
                        <button data-from="home" class="explore_button" id="${validate.isFalsy(
                          venue.id
                        )}">Explore</button>
                    </div>
                </div>
            </div>
      `;
      })
      .join("");

    // save the current city as visited
    const visitedCities = handleStore.handleRetriveData(visitedCitiesKeyname);

    //set the new venue info
    const visitedCitiesListInfo = { city, category };

    // check if the user visited list exist
    // if doest not exit, create one and then save it to local storage
    // if it does exist update it with the current city
    if (!visitedCities) {
      let visitedCitiesList = [];

      visitedCitiesList.push(visitedCitiesListInfo);

      handleStore.handleSaveData(
        visitedCitiesKeyname,
        JSON.stringify(visitedCitiesList)
      );
    } else {
      // set a flag to determine whether the current city has been visited by the current user
      let newVisit = true;

      // map through all visited cities from the local storage
      // if a city match match the current city and filter category
      // set the flag to false. This prevent multiple saving.
      visitedCities.map(visitedCity => {
        if (visitedCity.city === city && visitedCity.category === category)
          newVisit = false;
      });

      // if the city was not found in the visited list from the local storage
      // save it as visited city.
      if (newVisit) {
        visitedCities.push(visitedCitiesListInfo);
        handleStore.handleSaveData(
          visitedCitiesKeyname,
          JSON.stringify(visitedCities)
        );
      }
    }

    // display the venues to the UI.
    handleInnerHTMLChange.setInnerHtml(resultContainer, venues);

    setTimeout(() => {
      const favoriteIcon = document.querySelectorAll(".favorite_icon");
      /// listen for a click event on all favorite icons to set a venue liked or unliked
      favoriteIcon.forEach(icon =>
        icon.addEventListener("click", handleVenuesLike.handleLikes)
      );

      document.querySelectorAll(".explore_button").forEach(button => {
        button.addEventListener("click", validate.handllRedirection);
      });
    }, 2000);

    // save the venues latitude and longitude
    handleStore.handleSaveData("venuesLatLng", JSON.stringify(venuesLatLng));

    // send the venues latitude and longitude to map method that will display venues on map.
    handleMap.load($map, venuesLatLng);
  }
}

export default DisplayVenues;
