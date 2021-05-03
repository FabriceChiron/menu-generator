const getNbMeals = (mealsPerDay) => {
  let nbMeals = 0;
  for (const day in mealsPerDay) {
    for (const meal in mealsPerDay[day]) {
      nbMeals++;
    }
  }
  console.log('nbMeals', nbMeals);

  return nbMeals;
}

const assignMeal = (mealsPerDay, day, meal, targetMeal, mealContainer, menus) => {
  const dish = menus[targetMeal][Math.floor(Math.random() * menus[targetMeal].length)];

  mealsPerDay[day][meal] = dish;
  mealContainer.innerText = dish; 
}

const assignDishCategoryPerMeal = (mealsPerDay, menus) => {
  for (const day in mealsPerDay) {
    for (const meal in mealsPerDay[day]) {
      const targetMeal = weightedRandom({mains: 1/7, tarts: 1/7, pasta: 1/7, family: 1/7, rice: 1/7, exotic: 1/7, tortillas: 1/7});
      
      const mealContainer = createElem('div', mainContainer.querySelector(`#${day} .${meal}`), {
        class: 'content'
      });

      assignMeal(mealsPerDay, day, meal, targetMeal, mealContainer, menus)
      
    }
  }

  console.log(mealsPerDay);
}

const generateContent = (data, mealsPerDay) => {
  let menus = {...data.menus};

  console.log(menus);

  menus.mains = [...menus.meat, ...menus.fish];

  assignDishCategoryPerMeal(mealsPerDay, menus);
}