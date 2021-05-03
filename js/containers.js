const createDayContainer = (container, weekDate) => { 
  const dayContainer = createElem('div', container, {
    class: "day outside"
  });

  const dateContainer = createElem('h2', dayContainer, {
    class: 'inside highlight'
  });

  dateContainer.innerHTML = `${weekDate.dayName} ${weekDate.day} ${weekDate.month}`;

  return dayContainer;
}

const createWeek = (year, month, day) => {
  arrayWeek = [];

  for (var i = 0; i < 7; i++) {
    const thisDay = new Date(year, month,  day + i)
    arrayWeek[i] = {
      fullDate: thisDay.toLocaleDateString('fr-FR'),
      dayName: matchDayOfWeek[thisDay.getDay()].name,
      day: parseInt(thisDay.toLocaleDateString('fr-FR').split('/')[0]),
      month: arrayMonths[thisDay.getMonth()]
    }
  }

  return arrayWeek;
}

const setMealsPerDay = (dayName, mealsPerDay) => {
  let mealsForThisDay = {};

  mealsForThisDay[dayName] = {};

  [...document.querySelectorAll(`#filters .${dayName} input`)].map(meal => {
    if(meal.checked) {

      console.log(mealsPerDay[dayName]);

      mealsForThisDay[dayName][meal.closest('.meal').id] = {};
    }
  });

  Object.assign(mealsPerDay, mealsForThisDay);
}

const addFilters = (mealName, mealId, data) => {
 const mealFilterContainer = createElem('div', document.querySelector('header .filters'), {
  class: 'meal',
  id: `${mealId}`
 });

 const textMealName = createElem('h3', mealFilterContainer);
 textMealName.innerText = `${mealName} : `;

 const mealList = createElem('ul', mealFilterContainer);

  arrayDays.map(day => {
    const mealListItem = createElem('li', mealList, {
      class: `${day}`
    });
 
    const mealListInput = createElem('input', mealListItem, {
      class: 'hidden',
      type: 'checkbox',
      id: `${mealId}-${day}`
    });
    if((mealId === 'dinner') || (mealId === 'lunch' && ['mercredi', 'samedi', 'dimanche'].includes(day))){
      mealListInput.checked = true;
    }

    const mealListLabel = createElem('label', mealListItem, {
      class: 'outside',
      for: `${mealId}-${day}`
    });
    mealListLabel.innerText = `${day.charAt(0)}`;
 
    setMealsPerDay(day, mealsPerDay);

    mealListInput.onchange = () => {
      setMealsPerDay(day, mealsPerDay);
      if(startingDate) {
        generateContainers(startingDate[0], startingDate[1], startingDate[2]);
        generateContent(data, mealsPerDay);
      }
    }
 
  });

}

const generateContainers = (year, month, day, data) => {
  mainContainer.innerHTML = '';

  startingDate = [year, month, day];

  console.log(mealsPerDay);

  const daysContainer = createElem('section', mainContainer, {
    class: 'days',
  })

  createWeek(year, month, day).map(weekDate => {
    if(!isEmpty(mealsPerDay[weekDate.dayName])) {
      const dayElem = createDayContainer(daysContainer, weekDate);
      
      setAttributes(dayElem, {
        id: `${weekDate.dayName}`
      });

      const mealsContainer = createElem('div', dayElem, {
        class: 'meals inside'
      });

      for(var meal in mealsPerDay[weekDate.dayName]) {
        const mealContainer = createElem('div', mealsContainer, {
          class: `meal ${meal}`
        });

        const mealNameContainer = createElem('div', mealContainer, {
          class: 'title'
        });

        const mealName = createElem('h3', mealNameContainer, {
          class: 'inside highlight'
        });
        mealName.innerText = `${objectMeals[meal]}`;
      }
    }
  });

  console.log(arrayWeek);
}