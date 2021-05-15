const userBlock = document.querySelector('#user-block');

const getUserId = () => {
  const userId = window.localStorage.getItem('userId');

  return userId;
}

const getUserName = () => {
  const userName = window.localStorage.getItem('userName');

  return userName;
}

const createInputBlock = (field, userLoginBlock, prefill) => {
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

    case 'new-password':
      labelText = 'Nouveau MdP';
      placeHolderText = 'Nouveau mot de passe';
    break;

    case 'confirm-password':
      labelText = 'Confirmer MdP';
      placeHolderText = 'Encore une fois';
    break;

    case 'user-name':
      labelText = 'Nom';
      placeHolderText = 'ex: Prénom Nom';
    break;

    case 'new-user-name':
      labelText = 'Nouveau Nom';
      placeHolderText = 'ex: Prénom Nom';
    break;
    
    case 'user-id':
      labelText = 'Identifiant';
      placeHolderText = 'ex: prenomnom';
    break;
    
    case 'new-user-id':
      labelText = 'Nouveal Identifiant';
      placeHolderText = 'ex: prenomnom';
    break;
  }

  label.innerText = labelText;

  const userField = createElem('input', block, {
    id: `${field}-field`,
    placeholder: `${placeHolderText}`,
    type: `${((field === 'password') || (field === 'confirm-password')) ? 'password' : 'text'}`,
    class: 'outside',
    name: `${field}`,
    autocomplete: `off`,
    value: `${(prefill) ? prefill : ''}`
  });

}

const errorMessage = (message, errorArea) => {
  errorArea.innerText = message;
  errorArea.classList.remove('hidden');
}

const doLogin = (userId, userName) => {

  if(!getUserId()) {
    window.localStorage.setItem('userId', userId);
    location.reload(); 
  }

  if(!getUserName()) {
    window.localStorage.setItem('userName', userName);
  }

  
  document.querySelector('#user-id').innerText = userName;
  document.querySelector('#user-block').classList.remove('guest');
  if(document.querySelector('#user-management')){
    document.querySelector('#user-management').remove();
  }


  const buttonsArea = document.querySelector('#user-block .buttons') || createElem('div', document.querySelector('#user-block'), {
    class: 'buttons'
  });

  buttonsArea.innerHTML = '';

  const editUserButton = createElem('button', buttonsArea, {
    class: 'highlight outside symbols edit-user'
  });
  editUserButton.dataset.text = 'éditer profil';
  
  editUserButton.innerHTML = '?';

  editUserButton.onclick = () => {
    createUserBlock('edit-user');
  }

  const logoutButton = createElem('button', buttonsArea, {
    class: 'highlight outside symbols logout'
  });
  logoutButton.dataset.text = 'déconnexion';
  
  logoutButton.innerHTML = '`';

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
          doRegister(userName.toLowerCase(), userId, password);
        }
      }
    });
  })
}

const editUser = (userName, newUserName, password, newPassword, errorArea) => {
  fetch('data/users.json')
  .then(res => res.json())
  .then(data => {
    const userId = getUserId();

    data.users.map(user => { 
      if(user.userId === getUserId()) {
        
        if(user.name.toLowerCase() !== userName) {
          errorMessage(`Nom incorrect`, errorArea);
        }
        else if(user.password !== password) {
          errorMessage(`Veuillez remplir le bon mot de passe pour enregistrer les modifications`, errorArea);
        }
        else {
          if(newUserName.length > 0) {
            user.name = newUserName.toLowerCase();
            window.localStorage.setItem('userName', newUserName.toLowerCase());
            location.reload();
          }
          if(newPassword.length > 0) {
            user.password = newPassword;
          }

          saveDataToJson(data, 'users');

          doLogin(userId, userName);

          window.location.reload;
        }
      }
    })


  })
}

const login = (userId, password, errorArea, auto) => {

  fetch('data/users.json')
  .then(res => res.json())
  .then(data => {

    let userFound = false;

    data.users.map(user => {
      if(user.userId === userId) {
        userFound = userId;

        if(user.password === password || auto) {
          doLogin(userId, user.name.toLowerCase());
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

  const userContainerBlock = createElem('form', userManagement, {
    class:'user-block',
    autocomplete: 'off'
  });

  const actionTitlesContainer = createElem('div', userContainerBlock, {
    class: 'action-titles-container'
  });

  let loginTitle, registerTitle;

  if(action !== 'edit-user') {
    loginTitle = createElem('h2', actionTitlesContainer);
    loginTitle.innerText = 'Connexion :';

    registerTitle = createElem('h2', actionTitlesContainer);
    registerTitle.innerText = 'Inscription :';
  }

  switch(action) {
    case 'edit-user':
      createInputBlock('user-name', userContainerBlock, getUserName());
      createInputBlock('new-user-name', userContainerBlock);

      createInputBlock('password', userContainerBlock);
      createInputBlock('new-password', userContainerBlock);
    break;

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
      createInputBlock('user-id', userContainerBlock, userId);
      createInputBlock('user-name', userContainerBlock);
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

  const submitButtonHolder = createElem('div', buttonsArea, {
    class: 'button-holder'
  });
  submitButtonHolder.innerHTML = '<span>Valider</span>'

  const submitButton = createElem('button', submitButtonHolder, {
    class: 'highlight outside symbols submit'
  }, 'prepend');

  submitButton.innerHTML = '<span>õ</span>';

  submitButtonHolder.onclick = () => {
    if(action === 'edit-user') {
      editUser(
        userContainerBlock.querySelector('#user-name-field').value, 
        userContainerBlock.querySelector('#new-user-name-field').value, 
        userContainerBlock.querySelector('#password-field').value, 
        userContainerBlock.querySelector('#new-password-field').value,
        errorArea);
    }
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

  const closeButtonHolder = createElem('div', buttonsArea, {
    class: 'button-holder'
  });
  closeButtonHolder.innerHTML = '<span>Fermer</span>'

  const closeButton = createElem('button', closeButtonHolder, {
    class: 'highlight outside symbols cancel'
  }, 'prepend');
  closeButton.innerHTML = '<span>Î</span>';

  closeButtonHolder.onclick = () => {
    userManagement.remove();
  }
}

userBlock.querySelector('div').onclick = () => {

  if(userBlock.nextElementSibling === getUserId()) {
    createUserBlock('login');
  }
  
}