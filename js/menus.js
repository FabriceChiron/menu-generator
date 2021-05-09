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

const checkModifications = (data) => {

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
    // if(confirm("Sauvegarder les modifications ?")) {
      checkModifications(data)
    // }
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
  const originDish = data.menus[category][i];

  const dishItem = createElem('li', dishList);
  dishItem.dataset.originDish = originDish;

  const dishContainer = createElem('div', dishItem, {
    contenteditable: false
  });
  dishContainer.innerText = originDish;

  const dishUndoButton = createElem('button', dishItem, {
    class: 'highlight outside symbols hidden'
  });
  dishUndoButton.innerText = 'ª';

  const dishEditButton = createElem('button', dishItem, {
    class: 'highlight outside symbols'
  });
  dishEditButton.innerText = '?';

  
  dishUndoButton.onclick = () => {
    dishContainer.innerText = originDish;
    dishUndoButton.classList.add('hidden');
    dishEditButton.click();
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
      dishEditButton.innerText = 'õ';
      dishContainer.focus();
    }
    else {
      dishContainer.contentEditable = "false";
      dishEditButton.innerText = '?';
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
  const popinFooter = createElem('footer', popin);

  createHeader(popinHeader, popin, data);

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

  }
}