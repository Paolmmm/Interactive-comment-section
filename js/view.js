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

export function toggleGeneralForm() {
  [overlay, popup].forEach((el) => el.classList.toggle("hiddenOpacity"));
}

export function renderComment(comment, replyTo, own) {
  const html = `
    <div class="comment${comment[1] ? " comment--reply" : ""}${
    own ? " comment--own" : ""
  }" data-id="${comment[0].id}" data-date="${
    calcTime(comment[0].date).split(" ")[0]
  }" data-likes=${false}>
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

      <p class="comment__username">${comment[0].username}<span>${
    own ? "you" : ""
  }</span></p>
      <p class="comment__date">${calcTime(comment[0].date)}</p>

      ${
        own
          ? `<button class="comment__btn comment__btn--delete">
          <ion-icon name="trash-bin"></ion-icon>
          <span>Delete</span>
        </button>
        <button class="comment__btn comment__btn--edit">
          <ion-icon name="pencil-sharp"></ion-icon>          
          <span>Edit</span>
        </button>`
          : `<button class="comment__btn comment__btn--reply">
          <ion-icon name="arrow-undo-sharp"></ion-icon>
          <span>Reply</span>
        </button>`
      }

      <p class="comment__content">
        <span>${replyTo ? `@${replyTo} ` : ""}</span>${comment[0].comment}
      </p>
    </div>`;

  if (comment[1]) {
    const parent = [...document.querySelectorAll(".comment")].find(
      (el) =>
        el.dataset.id ==
        comment[1][
          comment[1].length > 1 ? comment[1].length - 2 : comment[1].length - 1
        ].id
    );
    parent.insertAdjacentHTML("afterend", html);
  } else {
    container.insertAdjacentHTML("beforeend", html);

    container.lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

export function formSendComment(user) {
  let value;
  if (document.querySelector("#send-comment")) {
    value = document.querySelector("#send-comment").value;

    document.querySelector("#send-comment").closest(".comment").remove();
  }

  const html = `
    <div class="comment comment--add" id="addComment">
    ${
      user.image
        ? `<img
    src="${user.image}"
    alt="profile pic"
    class="comment--add__avatar"
  />`
        : `<ion-icon name="person-sharp" class="comment--add__avatar"></ion-icon>`
    }
      
      <form action="" class="form">
        <textarea
          name="send-comment"
          id="send-comment"
          placeholder="Add a comment..."
          class="form__input"
          rows="3"
          required
        >${value ? value : ""}</textarea>
        <label for="send-comment"
          ><button class="submit-btn submit-btn--send" type="submit">
            SEND
          </button></label
        >
      </form>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", html);
}

export function openCommentForm(user, parent, update) {
  if (document.querySelector(".submit-btn--reply")) {
    document.querySelector(".submit-btn--reply").closest(".comment").remove();
  }

  const html = `
    <div class="comment ${
      update && !parent.classList.contains("comment--reply")
        ? ""
        : "comment--reply"
    } comment--add">
      <img
        src="${user.image}"
        alt="profile pic"
        class="comment--add__avatar"
      />
      <form action="" class="form">
        <textarea
          name="${update ? "update" : "reply"}-comment"
          id="${update ? "update" : "reply"}-comment"
          placeholder="Add a comment..."
          class="form__input"
          rows="3"
          required
        >${
          update
            ? parent.querySelector(".comment__content").innerText.trim()
            : ""
        }</textarea>
        <label for="${update ? "update" : "reply"}-comment"
          ><button class="submit-btn submit-btn--${
            update ? "update" : "reply"
          }" type="submit">
            ${update ? "UPDATE" : "REPLY"}
          </button></label
        >
      </form>
    </div>
  `;

  parent.insertAdjacentHTML("afterend", html);
}

export function findParent(prevSib) {
  if (prevSib.classList.contains("comment--reply")) {
    return findParent(prevSib.previousElementSibling);
  }
  return prevSib;
}

export function removeComment(e) {
  e.target.closest(".comment").remove();
}

export function editComment(comment, content) {
  comment.querySelector(".comment__content").innerText = content;
}

export function editLikes(comment) {
  console.log(comment);
  const currComment = [...document.querySelectorAll(".comment")].find(
    (el) => +el.dataset.id === comment.id
  );

  currComment.querySelector(".comment__likes__value").innerText = comment.likes;
}
