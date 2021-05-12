const userBlock = document.querySelector('#user-block');

const getUserId = () => {
  const userId = window.localStorage.getItem('userId');

  return userId;
}

const createInputBlock = (field, userLoginBlock, userId) => {
  const block = createElem('div', userLoginBlock, {
    class: 'block'
  });
  const label = createElem('label', block, {
    for: `${field}-field`
  });

  let labelText = '';
  let placeHolderText = '';

  switch(field) {
    case 'password':
      labelText = 'Mot de passe';
      placeHolderText = 'Entrer mot de passe';
    break;

    case 'confirm-password':
      labelText = 'Confirmer MdP';
      placeHolderText = 'Encore une fois';
    break;

    case 'user-name':
      labelText = 'Nom';
      placeHolderText = 'ex: Prénom Nom';
    break;
    
    case 'user-id':
      labelText = 'Identifiant';
      placeHolderText = 'ex: prenomnom';
    break;
  }

  label.innerText = labelText;

  const userField = createElem('input', block, {
    id: `${field}-field`,
    placeholder: `${placeHolderText}`,
    type: `${((field === 'password') || (field === 'confirm-password')) ? 'password' : 'text'}`,
    class: 'outside',
    value: `${(userId) ? userId : ''}`
  });

}

const errorMessage = (message, errorArea) => {
  errorArea.innerText = message;
  errorArea.classList.remove('hidden');
}

const doLogin = (userId, userName) => {

  console.log(getUserId());

  if(!getUserId()) {
    window.localStorage.setItem('userId', userId);
    location.reload(); 
  }

  
  document.querySelector('#user-id').innerText = userName;
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

const doRegister = (userName, userId, password) => {
  fetch('data/users.json')
  .then(res => res.json())
  .then(data => {
    const newUser = {
      "name": userName,
      "userId": userId,
      "password": password      
    }

    data.users.push(newUser);

    saveDataToJson(data, 'users');

    doLogin(userId, userName); 
  })

  // saveDataToJson(
}

const register = (userName, userId, password, confirmPassword, errorArea, auto) => {

  fetch('data/users.json')
  .then(res => res.json())
  .then(data => {
    let userFound = false;

    data.users.map(user => {
      if(user.userId === userId) {
        errorMessage(`${userId} existe déjà`, errorArea);
      }
      else {
        console.log({
          password: password,
          passwordLength: password.length,
          userName: userName,
          userNameLength: userName.length
        });

        if(userName.length === 0) {
          errorMessage(`Veuillez entrer votre nom`, errorArea);
        }
        else if(userId.length === 0) {
          errorMessage(`Veuillez entrer un identifiant`, errorArea);
        }
        else if(password.length === 0) {
          errorMessage(`Veuillez entrer un mot de passe`, errorArea);
        }
        else if(confirmPassword.length === 0) {
          errorMessage(`Veuillez confirmer mot de passe`, errorArea);
        }
        else if(confirmPassword !== password) {
          errorMessage(`Le mot de passe et sa confirmation doivent être identiques`, errorArea);
        }

        else {
          doRegister(userName, userId, password);
        }
      }
    });
  })
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
          doLogin(userId, user.name);
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
      registerButton.onclick = () => {
        document.querySelector('#user-management').remove();
        createUserBlock('register', userId);
      }
    }
  })
}


const createUserBlock = (action, userId) => {

  const userManagement = createElem('div', document.querySelector('#header'), {
    id: 'user-management',
    class: 'inside'
  });

  const userContainerBlock = createElem('div', userManagement, {
    class:'user-block'
  });

  const actionTitlesContainer = createElem('div', userContainerBlock, {
    class: 'action-titles-container'
  });

  const loginTitle = createElem('h2', actionTitlesContainer);
  loginTitle.innerText = 'Connexion :';

  const registerTitle = createElem('h2', actionTitlesContainer);
  registerTitle.innerText = 'Inscription :';

  switch(action) {
    case 'login':
      // createElem('h2', userContainerBlock).innerText = 'Connexion :';
      createInputBlock('user-id', userContainerBlock);
      createInputBlock('password', userContainerBlock);
      
      setAttributes(loginTitle, {
        class: 'inside highlight'
      });
      
      setAttributes(registerTitle, {
        class: 'outside'
      });
      registerTitle.onclick = () => {
        document.querySelector('#user-management').remove();
        createUserBlock('register', userId);
      }
    break;

    case 'register':
      // createElem('h2', userContainerBlock).innerText = 'Inscription :';
      createInputBlock('user-name', userContainerBlock);
      createInputBlock('user-id', userContainerBlock, userId);
      createInputBlock('password', userContainerBlock);
      createInputBlock('confirm-password', userContainerBlock);
      
      setAttributes(registerTitle, {
        class: 'inside highlight'
      });

      setAttributes(loginTitle, {
        class: 'outside'
      });
      loginTitle.onclick = () => {
        document.querySelector('#user-management').remove();
        createUserBlock('login', userId);
      }
    break;
  }


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
    if(action === 'login') {
      login(
        userContainerBlock.querySelector('#user-id-field').value, 
        userContainerBlock.querySelector('#password-field').value, 
        errorArea);
    }
    if(action === 'register') {
      register(
        userContainerBlock.querySelector('#user-name-field').value, 
        userContainerBlock.querySelector('#user-id-field').value, 
        userContainerBlock.querySelector('#password-field').value, 
        userContainerBlock.querySelector('#confirm-password-field').value, 
        errorArea);
    }
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