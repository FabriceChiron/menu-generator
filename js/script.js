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

const init = (userId) => {
  console.log(`generating page for ${(userId) ? userId : 'invité'}`);

  if(userId) {
    login(userId, null, null, true);
    console.log(userId);
    fetchAndStart(userId);
  } else {
    fetchAndStart();
  }

  
}



addFilters('Soir', 'dinner');
addFilters('Midi', 'lunch');

init(getUserId());