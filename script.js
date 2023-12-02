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

// PARENT WORKOUT CLASS
class Workout {
  date = new Date();
  id = (new Date() + '').slice(-10);
  // NOTE: Never create ID identifiers by yourself, always use third party libraries that generates unique IDs as ID identifiers are an important aspect of every real world application.

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

// CHILDREN WORKOUT CLASSES
class Running extends Workout{
  constructor(coords, distance, duration, cadence){
    super(coords, distance, duration);
    this.cadence = cadence
  }

  calcPace() {
    // Pace is usually defined in min/kilometers
    this.pace = this.duration / this.distance;
  }
}

class Running extends Workout{
  constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain = elevationGain
  }
}
class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition(); // Calling a function inside of the class itself

    form.addEventListener('submit', this._newWorkout.bind(this));

    // The change event listner is available on the select tag and the event listens for any change that has been made in it.
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    console.log(this);
    this.#map = L.map('map').setView(coords, 13);
    //   console.log(map);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on the map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    // Displaying the marker
    e.preventDefault();

    // Clearing the input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Displaying the marker
    const { lat, lng } = this.#mapEvent.latlng;
    console.log(lat, lng);
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workouts')
      .openPopup();
  }
}

const app = new App();
// app._getPosition(); // Calling a method outside of the class.
