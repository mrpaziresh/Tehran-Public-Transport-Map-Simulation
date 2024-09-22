// Initialize the map centered on Tehran
var map = L.map('map').setView([35.6892, 51.3890], 12);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Define 20 points in Tehran with values
const points = [
  {lat: 35.6892, lon: 51.3890, name: "Point 1", value: 7, details: "Detail 1"},
  {lat: 35.7050, lon: 51.4000, name: "Point 2", value: 10, details: "Detail 2"},
  {lat: 35.7001, lon: 51.4216, name: "Point 3", value: 5, details: "Detail 3"},
  {lat: 35.7010, lon: 51.4316, name: "Point 4", value: 12, details: "Detail 4"},

  // Add more points with values...
];

// Initialize marker cluster group with custom cluster creation logic
var markers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    // Get the markers in the cluster
    var markers = cluster.getAllChildMarkers();
    
    // Sum the values of all points in this cluster
    var totalValue = markers.reduce((sum, marker) => sum + marker.options.value, 0);
    
    // Create a custom icon for the cluster that shows the total value
    return L.divIcon({
      html: `<div style="background-color:rgba(51, 136, 255, 0.6); padding:5px; border-radius:50%; width:50px; height:50px; display:flex; justify-content:center; align-items:center;">
               <b>${totalValue}</b>
             </div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(50, 50)
    });
  }
});

// Add each point to the cluster, with its value as an option
points.forEach(function(point) {
  var marker = L.marker([point.lat, point.lon], {value: point.value}); // Pass the value as an option
  marker.bindPopup(`<b>${point.name}</b><br>Value: ${point.value}<br>${point.details}`);
  markers.addLayer(marker);
  
});

// Add the cluster to the map
map.addLayer(markers);
