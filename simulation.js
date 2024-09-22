const map = L.map('map').setView([35.6892, 51.3890], 12); 


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


const tooltip = d3.select("#tooltip");


let points = d3.range(20).map((d, i) => ({
  id: i + 1,
  lat: 35.60 + Math.random() * 0.15,
  lon: 51.30 + Math.random() * 0.15,
  value: Math.floor(Math.random() * 20) + 5
}));


const svg = d3.select(map.getPanes().overlayPane).append("svg");
const g = svg.append("g").attr("class", "leaflet-zoom-hide");


function projectPoint(lat, lon) {
  const point = map.latLngToLayerPoint(new L.LatLng(lat, lon));
  return [point.x, point.y];
}


function resizeSVG() {
  const bounds = map.getBounds();
  const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

  svg
    .attr("width", bottomRight.x - topLeft.x)
    .attr("height", bottomRight.y - topLeft.y)
    .style("left", `${topLeft.x}px`)
    .style("top", `${topLeft.y}px`);

  g.attr("transform", `translate(${-topLeft.x}, ${-topLeft.y})`);
}


function drawPoints() {
  g.selectAll("circle").remove();
  
  points.forEach(point => {
    const projected = projectPoint(point.lat, point.lon);
    g.append("circle")
      .attr("cx", projected[0])
      .attr("cy", projected[1])
      .attr("r", map.getZoom() < 14 ? 20 : 10)
      .style("fill", "blue")
      .style("opacity", 0.7)
      .on("mouseover", (event, d) => showTooltip(event, point))
      .on("mouseout", hideTooltip)
      .on("click", () => alert(`Point ID: ${point.id}, Value: ${point.value}`));
  });
}

function showTooltip(event, point) {
  tooltip
    .style("left", `${event.pageX + 10}px`)
    .style("top", `${event.pageY - 20}px`)
    .style("display", "inline-block")
    .html(`ID: ${point.id}<br>Value: ${point.value}`);
}

function hideTooltip() {
  tooltip.style("display", "none");
}


function mergePoints() {
  g.selectAll("circle").remove();
  g.selectAll("text").remove(); 

  const mergedValue = points.reduce((acc, d) => acc + d.value, 0);

  const center = projectPoint(35.6892, 51.3890); 
  g.append("circle")
    .attr("cx", center[0])
    .attr("cy", center[1])
    .attr("r", 50)
    .style("fill", "red")
    .style("opacity", 0.5);

  g.append("text")
    .attr("x", center[0])
    .attr("y", center[1])
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("font-size", "24px")
    .text(`Total Value: ${mergedValue}`);
}


function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (angle) => (angle * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance;
}

function calculateDistances() {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const distance = haversineDistance(
        points[i].lat,
        points[i].lon,
        points[j].lat,
        points[j].lon
      );
      console.log(
        `Distance between Point ${points[i].id} and Point ${points[j].id}: ${distance.toFixed(2)} km`
      );
    }
  }
}


function update() {
  resizeSVG();

  if (map.getZoom() < 14) {
    mergePoints();
  } else {
    drawPoints();
  }
}

update();
calculateDistances();

map.on("zoomend", update);
map.on("moveend", update);
