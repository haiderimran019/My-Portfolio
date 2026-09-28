const body = document.body;
const toggle = document.getElementById("themeToggle");
const icon = toggle?.querySelector(".theme-icon");
const label = toggle?.querySelector(".theme-label");

function setTheme(theme) {
  const light = theme === "light";
  body.classList.toggle("theme-light", light);
  body.classList.toggle("theme-dark", !light);
  if (icon) icon.textContent = light ? "☾" : "☼";
  if (label) label.textContent = light ? "Dark" : "Light";
  if (toggle) toggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  localStorage.setItem("haider-theme", theme);
}

const saved = localStorage.getItem("haider-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
setTheme(saved || (prefersLight ? "light" : "dark"));

toggle?.addEventListener("click", () => {
  setTheme(body.classList.contains("theme-light") ? "dark" : "light");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


// Desktop cursor: restrained follower with larger state on interactive elements.
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover && cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
    document.body.classList.add("cursor-active");
  }, { passive: true });

  const interactive = document.querySelectorAll("a, button, .project-visual, .orbit-card");
  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}
