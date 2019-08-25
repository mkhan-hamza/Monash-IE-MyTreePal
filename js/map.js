//////////////////////////////////////////////////////////////////////////////////
//////////////// WHERE THE DATA COMES FROM ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// reading data - see html file to see how this is loaded
var theData = treesmal;
console.log(treesmal);

//////////////////////////////////////////////////////////////////////////////////
//////////////// BUILDING THE MAP ////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// access token for map box
// not sure where this comes from
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtemFraGFuOTQiLCJhIjoiY2p6cGpwOWdlMHFmcjNibzVzcHd3d3NzMiJ9.QnYqiNYoM2Kvcwm00alhuw';

// This adds the map to your page
var map = new mapboxgl.Map({
  container: 'map', // container id specified in the HTML
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: [  144.95404601277124, -37.79334526904956], // initial position in [lon, lat] format
  zoom: 13 // initial zoom
});

map.on('load', function(e) {
  // Add the data to your map as a layer
  map.addSource('places', {
   type: 'geojson',
   data: theData
 });

  buildLocationList(theData);
});


//////////////////////////////////////////////////////////////////////////////////
////////////////FUNCTIONS ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

// function to build the tree listing on the side
function buildLocationList(data) {
  // Iterate through the list of trees
  for (i = 0; i < data.features.length; i++) {
    var currentFeature = data.features[i];
    var prop = currentFeature.properties; // writing this long form over and over again.
      
    // Select the listing container in the HTML and append a div
    // with the class 'item' for each store
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = 'listing-' + i;

    // Create a new link with the class 'title' for each store
    // and fill it with the tree's common name
    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.dataPosition = i;
    link.innerHTML = prop.common_name;
    
    // Create a new div with the class 'details' for each store
    // and fill it with the city and phone number
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = "Located in - "
    details.innerHTML += prop.located_in;
    if (prop.useful_life_expectency_value) {
      details.innerHTML += '<br/> ' + "Life Expectency - "+ prop.useful_life_expectency;
    }
      
    // Add an event listener for the links in the sidebar listing
    link.addEventListener('click', function(e) {
    // Update the currentFeature to the store associated with the clicked link
    var clickedListing = data.features[this.dataPosition];
    // 1. Fly to the point associated with the clicked link
    flyToStore(clickedListing);
    // 2. Close all other popups and display popup for clicked store
    createPopUp(clickedListing);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  }
};

// function to make the listing fly
function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

// function to create pop up
function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  // Check if there is already a popup on the map and if so, remove it
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>MyTreePal</h3>' +
      '<h4>' + currentFeature.properties.common_name + '</h4>')
    .addTo(map);
}

theData.features.forEach(function(marker) {
  // Create a div element for the marker
  var el = document.createElement('div');
  // Add a class called 'marker' to each div
  el.className = 'marker';
  // By default the image for your custom marker will be anchored
  // by its center. Adjust the position accordingly
  // Create the custom markers, set their position, and add to map
  new mapboxgl.Marker(el, { offset: [0, 23] })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
    el.addEventListener('click', function(e) {
    var activeItem = document.getElementsByClassName('active');
    // 1. Fly to the point
    flyToStore(marker);
    // 2. Close all other popups and display popup for clicked store
    createPopUp(marker);
    // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    e.stopPropagation();
    if (activeItem[0]) {
      activeItem[0].classList.remove('active');
    }

    var listing = document.getElementById('listing-' + i);
    console.log(listing);
    listing.classList.add('active');
  });
});
