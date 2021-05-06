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

const getRandomDish = (menus, targetMeal, i = 0) => {

  let randomDish = menus[targetMeal][Math.floor(Math.random() * menus[targetMeal].length)];

  console.log(`i = ${i}`);

  if(alreadyAssignedMeals.includes(randomDish) && menus[targetMeal].length < i) {
    getRandomDish(menus, targetMeal, i++);
  }

  else {
    return randomDish;
  }
  
  // console.log('after if statement');

}

const assignMeal = (mealsPerDay, day, meal, targetMeal, dishContainer, menus, dish, option) => {
  
  dishContainer.dataset.type = `${targetMeal}`;

  if(dish.split('|')[1] === '') {
    
    // console.log(getRandomDish(menus, targetMeal));

    dish = `${targetMeal}|${getRandomDish(menus, targetMeal)}`;

    
    alreadyAssignedMeals.push(dish.split('|')[1]);
  
    if(option) {
      mealsPerDay[day][meal].push(dish);   
    }
    else {
      mealsPerDay[day][meal].push(dish);
    }
  }

  const dishListWrapper = createElem('div', dishContainer);
  
  const dishList = createElem('select', dishListWrapper);

  menus[dish.split('|')[0]].map(mealItem => {
    const dishListItem = createElem('option', dishList, {
      value: `${mealItem}`
    });

    dishListItem.innerText = `${mealItem}`;

    if(mealItem === dish.split('|')[1]) {
      dishListItem.selected = true;
    }

    dishList.onchange = () => {
      let previousDish = dish.split('|')[1];
      let newDish = dishList.value;

      mealsPerDay[day][meal] = mealsPerDay[day][meal].join(',').replace(`${previousDish}`, `${newDish}`).split(',');

      // console.log(alreadyAssignedMeals);

      alreadyAssignedMeals = alreadyAssignedMeals.join(',').replace(`${previousDish}`, `${newDish}`).split(',');

      // console.log(alreadyAssignedMeals);

    }
  });

  // if(!['sides', 'extras'].includes(targetMeal)) {


  const createButton = (type) => {
    let button = createElem('button', dishContainer, {class: 'highlight inside symbols'});

    switch (type) {

      case 'sides':
        
        button.innerHTML = '<span>Â</<span>';

        button.onclick = () => {
          dispatchCategoryMeal('extras', meal, day, mealsPerDay, menus, mainContainer.querySelector(`#${day} .${meal} .content`));
        }


      break;

      case 'extras':

        button.innerHTML = '<span>Î</<span>';

        button.onclick = () => {
          button.closest('.dish').previousSibling.querySelector('button').classList.remove('hide');
          alreadyAssignedMeals.splice(alreadyAssignedMeals.indexOf(mealsPerDay[day][meal][2].split('|')[1]), 1);
          dishContainer.remove();
          mealsPerDay[day][meal].length = 2;
        }
      
      break;
      
      default:
      
        button.innerHTML = '~';

        button.onclick = () => {
          
          button.closest('.content').innerHTML = '';

          mealsPerDay[day][meal].map(dishItem => {
            alreadyAssignedMeals.splice(alreadyAssignedMeals.indexOf(dishItem.split('|')[1]), 1);
          });
          mealsPerDay[day][meal] = [];
          
          dispatchCategoryMeal(undefined, meal, day, mealsPerDay, menus, mainContainer.querySelector(`#${day} .${meal} .content`));
        }
    } 

  }

  createButton(targetMeal);


  // }


}

const createDish= (targetMeal, meal, day, mealsPerDay, menus, mealContainer, option) => {

  
  const dishContainer = createElem('div', mealContainer, {
    class: 'dish'
  });

  // console.log('targetMeal', targetMeal);
  

  if(!mealsPerDay[day][meal] || mealsPerDay[day][meal].length === 0) {
    if(targetMeal === undefined) {
      targetMeal = weightedRandom({mains: 1/6, tarts: 1/6, starch: 1/6, family: 1/6, exotic: 1/6, tortillas: 1/6});
    } 
    else {
      targetMeal = targetMeal;
    }

  }
  else {

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

  }

  if(targetMeal === "extras") {
    dishContainer.previousSibling.querySelector('button').classList.add('hide');
  }

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

  assignMeal(mealsPerDay, day, meal, targetMeal, dishContainer, menus, mealsPerDay[day][meal][mealIndex] || `${targetMeal}|`, option);
  // console.log(targetMeal);

  return targetMeal;
}

const dispatchCategoryMeal = (targetMeal, meal, day, mealsPerDay, menus, mealContainer) => {
  targetMeal = createDish(targetMeal, meal, day, mealsPerDay, menus, mealContainer);


  if(targetMeal === 'mains') {
    targetMeal = createDish('sides', meal, day, mealsPerDay, menus, mealContainer, 'add');

    if((Math.round(Math.random()) > 0) || mealsPerDay[day][meal].length === 3) {
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

  assignDishCategoryPerMeal(mealsPerDay, menus);
}