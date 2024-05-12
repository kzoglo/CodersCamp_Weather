import $ from 'jquery'
import Mustache from 'mustache'
import * as CanvasJS from '@canvasjs/charts'

import fetchCityData from '../../fetchCityData'

function formatTime(timeInMs) {
  const date = new Date(timeInMs * 1000)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

function getTodayDate() {
  const date = new Date()
  let todayDate = ''

  const year = `${date.getFullYear()}`
  const month = date.getDay() < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`

  todayDate = `${year}-${month}-${day}`

  return todayDate
}

function getTodayWeatherData(cityWeatherData) {
  const todayDate = getTodayDate()
  const todayWeatherData = cityWeatherData.list.filter(date => date.dt_txt.includes(todayDate))

  return todayWeatherData
}

function createTempChart(todayWeatherData) {
  $('#chartContainer').html('')

  const tempPerHourList = todayWeatherData.map(x => [
    x.dt_txt.split(' ')[1].split(':')[0],
    x.main.temp
  ])

  const tempPerHourDataPoints = []
  for (let i = 0; i < tempPerHourList.length; i++) {
    const objectOfh = { x: tempPerHourList[i][0], y: tempPerHourList[i][1] }
    tempPerHourDataPoints.push(objectOfh)
  }

  const chart = new CanvasJS.Chart('chartContainer', {
    animationEnabled: true,
    theme: 'light2',
    axisY: {
      includeZero: false,
      title: 'Temperatura'
    },
    axisX: {
      interval: 2,
      minimum: -1,
      maximum: 24,
      title: 'Godzina'
    },
    data: [
      {
        type: 'line',
        dataPoints: tempPerHourDataPoints
      }
    ]
  })

  chart.render()
}

function checkWeather(weather) {
  const todayWeather = []

  if (weather.main.includes('Snow')) {
    todayWeather.push({ x: 'Śnieg', icon: weather.icon })
  } else if (weather.main.includes('Clear')) {
    todayWeather.push({ x: 'Czyste niebo', icon: weather.icon })
  } else if (weather.main.includes('Cloud')) {
    todayWeather.push({ x: 'Zachmurzone niebo', icon: weather.icon })
  } else if (weather.main.includes('Rain')) {
    todayWeather.push({ x: 'Deszcz', icon: weather.icon })
  }

  return todayWeather
}

function createWindChart(cityWeatherData) {
  $('#chartContainer').html('')

  $.get('modules/weatherToday/wind.mst', function(template) {
    const result = Mustache.render(template, cityWeatherData.list[0])

    $('#chartContainer').html(result)
    $('.fa-location-arrow')[0].style.cssText = `--wind-deg: ${cityWeatherData.list[0].wind.deg}deg`
  })
}

function createRainChart(cityWeatherData) {
  $('#chartContainer').html('')

  $.get('modules/weatherToday/rain.mst', function(template) {
    const weather = checkWeather(cityWeatherData.list[0].weather[0])[0]
    const result = Mustache.render(template, weather)

    $('#chartContainer').html(result)
    $('#imgRain').attr(
      'src',
      `http://openweathermap.org/img/w/${weather.icon}.png`
    )
  })
}

function handleAfterRender(cityWeatherData) {
  document.getElementById('todayDate').innerHTML = ` Dzisiejsza data:<br> ${getTodayDate()}`

  const todayWeatherData = getTodayWeatherData(cityWeatherData)
  createTempChart(todayWeatherData)

  document.getElementById('temp').addEventListener('click', function() {
    createTempChart(todayWeatherData)
  })
  document.getElementById('rain').addEventListener('click', function() {
    createRainChart(cityWeatherData)
  })
  document.getElementById('wind').addEventListener('click', function() {
    createWindChart(cityWeatherData)
  })

  document.getElementById('sunriseValue').textContent = formatTime(
    cityWeatherData.city.sunrise
  )
  document.getElementById('sunsetValue').textContent = formatTime(
    cityWeatherData.city.sunset
  )
}

function renderTodayWeather(cityWeather) {
  $.get('modules/weatherToday/weatherToday.mst', function(template) {
    document.getElementById('nameOfCity').textContent = cityWeather.city.name

    const result = Mustache.render(template, cityWeather.list[0])
    $('.main').html(result)

    handleAfterRender(cityWeather)
  })
}

// eslint-disable-next-line import/prefer-default-export
export const changeToPresentDay = cityId => {
  fetchCityData(renderTodayWeather, cityId)
}
