import "babel-polyfill";
import HandleStorage from "../components/storage";
import ClassRemover from "../components/classRemover";
import Validator from "../components/validator";
import { favoriteCounters, favoriteFilter } from "../components/globalSelect";
// instantiate the object
const handleStore = new HandleStorage();
const handleRemove = new ClassRemover();
const handleValidate = new Validator();

class venuesLike {
  handleLikes() {
    // active the ALL filter button
    handleRemove.handleActiveElement(
      favoriteFilter,
      "filter_Active",
      "filter_all_container"
    );

    // delete the load status from the locale storage
    // this action allow the favorite venues to be loaded with new content each time a user likes a venue
    handleStore.handleDeleteData("loadFavoriteStatus");

    // animate the favorite icon
    handleRemove.handleAddClass(this, "animate_like");
    // animate the counter container (small circle red - top right corner)
    favoriteCounters.forEach(counter =>
      handleRemove.handleAddClass(counter, "animate_red_circle")
    );

    // remove the animate on favorite icon after 1 minute
    setTimeout(() => {
      handleRemove.handleRemoveClass(this, "animate_like");
      favoriteCounters.forEach(counter =>
        handleRemove.handleRemoveClass(counter, "animate_red_circle")
      );
    }, 1000);

    // get the id of the venue that has been clicked
    const venueId = this.parentNode.parentNode.parentNode.getAttribute("id");

    // get the venue categorey
    const venueCategory = this.parentNode.parentNode.parentNode.dataset
      .category;

    // get the currrent venues list from the local storage
    const currentVenues = handleStore.handleRetriveData("currentVenues");

    // current venue that is being set as favorite
    const currerntVenueFavorite = currentVenues.filter(
      venue => venue.id === venueId
    );

    // build the objct that old the venue details and category
    const venueIdentity = {
      venue: currerntVenueFavorite[0],
      category: venueCategory
    };

    // get the venue status (liked or never liked)
    const venueStatus = this.dataset.status;

    // initialize the an empty array to old the first liked venue
    const favoriteVenueIds = [];

    // call all favorite venues venue from the local storage
    const favoriteVenuesFromLocalStorage = handleStore.handleRetriveData(
      "storedFavoriteVenuesId"
    );

    if (!venueStatus) {
      // run this code if the user like a venue

      // check to see if we have data from the local storage
      if (favoriteVenuesFromLocalStorage) {
        // check to see if the current venue is not present in the list array
        // if yes, push the new venue to the old venues array from the local storage
        // and resent new array list in the local storage
        if (
          !favoriteVenuesFromLocalStorage.some(
            favorite =>
              favorite.venue === venueIdentity.venue &&
              favorite.category === venueIdentity.category
          )
        ) {
          // add the current venue that is being set as favorite to the array list of venues
          favoriteVenuesFromLocalStorage.push(venueIdentity);

          // save the venues list with the new venue added
          handleStore.handleSaveData(
            "storedFavoriteVenuesId",
            JSON.stringify(favoriteVenuesFromLocalStorage)
          );
        }
      } else {
        // if we do not have any data from the local storage
        // push the new venue id to the empty array initialized above and
        favoriteVenueIds.push(venueIdentity);

        // save it in the local storage as the fist entry.
        handleStore.handleSaveData(
          "storedFavoriteVenuesId",
          JSON.stringify(favoriteVenueIds)
        );
      }
      // set the venue staus to liked
      this.dataset.status = "liked";

      // set the heart to a full heart
      this.setAttribute("src", "full_favorite.910f9482.svg");
    } else {
      // run this code if the user unlike a venue
      if (
        favoriteVenuesFromLocalStorage ||
        favoriteVenuesFromLocalStorage.includes(venueIdentity)
      ) {
        // set the venue status to nothing (this means the venue has not ye been liked by the user)
        this.dataset.status = "";

        // set the heart to an empty one
        this.setAttribute("src", "favorite_home.eef3b794.svg");

        // filter the Venue Ids from the local storage and remove the one that correspond to the one that the user unliked
        const newFilteredVenueId = favoriteVenuesFromLocalStorage.filter(
          favorite => favorite.venue.id !== venueIdentity.venue.id
        );

        // save the new venue Ids list in the local storage
        handleStore.handleSaveData(
          "storedFavoriteVenuesId",
          JSON.stringify(newFilteredVenueId)
        );
      }
    }

    const favoriteNumber = handleValidate.isFavoriteGreatThanNine(
      handleCount.handleCountLikes("storedFavoriteVenuesId")
    );
    handleRemove.setInnerHtml(favoriteCounters, favoriteNumber);
  }

  // this method return the total number of liked venues
  handleCountLikes(keyName) {
    if (typeof keyName === "string") {
      return handleStore.handleRetriveData(keyName).length;
    } else {
      return keyName.length;
    }
  }
}

export default venuesLike;

const handleCount = new venuesLike();
