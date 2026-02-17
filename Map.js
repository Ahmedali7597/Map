/*
*"StAuth10244: I Ahmed Ali, 000824753 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
*/


// Global variables for map, markers, info window, user marker, and directions services.
let map;
let markers = [];
let infoWindow;
let userMarker = null;
let directionsService;
let directionsRenderer;

// Array of 10 sample locations with various categories.
const locations = [
  {
    name: "Dundurn Castle",
    address: "610 York Blvd, Hamilton, ON L8R 3E7",
    category: "Historic",
    description: "A beautiful Castle in Hamilton.",
    position: { lat: 43.26978766808976, lng: -79.88362999268274 }
  },
  {
    name: "Workers Arts & Heritage Centre",
    address: "51 Stuart St, Hamilton, ON L8L 1B5",
    category: "Museum",
    description: "A museum showcasing local history.",
    position: { lat: 43.26666225937804, lng: -79.86659800456955 }
  },
  {
    name: "Historic Fort",
    address: "Fort George, Hamilton",
    category: "Historic",
    description: "A historic fort site with guided tours.",
    position: { lat: 43.2570, lng: -79.8720 }
  },
  {
    name: "Art Gallery",
    address: "Art Gallery, Hamilton",
    category: "Attraction",
    description: "A vibrant local art gallery.",
    position: { lat: 43.2540, lng: -79.8700 }
  },
  {
    name: "Botanical Gardens",
    address: "Botanical Gardens, Hamilton",
    category: "Park",
    description: "Expansive gardens featuring rare plants.",
    position: { lat: 43.2530, lng: -79.8680 }
  },
  {
    name: "Science Centre",
    address: "Science Centre, Hamilton",
    category: "Museum",
    description: "An interactive science centre for all ages.",
    position: { lat: 43.2580, lng: -79.8730 }
  },
  {
    name: "Old Town Square",
    address: "Old Town, Hamilton",
    category: "Historic",
    description: "Historic downtown area with charming architecture.",
    position: { lat: 43.2520, lng: -79.8670 }
  },
  {
    name: "City Zoo",
    address: "City Zoo, Hamilton",
    category: "Attraction",
    description: "A popular local zoo with various animal exhibits.",
    position: { lat: 43.2510, lng: -79.8660 }
  },
  {
    name: "River Park",
    address: "River Park, Hamilton",
    category: "Park",
    description: "A scenic park by the river.",
    position: { lat: 43.2500, lng: -79.8650 }
  },
  {
    name: "Maritime Museum",
    address: "Maritime Museum, Hamilton",
    category: "Museum",
    description: "A museum showcasing Hamilton's maritime history.",
    position: { lat: 43.2590, lng: -79.8740 }
  }
];

/**
 * initMap
 * Initializes the Google Map, sets up the directions services,
 * adds markers to the map, and configures UI event listeners.
 */
function initMap() {
  // Initialize the map using a valid Map ID from your Google Cloud Console.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2557, lng: -79.8711 },
    zoom: 13,
    mapId: "DEMO_MAP_ID"
  });
  infoWindow = new google.maps.InfoWindow();

  // Initialize directions services.
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("directions-panel"));

  // Add sample markers for each location.
  locations.forEach(location => {
    addMarker(location);
  });

  // Populate the dropdown for selecting a destination.
  populateDestinationDropdown();

  // Set up category filter buttons.
  document.getElementById("btn-all").addEventListener("click", () => filterMarkers("All"));
  document.getElementById("btn-park").addEventListener("click", () => filterMarkers("Park"));
  document.getElementById("btn-museum").addEventListener("click", () => filterMarkers("Museum"));
  document.getElementById("btn-historic").addEventListener("click", () => filterMarkers("Historic"));
  document.getElementById("btn-attraction").addEventListener("click", () => filterMarkers("Attraction"));

  // Set up geolocation to mark the user's current location.
  document.getElementById("btn-geolocate").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Remove previous user marker if one exists.
          if (userMarker) {
            userMarker.map = null;
          }
          // Create an image element to represent the user's location.
          const img = document.createElement("img");
          img.src = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
          img.alt = "Your Location";
          userMarker = new google.maps.marker.AdvancedMarkerElement({
            position: pos,
            map: map,
            title: "Your Location",
            content: img
          });
          map.setCenter(pos);
        },
        () => handleLocationError(true, map.getCenter())
      );
    } else {
      handleLocationError(false, map.getCenter());
    }
  });

  // Event listener for the form used to add new markers.
  document.getElementById("markerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const geocoder = new google.maps.Geocoder();
    // Geocode the provided address.
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        const newLocation = {
          name: name,
          address: address,
          category: category,
          description: description,
          position: { lat: location.lat(), lng: location.lng() }
        };
        addMarker(newLocation);
        populateDestinationDropdown();
        document.getElementById("markerForm").reset();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });

  // Event listener for the directions button to get route details.
  document.getElementById("btn-directions").addEventListener("click", () => {
    if (!userMarker) {
      alert("Please set your location first using the 'Find My Location' button.");
      return;
    }
    const destIndex = document.getElementById("destinations").value;
    if (destIndex === "") {
      alert("Please select a destination.");
      return;
    }
    const destination = markers[destIndex].position;
    const request = {
      origin: userMarker.position,
      destination: destination,
      travelMode: "DRIVING"
    };
    directionsService.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        alert("Directions request failed due to " + status);
      }
    });
  });
}

/**
 * addMarker
 * Adds a new marker on the map for a given location.
 * Also sets up an info window and a button for directions.
 */
function addMarker(location) {
  const index = markers.length;
  // Create a new AdvancedMarkerElement with the provided location.
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: location.position,
    map: map,
    title: location.name
  });
  // Attach additional properties to the marker.
  marker.category = location.category;
  marker.infoContent = 
    '<div>' +
      '<strong>' + location.name + '</strong><br>' +
      'Address: ' + location.address + '<br>' +
      'Description: ' + location.description + '<br>' +
      // The button calls getDirections with the current marker index.
      '<button class="btn btn-sm btn-warning" onclick="getDirections(' + index + ')">Get Directions</button>' +
    '</div>';

  // Add a click listener to display the info window when the marker is clicked.
  marker.addListener("click", () => {
    infoWindow.setContent(marker.infoContent);
    infoWindow.open({ map: map, anchor: marker });
  });
  markers.push(marker);
}

/**
 * filterMarkers
 * Shows or hides markers based on the selected category.
 */
function filterMarkers(category) {
  markers.forEach(marker => {
    if (category === "All" || marker.category === category) {
      marker.map = map;
    } else {
      marker.map = null;
    }
  });
}

/**
 * populateDestinationDropdown
 * Fills the dropdown with marker options for the user to choose a destination.
 */
function populateDestinationDropdown() {
  const select = document.getElementById("destinations");
  select.innerHTML = '<option value="">Select destination</option>';
  markers.forEach((marker, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = marker.title;
    select.appendChild(option);
  });
}

/**
 * getDirections
 * Requests and displays driving directions from the user's current location
 * to the selected marker's location.
 */
function getDirections(markerIndex) {
  if (!userMarker) {
    alert("Please set your location first using the 'Find My Location' button.");
    return;
  }
  const destination = markers[markerIndex].position;
  const request = {
    origin: userMarker.position,
    destination: destination,
    travelMode: "DRIVING"
  };
  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      alert("Directions request failed due to " + status);
    }
  });
}

/**
 * handleLocationError
 * Displays an error message when geolocation fails or is not supported.
 */
function handleLocationError(browserHasGeolocation, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    "Error: The Geolocation service failed." :
    "Error: Your browser doesn't support geolocation.");
  infoWindow.open(map);
}
