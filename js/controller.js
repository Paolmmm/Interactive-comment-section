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
    view.formSendComment(model.user);
    view.toggleGeneralForm();
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

view.container.addEventListener("click", function (e) {
  if (!e.target.closest("button")) return;

  if (e.target.classList.contains("submit-btn")) {
    if (!e.target.closest("form").checkValidity()) return;
    e.preventDefault();
  }

  if (e.target.classList.contains("submit-btn--send")) {
    const comment = {
      username: model.user.username,
      comment: document.querySelector("#send-comment").value,
      id: model.calcID(),
      image: model.user.image,
      likes: 0,
      date: new Date(),
    };

    view.renderComment(
      model.positionOwnComment(
        comment,
        [...e.target.classList].at(-1).split("--").at(-1)
      ),
      false,
      true
    );

    document.querySelector("#send-comment").value = "";
    view.formSendComment(model.user);

    console.log(model.comments);
  }

  if (e.target.closest("button").classList.contains("comment__btn--reply")) {
    const parent = e.target.closest(".comment");

    view.openCommentForm(model.user, parent);
  }

  if (e.target.classList.contains("submit-btn--reply")) {
    const comment = [
      {
        username: model.user.username,
        comment: document.querySelector("#reply-comment").value,
        id: model.calcID(),
        image: model.user.image,
        likes: 0,
        date: new Date(),
      },
    ];

    const parent = document
      .querySelector(".submit-btn--reply")
      .closest(".comment");

    const prevElUsername =
      parent.previousElementSibling.querySelector(
        ".comment__username"
      ).innerText;

    view.renderComment(
      model.positionOwnComment(
        comment[0],
        [...e.target.classList].at(-1).split("--").at(-1),
        view.findParent(parent.previousElementSibling).dataset.id
      ),
      parent.previousElementSibling.classList.contains("comment--reply")
        ? prevElUsername
        : "",
      true
    );

    document.querySelector(".submit-btn--reply").closest(".comment").remove();
  }

  if (e.target.closest("button").classList.contains("comment__btn--delete")) {
    const id = +e.target.closest(".comment").dataset.id;
    const parentID = +view.findParent(e.target.closest(".comment")).dataset.id;

    model.deleteComment(id, parentID);
    view.removeComment(e);
  }

  if (e.target.closest("button").classList.contains("comment__btn--edit")) {
    console.log(e.target.closest("button"));

    const comment = e.target.closest(".comment");
    console.log(comment);
    comment.classList.add("hiddenDisplay");

    view.openCommentForm(model.user, comment, true);
  }

  if (e.target.classList.contains("submit-btn--update")) {
    const form = e.target.closest(".comment");
    const comment = document.querySelector(".hiddenDisplay");
    const content = form.querySelector("textarea").value.trim();

    const parentID = +view.findParent(comment).dataset.id;
    const id = +comment.dataset.id;

    console.log(form, comment, content, parentID, id);

    model.editComment(id, parentID, content);

    view.editComment(comment, content);
    comment.classList.remove("hiddenDisplay");
    form.remove();

    // RIPULISCI E ORGANIZZA
    // CORREGGI SPAN TEXT BOLD
  }

  if (e.target.classList.contains("comment__likes__btn")) {
    const comment = e.target.closest(".comment");

    if (
      e.target.classList.contains("comment__likes__btn--up") &&
      comment.dataset.likes === "false"
    ) {
      if (comment.classList.contains("comment--reply")) {
        const parent = view.findParent(comment);
        view.editLikes(
          model.addRemoveLikes("add", +comment.dataset.id, +parent.dataset.id)
        );
      } else {
        view.editLikes(model.addRemoveLikes("add", +comment.dataset.id));
      }

      comment.dataset.likes = "true";
    }

    if (
      e.target.classList.contains("comment__likes__btn--down") &&
      comment.dataset.likes === "true"
    ) {
      if (comment.classList.contains("comment--reply")) {
        const parent = view.findParent(comment);
        view.editLikes(
          model.addRemoveLikes(
            "remove",
            +comment.dataset.id,
            +parent.dataset.id
          )
        );
      } else {
        view.editLikes(model.addRemoveLikes("remove", +comment.dataset.id));
      }

      comment.dataset.likes = "false";
      // model.addRemoveLikes(+comment.dataset.id);
    }
  }
});

function checkUser() {
  if (model.user.username) return;
  view.toggleGeneralForm();
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

      // FEATURE TEMPO

      view.renderComment(comment);
      view.formSendComment(model.user);
      likesGenerator(model.countComments());
    }, total * 1000);
  }
}

function likesGenerator(total) {
  view.editLikes(model.editLikes(total));
  console.log(model.comments);
}

async function init() {
  commentGenerator(MAX_COMMENTS);
  checkUser();
}
init();

// FEATURES IN ORDINE D'URGENZA
// -ripulisci codice
// -genera nuova chat
// -genera nuovo user
// -orario inserimento commento -> v1.0
