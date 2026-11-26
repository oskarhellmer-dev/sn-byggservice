(function () {
  const data = window.SITE_DATA;
  if (!data) return;

  // Mobile menu toggle
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Interactive service tabs
  const servicePanel = document.getElementById("servicePanel");
  const serviceTabs = document.querySelectorAll(".service-tab");
  function renderService(key) {
    const svc = data.services && data.services[key];
    if (!svc || !servicePanel) return;
    servicePanel.innerHTML = `
      <div class="service-panel-top">
        <span class="service-badge">${svc.badge}</span>
        <span class="service-meta-line">${svc.eyebrow}</span>
      </div>
      <h3>${svc.title}</h3>
      <p>${svc.desc}</p>
      <ul class="service-points">
        ${svc.points.map((pt) => `<li>${pt}</li>`).join("")}
      </ul>
      <div class="service-panel-footer">
        <span class="service-meta-line">${svc.meta}</span>
        <a href="#offert" class="btn btn-accent">${svc.ctaText}</a>
      </div>
    `;
  }

  if (serviceTabs.length) {
    renderService("snickeri");
    serviceTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.getAttribute("data-service");
        serviceTabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        renderService(key);
      });
    });
  }

  // Render projects
  const projectGrid = document.getElementById("projectGrid");
  if (projectGrid && Array.isArray(data.projects)) {
    projectGrid.innerHTML = data.projects
      .map(
        (p) => `
      <article class="project-card">
        <div class="project-media">
          <img src="${p.image}" alt="${p.alt}" width="1400" height="1050" loading="lazy">
        </div>
        <div class="project-body">
          <div class="project-meta">
            <span>${p.category}</span>
            <span>${p.location}</span>
          </div>
          <h3>${p.title}</h3>
          <p>${p.summary}</p>
        </div>
      </article>`
      )
      .join("");
  }

  // Render references
  const refGrid = document.getElementById("refGrid");
  if (refGrid && Array.isArray(data.references)) {
    refGrid.innerHTML = data.references.map((r) => `<div class="ref-pill">${r}</div>`).join("");
  }

  // Render testimonials
  const testimonialGrid = document.getElementById("testimonialGrid");
  if (testimonialGrid && Array.isArray(data.testimonials)) {
    testimonialGrid.innerHTML = data.testimonials
      .map(
        (t) => `
      <article class="testimonial-card">
        <blockquote>"${t.quote}"</blockquote>
        <cite>— ${t.author}</cite>
      </article>`
      )
      .join("");
  }

  // ROT calculator
  const rotSlider = document.getElementById("rotSlider");
  const rotInputDisplay = document.getElementById("rotInputDisplay");
  const rotGross = document.getElementById("rotGross");
  const rotDeduction = document.getElementById("rotDeduction");
  const rotNet = document.getElementById("rotNet");
  const fmtKr = (n) => `${Math.round(n).toLocaleString("sv-SE")} kr`;

  function updateRot() {
    if (!rotSlider) return;
    const gross = Number(rotSlider.value) || 60000;
    const ded = Math.min(gross * 0.3, 50000);
    const net = gross - ded;
    if (rotInputDisplay) rotInputDisplay.textContent = fmtKr(gross);
    if (rotGross) rotGross.textContent = fmtKr(gross);
    if (rotDeduction) rotDeduction.textContent = `−${fmtKr(ded)}`;
    if (rotNet) rotNet.textContent = fmtKr(net);
  }
  if (rotSlider) {
    rotSlider.addEventListener("input", updateRot);
    updateRot();
  }

  // Render FAQ
  const faqList = document.getElementById("faqList");
  if (faqList && Array.isArray(data.faqs)) {
    faqList.innerHTML = data.faqs
      .map(
        (item, i) => `
      <details class="faq-item"${i === 0 ? " open" : ""}>
        <summary>${item.q}</summary>
        <p>${item.a}</p>
      </details>`
      )
      .join("");
  }

  // Quote form
  const quoteForm = document.getElementById("quoteForm");
  const formStatus = document.getElementById("formStatus");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("qName")?.value.trim();
      const phone = document.getElementById("qPhone")?.value.trim();
      const email = document.getElementById("qEmail")?.value.trim();
      const service = document.getElementById("qService")?.value || "Byggtjänst";
      const message = document.getElementById("qMessage")?.value.trim();

      if (!name || !phone || !message) {
        if (formStatus) formStatus.textContent = "Fyll i namn/företag, telefonnummer och en kort beskrivning.";
        return;
      }

      const subject = encodeURIComponent(`Offertförfrågan: ${service} — ${name}`);
      const body = encodeURIComponent(
        `Namn/Företag: ${name}\nTelefon: ${phone}\nE-post: ${email || "-"}\nOmråde: ${service}\n\nBeskrivning:\n${message}`
      );
      if (formStatus) {
        formStatus.textContent = "Tack! Ditt e-postprogram öppnas nu — eller ring oss direkt på 0451-74 46 46.";
      }
      window.location.href = `mailto:${data.company.email}?subject=${subject}&body=${body}`;
    });
  }
})();
