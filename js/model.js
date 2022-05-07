import { randomNum } from "./helper.js";

// DA USARE CON PARCEL
// import { async } from "regenerator-runtime";

export const users = {
  currentUser: {
    username: "paolm",
    image:
      "https://content.fakeface.rest/male_25_de733d1d9c1216e408903e2cb93108a426274769.jpg",
  },
  comments: [],
};

// TEST
export async function fakerAPI(comments) {
  const res = await fetch(
    `https://fakerapi.it/api/v1/custom?_quantity=${comments}&username=firstName&date=date&content=text&id=counter`
  );
  const data = await res.json();

  data.data.forEach((comment) => {
    comment.likes = randomNum(0, 20);
  });
  users.comments = data.data;
  return data.data;
}

export async function fakerAPIPerson(quantity) {
  const res = await fetch(
    `https://fakerapi.it/api/v1/persons?_quantity=${quantity}`
  );
  const data = await res.json();

  users.comments.forEach((user, i) => {
    user.birthday = data.data[i].birthday;
    user.gender = data.data[i].gender;
  });

  return data.data;
}

export function storeData() {
  localStorage.setItem("users", JSON.stringify(users));
}
