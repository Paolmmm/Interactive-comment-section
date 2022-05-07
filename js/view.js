// DA USARE CON PARCEL (RICORDA ALLE IMGS SVG DI SOSTITUIRE src="..." con src="${iconEdit}")
// import iconEdit from "url:../images/icon-edit.svg";
// import iconDelete from "url:../images/icon-delete.svg";
// import iconReply from "url:../images/icon-reply.svg";

const container = document.querySelector(".container");
const overlay = document.querySelector(".overlay");
const popUpChoice = document.querySelector(".pop-up--choice");
const popUpProfile = document.querySelector(".pop-up--profile");
const profilePicBox = document.querySelector(".pop-up__profile-pic");
const addComment = document.querySelector("#addComment");

export function showInitForm() {
  container.classList.add("hiddenDisplay");
  overlay.classList.remove("hiddenOpacity");
  popUpChoice.classList.remove("hiddenOpacity");
}

export function changePopup() {
  popUpChoice.classList.add("hiddenOpacity");
  popUpProfile.classList.remove("hiddenOpacity");
}

export function closeInitForm() {
  container.classList.remove("hiddenDisplay");
  overlay.classList.add("hiddenOpacity");
  popUpProfile.classList.add("hiddenOpacity");
}

export async function initCurrentUserPic(gender, age) {
  try {
    profilePicBox.innerHTML = "";
    let html = `
      <svg>
        <use href="images/icons.svg#icon-loader"></use>
      </svg>`;
    profilePicBox.insertAdjacentHTML("afterbegin", html);

    const data = await generatePhoto(gender, age);
    console.log(data);

    profilePicBox.innerHTML = "";
    html = `
      <img src="${data.image_url}" alt="profile pic" class="pop-up__profile-pic__img" />
      `;
    profilePicBox.insertAdjacentHTML("afterbegin", html);

    return data.image_url;
  } catch (err) {
    console.error(err);
  }
}

export async function generatePhoto(gender, age) {
  try {
    const res = await fetch(
      `https://fakeface.rest/face/json?gender=${gender}&maximum_age=${
        +age + 5
      }&minimum_age=${+age - 5}`
    );

    if (!res.ok) {
      return { image_url: "images/person.svg" };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`here ur error: ${err}`);
  }
}

// PROVVISORIA
export function renderSubmitBtns(btns, username, image) {
  btns.forEach((btn) => {
    btn.closest(".comment").querySelector("img").src = image;
    if (btn.closest(".comment").querySelector(".comment__username")) {
      btn.closest(".comment").querySelector(".comment__username").textContent =
        username;
    }
  });
}

export function renderComment(type, comment, own = false) {
  let html;

  if (type === "send") {
    html = `
    <div class="comment comment--own">
      <div class="comment__likes">
        <button class="comment__likes__btn comment__likes__btn--up">+</button>
        <p class="comment__likes__value">${comment.likes}</p>
        <button class="comment__likes__btn comment__likes__btn--down">
          &ndash;
        </button>
      </div>
      <img
        src="${comment.image}"
        alt="profile pic"
        class="comment__avatar"
      />
      <p class="comment__username">
        ${comment.username} ${
      own ? `<span class="comment__tag">you</span>` : ``
    }
      </p>
      <p class="comment__date">${comment.date} minutes ago</p>
      <button class="comment__btn comment__btn--delete">
        <img
          src="images/icon-delete.svg"
          alt="delete btn"
          class="comment__btn__icon"
        />
        <span>Delete</span>
      </button>
      <button class="comment__btn comment__btn--edit">
        <img
          src="images/icon-edit.svg"
          alt="edit btn"
          class="comment__btn__icon"
        />
        <span>Edit</span>
      </button>
      <p class="comment__content">
        ${comment.content}
      </p>
    </div>`;
    container.insertAdjacentHTML("beforeend", html);
    addComment.querySelector(".form__input").value = "";
    container.appendChild(addComment);
  }

  if (type === "reply") {
    html = `
    <div class="comment comment--reply">
        <div class="comment__likes">
          <button class="comment__likes__btn comment__likes__btn--up">+</button>
          <p class="comment__likes__value">${comment.likes}</p>
          <button class="comment__likes__btn comment__likes__btn--down">
            &ndash;
          </button>
        </div>
        <img
          src="${comment.image}"
          alt="profile pic"
          class="comment__avatar"
        />
        <p class="comment__username">${comment.username} ${
      own ? `<span class="comment__tag">you</span>` : ``
    }</p>
        <p class="comment__date">${comment.date} month ago</p>
        <button class="comment__btn comment__btn--reply">
          <img
            src="images/icon-reply.svg"
            alt="reply btn"
            class="comment__btn__icon"
          />
          <span>Reply</span>
        </button>
        <p class="comment__content">
        ${comment.content}
        </p>
      </div>`;
    container.insertAdjacentHTML("beforeend", html);
    addComment.querySelector(".form__input").value = "";
    container.appendChild(addComment);
  }
}
