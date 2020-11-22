// Store our API endpoint inside queryUrl
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function getColor(d) { 
  if (d >= 5) { return "#FF0000" } else
  if (d >= 4) { return "#FF6900" } else
  if (d >= 3) { return "#FFC100" } else
  if (d >= 2) { return "#E5FF00" } else
  if (d >= 1) { return "#8DFF00" } else
  if (d >= 0) { return "#00FF00" };
};

// Perform a GET request to the query URL
d3.json(earthquake_url, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


  
  function createMap(earthquakes) {

     // Define streetmap and lightmap layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: "pk.eyJ1IjoiYmVuamFtZW5hbGZvcmQiLCJhIjoiY2toN3M4NGE5MDdsaDJybXpwcnd5ZTd2bCJ9.egqvokJx96RNTj-CL0rOkw"
    });

  

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      id: "mapbox/streets-v11",
      accessToken: "pk.eyJ1IjoiYmVuamFtZW5hbGZvcmQiLCJhIjoiY2toN3M4NGE5MDdsaDJybXpwcnd5ZTd2bCJ9.egqvokJx96RNTj-CL0rOkw"
    });





  // Define a baseMaps object to hold our base layers
  var baseMaps = {
   
    "Gray Scale": lightmap,
    "Street Map": streetmap
  };


  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

// create legend
