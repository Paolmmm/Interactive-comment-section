import { calcTime } from "./helper.js";

export const overlay = document.querySelector(".overlay");
export const popup = document.querySelector(".pop-up");
export const container = document.querySelector(".container");

export const html = {
  spinner: `<ion-icon name="reload-sharp"></ion-icon>`,
  userForm: `
  <h2>Who are you ?</h2>
  <form action="" class="pop-up__form">
    <legend>Select your gender:</legend>
    <div class="male">
      <input type="radio" name="gender" id="male" value="male" checked />
      <label for="male">male</label>
    </div>
    <div class="female">
      <input type="radio" name="gender" id="female" value="female" />
      <label for="female">female</label>
    </div>

    <input
      type="number"
      name="age"
      id="age"
      maxlength="2"
      min="5"
      max="85"
      placeholder="26"
      required
    />
    <label for="age">Select your age:</label>

    <input
      type="text"
      name="name"
      id="name"
      placeholder="John Doe"
      required
    />
    <label for="name">Write your username:</label>

    <button type="submit" class="pop-up__btn pop-up__form__init-btn" data-task="initUserForm">
      next
    </button>
  </form>`,
  userPropic: `
  <h2>Here's your avatar</h2>
  <div class="pop-up__profile-pic">
  </div>
    <button class="pop-up__btn pop-up__btn--accept" data-task="setPropic">
      fine
    </button>
    <button class="pop-up__btn pop-up__btn--cancel " data-task="unsetPropic">
      Please no
    </button>
  </div>`,
};

export function renderElement(parent, html) {
  parent.innerHTML = "";
  parent.insertAdjacentHTML("beforeend", html);
}

export function toggleForm() {
  [overlay, popup].forEach((el) => el.classList.toggle("hiddenOpacity"));
}

// RENDER CONTAINER
// parametri (comment, own?)
// parent: se comment, container (beforeend); se reply, elemento precedente (afterend?)
// OPPURE da comment (obj) vediamo se ha o no replies e da li deduciamo parent

export function renderComment(comment) {
  console.log("STAI PROVANDO A RENDERIZZARE UN: ");

  const html = `
    <div class="comment${comment[1] ? " comment--reply" : ""}" data-id="${
    comment[0].id
  }">
      <div class="comment__likes">
        <button class="comment__likes__btn comment__likes__btn--up">+</button>
        <p class="comment__likes__value">${comment[0].likes}</p>
        <button class="comment__likes__btn comment__likes__btn--down">
          &ndash;
        </button>
      </div>

      <div class="comment__img">
        ${
          comment[0].image
            ? `<img src="${comment[0].image}" alt="profile pic" class="comment__avatar" />`
            : `<ion-icon name="person-sharp"></ion-icon>`
        }
      </div>

      <p class="comment__username">${comment[0].username}</p>
      <p class="comment__date">some placeholder ago</p>
      <button class="comment__btn comment__btn--reply">
        <ion-icon name="arrow-undo-sharp"></ion-icon>
        <span>Reply</span>
      </button>
      <p class="comment__content">
        ${comment[0].comment}
      </p>
    </div>`;

  if (comment[1]) {
    console.log("REPLY");

    const parent = [...document.querySelectorAll(".comment")].find(
      (el) =>
        el.dataset.id ==
        comment[1][
          comment[1].length > 1 ? comment[1].length - 2 : comment[1].length - 1
        ].id
    );
    console.log(parent);
    parent.insertAdjacentHTML("afterend", html);
  } else {
    console.log("COMMENTO");

    container.insertAdjacentHTML("beforeend", html);
  }
}
