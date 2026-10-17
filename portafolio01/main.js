(() => {
  "use strict";

  const themeBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const THEME_KEY = "cv-theme";

  // Función para aplicar y guardar el tema
  function applyTheme(theme) {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // Ignorar si localStorage está bloqueado
    }
  }

  // Comprobar preferencia guardada o de sistema al cargar
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
    } catch (e) {}
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Inicializar tema
  applyTheme(getInitialTheme());

  // Manejar click en el botón de cambiar tema
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = root.dataset.theme;
      const next = current === "dark" ? "light" : "dark";
      
      // Si el navegador no soporta View Transitions API, cambiar de inmediato
      if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        applyTheme(next);
        return;
      }
      
      // Animación de transición (efecto circular expansivo)
      const transition = document.startViewTransition(() => applyTheme(next));
      
      transition.ready.then(() => {
        const rect = themeBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { 
            duration: 500, 
            easing: "cubic-bezier(0.22, 1, 0.36, 1)", 
            pseudoElement: "::view-transition-new(root)" 
          }
        );
      });
    });
  }
})();