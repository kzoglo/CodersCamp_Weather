/* eslint-disable no-param-reassign */
import $ from 'jquery'
import Mustache from 'mustache'
import fetchCityData from '../../fetchCityData'

const iconURL = 'http://openweathermap.org/img/wn/'

let gridHeader
let quote

let nineAmWrapper
let noonWrapper
let threeAmWrapper
let sixPmWrapper
let ninePmWrapper

function setQuote(icons) {
  const nums = icons.map(i => i.substring(0, 2))

  if (nums.includes('13')) {
    quote = 'Jutro będzie padać śnieg. Ubierz się ciepło!'
  } else if (nums.includes('09') || nums.includes('10') || nums.includes('11')) {
    quote = 'Jutro będzie padać deszcz. Nie zapomnij o parasolu!'
  } else {
    quote = 'Jutro będzie piękna pogoda!'
  }

  return quote
}

function getIndexOfTomorrowWeather(cityWeatherData) {
  const today = new Date().getDay()
  const weatherForecastList = cityWeatherData.list

  let tomorrow
  let index = -1

  const forecastDates = weatherForecastList.map(weather => {
    const date = Date.parse(weather.dt_txt)
    const day = new Date(date).getDay()

    return day
  })

  if (today === 6) tomorrow = 0
  else tomorrow = today + 1

  index = forecastDates.indexOf(tomorrow)

  return index
}

function generateWeatherHtml(cityWeatherData) {
  const icons = []
  gridHeader.textContent = `Prognoza pogody na jutrzejszy dzień`

  const indexOfTomorrowWeather = getIndexOfTomorrowWeather(cityWeatherData)

  const timeWrappers = [nineAmWrapper, noonWrapper, threeAmWrapper, sixPmWrapper, ninePmWrapper]
  timeWrappers.forEach((wrapper, index) => {
    const children = Array.from(new Array(3), () => document.createElement('div'))
    children[0].textContent = `${9 + 3 * index}:00`

    const properIndex = indexOfTomorrowWeather + 3 + index
    const { icon } = cityWeatherData.list[properIndex].weather[0]
    icons.push(icon)

    const image = document.createElement('img')
    image.src = `${iconURL}${icon}.png`

    children[1].appendChild(image)
    children[2].innerHTML = `${Math.floor(cityWeatherData.list[properIndex].main.temp)}&#176C`

    wrapper.innerHTML = ''
    wrapper.appendChild(children[0])
    wrapper.appendChild(children[1])
    wrapper.appendChild(children[2])
  })

  quote.textContent = setQuote(icons)
}

function renderTomorrowWeather(cityWeatherData) {
  $.get('modules/weatherTomorrow/weatherTomorrow.mst', function(template) {
    document.getElementById('nameOfCity').textContent = cityWeatherData.city.name

    const result = Mustache.render(template, cityWeatherData.list[0])
    $('.main').html(result)

    gridHeader = document.querySelector('.bar')
    quote = document.querySelector('.quote')

    nineAmWrapper = document.getElementById('nine-am-wrapper')
    noonWrapper = document.getElementById('noon-wrapper')
    threeAmWrapper = document.getElementById('three-pm-wrapper')
    sixPmWrapper = document.getElementById('six-pm-wrapper')
    ninePmWrapper = document.getElementById('nine-pm-wrapper')

    generateWeatherHtml(cityWeatherData)
  })
}

// eslint-disable-next-line import/prefer-default-export
export const changeToOneDay = function(cityId) {
  fetchCityData(renderTomorrowWeather, cityId)
}
