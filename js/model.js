import { MAX_AGE, MIN_AGE } from "./config.js";
import { calcNum, today } from "./helper.js";

export let user = {};
export const comments = [];
let total = 0;

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
    // const likes = Math.trunc(Math.random() * MAX_AGE);

    const id = calcID();

    return {
      username: data.data[0].username,
      comment: data.data[0].comment,
      id: id,
      image: photo,
      likes: 0,
      date: new Date(),
    };
  } catch (err) {
    console.error(err);
  }
}

export function calcID() {
  const repliesLength = comments.reduce((acc, el) => {
    acc = acc + el.replies.length;
    return acc;
  }, 0);
  return repliesLength + comments.length;
}

export function positionComment(comment) {
  if (comments.length < 1 || Math.random() < 0.5) {
    comment.replies = [];
    comments.push(comment);
    return [comment];
  } else {
    const i = calcNum(comments.length);
    comments[i].replies.push(comment);
    return [
      comment,
      comments[i].replies.length > 1 ? comments[i].replies : [comments[i]],
    ];
  }
}

export function positionOwnComment(comment, type, parentID) {
  if (type === "send") {
    comment.replies = [];
    comments.push(comment);
    return [comment];
  }

  if (type === "reply") {
    const parent = comments.find((el) => el.id == parentID);

    parent.replies.push(comment);

    return [comment, parent.replies.length > 1 ? parent.replies : [parent]];
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

export function deleteComment(id, parentID) {
  const parentComment = comments.find((comment) => comment.id === parentID);

  if (parentComment.id === id) {
    delete comments.comment;
  } else {
    const index = parentComment.replies.findIndex(
      (comment) => comment.id === id
    );
    parentComment.replies.splice(index, 1);
  }
}

export function editComment(id, parentID, content) {
  const parentComment = comments.find((comment) => comment.id === parentID);

  if (parentComment.id === id) {
    parentComment.comment = content;
  } else {
    const index = parentComment.replies.findIndex(
      (comment) => comment.id === id
    );
    parentComment.replies[index].comment = content;
  }
}

export function countComments() {
  return total++;
}

export function editLikes(total) {
  const comment = comments[Math.trunc(Math.random() * comments.length)];

  if (comment.replies.length > 0 && Math.random() > 0.5) {
    const reply =
      comment.replies[Math.trunc(Math.random() * comment.replies.length)];

    reply.likes = Math.trunc(Math.random() * total);

    return reply;
  } else {
    comment.likes = Math.trunc(Math.random() * total);

    return comment;
  }
}

export function addRemoveLikes(type, id, parentID) {
  console.log(parentID, !isNaN(parentID));
  let currComment;
  if (!isNaN(parentID) && id !== parentID) {
    currComment = comments
      .find((comment) => comment.id === parentID)
      .replies.find((reply) => reply.id === id);

    type === "add" ? currComment.likes++ : currComment.likes--;
  } else {
    currComment = comments.find((comment) => comment.id === id);

    type === "add" ? currComment.likes++ : currComment.likes--;
  }

  return currComment;
}

function init() {
  const storage = localStorage.getItem("user");
  if (storage) user = JSON.parse(storage);
}
init();
