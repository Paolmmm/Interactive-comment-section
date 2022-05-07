import * as view from "./view.js";
import * as model from "./model.js";
import * as helper from "./helper.js";
// DA USARE CON PARCEL
// import "core-js/stable";
// import "regenerator-runtime/runtime";

const submitBtns = document.querySelectorAll(".submit-btn");
const popUpBtnAccept = document.querySelector(".pop-up__btn--accept");
const popUpBtnRetry = document.querySelector(".pop-up__btn--retry");
const popUpForm = document.querySelector(".pop-up__form");

console.log(submitBtns);

function checkCurrentUser() {
  if (model.users.currentUser) {
    view.renderSubmitBtns(
      submitBtns,
      model.users.currentUser.username,
      model.users.currentUser.image
    );
    return;
  }

  view.showInitForm();
  popUpForm.addEventListener("submit", createCurrentUser.bind(this));
}

function createCurrentUser(e) {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) return;

  const gender = form[0].checked ? form[0].value : form[1].value;
  const age = form[2].value;
  const username = form[3].value;

  view.initCurrentUserPic(gender, age);
  view.changePopup();

  popUpBtnRetry.addEventListener(
    "click",
    view.initCurrentUserPic.bind(this, gender, age)
  );

  popUpBtnAccept.addEventListener("click", function () {
    model.users.currentUser = {
      username: username,
      image: document.querySelector(".pop-up__profile-pic__img").src,
    };

    view.closeInitForm();
    view.renderSubmitBtns(
      submitBtns,
      model.users.currentUser.username,
      model.users.currentUser.image
    );
  });
}

submitBtns.forEach((btn) => btn.addEventListener("click", submitForm));

function submitForm(e) {
  e.preventDefault();

  // controlla value textarea
  const text = e.target.closest("form").querySelector("textarea").value;
  if (!text) return;

  // prendi valore btn
  const type = e.target.classList.item(1).split("--").at(-1);

  view.renderComment(type, text);
}

function init() {
  checkCurrentUser();
  generateComments(helper.randomNum(4, 8));
}
init();

// Generare un numero casuale di commenti e di replies
// tra 4 e 8 commenti
// almeno la metà dei commenti deve avere almeno un reply
// la metà dei replies dev'essere costituita da 3 replies

// ogni commento è costituito da username, image, content, likes, date

// un timer deve aggiungere e rimuovere commenti ogni tot (tempo variable)

async function generateComments(comments) {
  try {
    const data = await model.fakerAPI(comments);
    const persons = await model.fakerAPIPerson(data.length);

    model.users.comments.forEach((el, i) => {
      setTimeout(async () => {
        el.image = (
          await view.generatePhoto(el.gender, helper.calcAge(el.birthday))
        ).image_url;

        el.date = helper.calcAge(el.date);

        view.renderComment(
          Math.random() * 11 > 5 && i !== 0 ? "reply" : "send",
          el
        );
      }, i * 1000);
    });

    console.log(model.users);
  } catch (err) {
    console.error(err);
  }
}
