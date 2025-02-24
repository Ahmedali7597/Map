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
