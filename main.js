/* ============================================================
   RAMES - Main JavaScript
   Mobile Nav, Modal Lead Capture, Direct WhatsApp Dispatch
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) mobileToggle.textContent = '☰';
      }
    });
  });

  // 2. Modal Lead Capture
  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) {
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // 3. Form Submission (Direct WhatsApp Integration)
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const contact = document.getElementById('clientContact').value.trim();
      const module = document.getElementById('clientModule').value;
      const msg = document.getElementById('clientMsg').value.trim();

      const text = `*Demande de Projet - RAMES*%0A%0A*Client / Entreprise:* ${encodeURIComponent(name)}%0A*Contact:* ${encodeURIComponent(contact)}%0A*Module choisi:* ${encodeURIComponent(module)}%0A*Message:* ${encodeURIComponent(msg || 'Je souhaite échanger sur une solution adaptée.')}`;

      // Official RAMES WhatsApp (+237 655 06 81 05)
      const waUrl = `https://wa.me/237655068105?text=${text}`;

      window.open(waUrl, '_blank');

      if (modal) modal.classList.remove('active');
      modalForm.reset();
      alert('Merci ! Vous allez être redirigé vers WhatsApp pour échanger directement avec un expert RAMES.');
    });
  }
});
