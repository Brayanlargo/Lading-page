(function startCountdown() {
  var endTime = Date.now() + 24 * 60 * 60 * 1000;

  function update() {
    var remaining = endTime - Date.now();
    if (remaining <= 0) remaining = 0;

    var h = Math.floor(remaining / 3600000);
    var m = Math.floor((remaining % 3600000) / 60000);
    var s = Math.floor((remaining % 60000) / 1000);

    var hoursEl = document.getElementById('hours');
    var minsEl  = document.getElementById('mins');
    var secsEl  = document.getElementById('secs');

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl)  minsEl.textContent  = String(m).padStart(2, '0');
    if (secsEl)  secsEl.textContent  = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

function toggleFaq(button) {
  var item = button.parentElement;
  var isOpen = item.classList.contains('open');

  document.querySelectorAll('.faq-item.open').forEach(function (el) {
    el.classList.remove('open');
  });

  if (!isOpen) {
    item.classList.add('open');
  }
}

function handleSubmit(event) {
  event.preventDefault();

  var nombre = document.getElementById('nombre');
  var email  = document.getElementById('email');
  var valid  = true;

  document.querySelectorAll('.form-error').forEach(function (el) {
    el.textContent = '';
  });
  document.querySelectorAll('.form-group input').forEach(function (el) {
    el.style.borderColor = '';
  });

  if (!nombre.value.trim()) {
    document.getElementById('error-nombre').textContent = 'Por favor ingresa tu nombre.';
    nombre.style.borderColor = '#c0392b';
    valid = false;
  }

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    document.getElementById('error-email').textContent = 'Por favor ingresa tu correo.';
    email.style.borderColor = '#c0392b';
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    document.getElementById('error-email').textContent = 'Ingresa un correo válido.';
    email.style.borderColor = '#c0392b';
    valid = false;
  }

  if (!valid) return;

  var form    = document.getElementById('contactForm');
  var success = document.getElementById('form-success');

  form.querySelectorAll('input, select, button').forEach(function (el) {
    el.disabled = true;
  });

  success.style.display = 'block';

  console.log('Datos del formulario:', {
    nombre: nombre.value.trim(),
    email:  email.value.trim(),
    ciudad: document.getElementById('ciudad').value.trim(),
    interes: document.getElementById('interes').value
  });
}

(function headerScroll() {
  var header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 16px rgba(45,30,15,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
})();

(function scrollReveal() {
  var elements = document.querySelectorAll('.benefit-card, .testi-card, .cat-card, .paso');

  if (!('IntersectionObserver' in window)) return;

  elements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();