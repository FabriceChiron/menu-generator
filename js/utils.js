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

const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
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
  let i, sum=0, r=Math.random();
  for (i in prob) {
    sum += prob[i];
    if (r <= sum) return i;
  }
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