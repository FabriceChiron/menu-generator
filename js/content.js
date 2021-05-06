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

  if(alreadyAssignedMeals.includes(randomDish)) {
    getRandomDish(menus, targetMeal);
  }
  
  // console.log('after if statement');
  return randomDish;

}

const assignMeal = (mealsPerDay, day, meal, targetMeal, dishContainer, menus, dish, option) => {
  
  dishContainer.dataset.type = `${targetMeal}`;

  console.log({
    dish: dish,
    targetMeal: targetMeal
  });

  if(dish.length === 0 || option) {
    console.log('no dish yet, or adding to it', dish);

    // console.log(getRandomDish(menus, targetMeal));

    dish = getRandomDish(menus, targetMeal);
    alreadyAssignedMeals.push(dish);
  
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


  

  // console.log(alreadyAssignedMeals);


  console.log({
    menus: menus,
    targetMeal: targetMeal,
    menusTargetMeal: menus[targetMeal]
  });
  
  const dishList = createElem('select', dishContainer);

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

      mealsPerDay[day][meal] = mealsPerDay[day][meal].join(',').replace(`${previousDish}`, `${newDish}`).split(',');

      // console.log(alreadyAssignedMeals);

      alreadyAssignedMeals = alreadyAssignedMeals.join(',').replace(`${previousDish}`, `${newDish}`).split(',');

      // console.log(alreadyAssignedMeals);

      mealsPerDay[day][meal] = updateMeal[meal];

    }
  });

  const randomButton = createElem('button', dishContainer, {
    class: 'highlight inside symbols'
  });
  randomButton.innerText = '~';

}

const createDish= (targetMeal, meal, day, mealsPerDay, menus, mealContainer, option) => {

  const dishContainer = createElem('div', mealContainer, {
    class: 'dish'
  });

  // console.log('targetMeal', targetMeal);
  // console.log('mealsPerDay[day][meal]', mealsPerDay[day][meal]);


  if(mealsPerDay[day][meal].length === 0) {
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
    if(['sides', 'extras'].includes(targetMeal)) {
      console.log('TARGETMEAL', targetMeal);
    }
    else {
      for(const thisMeal in menus) {
        console.log(menus[thisMeal]);
        console.log(mealsPerDay[day][meal]);
        // console.log(thisMeal, menus[thisMeal], mealsPerDay[day][meal]);
        if(menus[thisMeal].includes(mealsPerDay[day][meal][0].toString())) {
          targetMeal = thisMeal;
          // console.log('targetMeal', targetMeal);
          break;
        }
      }
    }


    // console.log(targetMeal);

    if(targetMeal === undefined) {
      console.log(3, 'targetMeal', targetMeal, day, meal);
    }

    else {
      console.log(4, 'targetMeal', targetMeal, day, meal);

    }


    // console.log(targetMeal);

  }

  console.log('FINAL TARGET MEAL', targetMeal);

  assignMeal(mealsPerDay, day, meal, targetMeal, dishContainer, menus, mealsPerDay[day][meal], option)
  // console.log(targetMeal);

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

      console.log(-1, 'targetMeal', targetMeal);

      if(targetMeal === 'mains') {
        console.log('add sides');
        targetMeal = createDish('sides', meal, day, mealsPerDay, menus, mealContainer, 'add');

        if( Math.round(Math.random()) > 0 ) {
          console.log('add extras');
          targetMeal = createDish('extras', meal, day, mealsPerDay, menus, mealContainer, 'add');
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