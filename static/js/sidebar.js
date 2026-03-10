/* sidebar.js — Activación del sidebar por posición del cursor */
(function () {
  const sidebar  = document.getElementById('sidebar');
  const trigger  = document.querySelector('.sidebar-trigger');
  if (!sidebar || !trigger) return;

  let hideTimer = null;

  function showSidebar() {
    clearTimeout(hideTimer);
    sidebar.classList.add('expanded');
  }

  function hideSidebar() {
    // Pequeño delay para no cerrar si el cursor se mueve hacia el sidebar
    hideTimer = setTimeout(() => {
      sidebar.classList.remove('expanded');
    }, 180);
  }

  // Abrir al tocar la franja izquierda (trigger)
  trigger.addEventListener('mouseenter', showSidebar);

  // Mantener abierto mientras el cursor está dentro del sidebar
  sidebar.addEventListener('mouseenter', showSidebar);
  sidebar.addEventListener('mouseleave', hideSidebar);

  // Cerrar si el cursor sale del trigger sin entrar al sidebar
  trigger.addEventListener('mouseleave', hideSidebar);
})();