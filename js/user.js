const userBlock = document.querySelector('#user-block');

const getUserId = () => {
  const userId = window.localStorage.getItem('userId');

  return userId;
}

const createInputBlock = (field, userLoginBlock) => {
  const block = createElem('div', userLoginBlock, {
    class: 'block'
  });
  const label = createElem('label', block, {
    for: `${field}-field`
  });
  label.innerText = `${(field === 'password') ? 'Mot de passe :' : 'Identifiant :'}`

  const userField = createElem('input', block, {
    id: `${field}-field`,
    type: `${(field === 'password') ? 'password' : 'text'}`,
    class: 'outside'
  });

}

const errorMessage = (message, errorArea) => {
  errorArea.innerText = message;
  errorArea.classList.remove('hidden');
}

const doLogin = (userId, user, fetchAndStart) => {
  console.log('yo');
  window.localStorage.setItem('userId', userId);
  
  document.querySelector('#user-id').innerText = user.name;
  
  if(document.querySelector('#user-management')){
    document.querySelector('#user-management').remove();
  }

  fetchAndStart(userId);
}

const login = (userId, password, errorArea, auto, fetchAndStart) => {

  if(fetchAndStart){
    console.log(fetchAndStart);
  }

  fetch('data/users.json')
  .then(res => res.json())
  .then(data => {

    let userFound = false;

    data.users.map(user => {
      if(user.userId === userId) {
        console.log('found you!');
        userFound = userId;

        if(user.password === password || auto) {
          doLogin(userId, user, fetchAndStart);
          if(errorArea) {
            errorArea.innerHTML = '';
            errorArea.classList.remove('hidden');
          }
        }

        else {
          errorMessage(`Mauvais mot de passe pour ${userId}`, errorArea);
        }
      }
    });

    if(userFound === false) {
      errorMessage(`L'identifiant n'existe pas`, errorArea);
    }
  })
}

userBlock.onclick = () => {

  console.log('clicked');

  const userManagement = createElem('div', document.querySelector('#header'), {
    id: 'user-management',
    class: 'inside'
  });

  const userLoginBlock = createElem('div', userManagement, {
    class:'user-login-block'
  });

  createInputBlock('user-id', userLoginBlock);
  createInputBlock('password', userLoginBlock);

  const errorArea = createElem('div', userManagement, {
    id: 'error-message'
  });

  const buttonsArea = createElem('div', userManagement, {
    class: 'buttons'
  });

  const submitButton = createElem('button', buttonsArea, {
    class: 'highlight outside symbols submit'
  });
  submitButton.innerHTML = '<span>õ</span>';

  submitButton.onclick = () => {
    login(userLoginBlock.querySelector('#user-id-field').value, userLoginBlock.querySelector('#password-field').value, errorArea);
  }

  const closeButton = createElem('button', buttonsArea, {
    class: 'highlight outside symbols cancel'
  });
  closeButton.innerHTML = '<span>Î</span>';

  closeButton.onclick = () => {
    userManagement.remove();
  }
}