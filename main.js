/**
 * JAMA ENTERPRISE — main.js
 *
 * FORMSPREE SETUP (one-time, takes 2 minutes):
 * ─────────────────────────────────────────────
 * 1. Go to https://formspree.io and sign up for a free account
 * 2. Click "New Form", give it a name (e.g. "Jama Enquiry")
 * 3. Copy your form ID — it looks like: xpwzabcd
 * 4. Paste it below in FORMSPREE_ID (replace YOUR_FORMSPREE_ID)
 * 5. Formspree will send every submission directly to your email
 *
 * Free plan: 50 submissions/month — enough for a B2B site
 */

const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // ← Replace this

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile Menu ── */
  var menu      = document.getElementById('mobileMenu');
  var overlay   = document.getElementById('mobileOverlay');
  var hamburger = document.getElementById('hamburger');
  var closeBtn  = document.getElementById('mobileClose');

  function openMenu()  { menu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { menu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ── Form Validation ── */
  function clearAll() {
    ['name', 'phone', 'email', 'service', 'message'].forEach(function (f) {
      var el  = document.getElementById('e_' + f);
      var inp = document.getElementById('f_' + f);
      if (el)  el.textContent = '';
      if (inp) inp.classList.remove('invalid');
    });
  }

  function setErr(field, msg) {
    var inp = document.getElementById('f_' + field);
    var err = document.getElementById('e_' + field);
    if (inp) inp.classList.add('invalid');
    if (err) err.textContent = msg;
  }

  function validate() {
    clearAll();
    var ok      = true;
    var name    = document.getElementById('f_name').value.trim();
    var phone   = document.getElementById('f_phone').value.trim();
    var email   = document.getElementById('f_email').value.trim();
    var service = document.getElementById('f_service').value;
    var message = document.getElementById('f_message').value.trim();

    if (!name)                                        { setErr('name',    'Please enter your full name.');                   ok = false; }
    if (!phone)                                       { setErr('phone',   'Phone number is required.');                     ok = false; }
    else if (!/^[6-9]\d{9}$/.test(phone))            { setErr('phone',   'Enter a valid 10-digit Indian mobile number.');  ok = false; }
    if (!email)                                       { setErr('email',   'Email address is required.');                    ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('email', 'Enter a valid email address.');                ok = false; }
    if (!service)                                     { setErr('service', 'Please select a service.');                      ok = false; }
    if (!message)                                     { setErr('message', 'Please describe your requirements.');            ok = false; }

    return ok;
  }

  /* ── Form Submit → Formspree ── */
  document.getElementById('enquiryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    document.getElementById('msg_success').style.display = 'none';
    document.getElementById('msg_error').style.display   = 'none';

    if (!validate()) return;

    var btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending...';
    btn.disabled    = true;

    var payload = {
      name:    document.getElementById('f_name').value.trim(),
      company: document.getElementById('f_company').value.trim() || 'N/A',
      phone:   document.getElementById('f_phone').value.trim(),
      email:   document.getElementById('f_email').value.trim(),
      service: document.getElementById('f_service').value,
      message: document.getElementById('f_message').value.trim()
    };

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(function (res) {
      if (res.ok) {
        document.getElementById('msg_success').style.display = 'block';
        document.getElementById('enquiryForm').reset();
        clearAll();
      } else {
        return res.json().then(function (data) { throw data; });
      }
    })
    .catch(function () {
      document.getElementById('msg_error').style.display = 'block';
    })
    .finally(function () {
      btn.textContent = 'Send Enquiry →';
      btn.disabled    = false;
    });
  });

});
