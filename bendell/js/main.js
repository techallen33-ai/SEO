/* Heather Bendl Campaign — Main JS */

(function () {
  'use strict';

  /* ----- Navbar scroll shadow + hamburger ----- */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const navLinks = document.querySelector('.navbar__nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  /* ----- Active nav link ----- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----- Donation amount buttons ----- */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('custom-amount');

  if (amountBtns.length) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (customInput) {
          customInput.value = '';
          customInput.placeholder = 'Or enter custom amount';
        }
        updateDonationTotal(btn.dataset.amount);
      });
    });
  }

  if (customInput) {
    customInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
      updateDonationTotal(customInput.value);
    });
  }

  function updateDonationTotal(amount) {
    const totalEl = document.getElementById('donation-total');
    if (totalEl && amount) {
      const num = parseFloat(amount);
      if (!isNaN(num) && num > 0) {
        totalEl.textContent = '$' + num.toFixed(2);
      } else {
        totalEl.textContent = '$0.00';
      }
    }
  }

  /* ----- Donation form validation + PayPal redirect ----- */
  const donateForm = document.getElementById('donate-form');
  if (donateForm) {
    donateForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const selected = document.querySelector('.amount-btn.selected');
      const custom = customInput ? customInput.value : '';
      const amount = selected ? parseFloat(selected.dataset.amount) : parseFloat(custom);

      if (!amount || amount <= 0) {
        showAlert('donate-alert', 'Please select or enter a donation amount.', 'error');
        return;
      }
      if (amount > 1000) {
        showAlert('donate-alert', 'Florida law limits individual contributions to $1,000 per election. Please enter an amount of $1,000 or less.', 'error');
        return;
      }

      const required = ['donor-first', 'donor-last', 'donor-email', 'donor-address', 'donor-city', 'donor-state', 'donor-zip'];
      for (const id of required) {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          showAlert('donate-alert', 'Please fill in all required fields.', 'error');
          el.focus();
          return;
        }
      }

      const certCheck = document.getElementById('certify-eligible');
      if (certCheck && !certCheck.checked) {
        showAlert('donate-alert', 'You must certify that you are eligible to contribute before proceeding.', 'error');
        return;
      }

      // Build PayPal donation URL with pre-filled amount
      // PLACEHOLDER: Replace YOUR_PAYPAL_HOSTED_BUTTON_ID with the actual PayPal hosted button ID
      const paypalBaseUrl = 'https://www.paypal.com/donate';
      const params = new URLSearchParams({
        hosted_button_id: 'YOUR_PAYPAL_HOSTED_BUTTON_ID',
        amount: amount.toFixed(2),
        currency_code: 'USD',
        custom: JSON.stringify({
          name: (document.getElementById('donor-first')?.value || '') + ' ' + (document.getElementById('donor-last')?.value || ''),
          email: document.getElementById('donor-email')?.value || '',
          employer: document.getElementById('donor-employer')?.value || '',
          occupation: document.getElementById('donor-occupation')?.value || ''
        })
      });

      // Notify user and redirect to PayPal
      showAlert('donate-alert', 'Redirecting you to PayPal to complete your secure donation...', 'success');
      setTimeout(() => {
        window.location.href = paypalBaseUrl + '?' + params.toString();
      }, 1500);
    });
  }

  /* ----- Volunteer form submission ----- */
  const volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const required = ['vol-first', 'vol-last', 'vol-email', 'vol-phone'];
      for (const id of required) {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          showAlert('volunteer-alert', 'Please fill in all required fields.', 'error');
          el.focus();
          return;
        }
      }
      showAlert('volunteer-alert', 'Thank you for signing up to volunteer! A member of the Bendl campaign team will reach out to you shortly.', 'success');
      volunteerForm.reset();
    });
  }

  /* ----- Contact form submission ----- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const required = ['contact-name', 'contact-email', 'contact-message'];
      for (const id of required) {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          showAlert('contact-alert', 'Please fill in all required fields.', 'error');
          el.focus();
          return;
        }
      }
      showAlert('contact-alert', 'Thank you for reaching out! We will get back to you within 1–2 business days.', 'success');
      contactForm.reset();
    });
  }

  /* ----- Alert helper ----- */
  function showAlert(containerId, message, type) {
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      const form = document.querySelector('form');
      if (form) form.insertBefore(container, form.firstChild);
    }
    container.className = 'alert alert--' + type;
    container.textContent = message;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') {
      setTimeout(() => { container.classList.add('hidden'); }, 7000);
    }
  }

  /* ----- Smooth scroll for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----- Intersection observer for fade-in ----- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.why-card, .issue-card, .involve-card, .platform-item, .volunteer-way-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

})();
