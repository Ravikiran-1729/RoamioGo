mapboxgl.accessToken = mapToken;

const startCoords = [73.5124, 18.3113];

const newlisting_map = new mapboxgl.Map({
    container: "newListing_map",
    center: startCoords,
    style: 'mapbox://styles/mapbox/standard',
    zoom: 9,
});

newlisting_map.addControl(new mapboxgl.NavigationControl(), "top-left");

// create div
const pointer = document.createElement("div");
pointer.className = "location-dot";

// Airbnb icon
const location_dot = document.createElement("i");
location_dot.className ="fa-solid fa-location-dot location-dot";

// append icons
pointer.appendChild(location_dot);

// add marker on map load
newlisting_map.on("load", () => {
    const marker = new mapboxgl.Marker({
        draggable: true,
        element: pointer,
    })
        .setLngLat(startCoords)
        .addTo(newlisting_map);

    const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        className: "airbnb-popup",
    }).setHTML(`
            <div class="popup-card">

                <p class="popup-desc">
                    Service available after booking!
                </p>
            </div>
        `);

    marker.setPopup(popup);
    
    const listing_lat = document.querySelector('#listing_lat');
    const listing_lng = document.querySelector('#listing_lng');

    marker.on("dragend", () => {
    const lngLat = marker.getLngLat();

    listing_lat.setAttribute('value', lngLat.lat);
    listing_lng.setAttribute('value', lngLat.lng);
    
    console.log(`Marker dropped at: ${lngLat.lng}, ${lngLat.lat}`);
    console.log(lngLat);
    fetchLocationFromCoords(lngLat);

});
});

const loc_inp = document.querySelector('#location');

const fetchLocationFromCoords = async ({ lng, lat }) => {
    const res = await fetch(
        `/reverseGeocode?lng=${lng}&lat=${lat}`
    );
    const data = await res.json();
    console.log(data);
    loc_inp.value = data.placeName;
};
