const getCategoryTitle = {
  tarts: "Tartes",
  pasta: "Pâtes",
  family: "Plats familiaux",
  rice: "Riz",
  exotic: "Exotique",
  tortillas: "Plats à base d'oeuf",
  veggies: "Légumes",
  meat: "Viandes",
  fish: "Poissons",
  extras: "Extras" 
}

let dayMealsToDelete = [];
let mealsToAdd = {}

const updateMealsPerDay = (data, thisCatType, currentDish, newDish, toDelete) => {
  for(day in mealsPerDay) {
    for (meal in mealsPerDay[day]) {
      switch(thisCatType) {
        case 'rice':
        case 'pasta':
          thisCatType = 'starch';
        break;

        case 'meat':
        case 'fish':
          thisCatType = 'mains';
        break;
      }

      if(mealsPerDay[day][meal][thisCatType] && mealsPerDay[day][meal][thisCatType] === currentDish) {
        if(toDelete) {
          console.log(`deleting "${currentDish}" on ${day} - ${meal}`);
          dayMealsToDelete.push(`${day} (${objectMeals[meal]})`);
          delete mealsPerDay[day][meal];

          document.querySelector(`#${meal}-${day}`).checked = false;
        }
        else {
          console.log(`found one on ${day} - ${meal}:
            "${currentDish}" changes to "${newDish}"`);
          mealsPerDay[day][meal][thisCatType] = newDish;
        }

      }
    }
  }

} 

const checkModifications = (data, popin) => {

  console.log("before", mealsPerDay);

  [...popin.querySelectorAll('.category')].map(thisCategory => {

    thisCatType = thisCategory.dataset.category;

    Object.assign(mealsToAdd, {
      [thisCatType]: []
    });

    // console.log(thisCatType, data.menus[thisCatType]);
    // console.log(thisCategory.querySelector('ul').childNodes.length);
    // console.log(data.menus[thisCatType].length);

    [...thisCategory.querySelectorAll('ul li')].map((thisItem, index) => {
      const currentDish = data.menus[thisCatType][index];
      const newDish = thisItem.querySelector('div').innerText;
      

      // If thisItem is not a new one
      if(index < data.menus[thisCatType].length) {
        // If the dish is to be deleted
        if(thisItem.classList.contains('to-delete')) {
          alreadyAssignedMeals.splice(alreadyAssignedMeals.indexOf(currentDish), 1);
          data.menus[thisCatType].splice(data.menus[thisCatType].indexOf(currentDish), 1);
          updateMealsPerDay(data, thisCatType, currentDish, newDish, true);
        }

        else {
          // If the dish has been updated
          if(currentDish !== newDish) {
            console.log('content change', {
              old: currentDish,
              new: newDish
            });
            data.menus[thisCatType][index] = newDish;

            if(alreadyAssignedMeals.includes(currentDish)) {
              alreadyAssignedMeals[alreadyAssignedMeals.indexOf(currentDish)] = newDish;
              updateMealsPerDay(data, thisCatType, currentDish, newDish);
            }
          }
        }
      }
      else {
        if(newDish.length > 0) {
          mealsToAdd[thisCatType].push(newDish);
        }
      }
    })
  });
  
  for (type in mealsToAdd) {
    mealsToAdd[type].map(thisDish => {
      data.menus[type].push(thisDish);
    });
  }

  console.log(data.menus);

  if(getUserId()) {
    saveDataToJson(data);
  }



  
  menus = reassignCategories({...data.menus});

  if(startingDate) {

    if(dayMealsToDelete.length > 0) {
      alert(`La suppression de certains plats a entraîné la suppression des menus pour: ${dayMealsToDelete.join(', ')}`);
    }

    generatePage(startingDate[0], startingDate[1], startingDate[2], data);
  }

  popin.remove();
}

const createHeader = (popinHeader, popin, data) => {
  const validateListContainer = createElem('div', popinHeader);
  validateListContainer.innerText = 'Valider la liste';  

  const validateListButton = createElem('button', validateListContainer, {
    id: '#validate-list',
    class: 'highlight outside symbols'
  }, 'prepend');
  validateListButton.innerHTML = '<span>õ</span>';

  validateListButton.onclick = () => {
    if(confirm("Sauvegarder les modifications ?")) {
      checkModifications(data, popin);
    }
  }

  const closeListContainer = createElem('div', popinHeader);

  const closeListButton = createElem('button', closeListContainer, {
    id: '#close-list',
    class: 'highlight outside symbols'
  }, 'prepend');
  closeListButton.innerHTML = '<span>Î</span>';

  closeListButton.onclick = () => {
    if(confirm("Annuler l'édition de la liste ?")) {
      popin.remove();
    }
  }
}

const createDishLine = (dishList, data, category, i) => {
  const originDish = data.menus[category][i] || '';

  const dishItem = createElem('li', dishList);
  dishItem.dataset.originDish = originDish;

  const dishContainer = createElem('div', dishItem, {
    contenteditable: false
  });
  dishContainer.innerText = originDish;

  const dishUndoButton = createElem('button', dishItem, {
    class: 'highlight outside symbols hidden undo'
  });
  dishUndoButton.innerText = 'ª';

  const dishEditButton = createElem('button', dishItem, {
    class: 'highlight outside symbols edit'
  });
  dishEditButton.innerText = '?';

  const dishDeleteButton = createElem('button', dishItem, {
    class: 'highlight outside symbols delete'
  });
  dishDeleteButton.innerHTML = '<span>Î</span>';

  
  dishUndoButton.onclick = () => {
    dishContainer.innerText = originDish;
    dishUndoButton.classList.add('hidden');
    // dishEditButton.click();
  }

  dishContainer.oninput = () => {
    if(dishContainer.innerText === originDish) {
      dishUndoButton.classList.add('hidden');
    }
    else {
      dishUndoButton.classList.remove('hidden');
    }
  }

  dishEditButton.onclick = () => {
    if(dishContainer.contentEditable === "false") {
      dishContainer.contentEditable = "true";
      dishEditButton.innerHTML = '<span>õ</span>';
      dishContainer.focus();
    }
    else {
      dishContainer.contentEditable = "false";
      dishEditButton.innerText = '?';
    }
  }

  dishDeleteButton.onclick = () => {
    dishItem.classList.toggle('to-delete');
  }
}

const createList = (popin, popinSection, data) => {
  const categoriesContainer = createElem('div', popinSection, {
    class: 'categories',
    id: 'categories'
  });

  for (const category in data.menus) {
    console.log(category);

    const categoryContainer = createElem('div', categoriesContainer, {
      class: 'category'
    });
    categoryContainer.dataset.category = category;

    const inputToggleCategory = createElem('input', categoryContainer, {
      type: 'checkbox',
      class: 'hidden',
      id: `toggle-${category}`
    });

    const categoryTitleContainer = createElem('div', categoryContainer, {
      class:"category-title-container highlight outside"
    });

    const categoryTitle = createElem('h2', categoryTitleContainer, {
      class:'category-title'
    });

    const buttonToggleCategory = createElem('label', categoryTitleContainer, {
      for: `toggle-${category}`,
      class: 'toggle-category inside symbols'
    });

    categoryTitle.innerText = getCategoryTitle[category];

    const dishList = createElem('ul', categoryContainer);

    for (var i = 0; i < data.menus[category].length; i++) {

      createDishLine(dishList, data, category, i);

    }

    const buttonAddDish = createElem('button', categoryContainer, {
      class: 'highlight outside symbols'
    })
    buttonAddDish.innerHTML = '<span>Â</span>';

    buttonAddDish.onclick = () => {
      createDishLine(dishList, data, category, dishList.childNodes.length + 1);
      dishList.lastChild.querySelector('button.edit').click();
    }
  }
}

const editMenus = (data) => {
  console.log(data.menus);

  const popin = createElem('div', document.body, {
    id: "popin-menus",
    class: 'outside'
  });

  const popinHeader = createElem('header', popin);
  const popinSection = createElem('section', popin);

  createHeader(popinHeader, popin, data);

  createList(popin, popinSection, data);

}
