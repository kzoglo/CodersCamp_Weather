// import './main.css';

import { changeToFiveDays } from './modules/weatherFiveDays/fiveDays.js';
import { changeToPresentDay } from './modules/weatherNow/nowDays.js';
import { changeToOneDay } from './modules/weatherOneDay/oneDay.js';

const body = document.body;
const nowDay = document.getElementById('nowDay');
const oneDay = document.getElementById('oneDay');
const fiveDays = document.getElementById('fiveDays');
// body.addEventListener('click', change);
nowDay.addEventListener('click', changeToPresentDay);
oneDay.addEventListener('click', changeToOneDay);
fiveDays.addEventListener('click', changeToFiveDays);
