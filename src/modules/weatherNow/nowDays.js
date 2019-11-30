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
  .then(result => {render(result); console.log(getTodaysObject(result))})
  .catch(reject => console.log(`Rejected: ${reject}`));
}

function render(x) {
 $.get('/src/modules/weatherNow/nowDays.mst', function(template) {
  console.log(x)
  const result = Mustache.to_html(template, x.list[0]);
  $('.main').html(result);
  let todayDate = getTodaysDate();
 document.getElementById('todayDate').textContent = todayDate;
 });
}

function getTodaysObject(x) {
  let todayDate = getTodaysDate()
//  document.getElementById('secBox').addEventListener('click', function () {
//    console.log('smile');
//  })
 const todayObjects = x.list.filter(date => {
  if (date.dt_txt.includes(todayDate)) {
    console.log(date);

    return date;
  }
 });
 return todayObjects;
}

function getTodaysDate() {
  const d = new Date();
  const todayDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  console.log(document.getElementById('todayDate'));
  return todayDate;
}