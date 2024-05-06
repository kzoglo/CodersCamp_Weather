import $ from 'jquery'
import Mustache from 'mustache'
import Chart from 'chart.js'

import fetchCityData from '../../fetchCityData'

const getDayInPolish = dayNumber => {
  switch(dayNumber) {
    case 0:
      return 'Niedziela'
    case 1:
      return 'Poniedziałek'
    case 2:
      return 'Wtorek'
    case 3:
      return 'Środa'
    case 4:
      return 'Czwartek'
    case 5:
      return 'Piątek'
    case 6:
      return 'Sobota'
    default:
      throw new Error('Unexpected day type')
  }
}

function handleAfterRender(resp) {
  const firstDayWeather = resp.list[0]
  const secondDayWeather = resp.list[7]
  const thirdDayWeather = resp.list[15]
  const forthDayWeather = resp.list[23]
  const fifthDayWeather = resp.list[31]

  const daysWeatherList = [firstDayWeather, secondDayWeather, thirdDayWeather, forthDayWeather, fifthDayWeather]
  const labels = daysWeatherList.map(day => getDayInPolish(new Date(day.dt_txt).getUTCDay()))

  const chartElement = document.getElementById('myChart').getContext('2d')
  // eslint-disable-next-line no-new
  new Chart(chartElement, {
    type: 'line',

    data: {
      labels,
      datasets: [
        {
          label: 'Temperatura',
          backgroundColor: '#f9f9c5',
          borderColor: '#ffbe1c',
          data: daysWeatherList.map(day => day.main.temp)
        }
      ]
    },
    options: {
      responsive: true,
      legend: {
        display: false,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    }
  })

  return chartElement
}

function renderFiveDaysWeather(cityWeather) {
  $.get('modules/weatherFiveDays/weatherFiveDays.mst', function(
    template
  ) {
    const result = Mustache.render(template, cityWeather.list[0])

    $('.main').html(result)

    handleAfterRender(cityWeather)
  })
}

// eslint-disable-next-line import/prefer-default-export
export const changeToFiveDays = async function(cityId) {
  fetchCityData(renderFiveDaysWeather, cityId)
}
