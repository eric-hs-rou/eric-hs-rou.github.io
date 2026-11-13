/* Vanilla, no dependencies. Every feature degrades to the full static page. */
(function () {
  var d = document, $ = function (s, c) { return (c || d).querySelector(s); },
      $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  // Reveal controls that need JavaScript; assemble the email address.
  $$('[data-js]').forEach(function (e) { e.hidden = false; });
  $$('.email').forEach(function (e) {
    var a = d.createElement('a'), m = e.getAttribute('data-u') + '@' + e.getAttribute('data-d');
    a.href = 'mailto:' + m; a.textContent = m; e.textContent = ''; e.appendChild(a);
  });

  // Publication filters: type and year (default: all). State lives in the URL hash, e.g. #type=journal&year=2025.
  var pubs = $$('.pub[data-type]'), st = { type: 'all', year: '' };
  if (!pubs.length) return;
  function readHash() {
    st.type = 'all'; st.year = '';
    location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) { var k = kv.slice(0, i); if (k in st) st[k] = decodeURIComponent(kv.slice(i + 1)); }
    });
  }
  function writeHash() {
    var parts = [];
    if (st.type !== 'all') parts.push('type=' + encodeURIComponent(st.type));
    if (st.year) parts.push('year=' + encodeURIComponent(st.year));
    history.replaceState(null, '', parts.length ? '#' + parts.join('&') : location.pathname + location.search);
  }
  function apply() {
    var shown = 0;
    pubs.forEach(function (p) {
      p.hidden = !((st.type === 'all' || p.getAttribute('data-type') === st.type) &&
        (!st.year || p.getAttribute('data-year') === st.year));
      if (!p.hidden) shown++;
    });
    $$('.pubsec, .pubsec .group').forEach(function (g) {
      g.hidden = !$$('.pub', g).some(function (p) { return !p.hidden; });
    });
    var s = $('#f-status'); if (s) s.textContent = shown + ' of ' + pubs.length + ' entries shown';
    $$('.chip[data-type]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-type') === st.type); });
    var y = $('#f-year'); if (y) y.value = st.year;
  }
  $$('.chip[data-type]').forEach(function (b) {
    b.addEventListener('click', function () { st.type = b.getAttribute('data-type'); apply(); writeHash(); });
  });
  var y = $('#f-year');
  if (y) y.addEventListener('change', function () { st.year = y.value; apply(); writeHash(); });
  readHash(); apply();
  addEventListener('hashchange', function () { readHash(); apply(); });
})();
