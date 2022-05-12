import * as view from "./view.js";
import * as model from "./model.js";
import * as helper from "./helper.js";
import { MAX_COMMENTS, MAX_INTERVAL } from "./config.js";

view.popup.addEventListener("click", function (e) {
  if (e.target.dataset.task === "initUserForm") {
    initUserForm(e);
  }

  if (e.target.dataset.task === "setPropic") {
    model.setPropic(
      view.popup.querySelector(".pop-up__profile-pic").querySelector("img").src
    );
    view.toggleForm();
    model.saveUserState();
  }

  if (e.target.dataset.task === "unsetPropic") {
    showPropic(model.user.gender, model.user.age);
  }

  // if (e.target.dataset.task === "cancelComment") {
  // }

  // if (e.target.dataset.task === "undoCancelComment") {
  // }
});

function checkUser() {
  if (model.user.username) return;
  view.toggleForm();
  view.renderElement(view.popup, view.html.userForm);
}

async function initUserForm(e) {
  const form = e.target.closest("form");

  if (!form.checkValidity()) return;
  e.preventDefault();

  const gender = form[0].checked ? form[0].value : form[1].value;
  const age = +form[2].value;
  const username = form[3].value;

  view.renderElement(view.popup, view.html.userPropic);
  await showPropic(gender, age);
  model.createUser({ username, gender, age });
}

async function showPropic(gender, age) {
  const photo = model.generateFace(gender, age);

  view.renderElement(
    view.popup.querySelector(".pop-up__profile-pic"),
    view.html.spinner
  );
  view.renderElement(
    view.popup.querySelector(".pop-up__profile-pic"),
    `<img src="${await photo}" />`
  );

  return photo;
}

function commentGenerator(num) {
  // GENERA COMMENTI OGNI TOT TEMPO IN SEQUENZA
  let total = 0;
  for (let i = 0; i < num; i++) {
    const n = Math.trunc(Math.random() * MAX_INTERVAL) + 1;
    total += n;
    // console.log(`Comment ${i + 1} printed after ${n}sec`);

    setTimeout(async () => {
      const comment = model.positionComment(await model.generateComment());
      // console.log(comment);
      // console.log(comment[1]);
      console.log(model.comments);

      view.renderComment(comment);
    }, total * 1000);
  }
}

async function init() {
  commentGenerator(MAX_COMMENTS);
  // console.log(model.positionComment(await model.generateComment()));
  checkUser();
}
init();

// ${calcTime(comment.date)}
