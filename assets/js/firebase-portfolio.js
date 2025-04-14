// firebase-portfolio.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeXPI59Y1t3EqcS11_05Qyc-i16o5iriQ",
  authDomain: "endless-grafix-admin-5fff7.firebaseapp.com",
  projectId: "endless-grafix-admin-5fff7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function renderFirebasePortfolioCards(containerSelector = ".cards") {
  const portfolioRef = collection(db, "portfolio");
  const querySnapshot = await getDocs(portfolioRef);
  const container = document.querySelector(containerSelector);

  if (!container) return;

  querySnapshot.forEach((doc) => {
    const d = doc.data();
    const cardHTML = `
      <div class="card-custom" data-index="0" data-aos="fade-up">
        <div class="card__inner bg-6 p-lg-6 p-md-4 p-3">
          <div class="card__image-container zoom-img position-relative">
            <img class="card__image" src="${d.image}" alt="${d.title || 'Portfolio Image'}" />
            <a href="work-single.html?id=${doc.id}" class="card-image-overlay position-absolute start-0 end-0 w-100 h-100"></a>
          </div>
          <div class="card__content px-md-4 px-3">
            <div class="card__title d-md-flex align-items-center mb-0 mb-lg-2">
              <a href="work-single.html?id=${doc.id}" class="card_title_link">
                <p class="text-primary mb-0 mb-md-2">${d.category || 'Design'}</p>
                <h3 class="fw-semibold">${d.title}</h3>
              </a>
              <a href="work-single.html?id=${doc.id}" class="card-icon d-none d-md-inline-flex border text-dark border-dark icon-shape ms-auto icon-md rounded-circle">
                <i class="ri-arrow-right-up-line"></i>
              </a>
            </div>
            <p class="text-300 mb-lg-auto mb-md-4 mb-3">${(d.description || '').slice(0, 150)}...</p>
            ${d.client ? `
              <div class="d-md-flex content">
                <p class="mb-0 fs-7 text-dark text-uppercase w-40">Client</p>
                <p class="mb-0 card__description text-300 fs-6 mb-0">${d.client}</p>
              </div>` : ''}
            ${d.time ? `
              <div class="d-md-flex content">
                <p class="mb-0 fs-7 text-dark text-uppercase w-40">Completion Time</p>
                <p class="mb-0 card__description text-300 fs-6 mb-0">${d.time}</p>
              </div>` : ''}
            ${d.tools ? `
              <div class="d-md-flex content">
                <p class="mb-0 fs-7 text-dark text-uppercase w-40">Tools</p>
                <p class="mb-0 card__description text-300 fs-6 mb-0">${d.tools}</p>
              </div>` : ''}
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHTML);
  });

  if (window.AOS) AOS.refresh();
}
