const getNbMeals = (mealsPerDay) => {
  let nbMeals = 0;
  for (const day in mealsPerDay) {
    for (const meal in mealsPerDay[day]) {
      nbMeals++;
    }
  }
  // console.log('nbMeals', nbMeals);

  return nbMeals;
}

const getRandomDish = (menus, targetMeal) => {
  let randomDish = menus[targetMeal][Math.floor(Math.random() * menus[targetMeal].length)];

  // console.log(randomDish);

  // console.log('before if statement');

  if(alreadyAssignedMeals.includes(randomDish) && targetMeal !== 'extras') {
    getRandomDish(menus, targetMeal);
  }

  else {
    return randomDish;
  }
  
  // console.log('after if statement');

}

const assignMeal = (mealsPerDay, day, meal, targetMeal, dishContainer, menus, dish, option) => {
  
  dishContainer.dataset.type = `${targetMeal}`;

  console.log({
    moment: 'before',
    dish: dish,
    typeofDish: typeof dish,
    targetMeal: targetMeal,
    mealsPerDayMeal: mealsPerDay[day][meal]
  });

  if(dish.split('|')[1] === '') {
    console.log('no dish yet, or adding to it', dish);

    // console.log(getRandomDish(menus, targetMeal));

    dish = `${targetMeal}|${getRandomDish(menus, targetMeal)}`;

    console.log('dish', dish);

    alreadyAssignedMeals.push(dish.split('|')[1]);
  
    if(option) {
      console.log('option');
      mealsPerDay[day][meal].push(dish);   
    }
    else {
      console.log('no option');
      mealsPerDay[day][meal].push(dish);
    }
  }

  else {
    console.log(`Dish already set: ${dish}`);
  }

  console.log({
    moment: 'after',
    dish: dish,
    typeofDish: typeof dish,
    targetMeal: targetMeal,
    mealsPerDayMeal: mealsPerDay[day][meal]
  });
  
  const dishList = createElem('select', dishContainer);

  menus[dish.split('|')[0]].map(mealItem => {
    const dishListItem = createElem('option', dishList, {
      value: `${mealItem}`
    });

    dishListItem.innerText = `${mealItem}`;

    if(mealItem === dish.split('|')[1]) {
      dishListItem.selected = true;
    }

    dishList.onchange = () => {
      console.log(dish.split('|')[0]);
      let previousDish = dish.split('|')[1];
      let newDish = dishList.value;

      mealsPerDay[day][meal] = mealsPerDay[day][meal].join(',').replace(`${previousDish}`, `${targetMeal}|${newDish}`).split(',');

      // console.log(alreadyAssignedMeals);

      alreadyAssignedMeals = alreadyAssignedMeals.join(',').replace(`${previousDish}`, `${newDish}`).split(',');

      // console.log(alreadyAssignedMeals);

    }
  });

  if(!['sides', 'extras'].includes(targetMeal)) {
    const randomButton = createElem('button', dishContainer, {
      class: 'highlight inside symbols'
    });

    randomButton.innerText = '~';

    randomButton.onclick = () => {
      mealsPerDay[randomButton.closest('.day').id][randomButton.closest('.meal').dataset.type] = [];
      console.log({
        day: randomButton.closest('.day').id,
        meal: randomButton.closest('.meal').dataset.type,
        mealPerDayMeal: mealsPerDay[randomButton.closest('.day').id][randomButton.closest('.meal').dataset.type] 
      });

      let toChange = {
        day:randomButton.closest('.day').id,
        meal:randomButton.closest('.meal').dataset.type,
        content:randomButton.closest('.content')
      }
      
      randomButton.closest('.content').innerHTML = '';

      dispatchCategoryMeal(undefined, toChange.meal, toChange.day, mealsPerDay, menus, toChange.content);
    }
  }


}

const createDish= (targetMeal, meal, day, mealsPerDay, menus, mealContainer, option) => {

  const dishContainer = createElem('div', mealContainer, {
    class: 'dish'
  });

  // console.log('targetMeal', targetMeal);
  console.log('mealsPerDay[day][meal]', mealsPerDay[day][meal]);


  if(!mealsPerDay[day][meal] || mealsPerDay[day][meal].length === 0) {
    console.log('length = 0');
    if(targetMeal === undefined) {
      // console.log(`targetMeal doesn't exist`);
      console.log(1, 'targetMeal', targetMeal, day, meal);
      targetMeal = weightedRandom({mains: 1/6, tarts: 1/6, starch: 1/6, family: 1/6, exotic: 1/6, tortillas: 1/6});
    } 
    else {
      console.log(2, 'targetMeal', targetMeal, day, meal);
      targetMeal = targetMeal;
    }

  }
  else {
    console.log('length != 0');

    console.log(3, 'targetMeal', targetMeal, day, meal);

    let mealIndex = 0;

    if(!targetMeal) {
      targetMeal = mealsPerDay[day][meal][mealIndex].split('|')[0];
    }

    if(targetMeal === 'sides'){
      mealIndex = 1;
    }

    else if (targetMeal === 'extras'){
      mealIndex = 2;
    }

    console.log(mealIndex)

/*    else {


      for(const thisMeal in menus) {
        // console.log(menus[thisMeal]);
        // console.log(mealsPerDay[day][meal]);
        // console.log(thisMeal, menus[thisMeal], mealsPerDay[day][meal]);
        if(menus[thisMeal].includes(mealsPerDay[day][meal][0].split('|')[0].toString())) {
          targetMeal = thisMeal;
          // console.log('targetMeal', targetMeal);
          break;
        }
      }
    }*/


    // console.log(targetMeal);

  }

  console.log('FINAL TARGET MEAL', targetMeal);

  switch(targetMeal) {
    case 'sides':
      mealIndex = 1;
      break;
    case 'extras':
      mealIndex = 2;
      break;
    default:
      mealIndex = 0;
  }

  console.log({
    message: 'FINAL TARGET MEAL',
    targetMeal: targetMeal,
    mealsPerDayMeal: mealsPerDay[day][meal],
    mealIndex: mealIndex,
    mealIndexValue: mealsPerDay[day][meal][mealIndex]
  })

  assignMeal(mealsPerDay, day, meal, targetMeal, dishContainer, menus, mealsPerDay[day][meal][mealIndex] || `${targetMeal}|`, option);
  // console.log(targetMeal);

  return targetMeal;
}

const dispatchCategoryMeal = (targetMeal, meal, day, mealsPerDay, menus, mealContainer) => {
  targetMeal = createDish(targetMeal, meal, day, mealsPerDay, menus, mealContainer);

  console.log(-1, 'targetMeal', targetMeal);

  if(targetMeal === 'mains') {
    console.log('add sides');
    console.log(mealsPerDay)
    targetMeal = createDish('sides', meal, day, mealsPerDay, menus, mealContainer, 'add');

    if((Math.round(Math.random()) > 0) || mealsPerDay[day][meal].length === 3) {
      console.log('add extras');
      targetMeal = createDish('extras', meal, day, mealsPerDay, menus, mealContainer, 'add');
    }
  }
}

const assignDishCategoryPerMeal = (mealsPerDay, menus) => {
  for (const day in mealsPerDay) {
    // console.log(mealsPerDay[day]);
    
    for (const meal in mealsPerDay[day]) {
      let targetMeal;

      const mealContainer = createElem('div', mainContainer.querySelector(`#${day} .${meal}`), {
        class: 'content'
      });

      dispatchCategoryMeal(targetMeal, meal, day, mealsPerDay, menus, mealContainer);

      

    }
  }

  // console.log(mealsPerDay);
}

const reassignCategories = (menus) => {
  menus.mains = [...menus.meat, ...menus.fish];
  delete menus.meat;
  delete menus.fish;

  menus.starch = [...menus.pasta, ...menus.rice];
  delete menus.pasta;
  delete menus.rice;

  return menus;
}

const generateContent = (data, mealsPerDay, update) => {

  if(!update) {
    menus = {...data.menus};
    // console.log(menus);
    reassignCategories(menus);
  }

  // console.log(menus);

  // console.log(mealsPerDay);

/*  let mainMenus = {...menus};

  delete mainMenus.sides;

  console.log('menus', menus);
  console.log('mainMenus', mainMenus);


  console.log('menus', menus);
  console.log('mainMenus', mainMenus);*/

  assignDishCategoryPerMeal(mealsPerDay, menus);
}