const userBlock = document.querySelector('#user-block');

const getUserId = () => {
  const userId = window.localStorage.getItem('userId');
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

userBlock.onclick = () => {

  const userManagement = createElem('div', document.querySelector('#header'), {
    id: 'user-management',
    class: 'inside'
  });

  const userLoginBlock = createElem('div', userManagement, {
    class:'user-login-block'
  });

  createInputBlock('user-id', userLoginBlock);
  createInputBlock('password', userLoginBlock);

}