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


// create checkboxes for each meal each day
const addFilters = (mealName, mealId) => {
  const mealFilterContainer = createElem('div', document.querySelector('#filters-wrapper'), {
    class: 'meal',
    id: `${mealId}`
  }, 'prepend');

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

 
  });

}

const createButton = (meal, mealCategory, dishContainer, dishListWrapper, type) => {

  let button;
  button = createElem('button', dishContainer.lastChild, {class: 'highlight inside symbols'});

  const mealContentContainer = button.closest('.content');
  
  switch (type) {
    case 'reset' :
      button.innerHTML = '~';

      button.onclick = () => {
          
        const thisDay = dishContainer.closest('.day').id;

        button.closest('.content').innerHTML = '';

        for (var thisMealCategory in meal) {
          removeFromAssigned(meal[thisMealCategory]);
          delete meal[thisMealCategory];
        }

        assignMealCategory(meal);


        createDishCategory(meal, mealContentContainer);
      }
    break;
    
    case 'veggies':
      button.innerHTML = '<span>Â</<span>';

      button.onclick = () => {
        assignMealCategory(meal, 'extras');
        mealContentContainer.innerHTML = '';
        createDishCategory(meal, mealContentContainer);

        if(!meal.extras) {
          mealContentContainer.querySelector('.dish[data-type="veggies"] button:last-child').classList.add('hide');
        }
        // mealContentContainer.querySelector('.dish[data-type="veggies"] button:last-child').classList.remove('hide');
      }


    break;

    case 'extras':

    button.innerHTML = '<span>Î</<span>';

    button.onclick = () => {
      // button.closest('.dish').previousSibling.querySelector('button').classList.remove('hide');

      removeFromAssigned(meal.extras);
      delete meal.extras;

      mealContentContainer.querySelector('.dish[data-type="veggies"] button:last-child').classList.remove('hide');

      dishContainer.remove();
    }

    break;
  }

  return meal;

}

const createButtons = (meal, mealCategory, dishContainer, dishListWrapper) => {

  const buttonsContainer = createElem('div', dishContainer, {
    class: 'buttons'
  });

  const order =  Array.from(dishContainer.parentNode.children).indexOf(dishContainer);

  if(order === 0) {
    createButton(meal, mealCategory, dishContainer, dishListWrapper, 'reset')
  }

  if(['veggies', 'extras'].includes(mealCategory)) {
    createButton(meal, mealCategory, dishContainer, dishListWrapper, mealCategory);
  }



  

}

const createDishList = (meal, mealCategory, dishList) => {

  menus[mealCategory].map(dishItem => {
    const dishListItem = createElem('option', dishList, {
      value: `${dishItem}`
    });

    dishListItem.innerText = `${dishItem}`;

    if(dishItem === meal[mealCategory]) {
      dishListItem.selected = true;
    }
  });

  dishList.onchange = () => {
    let previousDish = meal[mealCategory];
    let newDish = dishList.value;

    removeFromAssigned(meal[mealCategory]);
    assignDish(meal, mealCategory, dishList.value);
  }
}

const createDishContent = (meal, mealCategory, dishContainer) => {
  // console.log(meal, mealCategory, meal[mealCategory]);

  const dishListWrapper = createElem('div', dishContainer, {
    class: 'select-wrapper'
  });

  const dishList = createElem('select', dishListWrapper);

  createDishList(meal, mealCategory, dishList);

  createButtons(meal, mealCategory, dishContainer, dishListWrapper);
}

const createDishCategory = (meal, mealContentContainer) => {

  for(var mealCategory in meal) {
    const dishContainer = createElem('div', mealContentContainer, {
      class: 'dish',
    });
    dishContainer.dataset.type = mealCategory;

    if(mealCategory === 'extras') {
      mealContentContainer.querySelector('.dish[data-type="veggies"] button:last-child').classList.add('hide');
    }

    createDishContent(meal, mealCategory, dishContainer);
  }
}

const generateContainers = (year, month, day, data) => {
  mainContainer.innerHTML = '';

  startingDate = [year, month, day];

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
        mealContainer.dataset.type = meal;

        if(meal === 'lunch') {
          mealsContainer.prepend(mealContainer);
        }

        const mealNameContainer = createElem('div', mealContainer, {
          class: 'title'
        });

        const mealName = createElem('h3', mealNameContainer, {
          class: 'inside highlight'
        });
        mealName.innerText = `${objectMeals[meal]}`;

        const mealContentContainer = createElem('div', mealContainer, {
          class: 'content'
        });

        createDishCategory(mealsPerDay[weekDate.dayName][meal], mealContentContainer);
      }
    }

  });

  document.querySelector('#reset').classList.remove('hidden');

  // console.log(arrayWeek);
}