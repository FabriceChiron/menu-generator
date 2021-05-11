const thatDay = document.querySelector('header input[type="date"]');
const startOnNext = document.querySelector('header select');
const mainContainer = document.querySelector('#main-container');
const resetButton = document.querySelector('#reset');
const editMenusButton = document.querySelector('#edit-list');

let mealsPerDay = {};
let menus = {};
let arrayWeek = [];
let startingDate;
// let structureToCreate = true;

let alreadyAssignedMeals = [];

const generatePage = (year, month, day, data) => {  
  generateContainers(year, month, day, data);
}

const copyJsonFile = (defaultName, userId) => {
  fetch(`data/${defaultName}.json`)
  .then(res => res.json())
  .then(data => {
    data.fileName = `${userId}.json`;

    saveDataToJson(data);
  })
}

const fetchAndStart = (userId) => {

  if(userId && !fileExists(`data/${userId}.json`)) {
    copyJsonFile('menus', userId);
  }

  const jsonFile = `data/${(userId) ? userId : 'menus'}.json`;

  console.log('jsonFile', jsonFile);

  fetch(jsonFile)
  .then(res => res.json())
  .then(data => {

    menus = reassignCategories({...data.menus});
    generateWeek(data, mealsPerDay);

    editMenusButton.parentElement.onclick = () => {
      editMenus(data);
    }

    resetButton.onclick = () => {

      if(startingDate) {
        mealsPerDay = {};
        alreadyAssignedMeals = [];
        // structureToCreate = true;
        generateWeek(data, mealsPerDay);
        generatePage(startingDate[0], startingDate[1], startingDate[2], data);
      }
    }

    thatDay.onchange = () => {
      if(thatDay.value !== null) {
        startOnNext.value = '';

        let [year, month, day] = thatDay.value.split('-');

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

const init = (userId) => {
  console.log(`generating page for ${(userId) ? userId : 'invité'}`);

  if(userId) {
    login(userId, null, null, true, fetchAndStart);
  } else {
    fetchAndStart();
  }

  
}



addFilters('Soir', 'dinner');
addFilters('Midi', 'lunch');

init(getUserId());