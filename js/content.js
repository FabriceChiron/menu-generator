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

const assignMeal = (mealsPerDay, day, meal, targetMeal, dishContainer, menus, dish, option) => {
  
  dishContainer.dataset.type = `${targetMeal}`;

  if(!dish) {
    dish = menus[targetMeal][Math.floor(Math.random() * menus[targetMeal].length)];
  }

  if(option) {
    mealsPerDay[day][meal] += ` | ${dish}`;   
  }
  else {
    mealsPerDay[day][meal] = dish;
  }
  
  const dishList = createElem('select', dishContainer);

  console.log(day);
  console.log(menus);
  console.log(targetMeal); 
  console.log(menus[targetMeal]);

  menus[targetMeal].map(mealItem => {
    const dishListItem = createElem('option', dishList, {
      value: `${mealItem}`
    });

    dishListItem.innerText = `${mealItem}`;

    if(mealItem === dish) {
      dishListItem.selected = true;
    }

    dishList.onchange = () => {
      let previousDish = dish;
      let newDish = dishList.value;

      let updateMeal = {};
      updateMeal[meal] = mealsPerDay[day][meal].replace(`${previousDish}`, `${newDish}`);

      mealsPerDay[day][meal] = updateMeal[meal];

    }
  });

}

const createDish= (targetMeal, meal, day, mealsPerDay, menus, mealContainer, option) => {

  const dishContainer = createElem('div', mealContainer, {
    class: 'dish'
  });

  // console.log('targetMeal', targetMeal);
  // console.log('mealsPerDay[day][meal]', mealsPerDay[day][meal]);

  if(isEmpty(mealsPerDay[day][meal]) || option) {
    if(targetMeal === undefined) {
      console.log(`targetMeal doesn't exist`);
      targetMeal = weightedRandom({mains: 1/6, tarts: 1/6, starch: 1/6, family: 1/6, exotic: 1/6, tortillas: 1/6});
    } 
    else {
      console.log(`targetMeal exists: ${targetMeal}`);
      targetMeal = targetMeal;
    }
    console.log(targetMeal);
    assignMeal(mealsPerDay, day, meal, targetMeal, dishContainer, menus, null, option)
  }
  else {
    // console.log(mealsPerDay[day][meal]);

    for(const thisMeal in menus) {
      // console.log(thisMeal, menus[thisMeal], mealsPerDay[day][meal]);
      if(menus[thisMeal].includes(mealsPerDay[day][meal].toString())) {
        targetMeal = thisMeal;
        // console.log('targetMeal', targetMeal);
        break;
      }
    }

    if(targetMeal === undefined) {
      console.log(`targetMeal doesn't exist`);
      targetMeal = weightedRandom({mains: 1/6, tarts: 1/6, starch: 1/6, family: 1/6, exotic: 1/6, tortillas: 1/6});
    }
    
    assignMeal(mealsPerDay, day, meal, targetMeal, dishContainer, menus, mealsPerDay[day][meal], option)
  }

  console.log(targetMeal);

  return targetMeal;
}

const assignDishCategoryPerMeal = (mealsPerDay, menus) => {

  for (const day in mealsPerDay) {
    // console.log(mealsPerDay[day]);
    
    for (const meal in mealsPerDay[day]) {
      let targetMeal;

      const mealContainer = createElem('div', mainContainer.querySelector(`#${day} .${meal}`), {
        class: 'content'
      });

      targetMeal = createDish(targetMeal, meal, day, mealsPerDay, menus, mealContainer);

      // console.log('targetMeal', targetMeal);

      if(targetMeal === 'mains') {
        createDish('sides', meal, day, mealsPerDay, menus, mealContainer, 'add');

        if( Math.round(Math.random()) > 0 ) {
          createDish('extras', meal, day, mealsPerDay, menus, mealContainer, 'add');
        }
      }

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
    console.log(menus);
    reassignCategories(menus);
  }

  console.log(menus);

/*  let mainMenus = {...menus};

  delete mainMenus.sides;

  console.log('menus', menus);
  console.log('mainMenus', mainMenus);


  console.log('menus', menus);
  console.log('mainMenus', mainMenus);*/

  assignDishCategoryPerMeal(mealsPerDay, menus);
}