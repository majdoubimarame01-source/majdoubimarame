const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link"));
const sections = navLinks
  .map(link => document.querySelector<HTMLElement>(link.hash))
  .filter((section): section is HTMLElement => section !== null);

// Update the active navigation item as sections enter the reading area.
const sectionObserver = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => {
    const active = link.hash === `#${visible.target.id}`;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-20% 0px -58% 0px", threshold: [0, .2, .5] });
sections.forEach(section => sectionObserver.observe(section));

// Scroll progress and a compact return-to-top shortcut.
const progressBar = document.querySelector<HTMLElement>("[data-scroll-progress]");
const toTop = document.querySelector<HTMLAnchorElement>(".to-top");
let ticking = false;
const updateScrollDecorations = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const progress = available > 0 ? window.scrollY / available : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 550);
  ticking = false;
};
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateScrollDecorations);
}, { passive: true });
updateScrollDecorations();

// Gentle section reveals; content remains visible if scripts are unavailable.
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.body.classList.add("has-motion");
  const revealItems = document.querySelectorAll<HTMLElement>(
    ".about-grid, .project-card, .stack-card, .cert-card, .publication-feature, .publication-row, .community-entry, .quote-grid blockquote, .cv-card, .contact-content"
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  revealItems.forEach(item => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
}

// Configure only after a real GitHub profile URL is available.
const contactForm = document.querySelector<HTMLFormElement>("[data-contact-form]");
contactForm?.addEventListener("submit", event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") ?? "").trim();
  const sender = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Hi Maram,\n\n${message}\n\n— ${name}\n${sender}`);
  window.location.href = `mailto:majdoubimarame01@gmail.com?subject=${subject}&body=${body}`;
});
const githubProfileUrl = "";
const githubLink = document.querySelector<HTMLAnchorElement>("[data-github-link]");
const githubNote = document.querySelector<HTMLElement>("[data-github-note]");
const githubLabel = document.querySelector<HTMLElement>("[data-github-label]");
if (githubProfileUrl && githubLink && githubLabel && githubNote) {
  githubLink.href = githubProfileUrl;
  githubLabel.textContent = "View my GitHub profile";
  githubLink.hidden = false;
  githubNote.hidden = true;
}



