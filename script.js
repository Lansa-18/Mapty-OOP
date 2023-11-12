'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Using the Geolocation Api.
// - Takes in 2 callback functions. One that get's called on success and the second that get's called when there is an error
// - The success callback takes in a parameter called the position parameter.

let map, mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude]
      map = L.map('map').setView(coords, 13);
    //   console.log(map);

      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Handling clicks on the map
      map.on('click', function(mapE){
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();


      })
    },
    function () {
      alert('Could not get your position');
    }
  );
}

form.addEventListener('submit', function(e){
  // Displaying the marker
  e.preventDefault();

  // Clearing the input fields
  inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';

  console.log(mapEvent);
  const {lat, lng} = mapEvent.latlng;
  console.log(lat, lng);

  L.marker([lat, lng])
  .addTo(map)
  .bindPopup(L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'running-popup',
  }))
  .setPopupContent('Workouts')
  .openPopup();

})

inputType.addEventListener('change', function(e){

})
