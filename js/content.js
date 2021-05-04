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

const assignMeal = (mealsPerDay, day, meal, targetMeal, mealContainer, menus, dish) => {
  
  // console.log('targetMeal', targetMeal);

  if(!dish) {
    dish = menus[targetMeal][Math.floor(Math.random() * menus[targetMeal].length)];
  }
 
  mealsPerDay[day][meal] = dish;
  
  const dishList = createElem('select', mealContainer);

  menus[targetMeal].map(mealItem => {
    const dishListItem = createElem('option', dishList, {
      value: `${mealItem}`
    });

    dishListItem.innerText = `${mealItem}`;

    if(mealItem === dish) {
      dishListItem.selected = true;
    }

    dishList.onchange = () => {
      dish = dishList.value;
      mealsPerDay[day][meal] = dish;
      // console.log(mealsPerDay);
    }
  });

}

const assignDishCategoryPerMeal = (mealsPerDay, menus) => {
  // console.log(mealsPerDay);

  for (const day in mealsPerDay) {
    // console.log(mealsPerDay[day]);
    
    for (const meal in mealsPerDay[day]) {
      let targetMeal;

      const mealContainer = createElem('div', mainContainer.querySelector(`#${day} .${meal}`), {
        class: 'content'
      });

      if(isEmpty(mealsPerDay[day][meal])) {
        targetMeal = weightedRandom({mains: 1/7, tarts: 1/7, pasta: 1/7, family: 1/7, rice: 1/7, exotic: 1/7, tortillas: 1/7});

        assignMeal(mealsPerDay, day, meal, targetMeal, mealContainer, menus)
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

        assignMeal(mealsPerDay, day, meal, targetMeal, mealContainer, menus, mealsPerDay[day][meal])
      }
        

    }
  }

  // console.log(mealsPerDay);
}

const generateContent = (data, mealsPerDay) => {
  let menus = {...data.menus};

  console.log(menus);

  menus.mains = [...menus.meat, ...menus.fish];

  delete menus.meat;
  delete menus.fish;

  assignDishCategoryPerMeal(mealsPerDay, menus);
}