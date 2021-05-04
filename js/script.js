const thatDay = document.querySelector('header input[type="date"]');
const startOnNext = document.querySelector('header select');
const mainContainer = document.querySelector('#main-container');
const resetButton = document.querySelector('#reset');

let mealsPerDay = {};
let arrayWeek = [];
let startingDate;
let structureToCreate = true;

const generatePage = (year, month, day, data) => {  

    generateContainers(year, month, day, data);

    console.log('structureToCreate', structureToCreate);

    generateContent(data, mealsPerDay);

}

const init = () => {
  console.log('generating page');

  fetch('data/menus.json')
  .then(res => res.json())
  .then(data => {
  
    addFilters('Midi', 'lunch', data);
    addFilters('Soir', 'dinner', data);

    resetButton.onclick = () => {
      // console.log(startingDate);

      if(startingDate) {
        mealsPerDay = {};
        structureToCreate = true;
        generatePage(startingDate[0], startingDate[1], startingDate[2], data);
      }
    }

    thatDay.onchange = () => {
      if(thatDay.value !== null) {
        startOnNext.value = '';

        let [year, month, day] = thatDay.value.split('-');

        // console.log([year, month, day]);

        console.log(mealsPerDay);
        generatePage(parseInt(year), parseInt(month) - 1, parseInt(day), data);
      }
    }

    startOnNext.onchange = () => {
      if(startOnNext.value !== '') {
        thatDay.value = null;

        getNextDayOfTheWeek(startOnNext.value, false);
        
        let [day, month, year] = getNextDayOfTheWeek(startOnNext.value, false).split('/');
        
        console.log(mealsPerDay);
        generatePage(parseInt(year), parseInt(month) - 1, parseInt(day), data);
      }
    }
  });
}








init();