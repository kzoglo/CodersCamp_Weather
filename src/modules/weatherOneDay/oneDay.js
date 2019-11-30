// eslint-disable-next-line import/prefer-default-export
export const changeToOneDay = function() {
    const x = fetchFromApi();
    mainContainer.innerHTML = '<object type="text/html" data="/src/modules/weatherOneDay/oneDay.html" ></object>';
    // mainContainer.textContent = x;
    
};

const apiKey = 'd50a614e489fbba6669358f04ee95daa';
const query = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const units = 'metric';
const iconURL = 'http://openweathermap.org/img/wn/';

const city = document.querySelector('.bar');
const quote = document.querySelector('.quote');

const t1 = document.getElementById('1t');
const t2 = document.getElementById('2t');
const t3 = document.getElementById('3t');
const t4 = document.getElementById('4t');
const t5 = document.getElementById('5t');

const i1 = document.getElementById('1i');
const i2 = document.getElementById('2i');
const i3 = document.getElementById('3i');
const i4 = document.getElementById('4i');
const i5 = document.getElementById('5i');

const c1 = document.getElementById('1c');
const c2 = document.getElementById('2c');
const c3 = document.getElementById('3c');
const c4 = document.getElementById('4c');
const c5 = document.getElementById('5c');


function fetchFromApi(cityInput){
    fetch(`${query}${cityInput}&APPID=${apiKey}&units=${units}`)
    .then(result => result.json())
    .then(result => draw(result))
    .catch(reject => console.log('Rejected: ' + reject));
};

function draw(result){
    const indexOf = indexOfT(result);
    const first = indexOf + 3;
    const second = indexOf + 4;
    const third = indexOf + 5;
    const fourth = indexOf + 6;
    const fifth = indexOf + 7;

    city.textContent = `${result.city.name} - prognoza na jutro`;
    quote.textContent = "Dzisiaj będzie wspaniały dzień!";

    t1.textContent = '9:00' //result.list[first].dt_txt;
    i1.src = iconURL + result.list[first].weather[0].icon + '.png';
    c1.innerHTML = Math.floor(result.list[first].main.temp) + '&#176C';

    t2.textContent = '12:00' //result.list[second].dt_txt;
    i2.src = iconURL + result.list[second].weather[0].icon + '.png';
    c2.innerHTML = Math.floor(result.list[second].main.temp) + '&#176C';

    t3.textContent = '15:00' //result.list[third].dt_txt;
    i3.src = iconURL + result.list[third].weather[0].icon + '.png';
    c3.innerHTML = Math.floor(result.list[third].main.temp) + '&#176C';

    t4.textContent = '18:00' //result.list[fourth].dt_txt;
    i4.src = iconURL + result.list[fourth].weather[0].icon + '.png';
    c4.innerHTML = Math.floor(result.list[fourth].main.temp) + '&#176C';

    t5.textContent = '21:00' //result.list[fifth].dt_txt;
    i5.src = iconURL + result.list[fifth].weather[0].icon + '.png';
    c5.innerHTML = Math.floor(result.list[fifth].main.temp) + '&#176C';
};

function indexOfT(result){
    const today = new Date().getDay();
    const resultList = result.list;
    let tomorrow;
    let index;

    const dates = resultList.map(d => {
        let dt = Date.parse(d.dt_txt);
        let day = new Date(dt).getDay();
        return day;
    });

    if(today == 6)
        tomorrow = 0;
    else
        tomorrow = today + 1;

    index = dates.indexOf(tomorrow);
    return index;
};

//fetchFromApi('Wrocław');