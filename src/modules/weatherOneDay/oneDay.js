// eslint-disable-next-line import/prefer-default-export
export const changeToOneDay = function() {
    const x = fetchFromApi('Wrocław');
    mainContainer.innerHTML = '<object type="text/html" data="/src/modules/weatherOneDay/oneDay.html" ></object>';;
    // mainContainer.textContent = x;
    console.log(x)
};
const apiKey = 'd50a614e489fbba6669358f04ee95daa';
const query = 'http://api.openweathermap.org/data/2.5/forecast?q=';
const units = 'metric'

function fetchFromApi(cityInput){
    fetch(`${query}${cityInput}&APPID=${apiKey}&units=${units}`)
    .then(result => result.json())
    .then(result => fire(result))
    .catch(reject => console.log('Rejected: ' + reject))
}

function fire(result){
    console.log('fired')
    mainContainer.textContent = JSON.stringify(result.list[0].main.temp);
}




