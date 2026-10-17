"use strict";

// Resalta el enlace de navegación correspondiente a la sección visible.
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const linksBySectionId = new Map(
  navigationLinks.map((link) => [link.getAttribute("href").slice(1), link])
);
const observedSections = [...linksBySectionId.keys()]
  .map((sectionId) => document.getElementById(sectionId))
  .filter(Boolean);
let currentNavigationLink = null;

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const nextNavigationLink = linksBySectionId.get(entry.target.id);
      if (!nextNavigationLink || nextNavigationLink === currentNavigationLink) continue;
      currentNavigationLink?.removeAttribute("aria-current");
      nextNavigationLink.setAttribute("aria-current", "location");
      currentNavigationLink = nextNavigationLink;
    }
  }, { rootMargin: "-25% 0px -60% 0px" });

  observedSections.forEach((section) => sectionObserver.observe(section));
}
