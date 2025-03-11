// Initialize map
var map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 4;
}

// Function to determine marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' : '#1a9850';
}

// Fetch Earthquake Data from USGS
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(data) {
    data.features.forEach(feature => {
        var coords = feature.geometry.coordinates;
        var magnitude = feature.properties.mag;
        var depth = coords[2];

        L.circleMarker([coords[1], coords[0]], {
            radius: markerSize(magnitude),
            fillColor: markerColor(depth),
            color: "#000",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(
            `<strong>Location:</strong> ${feature.properties.place}<br>
             <strong>Magnitude:</strong> ${magnitude}<br>
             <strong>Depth:</strong> ${depth} km`
        ).addTo(map);
    });
});

// Add Legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    var depths = [-10, 10, 30, 50, 70, 90];
    var labels = [];
    
    div.innerHTML += '<strong>Depth (km)</strong><br>';
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML += '<span style="background:' + markerColor(depths[i] + 1) + '"></span> ' +
                         depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(map);
