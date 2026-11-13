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

})();
