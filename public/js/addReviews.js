function addReviewValidation() {
  const formElement = document.getElementById("daycareReview");
  const one_star = document.getElementById("one_star").checked;
  const two_star = document.getElementById("two_star").checked;
  const three_star = document.getElementById("three_star").checked;
  const four_star = document.getElementById("four_star").checked;
  const five_star = document.getElementById("five_star").checked;

  if (!one_star && !two_star && !three_star && !four_star && !five_star) {
    const checkForPara = document.getElementById("errorMessage");
    if (checkForPara) {
      formElement.removeChild(checkForPara);
    }
    let para = document.createElement("p");
    para.id = "errorMessage";
    let node = document.createTextNode(
      "Must select one of the ratings buttons."
    );
    para.appendChild(node);
    formElement.appendChild(para);
  } else {
    formElement.submit();
  }
}
