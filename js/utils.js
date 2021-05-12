const fetchAndStart = (userId) => {

  if(userId && !fileExists(`data/${userId}.json`)) {
    copyJsonFile('menus', userId);
  }

  const jsonFile = `data/${(userId) ? userId : 'menus'}.json`;

  console.log('jsonFile', jsonFile);

  fetch(jsonFile)
  .then(res => res.json())
  .then(data => {

    menus = reassignCategories({...data.menus});
    generateWeek(data, mealsPerDay);

    editMenusButton.parentElement.onclick = () => {
      editMenus(data);
    }

    resetButton.onclick = () => {

      if(startingDate) {
        mealsPerDay = {};
        alreadyAssignedMeals = [];
        // structureToCreate = true;
        generateWeek(data, mealsPerDay);
        generatePage(startingDate[0], startingDate[1], startingDate[2], data);
      }
    }

    thatDay.onchange = () => {
      if(thatDay.value !== null) {
        startOnNext.value = '';

        let [year, month, day] = thatDay.value.split('-');

        generatePage(parseInt(year), parseInt(month) - 1, parseInt(day), data);
      }
    }

    startOnNext.onchange = () => {
      if(startOnNext.value !== '') {
        thatDay.value = null;

        getNextDayOfTheWeek(startOnNext.value, false);
        
        let [day, month, year] = getNextDayOfTheWeek(startOnNext.value, false).split('/');

        generatePage(parseInt(year), parseInt(month) - 1, parseInt(day), data);
      }
    }
  });
}

const fileExists = (url) => {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

const saveDataToJson = (data) => {
  var json_data = data;
  
  console.log('json_data', json_data);
  console.log('JSON.stringify(json_data)', JSON.stringify(json_data));

  $.ajax({
    type : "POST",
    url : "data/save.php",
    contentType: "application/json",
    data : JSON.stringify(json_data),
    success: function (data){
      console.log('data', data);
      console.log("Saved!");
    },
    done: function (data) {
      console.log('done');
      console.log(data);
    },
    fail: function (data) {
      console.log('fail');
      console.log(data);
    }
  });

}

const createElem = (el, ctnr, attrs, where) => {
  const element = document.createElement(el);
  if(attrs) {
    setAttributes(element, attrs);
  }
  if(ctnr) {
    if(where && where === 'prepend') {
      ctnr.prepend(element);
    } else {
      ctnr.append(element);
    }
  }
  return element;
}

const setAttributes = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const getCategoryTitleText = {
  tarts: "tartes",
  pasta: "pâtes",
  family: "plats familiaux",
  rice: "riz",
  exotic: "exotique",
  tortillas: "plats à base d'oeuf",
  veggies: "légumes",
  meat: "viandes",
  fish: "poissons",
  extras: "extras" 
}

const getMealText = {
  lunch: "Déjeuner",
  dinner: "Dîner"
}

const matchDayOfWeek = [
  {
    id: "sun",
    name: "dimanche"
  },
  {
    id: "mon",
    name: "lundi"
  },
  {
    id: "tue",
    name: "mardi"
  },
  {
    id: "wed",
    name: "mercredi"
  },
  {
    id: "thu",
    name: "jeudi"
  },
  {
    id: "fri",
    name: "vendredi"
  },
  {
    id: "sat",
    name: "samedi"
  }
];

const arrayDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const objectMeals = {
  lunch: 'Déjeuner',
  dinner: 'Dîner'
}

const arrayMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'November', 'Décembre'];

const weightedRandom = (prob) => {
  let key, total = 0;

  for(key in prob) {
    total += prob[key];
  }

  let i, sum=0, r=Math.random();
  for (i in prob) {
    sum += prob[i]/total;
    if (r <= sum) {
      return i;
    }
  }
}

const getNextDayOfTheWeek = (dayName, excludeToday = true, refDate = new Date()) => {
    const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
                      .indexOf(dayName.slice(0,3).toLowerCase());
    if (dayOfWeek < 0) return;
    refDate.setHours(0,0,0,0);
    refDate.setDate(refDate.getDate() + +!!excludeToday + 
                    (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
    return refDate.toLocaleDateString('fr-FR');
}