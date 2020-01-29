const isEmpty = str => {
  if (str.trim() === "") return true;
  return false;
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  return false;
};

exports.validateSignupData = (data) => {
  const errors = {};
  //validate email
  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email adress";
  }
  //validate password

  if (isEmpty(data.password)) {
    errors.password = "Must not be empty";
  }else if (data.password.length < 6){
    errors.password = "Your password must be at least 6 charters";
  }else if (data.password.length > 12){
    errors.password = "Your password must be not more 12 charters";
  }else if (data.password.search(/[a-z]/i) < 0){
    errors.password = "Your password must at least one letters";
  }

  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "Must not be empty";
  }else if (data.password !== data.confirmPassword){
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(data.handle)) errors.handle = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.loginValidateData = (user) => {
  const errors = {};
  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.reduceUserDetails = data => {
  let userDetails = {}

  if(!isEmpty((data.bio).trim())) userDetails.bio = data.bio

  if(!isEmpty(data.linkedIn.trim())) {
    if(data.linkedIn.trim().substring(0, 4) !== 'http'){
      userDetails.linkedIn = `http://${data.linkedIn}`
    } else userDetails.linkedIn = data.linkedIn
  }
  
  if(!isEmpty(data.gitHub.trim())) {
    if(data.gitHub.trim().substring(0, 4) !== 'http'){
      userDetails.gitHub = `http://${data.gitHub}`
    } else userDetails.gitHub = data.gitHub
  }
  if(!isEmpty(data.location.trim())){
    userDetails.location = data.location
  }
  return userDetails
}
