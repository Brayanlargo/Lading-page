(function startCountdown() {
  var endTime = Date.now() + 24 * 60 * 60 * 1000;

  var hoursEl = document.getElementById('hours');
  var minsEl  = document.getElementById('mins');
  var secsEl  = document.getElementById('secs');

  function update() {
    var remaining = endTime - Date.now();
    if (remaining < 0) remaining = 0;

    var h = (remaining / 3600000) | 0;
    var m = ((remaining % 3600000) / 60000) | 0;
    var s = ((remaining % 60000) / 1000) | 0;

    if (hoursEl) hoursEl.textContent = (h < 10 ? '0' : '') + h;
    if (minsEl)  minsEl.textContent  = (m < 10 ? '0' : '') + m;
    if (secsEl)  secsEl.textContent  = (s < 10 ? '0' : '') + s;
  }

  update();
  setInterval(update, 1000);
})();


function toggleFaq(button) {
  var item = button.parentElement;
  var isOpen = item.classList.contains('open');

  var openItems = document.querySelectorAll('.faq-item.open');
  for (var i = 0; i < openItems.length; i++) {
    openItems[i].classList.remove('open');
  }

  if (!isOpen) item.classList.add('open');
}


async function handleSubmit(event) {
  event.preventDefault();

  var nombre  = document.getElementById('nombre');
  var email   = document.getElementById('email');
  var ciudad  = document.getElementById('ciudad');
  var interes = document.getElementById('interes');

  var form      = document.getElementById('contactForm');
  var submitBtn = form.querySelector('button[type="submit"]');
  var successDiv = document.getElementById('form-success');

  // reset errores (más rápido con for loop clásico)
  var errorEls = document.querySelectorAll('.form-error');
  for (var i = 0; i < errorEls.length; i++) {
    errorEls[i].textContent = '';
  }

  var inputEls = document.querySelectorAll('.form-group input');
  for (var j = 0; j < inputEls.length; j++) {
    inputEls[j].style.borderColor = '';
  }

  var valid = true;

  if (!nombre.value.trim()) {
    document.getElementById('error-nombre').textContent = 'Por favor ingresa tu nombre.';
    nombre.style.borderColor = '#c0392b';
    valid = false;
  }

  var emailValue = email.value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValue) {
    document.getElementById('error-email').textContent = 'Por favor ingresa tu correo.';
    email.style.borderColor = '#c0392b';
    valid = false;
  } else if (!emailRegex.test(emailValue)) {
    document.getElementById('error-email').textContent = 'Ingresa un correo válido.';
    email.style.borderColor = '#c0392b';
    valid = false;
  }

  if (!valid) return;

  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  var payload = {
    fields: [
      { name: 'firstname', value: nombre.value.trim() },
      { name: 'email', value: emailValue },
      { name: 'city', value: ciudad.value.trim() },
      { name: 'message', value: interes.value }
    ],
    context: {
      pageUri: location.href,
      pageName: document.title
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: 'Acepto el tratamiento de mis datos'
      }
    }
  };

  try {
    var response = await fetch(
      'https://api.hsforms.com/submissions/v3/integration/submit/51321595/8c16cb76-461b-402f-b9bd-5e69306254ac',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      var allFields = form.querySelectorAll('input, select, button');
      for (var k = 0; k < allFields.length; k++) {
        allFields[k].disabled = true;
      }
      successDiv.style.display = 'block';
    } else {
      submitBtn.textContent = 'Quiero mi descuento →';
      submitBtn.disabled = false;
      alert('Hubo un problema al enviar. Intenta de nuevo.');
    }
  } catch (err) {
    submitBtn.textContent = 'Quiero mi descuento →';
    submitBtn.disabled = false;
    alert('Error de conexión. Verifica tu internet e intenta de nuevo.');
  }
}


// HEADER scroll optimizado (evita ejecutar DOM style en cada scroll)
(function headerScroll() {
  var header = document.querySelector('header');
  if (!header) return;

  var lastState = false;

  window.addEventListener('scroll', function () {
    var scrolled = window.scrollY > 10;

    if (scrolled === lastState) return;
    lastState = scrolled;

    header.style.boxShadow = scrolled
      ? '0 2px 16px rgba(45,30,15,0.08)'
      : 'none';
  }, { passive: true });
})();


// SCROLL REVEAL optimizado
(function scrollReveal() {
  var elements = document.querySelectorAll('.benefit-card, .testi-card, .cat-card, .paso');
  if (!('IntersectionObserver' in window)) return;

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.opacity = '0';
    elements[i].style.transform = 'translateY(20px)';
    elements[i].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (entry.isIntersecting) {
        var el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }
  }, { threshold: 0.15 });

  for (var j = 0; j < elements.length; j++) {
    observer.observe(elements[j]);
  }
})();
