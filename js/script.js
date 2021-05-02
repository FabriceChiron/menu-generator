const init = (year, month, day) => {
  console.log('generating page');

  fetch('data/menus.json')
  .then(res => res.json())
  .then(data => {

    
    generateContainers(year, month - 1, day);

    // generateContent(data);
  });
}



addFilters('Midi', 'noon');
addFilters('Soir', 'evening');

const thatDay = document.querySelector('header input[type="date"]');
const startOnNext = document.querySelector('header select');

thatDay.onchange = () => {
  let [year, month, day] = thatDay.value.split('-');
  console.log([year, month, day]);

  init(parseInt(year), parseInt(month), parseInt(day));
  // console.log(`starting menu on ${thatDay.value}`);
}

startOnNext.onchange = () => {
  thatDay.value = null;
  getNextDayOfTheWeek(startOnNext.value, false);
  let [day, month, year] = getNextDayOfTheWeek(startOnNext.value, false).split('/');
  // console.log([year, month, day]);

  init(parseInt(year), parseInt(month), parseInt(day));
  // console.log([year, month, day]);
  // console.log(`starting menu on ${getNextDayOfTheWeek(startOnNext.value, false)}`);
}


// init();