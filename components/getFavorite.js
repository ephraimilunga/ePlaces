"user strict";
import Glide from "@glidejs/glide";

import "babel-polyfill";
import HandleStorage from "../components/storage";
import ClassRemover from "../components/classRemover";
import venuesLike from "../components/handleVenuesLike";
import Validator from "../components/validator";
import DeleteFavorite from "../components/deleteFavorite";
import { handleSwitch } from "../components/switch";
import {
  placesYouLikeContainer,
  favoriteVenueCounter,
  favoriteVenuesLoader,
  favoriteFilter,
  favoriteVenuesErrorMessage
} from "../components/globalSelect";

//instantiate objects
const handleStore = new HandleStorage();
const handleRemove = new ClassRemover();
const handleCounter = new venuesLike();
const handleValidate = new Validator();
const handleDeleteFavorite = new DeleteFavorite();

class GetFavoriteVenues {
  //**
  /* tells the function which category to fetch from the local storage (eg: food, fun or  coffee )
     /* @param {String} target 
     */
  handleFavorite(target, from = null, fromsection) {
    //if (target === "all") handleStore.handleDeleteData("loadFavoriteStatus");
    //get the favorite status from the local store to allow or prent the venues to be loaded to the UI
    const loadedStatus = handleStore.handleRetriveData("loadFavoriteStatus");

    // check to see if the loaded status is available and the status is not set to false
    // NOTE : THIS LINE OF CODE  WILL MOSTLY BE EXECUTED WHEN THE USER SCROLL TO THE FAVORITE VENUES SECTION
    // AND AFTER HE HAS LIKED A VENUE
    if ((!loadedStatus || !loadedStatus.status) && target === "all") {
      // active the ALL filter button
      handleRemove.handleActiveElement(
        favoriteFilter,
        "filter_Active",
        "fav_filter_all_container"
      );

      // show the loader to the user
      handleRemove.setInnerHtml(placesYouLikeContainer, favoriteVenuesLoader);

      // get the venues from the local storage
      const getFavoriteVenuresFromLocalStorage = handleStore.handleRetriveData(
        "storedFavoriteVenuesId"
      );

      // check to see if have 1 or more venues
      if (!getFavoriteVenuresFromLocalStorage) {
        handleRemove.setInnerHtml(
          placesYouLikeContainer,
          favoriteVenuesErrorMessage
        );

        // set the total of favorite venues to 0 result
        handleRemove.setInnerHtml(favoriteVenueCounter, "0 Result");

        return;
      }
      if (getFavoriteVenuresFromLocalStorage) {
        if (
          handleCounter.handleCountLikes(getFavoriteVenuresFromLocalStorage) < 1
        ) {
          handleRemove.setInnerHtml(
            placesYouLikeContainer,
            favoriteVenuesErrorMessage
          );

          // set the total of favorite venues to 0 result
          handleRemove.setInnerHtml(favoriteVenueCounter, "0 Result");

          return;
        } else {
          setTimeout(() => {
            // display the favorite venues to the UI
            handleDisplayVenue.handleFavoriteUI(
              getFavoriteVenuresFromLocalStorage
            );
          }, 2000);

          // set the load status to true to prevent multiple loadings
          handleStore.handleSaveData(
            "loadFavoriteStatus",
            JSON.stringify({ status: true })
          );
        }
      }
    }

    // NOTE :  THIS CODE WILL BE EXECUTED ONLY WHEN THE USER CLICK ON  THE "ALL FILTER BUTTON" ON FAVORITE VENUE BLOCK
    if (from === "form") {
      // get the venues from the local storage
      const getFavoriteVenuresFromLocalStorage = handleStore.handleRetriveData(
        "storedFavoriteVenuesId"
      );

      // check to see if we have 1 or more venues
      // if no venues stop the function execution
      if (!getFavoriteVenuresFromLocalStorage) {
        handleRemove.setInnerHtml(
          placesYouLikeContainer,
          favoriteVenuesErrorMessage
        );

        // set the total of favorite venues to 0 result
        handleRemove.setInnerHtml(favoriteVenueCounter, "0 Result");
        return;
      }
      // if we have a venues array this code will be executed
      if (getFavoriteVenuresFromLocalStorage) {
        // check to see if the venue array length is less than one
        // if yes, tell the user that he has not yet save any favorite
        if (
          handleCounter.handleCountLikes(getFavoriteVenuresFromLocalStorage) < 1
        ) {
          // display the error message (info message)
          // and stop the execution of the function
          handleRemove.setInnerHtml(
            placesYouLikeContainer,
            favoriteVenuesErrorMessage
          );

          // set the total of favorite venues to 0 result
          handleRemove.setInnerHtml(favoriteVenueCounter, "0 Result");
          return;
        } else {
          // if the favorite venues array length is greater than 0
          // first initialize the variable to old the filtered venues
          let filteredFavoriteVenues = null;

          // check to see what button was clicked by the user
          // if it was not the ALL button filter the favorite venues to get only those corresponding to the category clicked (eg: food, fun,...)
          if (target !== "all") {
            filteredFavoriteVenues = getFavoriteVenuresFromLocalStorage.filter(
              venue => venue.category === target
            );
          } else {
            // if it was the ALL button that has been clicked
            // do not filter and display set the value of filtered Favorite venues to all the available venues
            filteredFavoriteVenues = getFavoriteVenuresFromLocalStorage;
          }

          // check to see if the filtered array contains any value
          if (handleCounter.handleCountLikes(filteredFavoriteVenues) < 1) {
            //if not, show the loader to the user
            handleRemove.setInnerHtml(
              placesYouLikeContainer,
              favoriteVenuesLoader
            );

            // build the error message
            const favoriteVenuesErrorMessageByCategory = `
                    <div class="loader_places_">
                        <p class="fovorite_error_main">You havn't a favorite in <b> ${handleValidate.capitalize(
                          target
                        )} </b> category</p>
                        <p class="fovorite_error_sub">All favorite places will appear here</p>
                    </div>
            `;

            // wait 1 second
            setTimeout(() => {
              // and display the error message to the user
              handleRemove.setInnerHtml(
                placesYouLikeContainer,
                favoriteVenuesErrorMessageByCategory
              );

              placesYouLikeContainer.style.minHeight = 150 + "px";

              //finally
              // set the total of favorite venues to 0 result
              handleRemove.setInnerHtml(favoriteVenueCounter, "0 Result");
            }, 1000);
          } else {
            // if the filtered contains some values

            // show the loader to the user
            handleRemove.setInnerHtml(
              placesYouLikeContainer,
              favoriteVenuesLoader
            );

            // wait 1 second
            setTimeout(() => {
              // and finaly display the favorite venues to the UI
              handleDisplayVenue.handleFavoriteUI(filteredFavoriteVenues);
            }, 1000);
          }
        }
      }
    }
  }

  handleFavoriteUI(object) {
    const favoriteVenues = object
      .map(place => {
        return `
            <div class="glide__slide custome_style_ custome_style_un_carousel">
                <div id="${place.venue.id}" data-category="${place.category}" 
                class="venue_block_container fav_venue_block_container">
                    <div class="venue_image_container" style="background-image: url('https://source.unsplash.com/featured/?${
                      place.category
                    }')">
                        <div class="venue_set_favorite_container">
                            <img data-status="" class="favorite_icon delete_favorite_icon" src="trash.e2762dec.svg" alt="">
                        </div> 
                    </div>
                
                    <div class="venue_description_name_address">
                         <p class="venue_description">${handleValidate.isFalsy(
                           place.venue.categories[0],
                           "category"
                         )}</p>
                    <p class="venue_name">${handleValidate.isFalsy(
                      place.venue.name
                    )}</p>
                    <p class="venue_address">${handleValidate.isFalsy(
                      place.venue.location.formattedAddress[0]
                    )} </p>
                    <p class="venue_sub_address">${handleValidate.isFalsy(
                      place.venue.location.formattedAddress[1]
                    )}</p>
                    </div>
                
                    <div class="venue_distance_explore_button">
                        <div class="venue_distance">
                        <img src="distance_search.982581db.svg" alt="eplaces">
                        <p>${handleValidate.isFalsy(
                          handleValidate.roundToPrecision(
                            handleValidate.mathOperations(
                              place.venue.location.distance,
                              1000,
                              "div"
                            ),
                            1
                          )
                        )}km</p>
                    </div>
                    <div class="venue_explore_button">
                        <button data-from="home" class="explore_button" id="${handleValidate.isFalsy(
                          place.venue.id
                        )}">Explore</button>
                    </div>
                    </div>
                </div>
            
            </div>
          
          `;
      })
      .join("");

    // construct the favorite venues carousel
    const favoriteVenuesBlock = `
            <div class="glide__track" data-glide-el="track">
                <div class="glide__slides">
                        ${favoriteVenues}
                </div>
            </div>

        
            <div class="slide_arrow_container glide__arrows" data-glide-el="controls">
                <img src="arrow_left.35058f2e.svg" class="slide_arrow a_left glide__arrow glide__arrow--left" data-glide-dir="<">
                <img src="arrow_right.bd98ca69.svg" class="slide_arrow a_right glide__arrow glide__arrow--right" data-glide-dir=">">
            </div>
        `;

    // do not create a carousel if the favorite venues array lenght is less than 4
    if (object.length >= 4) {
      // display the venues carousel to the UI
      handleRemove.setInnerHtml(placesYouLikeContainer, favoriteVenuesBlock);

      // select all slider block
      const sliderBlocks = document.querySelectorAll(
        ".custome_style_un_carousel"
      );

      // remove all classes that style the venues when the carousel is desable
      sliderBlocks.forEach(element =>
        element.classList.remove("custome_style_")
      );

      // initialise the carousel
      new Glide(".glide_places_you_liked", {
        type: "carousel",
        startAt: 0,
        perView: 4
        //animationDuration: 1500,
        //rewindDuration: 2000
      }).mount();

      setTimeout(() => {
        // add a listener for the click event on the slider parent element
        // this event will help us determine if the user want to unlike (unfavorite) a place
        handleDeleteFavorite.handleDelete(
          document.querySelectorAll(".delete_favorite_icon")
        );

        // on all explore link
        // this code when the user click "Explore" on the venue block
        document
          .querySelectorAll(".explore_button")
          .forEach(button =>
            button.addEventListener("click", handleValidate.handllRedirection)
          );
      }, 1000);
    } else {
      // display the venues to the UI
      handleRemove.setInnerHtml(placesYouLikeContainer, favoriteVenues);

      // add a listner for the click event on the slider parent element
      // this event will help us determine if the user want to unlike (unfavorite) a place
      handleDeleteFavorite.handleDelete(placesYouLikeContainer);
    }

    // get the total of favorite venues
    const totalVenues = handleCounter.handleCountLikes(object);
    handleRemove.setInnerHtml(
      favoriteVenueCounter,
      totalVenues + " " + handleValidate.isPlural(totalVenues, "Result")
    );

    // add a listener for the mouse over event on the each trash icon
    // this event will help us determine if the user over the trash icon so that we can animate
    // the trans icon at the bottom right coner of the screen
    handleDeleteFavorite.handleDelteAnimation(
      document.querySelectorAll(".delete_favorite_icon")
    );
  }
}

// instantiant the object
const handleDisplayVenue = new GetFavoriteVenues();

export { handleDisplayVenue };
