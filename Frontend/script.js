const api = "http://localhost:3000/blogs";
const card = document.getElementById("cards");

async function getData() {
  const res = await fetch(api);
  const data = await res.json();
  if (data) {
    data.forEach((element) => {
      const postId = element.id;
      card.innerHTML += `
        <div class="col-lg-4">
          <div class="cards mt-5 mb-4">
            <img class="img-fluid" src="images/blog1.jpg" alt="blog1" />
            <div class="p-3 text-center">
              <h2>${element.title}</h2>
              <p>${element.content}</p>
              <div>
                <button class="btn btn-warning" onclick="editPost(${postId})">Edit</button>
                <button class="btn btn-danger" onclick="deletePost(${postId})">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }
}

function editPost(postId) {
  window.location.href = `edit.html?id=${postId}`;
}

getData();

async function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) {
    return;
  }
  const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("Post deleted successfully");
  } else {
    console.error("Failed to delete post:", response.statusText);
  }
}

document
  .getElementById("postForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    await postFormData(); // Call the function to send the form data
  });

async function postFormData() {
  const form = document.getElementById("postForm");
  const formData = new FormData(form);

  const response = await fetch("http://localhost:3000/blogs/post", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    console.log("Post added successfully");
    // You can also refresh the page or clear the form here if needed
  } else {
    console.error("Failed to add post:", response.statusText);
  }
}
