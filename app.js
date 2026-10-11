/**
 * МОНОПОЛИЯ — Логика иллюстрированной инструкции
 * Подсветка оглавления, мобильное меню, QR-код и печать
 */

document.addEventListener('DOMContentLoaded', () => {
  // Вычисляем локальный адрес для телефона
  const currentHost = window.location.hostname;
  const currentPort = window.location.port || '8080';
  // Если открыт по localhost или файлу, используем локальный IP для телефона
  const phoneHost = (currentHost === 'localhost' || currentHost === '127.0.0.1' || !currentHost) 
    ? '192.168.31.151' 
    : currentHost;
  const phoneUrl = `http://${phoneHost}:${currentPort}/index.html`;

  // 1. Кнопка печати
  const printBtn = document.getElementById('print-book-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 2. Модальное окно QR-кода для телефона
  const phoneQrBtn = document.getElementById('phone-qr-btn');
  const qrModal = document.getElementById('qr-modal');
  const closeQrBtn = document.getElementById('close-qr-btn');
  const qrImage = document.getElementById('qr-image');
  const phoneUrlInput = document.getElementById('phone-url-input');
  const copyUrlBtn = document.getElementById('copy-url-btn');
  const copyStatus = document.getElementById('copy-status');

  if (phoneUrlInput) {
    phoneUrlInput.value = phoneUrl;
  }

  function openQrModal() {
    if (qrImage) {
      // Генерируем QR-код через надежный и быстрый сервис
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=4&data=${encodeURIComponent(phoneUrl)}`;
    }
    if (qrModal) qrModal.classList.remove('hidden');
  }

  function closeQrModal() {
    if (qrModal) qrModal.classList.add('hidden');
  }

  if (phoneQrBtn) phoneQrBtn.addEventListener('click', openQrModal);
  if (closeQrBtn) closeQrBtn.addEventListener('click', closeQrModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  // Копирование ссылки
  if (copyUrlBtn && phoneUrlInput) {
    copyUrlBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(phoneUrlInput.value).then(() => {
        copyStatus.classList.remove('hidden');
        setTimeout(() => {
          copyStatus.classList.add('hidden');
        }, 2500);
      });
    });
  }

  // 3. Мобильный Drawer (Оглавление)
  const mobileTocBtn = document.getElementById('mobile-toc-btn');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (drawerOverlay) drawerOverlay.classList.remove('hidden');
  }

  function closeDrawer() {
    if (drawerOverlay) drawerOverlay.classList.add('hidden');
  }

  if (mobileTocBtn) mobileTocBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });


  // 5. Кнопка «Наверх» на мобильном
  const mobileTopBtn = document.getElementById('mobile-top-btn');
  if (mobileTopBtn) {
    mobileTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Подсветка текущей главы в оглавлении при скролле
  const chapters = document.querySelectorAll('.manual-chapter');
  const tocLinks = document.querySelectorAll('.toc-link');

  function updateActiveToc() {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    chapters.forEach(ch => {
      const top = ch.offsetTop;
      const height = ch.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = ch.getAttribute('id');
      }
    });

    if (currentId) {
      tocLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveToc, { passive: true });
  updateActiveToc();
});
