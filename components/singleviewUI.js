/// *********** IMPORT MODULES *************//
import ClassRemover from "../components/classRemover";
import HereMaps from "../components/map";
import {
  testimonyContainer,
  hideTestimonialContaienr,
  singleVenueDetailsContainer,
  singleVenueMap
} from "../components/globalSelect";

///*********** INSTANTIATE OBJEST ******** */
const handleClassRemove = new ClassRemover();
const handleMap = new HereMaps();

// *********** CLASS DECALRATION *********** //
class SingleViewUI {
  //**
  /* Show and hide the testimonials slider
   */
  handleHideShowComment() {
    // remove or hide the testimonials container
    if (
      handleClassRemove.handleHasThisClass(
        testimonyContainer,
        hideTestimonialContaienr
      )
    ) {
      handleClassRemove.handleRemoveClass(
        testimonyContainer,
        hideTestimonialContaienr
      );
    } else {
      handleClassRemove.handleAddClass(
        testimonyContainer,
        hideTestimonialContaienr
      );
    }
  }

  // */

  handleDisplayVenueDetails() {
    // BUILD THE VENUE DETAILS SECTION

    const v = JSON.parse(localStorage.getItem("v"));

    //localStorage.setItem("v", JSON.stringify(v));

    const venueDetailsHtml = `

    <div class="single_details_one">
        <a href="${isTruthy(
          v.url
        )}"><img src="global.529c85ba.svg" alt="${isTruthy(v.url)}""></a>
        <a href="tel:${isTruthy(
          parseObj(v.contact, "phone")
        )}"><img src="phone.00c8e429.svg" alt=""></a>

        <div class="single_meters">
            <p>${isTruthy(parseObj(v.price, "currency"))}</p>
        </div>

        <div class="single_likes">
            <img src="icons/full_red_heart.svg" alt="">
            <p>${isTruthy(v.ratingSignals)}</p>
        </div>

        <div class="single_verify">
            ${isVerify(v.verified)}
        </div>

        <div styly="background-color:#${v.ratingColor};" class="single_rating">
            <p>${isTruthy(v.rating)}</p>
        </div>
    </div>

    <div class="single_name_category_address">
        <p class="single_name">${isTruthy(v.name)}</p>
        <p class="single_category">Category : ${isTruthy(
          parseObj(v.categories, "name")
        )}</p>
        <p class="single_address">${parseObj(v.location, "address")}</p>
        <p class="single_city">${isTruthy(
          parseObj(v.location, "city")
        )}, ${isTruthy(parseObj(v.location, "state"))}</p>
        <p class="single_country">${isTruthy(
          parseObj(v.location, "country")
        )}</p>

    </div>

    <div class="single_more_category">
        ${displayCat(v.categories)}
        <div class="cat_ single_checkedin">${
          parseObj(v.stats, "checkinsCount")
            ? parseObj(v.stats, "checkinsCount")
            : 0
        } Checked in</div>
    </div>

    <div class="single_venue_open_hours">
        <div class="parent single_open_unil">
            <img src="icons/clock_red.svg" alt="">
            <div class="child open_until">
                <p class="open_until_text">Open until</p>
                <p class="open_until_time">1:00 AM</p>
            </div>
        </div>

        <div class="parent single_weekdays_frame">
            <img src="icons/calendar.svg" alt="">
            <div class="child open_until">
                <p class="open_until_text">Mon - Sun</p>
                <p class="open_until_time">Now Open</p>
            </div>
        </div>

        <div class="parent single_weekdays_frame">
            <img src="icons/calendar_clock.svg" alt="">
            <div class="child open_until">
                <p class="open_until_text">Mon – Sun</p>
                <p class="open_until_time">6:00 AM–1:00 AM</p>
            </div>
        </div>
    </div>

    <div class="single_activity_hours">
        <p class="single_activity_hours_title">Map</p>

        <div width="100" id="singlemap">
        </div>

    </div>

    
    `;

    // display the venue detaills to the user
    singleVenueDetailsContainer.innerHTML = venueDetailsHtml;

    // display the venue on the map
    if (isTruthy(v.location.lat) && isTruthy(v.location.lng)) {
      const lat = v.location.lat;
      const lng = v.location.lng;

      // set the venue location
      const venueLocation = [{ lat, lng }];

      // display the venue on the map
      // handleMap.load(singleVenueMap, venueLocation);
    }
  }
}

//*********** EXPORT MODULES ********** */
export default SingleViewUI;

// validator
function isTruthy(value) {
  return value ? value : "...";
}

function parseObj(obj, valueToReturn) {
  if (obj) {
    return obj[valueToReturn];
  } else {
    return "...";
  }
}

function isVerify(verified) {
  if (verified) {
    return '<img src="check_white.ae069194.ae069194.svg" alt="">';
  }

  return "NO";
}

function displayCat(catList) {
  const catLength = catList.length;

  if (catList) {
    if (catLength > 1) {
      return catList.map(cat => {
        return `<div class="cat_">${cat.name}</div>`;
      });
    }

    if (catLength === 1) {
      return `<div class="cat_">${catList[0].name}</div>`;
    }

    if (catLength < 1) {
      return "N/A";
    }
  }
}
