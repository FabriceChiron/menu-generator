const thatDay = document.querySelector('header input[type="date"]');
const startOnNext = document.querySelector('header select');
const mainContainer = document.querySelector('#main-container');

let mealsPerDay = {};
let arrayWeek = [];
let startingDate;

const generatePage = (year, month, day, data) => {  
    generateContainers(year, month, day, data);
    generateContent(data, mealsPerDay);
}

const init = () => {
  console.log('generating page');

  fetch('data/menus.json')
  .then(res => res.json())
  .then(data => {
  
    addFilters('Midi', 'lunch', data);
    addFilters('Soir', 'dinner', data);

    const resetButton = createElem('button', document.querySelector('header'), {
      id: 'reset'
    });

    resetButton.onclick = () => {
      console.log(startingDate);

      if(startingDate) {
        generatePage(startingDate[0], startingDate[1], startingDate[2], data);
      }
    }

    thatDay.onchange = () => {
      if(thatDay.value !== null) {
        startOnNext.value = '';

        let [year, month, day] = thatDay.value.split('-');

        console.log([year, month, day]);

        generatePage(parseInt(year), parseInt(month) - 1, parseInt(day), data);
      }
    }

    startOnNext.onchange = () => {
      if(startOnNext.value !== '') {
        thatDay.value = null;

        getNextDayOfTheWeek(startOnNext.value, false);
        
        let [day, month, year] = getNextDayOfTheWeek(startOnNext.value, false).split('/');
        
        generatePage(parseInt(year), parseInt(month) - 1, parseInt(day), data);
      }
    }
  });
}








init();