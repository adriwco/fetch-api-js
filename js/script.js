const url = "https://jsonplaceholder.typicode.com/posts";
const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

const prevButton = document.querySelector("#prev_button");
const nextButton = document.querySelector("#next_button");
const exibirBtn = document.querySelector("#exibirBtn");
let startIndex = 0;
let totalItems = 0;

// Get id form URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Get all Posts
async function getAllPosts() {
  const response = await fetch(url);
  const data = await response.json(response);
  totalItems = data.length;
  postsContainer.innerHTML = "";

  data.slice(startIndex, startIndex + 10).forEach((post) => {
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");

    title.innerHTML = post.title;
    body.innerHTML = post.body;
    link.innerHTML = `Ler (${post.id})`;
    link.setAttribute("href", `post.html?id=${post.id}`);

    div.append(title, body, link);
    postsContainer.append(div); // append() é melhor que appendChild()
  });

  if (postsContainer.childElementCount > 0) {
    sessionStorage.setItem("clickGerar", true);
  } else {
    sessionStorage.setItem("clickGerar", false);
  }
}

// Get Indidual Post
async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);
  const dataPost = await responsePost.json();
  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.innerText = dataPost.title;
  body.innerHTML = dataPost.body;
  postContainer.append(title, body);

  dataComments.map((comment) => {
    createComment(comment);
  });
}

function createComment(comment) {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentBody = document.createElement("p");

  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.append(email, commentBody);
  commentsContainer.append(div);
}

// Post a Comment
async function postComment(comment) {
  // POST, PUT, PATCH, DELETE - headers(requição) body(enviar)
  const response = await fetch(`${url}/${postId}/comments`, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();
  createComment(data);
}

// Start
if (!postId) {
  // getAllPosts();
  exibirBtn.addEventListener("click", getAllPosts);
  // Verifica se o botão "Gerar" já foi clicado antes
  if (sessionStorage.getItem("clickGerar") === "true") {
    getAllPosts();
  }

  loadingElement.classList.add("hide");

  // Anterior & Proximo
  prevButton.addEventListener("click", () => {
    if (startIndex > 0) {
      startIndex -= 10;
      getAllPosts();
    }
  });
  nextButton.addEventListener("click", () => {
    startIndex += 10;
    if (startIndex >= totalItems) {
      startIndex = totalItems - 10;
    }
    getAllPosts();
  });
} else {
  getPost(postId);

  // Add Event to Comment Form
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };
    comment = JSON.stringify(comment);
    postComment(comment);
  });
}

// remover item do localStorage| sessionStorage e localStorage.
window.addEventListener("beforeunload", function (event) {
  if (!sessionStorage.getItem("clickGerar")) {
    sessionStorage.removeItem("clickGerar");
  }
});