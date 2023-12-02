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
  id = (Date.now() + '').slice(-10);
  // NOTE: Never create ID identifiers by yourself, always use third party libraries that generates unique IDs as ID identifiers are an important aspect of every real world application.

  constructor(coords, distance, duration) {
    this.coords = coords; // [latitude, longitude]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

// CHILDREN WORKOUT CLASSES
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // Pace is usually defined in min/kilometers
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    // speed is defined in km/hr
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
  #map;
  #mapEvent;
  #workouts = [];

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
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);
    // Displaying the marker
    e.preventDefault();

    // Getting data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If the workout is running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Checking if the data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers');

      workout = new Running([lat, lng], distance, duration, cadence);

    }

    // if the workout is cycling, create a cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      // Checking if the data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers');

        
      workout = new Cycling([lat, lng], distance, duration, elevation);

    }

    // Add the new object to the workout array
    this.#workouts.push(workout)


    // Render the new workout on the map as a marker

    // Render the new workout on the list

    // Hide the form and clear the input fields

    // Clearing the input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // Displaying the marker
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
