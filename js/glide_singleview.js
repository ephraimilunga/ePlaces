"user strict";
import Glide from "@glidejs/glide";

// new Glide(".single_view_gallery", {
//   type: "carousel",
//   startAt: 0,
//   perView: 1
//   //animationDuration: 1500,
//   //rewindDuration: 2000
// }).mount();

new Glide(".slider_testimonials_container", {
  type: "carousel",
  startAt: 0,
  perView: 1
  //animationDuration: 1500,
  //rewindDuration: 2000
}).mount();
