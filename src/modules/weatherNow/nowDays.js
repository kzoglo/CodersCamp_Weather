// eslint-disable-next-line no-undef
const mainContainer = document.querySelector('.main');

// eslint-disable-next-line import/prefer-default-export
export const changeToPresentDay = function() {
 mainContainer.innerHTML =
  '<object type="text/html" data="/src/modules/weatherNow/nowDays.html" ></object>';
};
