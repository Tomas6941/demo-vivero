/* ================================================================
   sidebar.js
   - Detecta si el dispositivo es táctil y agrega .is-touch al <html>
   - Desktop (no táctil): sidebar se abre con hover en el borde
   - Touch (táctil): sidebar se abre con el botón hamburguesa
   Debe cargarse al FINAL del <body>
   ================================================================ */
(function () {

  /* ── 1. Detección táctil real ──
     Se considera táctil si el dispositivo tiene touchpoints Y
     no tiene puntero fino (mouse). Esto excluye laptops con touchpad
     y tablets con teclado conectado en modo desktop.           */
  function detectTouch() {
    const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    // Si tiene touch PERO también tiene mouse fino → desktop con touchscreen
    // Solo marcamos touch si NO tiene puntero fino
    return hasTouch && !hasFinePointer;
  }

  if (detectTouch()) {
    document.documentElement.classList.add('is-touch');
  }

  /* ── 2. Referencias DOM ── */
  const sidebar = document.getElementById('sidebar');
  const trigger = document.getElementById('sidebarTrigger');
  const toggle  = document.getElementById('sidebarToggle');
  const overlay = document.getElementById('sidebarOverlay');

  if (!sidebar) return;

  const isTouch = () => document.documentElement.classList.contains('is-touch');

  /* ── 3. Abrir / cerrar ── */
  function openSidebar() {
    sidebar.classList.add('expanded');
    if (isTouch()) {
      if (overlay) {
        overlay.style.display = 'block';
        requestAnimationFrame(() => overlay.classList.add('visible'));
      }
      if (toggle) toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSidebar() {
    sidebar.classList.remove('expanded');
    if (overlay) {
      overlay.classList.remove('visible');
      setTimeout(() => {
        if (!overlay.classList.contains('visible')) overlay.style.display = 'none';
      }, 260);
    }
    if (toggle) toggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── 4. Desktop: hover sobre la franja del trigger ── */
  let hideTimer;

  if (trigger) {
    trigger.addEventListener('mouseenter', () => { if (!isTouch()) openSidebar(); });
    trigger.addEventListener('mouseleave', () => { if (!isTouch()) hideTimer = setTimeout(closeSidebar, 200); });
  }

  sidebar.addEventListener('mouseenter', () => { if (!isTouch()) clearTimeout(hideTimer); });
  sidebar.addEventListener('mouseleave', () => { if (!isTouch()) hideTimer = setTimeout(closeSidebar, 200); });

  /* ── 5. Touch: botón hamburguesa ── */
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.contains('expanded') ? closeSidebar() : openSidebar();
    });
  }

  /* ── 6. Touch: cerrar al tocar el overlay ── */
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ── 7. Touch: cerrar al navegar ── */
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => { if (isTouch()) closeSidebar(); });
  });

})();
