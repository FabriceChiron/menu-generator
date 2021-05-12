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

const doLogin = (userId, user) => {

  console.log(getUserId());

  if(!getUserId()) {
    window.localStorage.setItem('userId', userId);
    location.reload(); 
  }

  
  document.querySelector('#user-id').innerText = user.name;
  document.querySelector('#user-block').classList.remove('guest');
  if(document.querySelector('#user-management')){
    document.querySelector('#user-management').remove();
  }

  const logoutButton = createElem('button', document.querySelector('#user-block'), {
    class: 'highlight outside symbols logout'
  });
  logoutButton.innerHTML = '<span>Î</span>';

  logoutButton.onclick = () => {
    window.localStorage.removeItem('userId');
    location.reload();
  }

  // fetchAndStart(userId);
}

const login = (userId, password, errorArea, auto) => {

  fetch('data/users.json')
  .then(res => res.json())
  .then(data => {

    let userFound = false;

    data.users.map(user => {
      if(user.userId === userId) {
        console.log('found you!');
        userFound = userId;

        if(user.password === password || auto) {
          doLogin(userId, user);
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
      const registerButton = createElem('button', errorArea, {
        class: 'highlight outside register'
      });

      registerButton.innerText = 'Créer compte';
    }
  })
}


const createUserBlock = (action) => {
  const userManagement = createElem('div', document.querySelector('#header'), {
    id: 'user-management',
    class: 'inside'
  });

  const userContainerBlock = createElem('div', userManagement, {
    class:'user-block'
  });

  createInputBlock('user-id', userContainerBlock);
  createInputBlock('password', userContainerBlock);

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
    login(userContainerBlock.querySelector('#user-id-field').value, userContainerBlock.querySelector('#password-field').value, errorArea);
  }

  const closeButton = createElem('button', buttonsArea, {
    class: 'highlight outside symbols cancel'
  });
  closeButton.innerHTML = '<span>Î</span>';

  closeButton.onclick = () => {
    userManagement.remove();
  }
}

userBlock.querySelector('div').onclick = () => {

  createUserBlock('login');

  
}