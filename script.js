(function startCountdown() {
  var endTime = Date.now() + 24 * 60 * 60 * 1000;

  var hoursEl = document.getElementById('hours');
  var minsEl  = document.getElementById('mins');
  var secsEl  = document.getElementById('secs');

  function update() {
    var remaining = endTime - Date.now();
    if (remaining < 0) remaining = 0;

    var h = Math.floor(remaining / 3600000);
    var m = Math.floor((remaining % 3600000) / 60000);
    var s = Math.floor((remaining % 60000) / 1000);

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

  var openItems = document.querySelectorAll('.faq-item.open');
  for (var i = 0; i < openItems.length; i++) {
    openItems[i].classList.remove('open');
  }

  if (!isOpen) {
    item.classList.add('open');
  }
}


async function handleSubmit(event) {
  event.preventDefault();

  var nombre  = document.getElementById('nombre');
  var email   = document.getElementById('email');
  var ciudad  = document.getElementById('ciudad');
  var interes = document.getElementById('interes');

  var form       = document.getElementById('contactForm');
  var submitBtn  = form.querySelector('button[type="submit"]');
  var successDiv = document.getElementById('form-success');

  var valid = true;

  var errorEls = document.querySelectorAll('.form-error');
  for (var i = 0; i < errorEls.length; i++) {
    errorEls[i].textContent = '';
  }

  var inputEls = document.querySelectorAll('.form-group input');
  for (var j = 0; j < inputEls.length; j++) {
    inputEls[j].style.borderColor = '';
  }

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

  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;

  var payload = {
    fields: [
      { name: 'firstname', value: nombre.value.trim() },
      { name: 'email',     value: email.value.trim() },
      { name: 'city',      value: ciudad.value.trim() },
      { name: 'message',   value: interes.value }
    ],
    context: {
      pageUri: window.location.href,
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
      var errorData = await response.json();
      console.error('Error HubSpot:', errorData);

      submitBtn.textContent = 'Quiero mi descuento →';
      submitBtn.disabled = false;

      alert('Hubo un problema al enviar. Intenta de nuevo.');
    }
  } catch (err) {
    console.error('Error de red:', err);

    submitBtn.textContent = 'Quiero mi descuento →';
    submitBtn.disabled = false;

    alert('Error de conexión. Verifica tu internet e intenta de nuevo.');
  }
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

  for (var i = 0; i < elements.length; i++) {
    elements[i].style.opacity = '0';
    elements[i].style.transform = 'translateY(20px)';
    elements[i].style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        var el = entries[i].target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el);
      }
    }
  }, { threshold: 0.15 });

  for (var j = 0; j < elements.length; j++) {
    observer.observe(elements[j]);
  }
})();
