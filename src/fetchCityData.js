import { apiKey, url, units, wroclawId } from './commonData'

export default function fetchCityData(renderCityWeather, cityInput = wroclawId) {
  fetch(`${url}${cityInput}&APPID=${apiKey}&units=${units}`)
    .then(cityWeather => cityWeather.json())
    .then(cityWeatherParsed => {
      renderCityWeather(cityWeatherParsed)
    })
    .catch(error => console.log(`Rejected: ${error}`))
}
