let map;
let markers = [];
let infoWindow;
let userMarker = null;
let directionsService;
let directionsRenderer;

// 10 markers with various categories
const locations = [
  {
    name: "Central Park",
    address: "Central Park, Hamilton",
    category: "Park",
    description: "A beautiful park in the heart of Hamilton.",
    position: { lat: 43.2557, lng: -79.8711 }
  },
  {
    name: "Heritage Museum",
    address: "Heritage Museum, Hamilton",
    category: "Museum",
    description: "A museum showcasing local history.",
    position: { lat: 43.2560, lng: -79.8690 }
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

function initMap() {
    // Initialize the map centered on Hamilton.
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 43.2557, lng: -79.8711 },
      zoom: 13
    });
    infoWindow = new google.maps.InfoWindow();
  
    // Initialize directions services.
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById("directions-panel"));
  
    // Add sample markers.
    locations.forEach(location => {
      addMarker(location);
    });
  
    // Populate the destination dropdown.
    populateDestinationDropdown();
  
    // Set up filtering buttons.
    document.getElementById("btn-all").addEventListener("click", () => {
      filterMarkers("All");
    });
    document.getElementById("btn-park").addEventListener("click", () => {
      filterMarkers("Park");
    });
    document.getElementById("btn-museum").addEventListener("click", () => {
      filterMarkers("Museum");
    });
    document.getElementById("btn-historic").addEventListener("click", () => {
      filterMarkers("Historic");
    });
    document.getElementById("btn-attraction").addEventListener("click", () => {
      filterMarkers("Attraction");
    });
    // Geolocation: Find and mark the user's current location.
    document.getElementById("btn-geolocate").addEventListener("click", () => {
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
              userMarker = new google.maps.Marker({
                position: pos,
                map: map,
                title: "Your Location",
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              });
              map.setCenter(pos);
            },
            () => {
              handleLocationError(true, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation.
          handleLocationError(false, map.getCenter());
        }
      });
      // Form to add new marker.
  document.getElementById("markerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const address = document.getElementById("address").value;
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;
    // Use Geocoder to get coordinates from the address.
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
        addMarker(newLocation);
        populateDestinationDropdown();
        // Reset the form.
        document.getElementById("markerForm").reset();
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });

  // Get directions using the dropdown selection.
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
