// Firebase Admin Panel Script
// Includes Firestore initialization, blog listing, blog deletion, and message retrieval

// Firebase SDKs
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js"></script>

<script>
  // Your Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyDeXPI59Y1t3EqcS11_05Qyc-i16o5iriQ",
    authDomain: "endless-grafix-admin-5fff7.firebaseapp.com",
    projectId: "endless-grafix-admin-5fff7"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const auth = firebase.auth();

  // Auth state check
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "login.html";
    }
  });

  // Fetch and render blogs
  function fetchBlogs() {
    db.collection("blogs").orderBy("timestamp", "desc").get().then(snapshot => {
      const container = document.getElementById("blogGrid");
      container.innerHTML = "";
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp?.toDate().toLocaleDateString() || "";
        const card = `
          <div class="col-md-4 mb-4" id="blog-${doc.id}">
            <div class="blog-card">
              <img src="${data.image}" class="img-fluid mb-2" />
              <h5>${data.title}</h5>
              <p class="mb-1"><strong>Slug:</strong> ${data.slug}</p>
              <p><small class="text-muted">${date}</small></p>
              <div class="d-flex justify-content-center gap-2 mt-2">
                <a href="blog-edit.html?id=${doc.id}" class="btn btn-sm btn-outline-secondary">Edit</a>
                <button onclick="deleteBlog('${doc.id}')" class="btn btn-sm btn-outline-danger">Delete</button>
              </div>
            </div>
          </div>`;
        container.innerHTML += card;
      });
    });
  }

// Blod Edit.html
 let allBlogs = [];

  function renderBlogs(docs) {
    const container = document.getElementById("blogGrid");
    container.innerHTML = "";
    if (docs.length === 0) {
      container.innerHTML = `<p class="text-muted">No blog posts found.</p>`;
      return;
    }

    docs.forEach(doc => {
      const d = doc.data();
      const date = d.timestamp?.toDate().toLocaleDateString() || '';
      const html = `
        <div class="col-md-4 mb-4" id="blog-${doc.id}">
          <div class="blog-card">
            <img src="${d.image}" class="img-fluid mb-3" />
            <h5>${d.title}</h5>
            <p class="mb-1"><strong>Slug:</strong> ${d.slug}</p>
            <p><small class="text-muted">${date}</small></p>
            <div class="d-flex justify-content-center gap-2 mt-2">
              <a href="blog-edit.html?id=${doc.id}" class="btn btn-sm btn-primary">Edit</a>
              <a href="blog-view.html?id=${doc.id}" class="btn btn-sm btn-info">View</a>
              <button onclick="deleteBlog('${doc.id}')" class="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += html;
    });
  }

  function fetchBlogs() {
    db.collection("blogs").orderBy("timestamp", "desc").get().then(snapshot => {
      allBlogs = snapshot.docs;
      renderBlogs(allBlogs);
    });
  }

  function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    db.collection("blogs").doc(id).delete().then(() => {
      document.getElementById(`blog-${id}`)?.remove();
    }).catch(err => alert("Delete failed: " + err.message));
  }

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('show');
    if (sidebar.classList.contains('show')) {
      menuToggle.style.display = 'none';
    } else {
      menuToggle.style.display = 'block';
    }
  }

  // Search blog by title or slug
  document.getElementById("searchInput")?.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    db.collection("blogs").orderBy("timestamp", "desc").get().then(snapshot => {
      const filtered = snapshot.docs.filter(doc => {
        const d = doc.data();
        return d.title.toLowerCase().includes(keyword) || d.slug.toLowerCase().includes(keyword);
      });
      renderBlogs(filtered);
    });
  });

  // Load on page ready
  window.addEventListener("DOMContentLoaded", () => {
    fetchBlogs();
  });

  // Add new blog button
  document.getElementById("createNewBlog")?.addEventListener("click", () => {
    window.location.href = "blog-upload.html";
  });

  // Logout
  function logout() {
    auth.signOut().then(() => {
      window.location.href = "login.html";
    });
  }
</script>
