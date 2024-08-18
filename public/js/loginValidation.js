const form = document.getElementById('login-form');
const email = document.getElementById('emailAddressInput');
const password = document.getElementById('passwordInput');

form.addEventListener('submit', e => {
  e.preventDefault();
  validateInputs();

});

const setError = (element,message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');
  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success');
}

const setSuccess = element => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
}

const validateInputs = () => {
  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();

  if(emailVal === '') {
    setError(email,'Email is required');
  } else if(!checkEmail(emailVal)) {
    setError(email, 'Invalid email,should include @ character and end with .com');
  } else {
    setSuccess(email);
  }

  if(passwordVal === '') {
    setError(password,'Password is required');
  } else if(!isValidPassword(passwordVal)) {
    setError(password, 'Invalid password,should include 8 characters, one special and one uppercase');
  } else {
    setSuccess(email);
  }
};

function checkEmail(email) {
  const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  email = email.trim();
  return emailForm.test(email);
}

function isValidPassword(input) {
  let re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':",.<>?/\\|`~]).{8,}$/;
  return re.test(input);
}