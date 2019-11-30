/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const mainContainer = document.querySelector('.main');

// eslint-disable-next-line import/prefer-default-export
export const changeToPresentDay = async function() {
 const x = fetchFromApi('Wrocław');
};

const apiKey = 'd50a614e489fbba6669358f04ee95daa';
const query = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const units = 'metric';

function fetchFromApi(cityInput) {
 fetch(`${query}${cityInput}&APPID=${apiKey}&units=${units}`)
  .then(result => result.json())
  .then(result => render(result))
  .catch(reject => console.log(`Rejected: ${reject}`));
}

function render(x) {
 $.get('/src/modules/weatherNow/nowDays.mst', function(template) {
  console.log(x);
  const result = Mustache.to_html(template, x.list[0]);
  $('.main').html(result);
  afterRender(x);
 });
}

function afterRender(result) {
 document.getElementById('todayDate').textContent = getTodaysDate();
 const todayObjects = getTodaysObject(result);
 createTempChar(todayObjects);

 document.getElementById('temp').addEventListener('click', function(){createTempChar(todayObjects)});
 document.getElementById('rain').addEventListener('click', createRainChar);
 document.getElementById('wind').addEventListener('click', function(){createWindChar(result);});

}

function getTodaysObject(x) {
 let todayDate = getTodaysDate();
 const todayObjects = x.list.filter(date => {
  if (date.dt_txt.includes(todayDate)) {
   return date;
  }
 });
 console.log(todayObjects)
 return todayObjects;
}

function getTodaysDate() {
 const d = new Date();
 const todayDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
 return todayDate;
}

function createTempChar(todayObjects) {
  $("#chartContainer").html("");
  console.log(todayObjects)
  const h = todayObjects.map(x => [x.dt_txt.split(' ')[1].split(':')[0], x.main.temp])
  let tableObjectOfh = []
  for(let i=0; i<h.length; i++) {
    let objectOfh = {x:h[i][0], y:h[i][1]}
    tableObjectOfh.push(objectOfh);
  }
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    axisY:{
      includeZero: false,
      title: 'Temperatura'
    },
    axisX: {
      interval: 2,
      minimum: -1,
      maximum: 24, 
      title: 'Godzina',
    },
    data: [{        
      type: "line",       
      dataPoints: tableObjectOfh,
    }]
  });

  chart.render();
}

function createWindChar(x) {
  $("#chartContainer").html("");
  $.get('/src/modules/weatherNow/wind.mst', function(template) {
    console.log(x)
    const result = Mustache.to_html(template, x.list[0]);
    $('#chartContainer').html(result);
    $(".fa-location-arrow")[0].style.cssText = `--wind-deg: ${x.list[0].wind.deg}deg`;
   });
  console.log('wind');
}

function createRainChar() {
  $("#chartContainer").html("");
  console.log('rain');
}

 //  document.getElementById('secBox').addEventListener('click', function () {
 //    console.log('smile');
 //  })