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

// Blog Edit.html

 const quill = new Quill('#editor', { theme: 'snow' });
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) location.href = "blog-list.html";

  const docRef = db.collection("blogs").doc(id);

  async function loadBlog() {
    const doc = await docRef.get();
    if (!doc.exists) return alert("Blog not found");

    const d = doc.data();
    document.getElementById("title").value = d.title;
    document.getElementById("slug").value = d.slug;
    document.getElementById("previewImage").src = d.image;
    quill.root.innerHTML = d.content;
  }

  loadBlog();

  document.getElementById("editBlogForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const slug = document.getElementById("slug").value;
    const content = quill.root.innerHTML;
    const file = document.getElementById("image").files[0];

    let imageURL = document.getElementById("previewImage").src;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "portfolio_unsigned");

      const res = await fetch("https://api.cloudinary.com/v1_1/dinpui98/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!data.secure_url) return alert("Image upload failed");
      imageURL = data.secure_url;
      document.getElementById("previewImage").src = imageURL;
    }

    await docRef.update({
      title,
      slug,
      content,
      image: imageURL
    });

    alert("Blog updated!");
    window.location.href = "blog-list.html";
  });

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('menuToggle').classList.toggle('hide');
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
