const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks.map(link => document.querySelector(link.hash)).filter(section => section !== null);
const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach(link => {
    const active = link.hash === `#${visible.target.id}`;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-20% 0px -58% 0px", threshold: [0, 0.2, 0.5] });
sections.forEach(section => observer.observe(section));
const contactForm = document.querySelector("[data-contact-form]");
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
const githubLink = document.querySelector("[data-github-link]");
const githubNote = document.querySelector("[data-github-note]");
const githubLabel = document.querySelector("[data-github-label]");
if (githubProfileUrl && githubLink && githubLabel) {
  githubLink.href = githubProfileUrl;
  githubLabel.textContent = "View my GitHub profile";
  githubLink.hidden = false;
  if (githubNote) githubNote.hidden = true;
}




// Premium motion and subtle multi-axis depth. Both effects stay off for reduced-motion users.
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;

if (!reduceMotion) {
  if (window.gsap) {
    const gsap = window.gsap;
    gsap.from(".hero-copy > *", {
      autoAlpha: 0,
      y: 22,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.08
    });
    gsap.from(".hero-visual", {
      autoAlpha: 0,
      y: 18,
      scale: 0.985,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });

    const motionTargets = document.querySelectorAll(
      ".project-card, .stack-card, .cert-card, .publication-feature, .community-entry"
    );
    const motionObserver = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(entry.target,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.68, delay: (index % 3) * 0.07, ease: "power3.out", clearProps: "opacity,visibility,transform" }
        );
        motionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    motionTargets.forEach(target => motionObserver.observe(target));
  }

  if (finePointer && window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll(".project-card, .cert-card"), {
      max: 7,
      perspective: 1100,
      speed: 550,
      scale: 1.012,
      glare: true,
      "max-glare": 0.12,
      gyroscope: false,
      transition: true
    });
  }
}
const projectFilters = document.querySelectorAll("[data-project-filter]");
const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));
const projectResults = document.querySelector("[data-project-results]");
projectFilters.forEach(button => {
  button.addEventListener("click", () => {
    const selectedType = button.dataset.projectFilter;
    projectFilters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    let visibleCount = 0;
    projectCards.forEach(card => {
      const visible = selectedType === "all" || card.dataset.category === selectedType;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (projectResults) {
      projectResults.textContent = selectedType === "all"
        ? `Showing all ${visibleCount} projects`
        : `Showing ${visibleCount} ${button.textContent.trim().replace(/\d+/g, "").trim()} project${visibleCount === 1 ? "" : "s"}`;
    }
    if (window.gsap && !reduceMotion) {
      window.gsap.fromTo(projectCards.filter(card => !card.hidden),
        { autoAlpha: 0.7, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.035, ease: "power2.out", clearProps: "opacity,visibility,transform" }
      );
    }
  });
});
// A subtle neural network drifts across the viewport behind the page content.
(() => {
  const canvas = document.createElement("canvas");
  canvas.className = "neuron-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let nodes = [];
  let animationFrame = 0;
  let running = false;
  const connectionRadius = 176;
  const palette = ["208,247,122", "182,161,255"];

  function drawNetwork(moveNodes = false) {
    context.clearRect(0, 0, width, height);
    if (moveNodes) {
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;
        node.phase += 0.036;
      });
    }

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance > connectionRadius) continue;
        const alpha = (1 - distance / connectionRadius) * 0.21;
        context.beginPath();
        context.strokeStyle = `rgba(${a.color},${alpha})`;
        context.lineWidth = 1.15;
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }

    nodes.forEach(node => {
      const pulse = 0.68 + (Math.sin(node.phase) + 1) * 0.32;
      context.beginPath();
      context.fillStyle = `rgba(${node.color},${0.56 * pulse})`;
      context.shadowBlur = 15;
      context.shadowColor = `rgba(${node.color},0.72)`;
      context.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
      context.fill();
    });
    context.shadowBlur = 0;
  }

  function resizeNetwork() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = Math.max(24, Math.min(72, Math.round((width * height) / 20500)));
    nodes = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.58,
      vy: (Math.random() - 0.5) * 0.58,
      radius: 1.3 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      color: palette[index % palette.length]
    }));
    drawNetwork(false);
  }

  function animateNetwork() {
    if (!running || reduceMotion || document.hidden) return;
    drawNetwork(true);
    animationFrame = window.requestAnimationFrame(animateNetwork);
  }

  function startNetwork() {
    if (running || reduceMotion) return;
    running = true;
    animationFrame = window.requestAnimationFrame(animateNetwork);
  }

  function stopNetwork() {
    running = false;
    window.cancelAnimationFrame(animationFrame);
  }

  resizeNetwork();
  if (!reduceMotion) startNetwork();
  window.addEventListener("resize", resizeNetwork, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopNetwork();
    else startNetwork();
  });
})();

// Replace the system pointer on fine-pointer devices with a small, accessible cursor pair.
if (finePointer) {
  const ring = document.querySelector("[data-cursor-ring]");
  const dot = document.querySelector("[data-cursor-dot]");
  if (ring && dot) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let cursorFrame = 0;

    function followCursor() {
      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
      cursorFrame = window.requestAnimationFrame(followCursor);
    }

    document.addEventListener("pointermove", event => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!document.body.classList.contains("has-custom-cursor")) {
        ringX = targetX;
        ringY = targetY;
        document.body.classList.add("has-custom-cursor");
        window.cancelAnimationFrame(cursorFrame);
        followCursor();
      }
      dot.style.transform = `translate3d(${targetX}px,${targetY}px,0) translate(-50%,-50%)`;
    }, { passive: true });

    document.addEventListener("pointerover", event => {
      document.body.classList.toggle("cursor-hover", Boolean(event.target instanceof Element && event.target.closest("a,button,input,textarea,[role='button']")));
    });
    document.addEventListener("pointerout", event => {
      if (event.relatedTarget === null) document.body.classList.remove("has-custom-cursor", "cursor-hover");
    });
    window.addEventListener("blur", () => document.body.classList.remove("has-custom-cursor", "cursor-hover"));
  }
}