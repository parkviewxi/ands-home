// 앤드스퀘어 홈페이지 공통 스크립트 (외부 의존 없음)
(function () {
  'use strict';

  // 모바일 메뉴
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // 수행실적 필터
  var filter = document.querySelector('.filter');
  if (filter) {
    var cards = document.querySelectorAll('.proj');
    filter.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var key = btn.getAttribute('data-filter');
      filter.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      cards.forEach(function (c) {
        var tags = (c.getAttribute('data-tags') || '').split(' ');
        c.hidden = !(key === 'all' || tags.indexOf(key) !== -1);
      });
    });
  }
})();
