// Navegação mobile e header
const navToggle = null;
const nav = document.querySelector('nav');
const navOverlay = null;
const headerEl = document.querySelector('header');
const backToTop = document.querySelector('.back-to-top');

// Nav is always visible; toggle removed

// Smooth scroll para links internos
const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId && targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Fade-in ao rolar
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// Botão voltar ao topo e header scrolled
if (backToTop && headerEl) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 320;
    backToTop.classList.toggle('show', scrolled);
    headerEl.classList.toggle('scrolled', window.scrollY > 24);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Auto-scroll infinito de logos via CSS
const logoTrack = document.getElementById('logoTrack');
if (logoTrack) {
  const logoCards = Array.from(logoTrack.querySelectorAll('.logo-card'));
  const originalHTML = logoTrack.innerHTML;
  
  // Duplicar o conteúdo várias vezes para loop infinito
  for (let i = 0; i < 4; i++) {
    logoTrack.innerHTML += originalHTML;
  }
}

// Drag to scroll para carrossel de portfólio
const portfolioCarousel = document.querySelector('.portfolio-carousel');
if (portfolioCarousel) {
  let isDown = false;
  let startX;
  let scrollLeft;

  portfolioCarousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - portfolioCarousel.offsetLeft;
    scrollLeft = portfolioCarousel.scrollLeft;
  });

  portfolioCarousel.addEventListener('mouseleave', () => {
    isDown = false;
  });

  portfolioCarousel.addEventListener('mouseup', () => {
    isDown = false;
  });

  portfolioCarousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - portfolioCarousel.offsetLeft;
    const walk = (x - startX) * 2; // velocidade do scroll
    portfolioCarousel.scrollLeft = scrollLeft - walk;
  });

  // Navegação e contador de projetos
  const items = Array.from(document.querySelectorAll('.portfolio-item'));
  const counter = document.querySelector('.portfolio-counter');
  const prevBtn = document.querySelector('.portfolio-nav-btn.prev');
  const nextBtn = document.querySelector('.portfolio-nav-btn.next');
  let currentIndex = 0;

  const updateCounter = () => {
    if (counter && items.length) {
      counter.textContent = `${currentIndex + 1}/${items.length}`;
    }
  };

  const scrollToIndex = (idx) => {
    if (!items.length) return;
    currentIndex = (idx + items.length) % items.length;
    items[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    updateCounter();
  };

  const syncIndexWithScroll = () => {
    if (!items.length) return;
    const center = portfolioCarousel.getBoundingClientRect().left + portfolioCarousel.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    currentIndex = closest;
    updateCounter();
  };

  let scrollTimeout;
  portfolioCarousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(syncIndexWithScroll, 120);
  });

  if (prevBtn) prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));

  updateCounter();
}

// Formulário de contato (contato.html)
const form = document.getElementById('contact-form');
const statusBox = document.getElementById('status');
if (form && statusBox) {
  const showStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.className = `status ${type}`;
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const telefone = form.telefone.value.trim();
    const mensagem = form.mensagem.value.trim();

    if (!nome || !email || !telefone || !mensagem) {
      showStatus('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (!isEmailValid(email)) {
      showStatus('Insira um email válido.', 'error');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    setTimeout(() => {
      showStatus('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensagem';
      }
    }, 400);
  });
}
