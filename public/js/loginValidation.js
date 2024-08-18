const form = document.getElementById('login-form');
const email = document.getElementById('emailAddressInput');
const password = document.getElementById('passwordInput');

form.addEventListener('submit', e => {
  e.preventDefault();
  if (validateInputs()) {
    form.submit();
  }

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
  let valid = true;
  const emailVal = email.value.trim();
  const passwordVal = password.value.trim();

  if(emailVal === '') {
    setError(email,'Email is required');
    valid = false;
  } else if(!checkEmail(emailVal)) {
    setError(email, 'Invalid email format');
    valid = false;
  } else {
    setSuccess(email);
  }

  if(passwordVal === '') {
    setError(password,'Password is required');
    valid = false
  } else if(!checkPassword(passwordVal)) {
    setError(password, 'Invalid password,should include 8 characters, one special and one uppercase');
    valid = false;
  } else {
    setSuccess(email);
  }

  return valid;
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

function checkPassword(val) {
  if (!val) return false;
  if (typeof val !== "string") return false;
  val = val.trim();
  if (val.length === 0) {
    return false;
  }
  if (val.length < 8) {
    return false
  }
  // Other types of checks
  if (!/[A-Z]/.test(val)) {
    return false;
  }
  if (!/[0-9]/.test(val)) {
    return false;
  }
  if (!/[^a-zA-Z0-9]/.test(val)) {
    return false;
  }
  return true;
}