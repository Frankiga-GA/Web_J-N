(function (global) {
  'use strict';

  let settings = { once: true, duration: 800 };
  let observer = null;

  function prepare() {
    const items = document.querySelectorAll('[data-aos]');
    items.forEach((item) => {
      item.classList.add('aos-ready');
      const delay = Math.max(0, Number(item.dataset.aosDelay) || 0);
      const duration = Math.max(0, Number(item.dataset.aosDuration) || settings.duration);
      item.style.setProperty('--aos-delay', `${delay}ms`);
      item.style.setProperty('--aos-duration', `${duration}ms`);
      if (!observer) {
        item.classList.add('aos-animate');
      } else if (!(settings.once && item.classList.contains('aos-animate'))) {
        observer.observe(item);
      }
    });
  }

  global.AOS = {
    init(options) {
      settings = Object.assign({ once: true, duration: 800 }, options || {});
      if ('IntersectionObserver' in global && !observer) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('aos-animate');
              if (settings.once) observer.unobserve(entry.target);
            } else if (!settings.once) {
              entry.target.classList.remove('aos-animate');
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
      }
      prepare();
    },
    refresh() {
      prepare();
    }
  };
})(window);
