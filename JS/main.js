// Navegação mobile e header
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');
const headerEl = document.querySelector('header');
const backToTop = document.querySelector('.back-to-top');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
    }
  });
}

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

// Rotação de depoimentos (index)
const testimonials = Array.from(document.querySelectorAll('.testimonial-item'));
const dots = Array.from(document.querySelectorAll('.testimonial-dot'));
if (testimonials.length > 0 && dots.length > 0) {
  let timer;
  let current = testimonials.findIndex((item) => item.classList.contains('active'));
  if (current === -1) current = 0;

  const setActive = (index) => {
    testimonials.forEach((item, idx) => {
      const isActive = idx === index;
      item.classList.toggle('active', isActive);
      dots[idx]?.classList.toggle('active', isActive);
    });
  };

  const start = () => {
    timer = setInterval(() => {
      current = (current + 1) % testimonials.length;
      setActive(current);
    }, 5200);
  };

  start();
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      current = idx;
      setActive(current);
      start();
    });
  });
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
