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

// Updated locations using real Hamilton, Ontario landmarks.
const locations = [
  {
    name: "Dundurn Castle",
    address: "610 York Blvd, Hamilton, ON L8R 3E7",
    category: "Historic",
    description: "A historic castle in Hamilton with beautiful architecture.",
    position: { lat: 43.2565, lng: -79.8829 }
  },
  {
    name: "Workers Arts & Heritage Centre",
    address: "51 Stuart St, Hamilton, ON L8L 1B5",
    category: "Museum",
    description: "A museum showcasing local labour history and art.",
    position: { lat: 43.2678, lng: -79.8665 }
  },
  {
    name: "HMCS Haida National Historic Site",
    address: "145 York Blvd, Hamilton, ON L8R 1B3",
    category: "Historic",
    description: "A museum ship and a National Historic Site.",
    position: { lat: 43.2592, lng: -79.8840 }
  },
  {
    name: "Art Gallery of Hamilton",
    address: "123 King St W, Hamilton, ON L8P 1A1",
    category: "Attraction",
    description: "A vibrant art gallery showcasing contemporary and historical art.",
    position: { lat: 43.2569, lng: -79.8621 }
  },
  {
    name: "Bayfront Park",
    address: "Bayfront Park, Hamilton, ON",
    category: "Park",
    description: "A scenic park along Hamilton’s waterfront.",
    position: { lat: 43.2557, lng: -79.8657 }
  },
  {
    name: "Canadian Warplane Heritage Museum",
    address: "100 Longwood Rd, Hamilton, ON L8E 1J7",
    category: "Museum",
    description: "A museum showcasing historic aircraft and warplanes.",
    position: { lat: 43.2349, lng: -79.8886 }
  },
  {
    name: "Hamilton Waterfront",
    address: "Hamilton Harbour, Hamilton, ON",
    category: "Historic",
    description: "The revitalized historic waterfront district of Hamilton.",
    position: { lat: 43.2555, lng: -79.8600 }
  },
  {
    name: "Lemoine Point Park",
    address: "Lemoine Point, Hamilton, ON",
    category: "Park",
    description: "A beautiful park with walking trails along Hamilton Harbour.",
    position: { lat: 43.2632, lng: -79.8657 }
  },
  {
    name: "Gage Park",
    address: "100 King William St, Hamilton, ON",
    category: "Park",
    description: "A historic park known for its gardens and conservatory.",
    position: { lat: 43.2560, lng: -79.8700 }
  },
  {
    name: "Hamilton Science Centre",
    address: "Science Centre, Hamilton, ON",
    category: "Museum",
    description: "A centre dedicated to science and technology exhibits.",
    position: { lat: 43.2570, lng: -79.8680 }
  }
];

function MysteryInitMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.2557, lng: -79.8711 },
    zoom: 13,
    mapId: "3c96fd4592614a65"
  });
  infoWindow = new google.maps.InfoWindow();

  // Initialize directions services.
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("directions-panel"));

  // Add sample markers.
  locations.forEach(location => {
    MysteryAddMarker(location);
  });

  // Populate the destination dropdown.
  MysteryPopulateDestinationDropdown();

  // Set up category filter buttons.
  document.getElementById("btn-all").addEventListener("click", () => MysteryFilterMarkers("All"));
  document.getElementById("btn-park").addEventListener("gmp-click", () => MysteryFilterMarkers("Park"));
  document.getElementById("btn-museum").addEventListener("gmp-click", () => MysteryFilterMarkers("Museum"));
  document.getElementById("btn-historic").addEventListener("gmp-click", () => MysteryFilterMarkers("Historic"));
  document.getElementById("btn-attraction").addEventListener("gmp-click", () => MysteryFilterMarkers("Attraction"));

  // Set up geolocation to mark the user's current location.
  document.getElementById("btn-geolocate").addEventListener("gmp-click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          // Remove previous user marker if it exists.
          if (userMarker) {
            userMarker.setMap(null);
          }
          // Create an image element as a DOM Node for the content.
          const img = document.createElement("img");
          img.src = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
          img.alt = "Your Location";
          userMarker = new google.maps.marker.AdvancedMarkerElement({
            position: pos,
            map: map,
            title: "Your Location",
            content: img
          });
          map.setCenter(pos);
        },
        () => MysteryHandleLocationError(true, map.getCenter())
      );
    } else {
      MysteryHandleLocationError(false, map.getCenter());
    }
  });

  // Event listener for the form to add new markers.
  document.getElementById("markerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    const geocoder = new google.maps.Geocoder();
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
        MysteryAddMarker(newLocation);
        MysteryPopulateDestinationDropdown();
        document.getElementById("markerForm").reset();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });

  // Event listener for the directions button.
  document.getElementById("btn-directions").addEventListener("gmp-click", () => {
    if (!userMarker) {
      alert("Please set your location first using the 'Find My Location' button.");
      return;
    }
    const destIndex = document.getElementById("destinations").value;
    if (destIndex === "") {
      alert("Please select a destination.");
      return;
    }
    const destination = markers[destIndex].getPosition();
    const request = {
      origin: userMarker.getPosition(),
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
 * MysteryAddMarker
 * Adds a new marker on the map for a given location and sets up an info window.
 */
function MysteryAddMarker(location) {
  const index = markers.length;
  // Create the marker using AdvancedMarkerElement.
  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: location.position,
    map: map,
    title: location.name
  });
  // Attach custom properties.
  marker.category = location.category;
  marker.infoContent = 
    '<div>' +
      '<strong>' + location.name + '</strong><br>' +
      'Address: ' + location.address + '<br>' +
      'Description: ' + location.description + '<br>' +
      '<button class="btn btn-sm btn-warning" onclick="MysteryGetDirections(' + index + ')">Get Directions</button>' +
    '</div>';

  // Use the recommended "gmp-click" event.
  marker.addListener("gmp-click", () => {
    infoWindow.setContent(marker.infoContent);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

/**
 * MysteryFilterMarkers
 * Shows or hides markers based on the selected category.
 */
function MysteryFilterMarkers(category) {
  markers.forEach(marker => {
    if (category === "All" || marker.category === category) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });
}

/**
 * MysteryPopulateDestinationDropdown
 * Populates the destination dropdown with marker options.
 */
function MysteryPopulateDestinationDropdown() {
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
 * MysteryGetDirections
 * Requests and displays driving directions from the user's current location to a marker.
 */
function MysteryGetDirections(markerIndex) {
  if (!userMarker) {
    alert("Please set your location first using the 'Find My Location' button.");
    return;
  }
  const destination = markers[markerIndex].getPosition();
  const request = {
    origin: userMarker.getPosition(),
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
 * MysteryHandleLocationError
 * Displays an error message when geolocation fails.
 */
function MysteryHandleLocationError(browserHasGeolocation, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    "Error: The Geolocation service failed." :
    "Error: Your browser doesn't support geolocation.");
  infoWindow.open(map);
}
