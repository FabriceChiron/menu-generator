const createElem = (el, ctnr, attrs, where) => {
  const element = document.createElement(el);
  if(attrs) {
    setAttributes(element, attrs);
  }
  if(where && where === 'prepend') {
    ctnr.prepend(element);
  } else {
    ctnr.append(element);
  }
  return element;
}

const setAttributes = (el, attrs) => {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

const createDayContainer = (container, weekDate) => { 
  const dayContainer = createElem('div', container, {
    class: "day inside"
  });

  const dateContainer = createElem('h2', dayContainer);

  dateContainer.innerHTML = `${weekDate.dayName} ${weekDate.day} ${weekDate.month}`;
}

const matchDayOfWeek = [
  {
    id: "sun",
    name: "Dimanche"
  },
  {
    id: "mon",
    name: "Lundi"
  },
  {
    id: "tue",
    name: "Mardi"
  },
  {
    id: "wed",
    name: "Mercredi"
  },
  {
    id: "thu",
    name: "Jeudi"
  },
  {
    id: "fri",
    name: "Vendredi"
  },
  {
    id: "sat",
    name: "Samedi"
  }
];

const arrayDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

const arrayMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'November', 'Décembre'];

const createWeek = (year, month, day) => {
  const arrayWeek = [];

  for (var i = 0; i < 7; i++) {
    const thisDay = new Date(year, month,  day + i)
    arrayWeek[i] = {
      fullDate: thisDay.toLocaleDateString('fr-FR'),
      dayName: matchDayOfWeek[thisDay.getDay()].name,
      day: parseInt(thisDay.toLocaleDateString('fr-FR').split('/')[0]),
      month: arrayMonths[thisDay.getMonth()]
    }
  }

  console.log(arrayWeek);

  return arrayWeek;
}

const getNextDayOfTheWeek = (dayName, excludeToday = true, refDate = new Date()) => {
    const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
                      .indexOf(dayName.slice(0,3).toLowerCase());
    if (dayOfWeek < 0) return;
    refDate.setHours(0,0,0,0);
    refDate.setDate(refDate.getDate() + +!!excludeToday + 
                    (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
    // console.log(refDate.toLocaleDateString('fr-FR'));
    return refDate.toLocaleDateString('fr-FR');
}

console.log("Next is: " + getNextDayOfTheWeek("Wednesday", false));