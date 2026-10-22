(function initDynamicMotionLayer() {
      'use strict';

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const progressFill = document.querySelector('#scrollProgress span');

      let parallaxItems = [];
      let titleObserver = null;

      if ('IntersectionObserver' in window) {
        titleObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-inview');
            titleObserver.unobserve(entry.target);
          });
        }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
      }

      function setScrollProgress() {
        if (!progressFill) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressFill.style.width = Math.max(0, Math.min(100, pct)) + '%';
      }

      function refreshParallaxItems() {
        parallaxItems = Array.from(document.querySelectorAll(
          '.exp-bg-img, .areas-hero-bg, .area-page-hero-bg'
        )).map((el) => ({
          el,
          speed: el.classList.contains('exp-bg-img') ? 0.075 : 0.05
        }));
      }

      function updateParallax() {
        if (reduceMotion || parallaxItems.length === 0) return;
        const vh = window.innerHeight || 1;
        parallaxItems.forEach(({ el, speed }) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -220 || rect.top > vh + 220) return;
          const centerDelta = (rect.top + rect.height / 2) - vh / 2;
          const maxShift = Math.max(8, Math.min(26, rect.height * 0.045));
          const shift = Math.max(-maxShift, Math.min(maxShift, centerDelta * -speed));
          el.style.setProperty('--parallax-y', shift.toFixed(2) + 'px');
        });
      }

      function initTitles() {
        const titles = document.querySelectorAll(
          '.section-title, .about-title-ugaz, .cajas-title, .exp-title, .cta-asesoria-title, ' +
          '.contacto-info h3, .clientes-block-title, .areas-hero-title, ' +
          '.area-page-hero-title, .area-page-detail-title'
        );
        titles.forEach((el) => {
          el.classList.add('motion-title');
          if (reduceMotion || !titleObserver) {
            el.classList.add('is-inview');
            return;
          }
          if (el.dataset.motionTitleObserved === '1') return;
          el.dataset.motionTitleObserved = '1';
          titleObserver.observe(el);
        });
      }

      function resetTilt(card) {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--glow-x', '50%');
        card.style.setProperty('--glow-y', '50%');
      }

      function bindTiltCards() {
        if (reduceMotion || !finePointer) return;
        document.querySelectorAll('.area-card-ugaz, .equipo-card').forEach((card) => {
          if (card.dataset.motionTilt === '1') return;
          card.dataset.motionTilt = '1';
          let raf = 0;

          card.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch') return;
            const rect = card.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
              card.style.setProperty('--tilt-x', (-py * 7).toFixed(2) + 'deg');
              card.style.setProperty('--tilt-y', (px * 7).toFixed(2) + 'deg');
              card.style.setProperty('--glow-x', ((px + 0.5) * 100).toFixed(1) + '%');
              card.style.setProperty('--glow-y', ((py + 0.5) * 100).toFixed(1) + '%');
            });
          });

          card.addEventListener('pointerleave', () => {
            if (raf) cancelAnimationFrame(raf);
            resetTilt(card);
          });
          card.addEventListener('pointercancel', () => resetTilt(card));
        });
      }

      function initMotion() {
        initTitles();
        bindTiltCards();
        refreshParallaxItems();
        updateParallax();
        setScrollProgress();
      }

      window.initDynamicMotion = initMotion;

      let ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          setScrollProgress();
          updateParallax();
          ticking = false;
        });
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        refreshParallaxItems();
        updateParallax();
        setScrollProgress();
      }, { passive: true });

      const dynamicView = document.getElementById('areaDetailView');
      if (dynamicView && 'MutationObserver' in window) {
        const viewObserver = new MutationObserver(() => {
          requestAnimationFrame(initMotion);
        });
        viewObserver.observe(dynamicView, { childList: true, subtree: false });
      }

      document.addEventListener('DOMContentLoaded', initMotion);
      window.addEventListener('load', initMotion, { once: true });
      if (document.readyState !== 'loading') initMotion();
    })();
