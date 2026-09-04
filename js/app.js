let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Convert image file to Base64
function getBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function savePost(post) {
  posts.push(post);
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Admin/User: Add post
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm") || document.getElementById("userPostForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const title = form.querySelector("input[type=text]").value.trim();
      const likes = parseInt(form.querySelector("input[type=number]").value);
      const relevance = parseInt(form.querySelectorAll("input[type=number]")[1].value);
      const photoFile = form.querySelector("input[type=file]").files[0];
      const timestamp = Date.now();

      if (photoFile) {
        getBase64(photoFile, base64Image => {
          savePost({ title, likes, relevance, timestamp, photo: base64Image });
          alert("Post added successfully!");
          form.reset();
          loadFeed();
        });
      } else {
        savePost({ title, likes, relevance, timestamp, photo: null });
        alert("Post added successfully!");
        form.reset();
        loadFeed();
      }
    });
  }
});

// Load feed
function loadFeed() {
  posts = JSON.parse(localStorage.getItem("posts")) || [];
  const feedDiv = document.getElementById("feed");
  if (!feedDiv) return;

  let ranked = [...posts].sort((a, b) => {
    const recencyA = (Date.now() - a.timestamp < 3600000) ? 20 : 0;
    const recencyB = (Date.now() - b.timestamp < 3600000) ? 20 : 0;
    const scoreA = a.likes + a.relevance + recencyA;
    const scoreB = b.likes + b.relevance + recencyB;
    return scoreB - scoreA;
  });

  feedDiv.innerHTML = "";
  ranked.forEach(item => {
    const recency = (Date.now() - item.timestamp < 3600000) ? 20 : 0;
    const score = item.likes + item.relevance + recency;
    feedDiv.innerHTML += `
      <div class="news-item">
        <h3>${item.title}</h3>
        ${item.photo ? `<img src="${item.photo}" alt="Post Image">` : ""}
        <p>Likes: ${item.likes} | Relevance: ${item.relevance}</p>
        <p class="rank">Score: ${score}</p>
      </div>
    `;
  });
}
