/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
import * as $ from 'jquery';
import Mustache from 'mustache';

// eslint-disable-next-line import/prefer-default-export
export const changeToPresentDay = async function(city) {
  if (city === undefined) city = 3081368;
  const x = fetchFromApi(city);
};

const apiKey = 'd50a614e489fbba6669358f04ee95daa';
const query = 'https://api.openweathermap.org/data/2.5/forecast?id=';
const units = 'metric';

function fetchFromApi(cityInput) {
  fetch(`${query}${cityInput}&APPID=${apiKey}&units=${units}`)
    .then(result => result.json())
    .then(result => render(result))
    .catch(reject => console.log(`Rejected: ${reject}`));
}

function render(x) {
  $.get('/modules/weatherNow/nowDays.mst', function(template) {
    document.getElementById('nameOfCity').textContent = x.city.name;
    const result = Mustache.render(template, x.list[0]);
    $('.main').html(result);
    afterRender(x);
  });
}

function getSunRiseSet(x) {
  var date = new Date(x * 1000);
  var hours = date.getHours();
  var minutes = '0' + date.getMinutes();
  var seconds = '0' + date.getSeconds();
  var formattedTime =
    hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

function afterRender(result) {
  document.getElementById(
    'todayDate'
  ).innerHTML = ` Dzisiejsza data:<br> ${getTodaysDate()}`;
  const todayObjects = getTodaysObject(result);
  createTempChar(todayObjects);

  document.getElementById('temp').addEventListener('click', function() {
    createTempChar(todayObjects);
  });
  document.getElementById('rain').addEventListener('click', function() {
    createRainChar(result);
  });
  document.getElementById('wind').addEventListener('click', function() {
    createWindChar(result);
  });

  document.getElementById('sunriseValue').textContent = getSunRiseSet(
    result.city.sunrise
  );
  document.getElementById('sunsetValue').textContent = getSunRiseSet(
    result.city.sunset
  );
}

function getTodaysObject(x) {
  const todayDate = getTodaysDate();
  const todayObjects = x.list.filter(date => {
    if (date.dt_txt.includes(todayDate)) {
      return date;
    }
  });
  return todayObjects;
}

function getTodaysDate() {
  const d = new Date();
  let todayDate = '';
  if (d.getDate() < 10)
    todayDate = `${d.getFullYear()}-${d.getMonth() + 1}-0${d.getDate()}`;
  else todayDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  return todayDate;
}

function createTempChar(todayObjects) {
  $('#chartContainer').html('');
  const h = todayObjects.map(x => [
    x.dt_txt.split(' ')[1].split(':')[0],
    x.main.temp
  ]);
  let tableObjectOfh = [];
  for (let i = 0; i < h.length; i++) {
    let objectOfh = { x: h[i][0], y: h[i][1] };
    tableObjectOfh.push(objectOfh);
  }
  var chart = new CanvasJS.Chart('chartContainer', {
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
        dataPoints: tableObjectOfh
      }
    ]
  });

  chart.render();
}

function createWindChar(x) {
  $('#chartContainer').html('');
  $.get('/modules/weatherNow/wind.mst', function(template) {
    const result = Mustache.render(template, x.list[0]);
    $('#chartContainer').html(result);
    $(
      '.fa-location-arrow'
    )[0].style.cssText = `--wind-deg: ${x.list[0].wind.deg}deg`;
  });
}

function createRainChar(x) {
  $('#chartContainer').html('');
  $.get('/modules/weatherNow/rain.mst', function(template) {
    let weather = checkWeather(x.list[0].weather[0])[0];
    const result = Mustache.render(template, weather);
    $('#chartContainer').html(result);
    $('#imgRain').attr(
      'src',
      `http://openweathermap.org/img/w/${weather.icon}.png`
    );
  });
}

function checkWeather(weather) {
  let todayWeather = [];
  if (weather.main.includes('Snow')) {
    todayWeather.push({ x: 'Śnieg', icon: weather.icon });
  } else if (weather.main.includes('Clear')) {
    todayWeather.push({ x: 'Czyste niebo', icon: weather.icon });
  } else if (weather.main.includes('Cloud')) {
    todayWeather.push({ x: 'Zachmurzone niebo', icon: weather.icon });
  }
  return todayWeather;
}
