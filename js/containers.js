const generateContainers = (year, month, day) => {
  const mainContainer = document.querySelector('#main-container');

  mainContainer.innerHTML = '';

  const startingDate = new Date(year, month, day).toLocaleDateString('fr-FR');

  const daysContainer = createElem('section', mainContainer, {
    class: 'days'
  })

  createWeek(year, month, day).map(weekDate => {
    const dayElem = createDayContainer(daysContainer, weekDate);
  });



  // console.log(today);

  // console.log(date, month, year);
}

const addFilters = (mealName, mealId) => {
 const mealFilterContainer = createElem('div', document.querySelector('header .filters'), {
  class: 'meal',
  id: `${mealId}`
 });

 const textMealName = createElem('h3', mealFilterContainer);
 textMealName.innerText = `${mealName} : `;

 const mealList = createElem('ul', mealFilterContainer);

 arrayDays.map(day => {
  const mealListItem = createElem('li', mealList, {
  });
  mealListItem.innerHTML = `<input type="checkbox" class="hidden" ${((mealId === 'evening') || (mealId === 'noon' && day === 'mercredi') ) ? 'checked' : ''} id="${mealId}-${day}"><label class="outside" for="${mealId}-${day}">${day}</label>`;
 });
}