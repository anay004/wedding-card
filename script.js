const revealScreen = document.getElementById("revealScreen");
const openInvite = document.getElementById("openInvite");
const experience = document.getElementById("invitationExperience");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const petals = document.getElementById("petals");
const slideStack = document.getElementById("slideStack");

let hasOpened = false;
let isMusicPlaying = false;
let slideIndex = 0;
let slideshowTimer = null;

function createPetals() {
  const colors = ["#d59d43", "#c76d5c", "#f0d9b3", "#e6caae", "#b95a43"];

  for (let i = 0; i < 42; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--start-x", `${Math.random() * 100 - 10}vw`);
    petal.style.setProperty("--end-x", `${Math.random() * 100 - 10}vw`);
    petal.style.setProperty("--fall-duration", `${9 + Math.random() * 10}s`);
    petal.style.animationDelay = `${Math.random() * -14}s`;
    petal.style.setProperty("--petal-color", colors[i % colors.length]);
    petal.style.transform = `scale(${0.65 + Math.random() * 0.75})`;
    petals.appendChild(petal);
  }
}

function markLoadedImages() {
  document.querySelectorAll("img").forEach((image) => {
    if (image.complete && image.naturalWidth > 0) {
      image.parentElement?.classList.add("has-image");
      return;
    }

    image.addEventListener("load", () => {
      image.parentElement?.classList.add("has-image");
    });

    image.addEventListener("error", () => {
      image.removeAttribute("src");
    });
  });
}

function startSlideshow(slides) {
  if (!slides.length) return;

  slides[0].classList.add("is-active");
  slideStack.classList.add("has-image");

  slideshowTimer = window.setInterval(() => {
    slides[slideIndex].classList.remove("is-active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("is-active");
  }, 3200);
}

function prepareSlideshow() {
  const slideImages = Array.from(slideStack.querySelectorAll("img"));
  const settledSlides = [];
  let pending = slideImages.length;

  function finish() {
    pending -= 1;
    if (pending === 0 && !slideshowTimer) {
      startSlideshow(settledSlides);
    }
  }

  slideImages.forEach((image) => {
    if (image.complete) {
      if (image.naturalWidth > 0) {
        settledSlides.push(image);
      } else {
        image.remove();
      }
      finish();
      return;
    }

    image.addEventListener("load", () => {
      settledSlides.push(image);
      finish();
    });

    image.addEventListener("error", () => {
      image.remove();
      finish();
    });
  });
}

async function playMusic() {
  try {
    await music.play();
    isMusicPlaying = true;
    musicToggle.classList.remove("is-paused");
    musicIcon.textContent = "♪";
  } catch {
    isMusicPlaying = false;
    musicToggle.classList.add("is-paused");
    musicIcon.textContent = "♫";
  }
}

function pauseMusic() {
  music.pause();
  isMusicPlaying = false;
  musicToggle.classList.add("is-paused");
  musicIcon.textContent = "♫";
}

openInvite.addEventListener("click", () => {
  if (hasOpened) return;
  hasOpened = true;
  revealScreen.classList.add("is-opening");
  window.setTimeout(() => {
    revealScreen.classList.add("is-open");
    experience.scrollIntoView({ block: "start" });
    playMusic();
  }, 950);
});

musicToggle.addEventListener("click", () => {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
});

createPetals();
markLoadedImages();
prepareSlideshow();
