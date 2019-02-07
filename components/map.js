//************* CLASSES DECLARATION ********* */
class HereMaps {
  load(mapContainer, placesLocation) {
    //clear the map container
    mapContainer.innerHTML = "";

    // intialize the HERE Maps Apis
    const platform = new H.service.Platform({
      app_id: "qE0mA090Xy882e25rzOe",
      app_code: "cUqRE9iFoQaTWkTBquoAIQ"
    });

    // ****** instantiate the map object ****** //
    // 0. get the type of the map to display
    const defaultMapLayers = platform.createDefaultLayers();

    // 1. get the map from the map object and diplay it
    const map = new H.Map(mapContainer, defaultMapLayers.normal.traffic);

    // Enable the event on the map instance
    const mapEvents = new H.mapevents.MapEvents(map);

    // Enable the default map behavior (zoom, ...)
    new H.mapevents.Behavior(mapEvents);

    // add the default controler on the map
    H.ui.UI.createDefault(map, defaultMapLayers);

    // initialize the icon
    const imgIcon = "logo.91a27c4f_new.png";

    //display all venues on the map
    placesLocation.map(latLng => {
      // Creat an icon, an object holding the latitude and longitude, adn a marker
      const icon = new H.map.Icon(imgIcon),
        coords = { lat: latLng.lat, lng: latLng.lng },
        marker = new H.map.Marker(coords, { icon: icon });

      // add the marker to the map and center the map at he location of the marker
      map.addObject(marker);
      map.setCenter(coords);
      map.setZoom(12);
    });
  }
}

//************** EXPORT ********************* */
export default HereMaps;
