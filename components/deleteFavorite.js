"use strict";
import "babel-polyfill";
import HandleStorage from "../components/storage";
import Validator from "../components/validator";
import venuesLike from "../components/handleVenuesLike";
import ClassRemover from "../components/classRemover";
import { handleDisplayVenue } from "../components/getFavorite";
import {
  favoriteCounters,
  deleteConfirmation,
  deleteTrashContainer,
  favoriteVenueCounter,
  placesYouLikeWrapper
} from "../components/globalSelect";

// instantiate objects
const handleStore = new HandleStorage();
const handleValidate = new Validator();
const handleRemove = new ClassRemover();
const handleCount = new venuesLike();

class DeleteFavorite {
  //**
  /* The element on which to add a click event
     /* @param {HTMLElement} element 
     */
  handleDelete(element) {
    // if the click came from the ALL button under favorite places
    //the variable tab will be set to all
    let tab = null;

    if (element.length > 1) {
      element.forEach(ele => ele.addEventListener("click", deleteElement));
      tab = "all";
    } else {
      element.addEventListener("click", deleteElement);
    }

    function deleteElement(e) {
      // get the clicked element
      const clickedElement = e.target;

      // check to see if the current clicked element is the heart icon
      if (clickedElement.classList.contains("favorite_icon")) {
        /// get the parent element (3 level up)
        const clickedElementParentNode =
          clickedElement.parentNode.parentNode.parentNode;

        // if yes remove the parent node element from the view
        handleDeleteEvents.handleDelteAnimation(null, clickedElementParentNode);

        // set target (all, fun, coffee)
        // doing this help refech only the from where the user delete a place (venue);
        let target = tab || clickedElementParentNode.dataset.category;

        // get the favorite venues from the local storage
        const favoriteVenuesFromLocalStorage = handleStore.handleRetriveData(
          "storedFavoriteVenuesId"
        );

        // filter the Venue Ids from the local storage and remove the one that correspond to the one that the user unliked
        const newFilteredVenueId = favoriteVenuesFromLocalStorage.filter(
          favorite =>
            favorite.venue.id !== clickedElementParentNode.getAttribute("id")
        );

        // save the new venue Ids list in the local storage
        handleStore.handleSaveData(
          "storedFavoriteVenuesId",
          JSON.stringify(newFilteredVenueId)
        );

        // wait 2ms
        setTimeout(() => {
          //refresh the the venue list in the UI
          // note that we keep the actual tab active and only its venues list is refresh
          if (
            newFilteredVenueId.length === 3 ||
            newFilteredVenueId.length === 0
          ) {
            handleDisplayVenue.handleFavorite(target, "form");
          }

          // check to see if the user is currently deleting from others tab than the All tab
          const currentActiveTab = placesYouLikeWrapper.querySelector(
            ".filter_Active"
          ).dataset.favoritecategory;

          // if the current tab is different to all tab category
          if (currentActiveTab !== "all") {
            // check to see if there still any favorite for the current tab
            const isStillInFavoriteArray = handleValidate.isThisValueInThatArrayObject(
              currentActiveTab,
              newFilteredVenueId,
              "category"
            );

            // if false,
            // reload and display the empty status message to the user
            if (!isStillInFavoriteArray) {
              handleDisplayVenue.handleFavorite(currentActiveTab, "form");
            }
          }
        }, 1500);

        // reset the favorite counter in the nav bar to the current favorite length
        const favoriteNumber = handleValidate.isFavoriteGreatThanNine(
          handleCount.handleCountLikes("storedFavoriteVenuesId")
        );

        //display the new counter value
        handleRemove.setInnerHtml(favoriteCounters, favoriteNumber);

        // reset the favorite button counter
        handleRemove.setInnerHtml(
          favoriteVenueCounter,
          favoriteNumber +
            " " +
            handleValidate.isPlural(favoriteNumber, "Result")
        );

        // add the delete text to the delete message container
        handleRemove.setInnerHtml(
          deleteConfirmation,
          "<p>Favorite Deleteted</p>"
        );

        // show the delete confirmation to the user
        handleRemove.classToggler(
          deleteConfirmation,
          "hide_delete_confirmation"
        );

        // wait 1 second to remove the delete confirmation message
        setTimeout(() => {
          handleRemove.classToggler(
            deleteConfirmation,
            "hide_delete_confirmation"
          );
        }, 2000);
      }
    }
  }

  handleDelteAnimation(elementNode = null, elementToAnimate) {
    // this block animate the trash contaienr when the user over and leave
    if (elementNode) {
      elementNode.forEach(icon =>
        icon.addEventListener("mouseover", function(e) {
          handleRemove.handleRemoveClass(
            deleteTrashContainer,
            "hide_delete_trash_container"
          );
        })
      );

      elementNode.forEach(icon =>
        icon.addEventListener("mouseleave", function(e) {
          handleRemove.handleAddClass(
            deleteTrashContainer,
            "hide_delete_trash_container"
          );
        })
      );
    }

    // this will animate the venues container from its orginal place and size
    // to the size and place of the trash container
    // no idea how it gonna be :) Let try it <)
    if (elementToAnimate) {
      // get the trash container location
      const deleteTrashContainerLocation = deleteTrashContainer.getBoundingClientRect();

      // move the block venue to the same position as the trash container
      elementToAnimate.style.transform = `translate(${
        deleteTrashContainerLocation.left
      }px, ${deleteTrashContainerLocation.top}px)`;

      // await 1 second and remove the element from the UI
      setTimeout(() => {
        // set the parent node of the target element to 0 width and margin 0 to get that slide animation
        if (elementToAnimate.parentNode) {
          elementToAnimate.parentNode.style.width = 0 + "px";
          elementToAnimate.parentNode.style.margin = 0 + "px";
        }

        // finaly remove the element from the UI
        elementToAnimate.remove();
      }, 1000);
    }
  }
}

export default DeleteFavorite;

const handleDeleteEvents = new DeleteFavorite();
