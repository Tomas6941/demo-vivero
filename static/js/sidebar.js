/* ================================================================
   sidebar.js — Lógica de apertura/cierre del sidebar
   Desktop: hover sobre el borde izquierdo
   Móvil/táctil: botón hamburguesa
   ================================================================ */
(function () {
  const sidebar  = document.getElementById('sidebar');
  const trigger  = document.getElementById('sidebarTrigger');
  const toggle   = document.getElementById('sidebarToggle');
  const overlay  = document.getElementById('sidebarOverlay');

  if (!sidebar) return;

  // ── Detección de dispositivo táctil ──
  const isTouch = () => window.matchMedia('(max-width: 768px)').matches
                     || ('ontouchstart' in window)
                     || (navigator.maxTouchPoints > 0);

  // ── Abrir ──
  function openSidebar() {
    sidebar.classList.add('expanded');
    if (overlay) {
      overlay.style.display = 'block';
      requestAnimationFrame(() => overlay.classList.add('visible'));
    }
    if (toggle) toggle.classList.add('open');
    document.body.style.overflow = isTouch() ? 'hidden' : '';
  }

  // ── Cerrar ──
  function closeSidebar() {
    sidebar.classList.remove('expanded');
    if (overlay) {
      overlay.classList.remove('visible');
      // Esperar transición antes de ocultar el elemento
      overlay.addEventListener('transitionend', () => {
        if (!overlay.classList.contains('visible')) overlay.style.display = 'none';
      }, { once: true });
    }
    if (toggle) toggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Desktop: hover sobre la franja del trigger ──
  let hideTimer = null;

  if (trigger) {
    trigger.addEventListener('mouseenter', () => {
      if (!isTouch()) openSidebar();
    });
    trigger.addEventListener('mouseleave', () => {
      if (!isTouch()) {
        hideTimer = setTimeout(closeSidebar, 200);
      }
    });
  }

  sidebar.addEventListener('mouseenter', () => {
    if (!isTouch()) clearTimeout(hideTimer);
  });

  sidebar.addEventListener('mouseleave', () => {
    if (!isTouch()) {
      hideTimer = setTimeout(closeSidebar, 200);
    }
  });

  // ── Móvil: botón hamburguesa ──
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.contains('expanded') ? closeSidebar() : openSidebar();
    });
  }

  // ── Móvil: cerrar al tocar el overlay ──
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // ── Cerrar al hacer clic en un link (móvil) ──
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (isTouch()) closeSidebar();
    });
  });

  // ── Al cambiar tamaño de pantalla, resetear estado ──
  window.addEventListener('resize', () => {
    if (!isTouch()) {
      if (overlay) { overlay.classList.remove('visible'); overlay.style.display = 'none'; }
      if (toggle)  toggle.classList.remove('open');
      document.body.style.overflow = '';
      // No forzar close — el hover CSS se encarga en desktop
    }
  });

})();
