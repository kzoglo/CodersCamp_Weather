import $ from 'jquery'

import { changeToFiveDays } from './modules/weatherFiveDays/weatherFiveDays'
import { changeToPresentDay } from './modules/weatherToday/weatherToday'
import { changeToOneDay } from './modules/weatherTomorrow/weatherTomorrow'

import './main.css'

const todayBtn = document.getElementById('today-btn')
const tomorrowBtn = document.getElementById('tomorrow-btn')
const fiveDaysBtn = document.getElementById('fiveDays-btn')
const searchCity = document.querySelector('.search-city-input')
const autocompleteList = document.querySelector('.autocomplete-list')
let cityId // Receives id of a given city
let typingTimer // Timer identifier
const doneTypingInterval = 250 // Time in ms (.25 second)

const handleReset = () => {
  autocompleteList.innerHTML = null
  autocompleteList.classList.remove(
    'autocomplete-list-overflow',
    'autocomplete-list-visible',
    'autocomplete-list-hidden',
  )
}

async function getCitiesData() {
  // TODO - tutaj moze byc problem po wrzuceniu
  const citiesResp = await fetch('./assets/cityList/cityList.json')
  // const citiesResp = await fetch('CodersCamp_Weather/assets/cityList/cityList.json');
  const cities = await citiesResp.json()

  return cities
}

function renderFoundCities(searchValue, cities) {
  // Searches for cities similar with an user's input
  const foundCities = cities.filter(obj => {
    const cityName = obj.name.toLowerCase()
    return cityName.indexOf(searchValue) === 0
  })

  autocompleteList.style.height = foundCities.length > 13 ? `${13 * 35}px` : `${foundCities.length * 35}px`

  if (!foundCities.length) {
    handleReset()

    return
  }

  let html = foundCities.map(city => {
    const { id, name, country } = city
    return `<li class="autocomplete-item" data-city_id="${id}">${name}, ${country}</li>`
  })

  // Reduces number of projected cities to 25
  html = html.splice(0, 25).join('')

  // Makes suggestions container visible
  autocompleteList.classList.add('autocomplete-list-visible')

  // Activates autocomplete-list overflow-y to prevent it from vertical growth
  if (foundCities.length > 13)
    autocompleteList.classList.add('autocomplete-list-overflow')
  else autocompleteList.classList.remove('autocomplete-list-overflow')

  // Populate autocomplete-list with suggesstions
  autocompleteList.innerHTML = html
}

todayBtn.addEventListener('click', () => {
  $('.main').html('')
  changeToPresentDay(cityId)
})
tomorrowBtn.addEventListener('click', () => {
  $('.main').html('')
  changeToOneDay(cityId)
})
fiveDaysBtn.addEventListener('click', () => {
  $('.main').html('')
  changeToFiveDays(cityId)
})

window.addEventListener('DOMContentLoaded', () => {
  searchCity.focus()
})

searchCity.addEventListener('keyup', e => {
  const searchValue = e.target.value.toLowerCase()

  clearTimeout(typingTimer)

  if (searchValue) {
    typingTimer = setTimeout(() => {
      getCitiesData()
        .then(cities => {
          renderFoundCities(searchValue, cities)
        })
        .catch(err => console.log(err.message))
    }, doneTypingInterval)
  } else {
    autocompleteList.innerHTML = null
    autocompleteList.classList.remove(
      'autocomplete-list-overflow',
      'autocomplete-list-visible'
    )
  }
})

searchCity.addEventListener('blur', () => {
  // Delay in order to prevent instant removal of autocomplete-list, which forbids user from choosing a city
  setTimeout(() => {
    autocompleteList.classList.remove(
      'autocomplete-list-overflow',
      'autocomplete-list-visible'
    )
    autocompleteList.classList.add('autocomplete-list-hidden')
  }, 200)
})

searchCity.addEventListener('focus', () => {
  if (searchCity.value.toLowerCase()) {
    getCitiesData()
      .then(cities => {
        renderFoundCities(searchCity.value.toLowerCase(), cities)

        autocompleteList.classList.remove('autocomplete-list-hidden')
        autocompleteList.classList.add('autocomplete-list-overflow', 'autocomplete-list-visible')
      })
      .catch(err => console.log(err.message))
  }
})

autocompleteList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    let value = e.target.textContent
    const sliceIndex = value.indexOf(',')

    value = value.slice(0, sliceIndex)
    cityId = e.target.dataset.city_id

    searchCity.value = value;

    todayBtn.click()
  }
})
