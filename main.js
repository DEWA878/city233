document.addEventListener("DOMContentLoaded", () => {
  const getLocationButton = document.getElementById("getLocation");

  if (getLocationButton) {
    getLocationButton.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });
  }

  /// Fetch data from events.json
  fetch('events.json')
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
  })
  .then(events => {
      const eventContainer = document.getElementById('event-container');
      if (!eventContainer) {
          throw new Error('Event container not found');
      }

      events.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.classList.add('event');

          eventElement.innerHTML = `
              <img class="event_img" src="${event.image}" alt="${event.title}">
              <div class="event-details">
                  <h3>${event.title}</h3>
                  <p><strong>Date:</strong> ${event.date}</p>
                  <p><strong>Time:</strong> ${event.time}</p>
                  <p><strong>Location:</strong> ${event.location}</p>
                  <p><strong>Description:</strong> ${event.description}</p>
              </div>
          `;

          eventContainer.appendChild(eventElement);
      });
  })
  .catch(error => console.error('Error fetching or parsing data:', error));
});

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // Initialize the map
  const map = L.map("map").setView([latitude, longitude], 13);

  // Set up the OpenStreetMap layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a marker to the map at the user's location
  const marker = L.marker([latitude, longitude]).addTo(map);
  marker.bindPopup("<b>You are here!</b>").openPopup();
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
//Nav toggle
document.getElementById("menu-toggle").addEventListener("click", function () {
  document.querySelector(".nav-links").classList.toggle("show");
});
