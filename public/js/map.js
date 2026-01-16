const mapDiv = document.getElementById("map");

const mapToken = mapDiv.dataset.token;
const listing = JSON.parse(mapDiv.dataset.listing);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard-satellite",
  center: listing.geometry.coordinates,
  zoom: 12,
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4>
       <p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);