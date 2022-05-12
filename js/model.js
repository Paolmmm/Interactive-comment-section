import { MAX_AGE, MIN_AGE } from "./config.js";
import { calcNum, today } from "./helper.js";

export let user = {};
export const comments = [];

export async function generateFace(gender, age) {
  try {
    let newAge = age;
    if (age > MAX_AGE) newAge = MAX_AGE;
    if (age < MIN_AGE) newAge = MIN_AGE;

    const res = await fetch(
      `https://fakeface.rest/face/json?gender=${gender}&minimum_age=${
        newAge - 1
      }&maximum_age=${newAge + 1}`
    );
    const data = await res.json();
    return data.image_url;
  } catch (err) {
    console.error(err);
  }
}

export async function generateComment() {
  try {
    const res =
      await fetch(`https://fakerapi.it/api/v1/custom?_quantity=1&username=lastName&birthday=date&boolean=boolean&comment=text
  `);
    const data = await res.json();

    const age = today.getFullYear() - data.data[0].birthday.split("-")[0];
    const gender = data.data[0].boolean ? "male" : "female";

    const photo = await generateFace(gender, age);
    const likes = Math.trunc(Math.random() * MAX_AGE);
    const repliesLength = comments.reduce((acc, el) => {
      acc = acc + el.replies.length;
      return acc;
    }, 0);
    const id = repliesLength + comments.length;

    return {
      username: data.data[0].username,
      comment: data.data[0].comment,
      id: id,
      image: photo,
      likes: likes,
      date: new Date(),
    };
  } catch (err) {
    console.error(err);
  }
}

export function positionComment(comment) {
  if (comments.length < 1 || Math.random() < 0.5) {
    comment.replies = [];
    comments.push(comment);
    // console.log(comments);
    return [comment];
  } else {
    const i = calcNum(comments.length);
    comments[i].replies.push(comment);
    // console.log(comments);
    return [
      comment,
      comments[i].replies.length > 1 ? comments[i].replies : [comments[i]],
    ];
  }
}

export function createUser(obj) {
  user.username = obj.username;
  user.gender = obj.gender;
  user.age = obj.age;
}

export function setPropic(image) {
  user.image = image;
}

export function saveUserState() {
  localStorage.setItem("user", JSON.stringify(user));
}

function init() {
  const storage = localStorage.getItem("user");
  if (storage) user = JSON.parse(storage);
}
init();
