/**
 *
 * File maps.js.
 *
 */



// 
// BEGIN - global - do not edit
// -------------------------------------------------------------------------------------------------------------------------------------------- //
// 


var key_locations = {
  royal_canin: {
    lat: 43.700753,
    lng: 4.187961
  },
  first_10: {
    lat: 53.790639,
    lng: -1.532333
  },
  first_10_2: {
    lat: 53.790639,
    lng: -1.532
  }
}

// Map icon
var icon = {
  path: 'M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0zm0 57C18.2 57 7 45.8 7 32S18.2 7 32 7s25 11.2 25 25-11.2 25-25 25zm11.5-25c0 6.4-5.1 11.5-11.5 11.5S20.5 38.4 20.5 32 25.6 20.5 32 20.5 43.5 25.6 43.5 32z',
  fillColor: '#E2001A',
  fillOpacity: .6,
  scale: .5,
  strokeWeight: 0
}

/**
 * Create a Google Maps Marker
 * @param  object   position  The desired position of the Marker
 * @param  object   map       The Map to apply the Marker to      
 * @return object             The Marker applied to the Map
 */
function create_marker ( position, map ) {
  if ( typeof map === "undefined" || typeof position === "undefined") {
    return false;
  }

  var map_marker = new google.maps.Marker({
    icon: icon,
    position: position,
    map: map
  });

  // return not strictly needed, as Marker gets applied when new Method is called.
  return map_marker;
}


// 
// END - global - do not edit
// -------------------------------------------------------------------------------------------------------------------------------------------- //
// 




// Settings
var settings_map_royal_canin = {
  center: key_locations.royal_canin,
  scrollwheel: false,
  zoom: 17
}

var settings_map_first_10 = {
  center: key_locations.first_10,
  scrollwheel: false,
  zoom: 18
}



/**
 * Standard Google Maps init function. Generates Maps.
 */
function initMap() {

  var dom_map_royal_canin = document.getElementById( 'map_royal_canin' );
  var dom_map_first_10 = document.getElementById( 'map_first_10' );

  if ( null !== dom_map_royal_canin ) {
    var map_royal_canin = new google.maps.Map( dom_map_royal_canin, settings_map_royal_canin );
    create_marker( key_locations.royal_canin, map_royal_canin );
  }

  if ( null !== dom_map_first_10 ) {
    var map_first_10 = new google.maps.Map( dom_map_first_10, settings_map_first_10 );
    create_marker( key_locations.first_10, map_first_10 );
    create_marker( key_locations.first_10_2, map_first_10 );
  }

}


