/* ==========================================================================
   THE ARCHIVE — script.js
   ========================================================================== */

/* ------------------------------------------------------------------------
   PASSWORT
   ------------------------------------------------------------------------
   Ändere NUR diese eine Zeile, um das Passwort der Website zu ändern.
   ------------------------------------------------------------------------ */
const SITE_PASSWORD = "unsereparty2026";

/* Hinweis zur Sicherheit: siehe README.md — dieses Passwort wird rein im
   Browser (JavaScript) geprüft. Der Code ist auf GitHub Pages öffentlich
   einsehbar, ein technisch versierter Mensch kann das Passwort im
   Quellcode finden oder die Prüfung umgehen. Das ist für eine private
   Spaß-Seite unter Freunden okay, aber KEIN echter Schutz für wirklich
   vertrauliche Daten. */

const SESSION_KEY = "archive_unlocked";

/* ==========================================================================
   LOGIN
   ========================================================================== */

const loginScreen = document.getElementById("login-screen");
const loginBox = document.getElementById("login-box");
const passwordInput = document.getElementById("password-input");
const enterBtn = document.getElementById("enter-btn");
const loginError = document.getElementById("login-error");
const app = document.getElementById("app");

function unlockSite(skipAnimation) {
  sessionStorage.setItem(SESSION_KEY, "1");
  if (skipAnimation) {
    loginScreen.style.display = "none";
    app.classList.add("visible");
    return;
  }
  loginScreen.classList.add("leaving");
  app.classList.add("visible");
  setTimeout(() => { loginScreen.style.display = "none"; }, 750);
}

function tryLogin() {
  const value = passwordInput.value.trim();
  if (value.length > 0 && value === SITE_PASSWORD) {
    unlockSite(false);
  } else {
    loginError.classList.add("show");
    loginBox.classList.remove("shake");
    void loginBox.offsetWidth; // restart animation
    loginBox.classList.add("shake");
    passwordInput.value = "";
    passwordInput.focus();
  }
}

enterBtn.addEventListener("click", tryLogin);
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryLogin();
  loginError.classList.remove("show");
});

if (sessionStorage.getItem(SESSION_KEY) === "1") {
  unlockSite(true);
} else {
  setTimeout(() => passwordInput.focus(), 400);
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function byDateDesc(a, b) {
  return new Date(b.date || 0) - new Date(a.date || 0);
}

function metaLine(parts) {
  return parts.filter(Boolean).join(" · ");
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function placeholderOnError(imgEl) {
  imgEl.addEventListener("error", function handler() {
    this.removeEventListener("error", handler);
    this.src = "images/placeholder.jpg";
  });
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

const views = ["home", "photos", "videos", "stories", "events"];
const navButtons = document.querySelectorAll("nav.main-nav button");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");

function showView(name) {
  views.forEach((v) => {
    document.getElementById("view-" + v).classList.toggle("hidden", v !== name);
  });
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === name);
  });
  mainNav.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

document.querySelectorAll("[data-view-link]").forEach((link) => {
  link.addEventListener("click", () => showView(link.dataset.viewLink));
});

navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));

/* ==========================================================================
   PHOTOS
   ========================================================================== */

function photoCard(photo) {
  const card = el("div", "card photo-card");
  card.innerHTML = `
    <div class="card-media"><img loading="lazy" src="${photo.image}" alt="${photo.title || ""}"></div>
    <div class="card-body">
      <div class="title">${photo.title || "Ohne Titel"}</div>
      <div class="meta">${metaLine([formatDate(photo.date), photo.location])}</div>
    </div>`;
  placeholderOnError(card.querySelector("img"));
  card.addEventListener("click", () => openLightbox(photo.id));
  return card;
}

function renderPhotosHome() {
  const container = document.getElementById("home-photos");
  container.innerHTML = "";
  [...PHOTOS].sort(byDateDesc).slice(0, 8).forEach((p) => container.appendChild(photoCard(p)));
}

function renderPhotosGrid(filterText) {
  const grid = document.getElementById("photos-grid");
  grid.innerHTML = "";
  const q = (filterText || "").toLowerCase();
  const list = [...PHOTOS].sort(byDateDesc).filter((p) => {
    if (!q) return true;
    return [p.title, p.location, p.people, p.description].join(" ").toLowerCase().includes(q);
  });
  if (list.length === 0) {
    grid.appendChild(el("div", "empty-state", "Keine Fotos gefunden. Trage deine eigenen Fotos in <strong>data/photos.js</strong> ein."));
    return;
  }
  list.forEach((p) => grid.appendChild(photoCard(p)));
}

document.getElementById("photo-search").addEventListener("input", (e) => {
  renderPhotosGrid(e.target.value);
});

/* Lightbox */
const lightbox = document.getElementById("lightbox");
let lightboxList = [];
let lightboxIndex = 0;

function openLightbox(photoId) {
  lightboxList = [...PHOTOS].sort(byDateDesc);
  lightboxIndex = lightboxList.findIndex((p) => p.id === photoId);
  if (lightboxIndex < 0) lightboxIndex = 0;
  renderLightbox();
  lightbox.classList.add("open");
}

function renderLightbox() {
  const photo = lightboxList[lightboxIndex];
  if (!photo) return;
  const img = document.getElementById("lightbox-img");
  img.src = photo.image;
  placeholderOnError(img);
  document.getElementById("lightbox-title").textContent = photo.title || "";
  document.getElementById("lightbox-meta").textContent = metaLine([formatDate(photo.date), photo.location, photo.people]);
  document.getElementById("lightbox-desc").textContent = photo.description || "";
}

document.getElementById("lb-prev").addEventListener("click", () => {
  lightboxIndex = (lightboxIndex - 1 + lightboxList.length) % lightboxList.length;
  renderLightbox();
});
document.getElementById("lb-next").addEventListener("click", () => {
  lightboxIndex = (lightboxIndex + 1) % lightboxList.length;
  renderLightbox();
});

/* ==========================================================================
   VIDEOS
   ========================================================================== */

function videoCard(video) {
  const card = el("div", "card video-card");
  card.innerHTML = `
    <div class="card-media">
      <img loading="lazy" src="${video.poster}" alt="${video.title || ""}">
      <div class="play-badge"><span>▶</span></div>
    </div>
    <div class="card-body">
      <div class="title">${video.title || "Ohne Titel"}</div>
      <div class="meta">${metaLine([formatDate(video.date), video.location])}</div>
    </div>`;
  placeholderOnError(card.querySelector("img"));
  card.addEventListener("click", () => openVideoModal(video.id));
  return card;
}

function renderVideosHome() {
  const container = document.getElementById("home-videos");
  container.innerHTML = "";
  [...VIDEOS].sort(byDateDesc).slice(0, 8).forEach((v) => container.appendChild(videoCard(v)));
}

function renderVideosGrid() {
  const grid = document.getElementById("videos-grid");
  grid.innerHTML = "";
  const list = [...VIDEOS].sort(byDateDesc);
  if (list.length === 0) {
    grid.appendChild(el("div", "empty-state", "Noch keine Videos. Lege Dateien in <strong>/videos</strong> ab und trage sie in <strong>data/videos.js</strong> ein."));
    return;
  }
  list.forEach((v) => grid.appendChild(videoCard(v)));
}

const videoModal = document.getElementById("video-modal");
const videoPlayer = document.getElementById("video-player");

function openVideoModal(videoId) {
  const video = VIDEOS.find((v) => v.id === videoId);
  if (!video) return;
  videoPlayer.src = video.video;
  videoPlayer.poster = video.poster || "";
  document.getElementById("video-title").textContent = video.title || "";
  document.getElementById("video-meta").textContent = metaLine([formatDate(video.date), video.location]);
  document.getElementById("video-desc").textContent = video.description || "";
  videoModal.classList.add("open");
}

function closeVideoModal() {
  videoPlayer.pause();
  videoPlayer.removeAttribute("src");
  videoPlayer.load();
}

/* ==========================================================================
   STORIES
   ========================================================================== */

function storyCard(story) {
  const card = el("div", "card story-card");
  card.innerHTML = `
    <div class="card-media"><img loading="lazy" src="${story.cover}" alt="${story.title || ""}"></div>
    <div class="card-body">
      <div class="title">${story.title || "Ohne Titel"}</div>
      <div class="meta">${metaLine([formatDate(story.date), story.location])}</div>
      <div class="excerpt">${(story.text || "").split("\n\n")[0]}</div>
    </div>`;
  placeholderOnError(card.querySelector("img"));
  card.addEventListener("click", () => openStoryReader(story.id));
  return card;
}

function renderStoriesHome() {
  const container = document.getElementById("home-stories");
  container.innerHTML = "";
  [...STORIES].sort(byDateDesc).slice(0, 8).forEach((s) => container.appendChild(storyCard(s)));
}

function renderStoriesGrid() {
  const grid = document.getElementById("stories-grid");
  grid.innerHTML = "";
  const list = [...STORIES].sort(byDateDesc);
  if (list.length === 0) {
    grid.appendChild(el("div", "empty-state", "Noch keine Stories. Trage deine erste Geschichte in <strong>data/stories.js</strong> ein."));
    return;
  }
  list.forEach((s) => grid.appendChild(storyCard(s)));
}

const storyReader = document.getElementById("story-reader");

function openStoryReader(storyId) {
  const story = STORIES.find((s) => s.id === storyId);
  if (!story) return;
  const img = document.getElementById("reader-cover-img");
  img.src = story.cover;
  placeholderOnError(img);
  document.getElementById("reader-meta").textContent = metaLine([formatDate(story.date), story.location]);
  document.getElementById("reader-title").textContent = story.title || "";
  const textHost = document.getElementById("reader-text");
  textHost.innerHTML = "";
  (story.text || "").split("\n\n").forEach((para) => {
    textHost.appendChild(el("p", "", para));
  });
  const gallery = document.getElementById("reader-gallery");
  gallery.innerHTML = "";
  (story.photos || []).forEach((src) => {
    const im = el("img");
    im.src = src;
    im.loading = "lazy";
    placeholderOnError(im);
    gallery.appendChild(im);
  });
  storyReader.classList.add("open");
}

/* ==========================================================================
   EVENTS — TIMELINE
   ========================================================================== */

function eventCard(evt) {
  const card = el("div", "card event-card");
  card.innerHTML = `
    <div class="card-media"><img loading="lazy" src="${evt.cover}" alt="${evt.title || ""}"></div>
    <div class="card-body">
      <div class="title">${evt.title || "Event"}</div>
      <div class="meta">${metaLine([formatDate(evt.date), evt.location])}</div>
    </div>`;
  placeholderOnError(card.querySelector("img"));
  card.addEventListener("click", () => openEventDetail(evt.id));
  return card;
}

function renderEventsHome() {
  const container = document.getElementById("home-events");
  container.innerHTML = "";
  [...EVENTS].sort(byDateDesc).slice(0, 8).forEach((e) => container.appendChild(eventCard(e)));
}

function renderTimeline() {
  const host = document.getElementById("events-timeline");
  host.innerHTML = "";
  const sorted = [...EVENTS].sort(byDateDesc);
  if (sorted.length === 0) {
    host.appendChild(el("div", "empty-state", "Noch keine Events. Trage dein erstes Event in <strong>data/events.js</strong> ein."));
    return;
  }
  let currentYear = null;
  sorted.forEach((evt) => {
    if (evt.year !== currentYear) {
      currentYear = evt.year;
      host.appendChild(el("div", "timeline-year", String(currentYear)));
    }
    const item = el("div", "timeline-item");
    item.innerHTML = `
      <div class="card timeline-card">
        <div class="thumb"><img loading="lazy" src="${evt.cover}" alt=""></div>
        <div class="info">
          <div class="title">${evt.title || "Event"}</div>
          <div class="meta">${metaLine([formatDate(evt.date), evt.location])}</div>
          <div class="desc">${evt.description || ""}</div>
        </div>
      </div>`;
    placeholderOnError(item.querySelector("img"));
    item.addEventListener("click", () => openEventDetail(evt.id));
    host.appendChild(item);
  });
}

const eventDetail = document.getElementById("event-detail");

function openEventDetail(eventId) {
  const evt = EVENTS.find((e) => e.id === eventId);
  if (!evt) return;

  const relatedPhotos = PHOTOS.filter((p) => p.eventId === eventId);
  const relatedVideos = VIDEOS.filter((v) => v.eventId === eventId);
  const relatedStories = STORIES.filter((s) => s.eventId === eventId);

  const host = document.getElementById("event-detail-inner");
  host.innerHTML = `
    <div class="meta">${metaLine([formatDate(evt.date), evt.location])}</div>
    <h2>${evt.title || "Event"}</h2>
    <div class="desc">${evt.description || ""}</div>
  `;

  if (relatedPhotos.length) {
    host.appendChild(el("h3", "", `Fotos (${relatedPhotos.length})`));
    const grid = el("div", "event-detail-grid");
    relatedPhotos.forEach((p) => {
      const im = el("img");
      im.src = p.image;
      im.loading = "lazy";
      placeholderOnError(im);
      im.addEventListener("click", (ev) => {
        ev.stopPropagation();
        eventDetail.classList.remove("open");
        openLightbox(p.id);
      });
      grid.appendChild(im);
    });
    host.appendChild(grid);
  }

  if (relatedVideos.length) {
    host.appendChild(el("h3", "", `Videos (${relatedVideos.length})`));
    const grid = el("div", "event-detail-grid");
    relatedVideos.forEach((v) => {
      const im = el("img");
      im.src = v.poster;
      im.loading = "lazy";
      placeholderOnError(im);
      im.addEventListener("click", (ev) => {
        ev.stopPropagation();
        eventDetail.classList.remove("open");
        openVideoModal(v.id);
      });
      grid.appendChild(im);
    });
    host.appendChild(grid);
  }

  if (relatedStories.length) {
    host.appendChild(el("h3", "", `Stories (${relatedStories.length})`));
    const grid = el("div", "event-detail-grid");
    relatedStories.forEach((s) => {
      const im = el("img");
      im.src = s.cover;
      im.loading = "lazy";
      placeholderOnError(im);
      im.addEventListener("click", (ev) => {
        ev.stopPropagation();
        eventDetail.classList.remove("open");
        openStoryReader(s.id);
      });
      grid.appendChild(im);
    });
    host.appendChild(grid);
  }

  if (!relatedPhotos.length && !relatedVideos.length && !relatedStories.length) {
    host.appendChild(el("div", "empty-state", "Noch nichts mit diesem Event verknüpft. Trage die passende <strong>eventId</strong> bei einem Foto, Video oder einer Story ein."));
  }

  eventDetail.classList.add("open");
}

/* ==========================================================================
   HOME STATS
   ========================================================================== */

function renderStats() {
  const host = document.getElementById("home-stats");
  const stats = [
    { num: PHOTOS.length, lbl: "Fotos" },
    { num: VIDEOS.length, lbl: "Videos" },
    { num: STORIES.length, lbl: "Stories" },
    { num: EVENTS.length, lbl: "Events" },
  ];
  host.innerHTML = stats.map((s) => `<div class="stat"><div class="num">${s.num}</div><div class="lbl">${s.lbl}</div></div>`).join("");
}

/* ==========================================================================
   OVERLAY CLOSE HANDLING
   ========================================================================== */

const allOverlays = [lightbox, videoModal, storyReader, eventDetail];

function closeOverlay(overlay) {
  overlay.classList.remove("open");
  if (overlay === videoModal) closeVideoModal();
}

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => closeOverlay(btn.closest(".overlay")));
});

allOverlays.forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay(overlay);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    allOverlays.forEach((o) => { if (o.classList.contains("open")) closeOverlay(o); });
  }
  if (lightbox.classList.contains("open")) {
    if (e.key === "ArrowLeft") document.getElementById("lb-prev").click();
    if (e.key === "ArrowRight") document.getElementById("lb-next").click();
  }
});

/* ==========================================================================
   INIT
   ========================================================================== */

function init() {
  renderStats();
  renderPhotosHome();
  renderVideosHome();
  renderStoriesHome();
  renderEventsHome();
  renderPhotosGrid("");
  renderVideosGrid();
  renderStoriesGrid();
  renderTimeline();
}

init();
