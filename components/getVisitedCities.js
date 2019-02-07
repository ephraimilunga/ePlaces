"user strict";
import "babel-polyfill";
import Glide from "@glidejs/glide";
import HandleStorage from "../components/storage";
import ClassRemover from "../components/classRemover";
import Validator from "../components/validator";
import { UI } from "../components/getCities";
import { fetchCities } from "../js/index";

import {
  visitedCitiesFilters,
  visitedCitiesContainer,
  favoriteVenuesLoader,
  visitedCitiesCounter,
  visitedCitiesKeyname,
  visitedCitiesErrorMessage,
  categoryInput,
  locationInput
} from "../components/globalSelect";

// instantiate object
const handleStore = new HandleStorage();
const handleRemove = new ClassRemover();
const handleValidate = new Validator();
const handleExtact = new UI();

class GetCities {
  handleVisitedCities(target, from = null) {
    // get visited cities from the local storage
    const visitedCities =
      handleStore.handleRetriveData(visitedCitiesKeyname) || [];

    // get the loaded status
    // if it not false load otherwise do no laad any city
    const visitedCitiesLoaded = handleStore.handleRetriveData(
      "visitedCitiesLoaded"
    );

    //check if the cities array length is more than 0
    if (visitedCities.length > 0) {
      // check if we the target equal to all
      // if yes laad all cities
      if (target === "all" && !visitedCitiesLoaded) {
        // active the ALL filter button
        handleRemove.handleActiveElement(
          visitedCitiesFilters,
          "filter_Active",
          "cities_filter_all_container"
        );

        // display the loader ot the user
        handleRemove.setInnerHtml(visitedCitiesContainer, favoriteVenuesLoader);

        // send all cities to the UI handler
        handleUI.handleVisitedCitiesUI(visitedCities);

        // set the counter to the array length
        handleRemove.setInnerHtml(
          visitedCitiesCounter,
          visitedCities.length +
            " " +
            handleValidate.isPlural(visitedCities.length, "Result")
        );

        // let first log to make sure of what we are is right :)
        //console.log(visitedCities);

        //set the loaded status to true in order to prevent multiple laoding on scroll
        handleStore.handleSaveData(
          "visitedCitiesLoaded",
          JSON.stringify({ status: true })
        );
      }

      // check if the target equal to others category
      // if yes filter the visited cities array the get only city that match.
      if (from === "form") {
        // initialize the filtered variable
        let filteredVisitedCities = null;

        // if the event came from the user click and the clicked button was "all"
        // execut this section
        if (target === "all") {
          // display the loader ot the user
          handleRemove.setInnerHtml(
            visitedCitiesContainer,
            favoriteVenuesLoader
          );

          filteredVisitedCities = visitedCities;

          // send all cities to the UI handler
          handleUI.handleVisitedCitiesUI(filteredVisitedCities);

          // set the counter to the array length
          handleRemove.setInnerHtml(
            visitedCitiesCounter,
            filteredVisitedCities.length +
              " " +
              handleValidate.isPlural(filteredVisitedCities.length, "Result")
          );
        } else {
          // display the loader ot the user
          handleRemove.setInnerHtml(
            visitedCitiesContainer,
            favoriteVenuesLoader
          );

          // if the user has cliked the others category the execute this block
          // filter the cities array
          filteredVisitedCities = visitedCities.filter(
            city => city.category === target
          );

          if (filteredVisitedCities.length > 0) {
            // send all cities to the UI handler
            handleUI.handleVisitedCitiesUI(filteredVisitedCities);

            // set the counter to the array length
            handleRemove.setInnerHtml(
              visitedCitiesCounter,
              filteredVisitedCities.length +
                " " +
                handleValidate.isPlural(filteredVisitedCities.length, "Result")
            );
          } else {
            //set the counter to zero
            handleRemove.setInnerHtml(visitedCitiesCounter, "0 Result");

            // build the error message
            const favoriteVenuesErrorMessageByCategory = `
                    <div class="loader_places_">
                        <p class="fovorite_error_main">You havn't search for <b> ${handleValidate.capitalize(
                          target
                        )} </b> in any city</p>
                        <p class="fovorite_error_sub">All cities you previously visited will appear here</p>
                    </div>
            `;

            // await 1 second
            setTimeout(() => {
              // and display the message to the user
              handleRemove.setInnerHtml(
                visitedCitiesContainer,
                favoriteVenuesErrorMessageByCategory
              );
            }, 1000);
          }
        }
      }
    } else {
      //set the counter to zero
      handleRemove.setInnerHtml(visitedCitiesCounter, "List Empty");

      // display the the message to the user
      handleRemove.setInnerHtml(
        visitedCitiesContainer,
        visitedCitiesErrorMessage
      );
    }
  }

  //**
  /* the cities object to be display
   /* @param {Object} cities 
   */
  handleVisitedCitiesUI(cities) {
    // create a list of all cities
    const citiesList = cities
      .map(city => {
        // extact region initial and country name from the City name
        const cityName = handleExtact.extractCityCountry(city.city)[0];
        const countryName = handleExtact.extractCityCountry(city.city)[
          handleExtact.extractCityCountry(city.city).length - 1
        ];
        const cityInitial = handleExtact.extractCityCountry(city.city)[
          handleExtact.extractCityCountry(city.city).length - 2
        ];

        return `
                <div class="glide__slide">
                    <!--start city block-->
                    <div class="venue_block_container">
                        <div data-city="${city.city}" data-category="${
          city.category
        }" class="venue_image_container venue_image_container_city" style="background-image: url('https://source.unsplash.com/featured/?${cityName}, ${countryName}')">
                            <div class="city_set_favorite_container">
                                <p class="main_city_name">${cityName}</p>
                                <p class="sub_city_country_name">${cityInitial} - ${countryName}</p>
                            </div>
                        </div>
                    </div>
                </div>
        `;
      })
      .join("");

    // create the carousel block
    const citiesBlock = `
        <div class="glide__track" data-glide-el="track">
            <div class="glide__slides">
                ${citiesList}
            </div>
        </div>
    
    
        <div class="slide_arrow_container glide__arrows" data-glide-el="controls">
            <img src="arrow_left.35058f2e.svg" class="slide_arrow a_left glide__arrow glide__arrow--left" data-glide-dir="<">
            <img src="arrow_right.bd98ca69.svg"  class="slide_arrow a_right glide__arrow glide__arrow--right" data-glide-dir=">">
        </div>
    `;

    // wait 1 second
    setTimeout(() => {
      if (cities.length > 5) {
        // set the cities to the user
        handleRemove.setInnerHtml(visitedCitiesContainer, citiesBlock);

        // initialize the carousel
        new Glide(".glide_visted_location", {
          type: "carousel",
          startAt: 0,
          perView: 5
          //animationDuration: 1500,
          //rewindDuration: 2000
        }).mount();
      } else {
        handleRemove.setInnerHtml(visitedCitiesContainer, citiesList);
      }
    }, 1000);

    // wait 2s
    setTimeout(() => {
      // add event listener to the visited cities block
      document.querySelectorAll(".venue_image_container_city").forEach(block =>
        block.addEventListener("click", function() {
          // get the clicked city name
          const city = this.dataset.city;
          const category = this.dataset.category;

          // set the city inputs value
          locationInput.forEach(inputy => (inputy.value = city));

          // set the category value
          // 0. active the category block on the hero section
          document
            .querySelector(`div[data-filtername="${category}"]`)
            .classList.add("activeFilter");

          // sethe the input value on the fixed search form
          categoryInput.value = category;

          // call the function that fetch venues
          fetchCities();

          // scroll to the top
          window.scrollTo(0, 500);
        })
      );
    }, 2000);
  }
}

export default GetCities;

const handleUI = new GetCities();
