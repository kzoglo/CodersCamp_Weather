/* **** IMPORTS **** */
import * as $ from 'jquery';
import './main.css';
import { changeToFiveDays } from './modules/weatherFiveDays/fiveDays';
import { changeToPresentDay } from './modules/weatherNow/nowDays';
import { changeToOneDay } from './modules/weatherOneDay/oneDay';

/* **** VARIABLES **** */
const nowDay = document.getElementById('nowDay');
const oneDay = document.getElementById('oneDay');
const fiveDays = document.getElementById('fiveDays');
const searchCity = document.querySelector('.search-city-input');
const autocompleteList = document.querySelector('.autocomplete-list');
let cityId; // Receives id of a given city
let typingTimer; // Timer identifier
const doneTypingInterval = 500; // Time in ms (.5 second)

/* **** UTILITY FUNCTIONS **** */
async function getData() {
  const all = await fetch('/CodersCamp_Weather/assets/cityList/cityList.json');
  const json = await all.json();
  return json;
}

function renderCities(value, jsonArray) {
  // Searches for cities similar with an user's input
  const cities = jsonArray.filter(obj => {
    const cityName = obj.name.toLowerCase();
    return cityName.indexOf(value) === 0;
  });

  let html = cities.map(city => {
    const { id, name, country } = city;
    return `<li class="autocomplete-item" data-city_id="${id}">${name}, ${country}</li>`;
  });

  // Reduces number of projected cities to 25
  html = html.splice(0, 25).join('');

  // Makes suggestions container visible
  autocompleteList.classList.add('autocomplete-list-visible');

  // Activates autocomplete-list overflow-y to prevent it from vertical growth
  if (cities.length > 13)
    autocompleteList.classList.add('autocomplete-list-overflow');
  else autocompleteList.classList.remove('autocomplete-list-overflow');

  // Populate autocomplete-list with suggesstions
  autocompleteList.innerHTML = html;
}

/* **** EVENT LISTENERS **** */
// Calling modules
nowDay.addEventListener('click', () => {
  $('.main').html('');
  changeToPresentDay(cityId);
});
oneDay.addEventListener('click', () => {
  $('.main').html('');
  changeToOneDay(cityId);
});
fiveDays.addEventListener('click', () => {
  $('.main').html('');
  changeToFiveDays(cityId);
});

// HomePage features
window.addEventListener('DOMContentLoaded', () => {
  searchCity.focus();
});

searchCity.addEventListener('keyup', e => {
  const value = e.target.value.toLowerCase();

  clearTimeout(typingTimer);
  if (value) {
    typingTimer = setTimeout(() => {
      getData()
        .then(jsonArray => {
          renderCities(value, jsonArray);
        })
        .catch(err => console.log(err.message));
    }, doneTypingInterval);
  } else {
    autocompleteList.innerHTML = null;
    autocompleteList.classList.remove(
      'autocomplete-list-overflow',
      'autocomplete-list-visible'
    );
  }
});

searchCity.addEventListener('blur', () => {
  // Delay in order to prevent instant removal of autocomplete-list, which forbids user from choosing a city
  setTimeout(() => {
    autocompleteList.classList.remove(
      'autocomplete-list-overflow',
      'autocomplete-list-visible'
    );
    autocompleteList.classList.add('autocomplete-list-hidden');
  }, 200);
});

autocompleteList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    let value = e.target.textContent;
    const sliceIndex = value.indexOf(',');
    value = value.slice(0, sliceIndex);
    searchCity.value = value;
    cityId = e.target.dataset.city_id;
    nowDay.click();
  }
});
