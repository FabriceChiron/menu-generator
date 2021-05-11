const reassignCategories = (menus) => {
  menus.mains = [...menus.meat, ...menus.fish];
  delete menus.meat;
  delete menus.fish;

  menus.starch = [...menus.pasta, ...menus.rice];
  delete menus.pasta;
  delete menus.rice;

  return menus;
}

const getRandomDish = (menus, mealCategory, i) => {

  let randomDish = menus[mealCategory][Math.floor(Math.random() * menus[mealCategory].length)];

  if(alreadyAssignedMeals.includes(randomDish) && menus[mealCategory].length > i) {
    i++;
    getRandomDish(menus, mealCategory, i);

    // return false;

  }

  return randomDish;
  
}

const removeFromAssigned = (dish) => {
  alreadyAssignedMeals.splice(alreadyAssignedMeals.indexOf(dish), 1);
}

const addToAssigned = (dish) => {
  alreadyAssignedMeals.push(dish);
}

const assignDish = (meal, mealCategory, choice) => {
  meal[mealCategory] = choice || getRandomDish(menus, mealCategory, 0);

  addToAssigned(meal[mealCategory]);

  return meal[mealCategory];
}

const assignMealCategory = (meal, category) => {
  let mealCategory = category || weightedRandom({mains: 2, veggies: 2, tarts: 1, starch: 1, family: 1, exotic: 1, tortillas: 1});


  // meal[mealCategory] = getRandomDish(menus, mealCategory);
  meal[mealCategory] = assignDish(meal, mealCategory);

  if(mealCategory === 'mains') {
    assignMealCategory(meal, 'veggies');
  }

  if(mealCategory === 'veggies' && (Math.round(Math.random()) > 0)) {
    assignMealCategory(meal, 'extras');
  }

  return meal;
}

const toggleMealStatus = (assignCategory) => {
  let meal = {};

  if(assignCategory) {
    assignMealCategory(meal);
  }

  console.log(meal);

  return meal;
}

const generateWeek = (data, mealsPerDay) => {
  const filters = document.querySelector('#filters');

  [...filters.querySelectorAll('.meal')].map(thisMeal => {

    [...thisMeal.querySelectorAll('li input[type="checkbox"]')].map(thisInput => {
      const day = thisInput.id.split('-')[1];
      const meal = thisInput.id.split('-')[0];

      if(!mealsPerDay[day]){
        mealsPerDay[day] = {};
      }

      if(thisInput.checked) {
        if(!mealsPerDay[day][meal] || isEmpty(mealsPerDay[day][meal])) {
          mealsPerDay[day][meal] = toggleMealStatus(true);
        }
      }

      thisInput.onchange = () => {
        if(thisInput.checked) {
          mealsPerDay[day][meal] = toggleMealStatus(thisInput.checked);
        } else {

          for(var dish in mealsPerDay[day][meal]) {
            removeFromAssigned(dish);
          }

          delete mealsPerDay[day][meal];
        }

        if(startingDate) {
          generateContainers(startingDate[0], startingDate[1], startingDate[2], data);
        }
      }

    })

  })

  console.log(mealsPerDay);
}