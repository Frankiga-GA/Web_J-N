/* ============================================================
   CAPA DE ANIMACIÓN J&N
   GSAP + ScrollTrigger + SplitText + Flip + Lenis (cargados por CDN con defer).

   - Este archivo se ejecuta ANTES que las librerías del CDN (todos son defer): por eso
     define primero su API (window.JNMotion y window.AOS) y espera a DOMContentLoaded
     para iniciar GSAP.
   - Si el CDN falla, el usuario pidió reducir movimiento o la carga tarda más de 4 s
     (ver script en <head>), no se anima nada y todo el contenido queda visible.
   - Atributos que usa el HTML:
       data-anim="eyebrow"      etiqueta pequeña con línea plateada que se dibuja
       data-anim="fade"         aparición con subida suave
       data-anim="stagger"      sus hijos aparecen escalonados
       data-anim="mask"         revelado con máscara (clip-path) + zoom interno
       data-anim="scrub-words"  cada palabra se ilumina según avanza el scroll
       data-aos="fade-up|..."   compatibilidad con el marcado anterior (vistas internas)
       data-magnetic            botón magnético (solo escritorio)
   ============================================================ */
(function (global) {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = global.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Títulos que se dividen en líneas con máscara.
  const SPLIT_SEL = [
    '.section-title', '.about-title-ugaz', '.areas-hero-title', '.exp-title', '.cajas-title',
    '.area-page-hero-title', '.area-page-detail-title', '.areas-discovery-copy h3', '.contacto-info h3'
  ].join(', ');
  // Imágenes de fondo con parallax.
  const PARALLAX_SEL = '.areas-hero-bg, .exp-bg-img, .area-page-hero-bg';

  let gsap = null;
  let ScrollTrigger = null;
  let lenis = null;
  let animOn = false;          // animaciones GSAP activas
  const done = new WeakSet();  // elementos ya preparados

  function headerOffset() {
    const header = document.getElementById('header');
    return header ? header.offsetHeight : 70;
  }

  function resolveTarget(target) {
    if (!target) return null;
    if (typeof target !== 'string') return target;
    try { return document.querySelector(target); } catch (e) { return null; }
  }

  /* ---------------- API pública (disponible desde el primer momento) ---------------- */
  const JNMotion = {
    // Desplaza hasta un selector o elemento compensando el header fijo.
    scrollTo(target, opts) {
      const options = opts || {};
      const el = resolveTarget(target);
      if (!el) return;
      const toTop = el === document.body || el === document.documentElement;
      const instant = !!options.immediate || reduceMotion;
      // Posición calculada a mano (Lenis sumaría además el scroll-margin-top del CSS).
      const y = toTop ? 0 : Math.max(0, el.getBoundingClientRect().top + global.pageYOffset - headerOffset());
      if (lenis) {
        lenis.resize(); // la altura de la página pudo cambiar al alternar vistas
        lenis.scrollTo(y, { immediate: instant, duration: 1.25, force: true });
        return;
      }
      global.scrollTo({ top: y, behavior: instant ? 'instant' : 'smooth' });
    },

    // Detiene el scroll suave mientras hay un modal o el menú abierto.
    lockScroll(lock) {
      if (!lenis) return;
      if (lock) lenis.stop();
      else lenis.start();
    },

    onMenuToggle(open) {
      JNMotion.lockScroll(open);
      if (!open || !animOn) return;
      const links = document.querySelectorAll('#navLinks a');
      gsap.fromTo(links,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.05, delay: 0.12, clearProps: 'transform' });
    },

    // Reordenamiento animado de las tarjetas de áreas (FLIP).
    captureCards(cards) {
      if (!animOn || !global.Flip) return null;
      return global.Flip.getState(cards, { props: 'opacity' });
    },
    animateCards(state) {
      if (!state || !global.Flip) return;
      global.Flip.from(state, {
        duration: 0.65,
        ease: 'power3.inOut',
        absolute: true,
        nested: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out', stagger: 0.04, clearProps: 'transform' }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }),
        onComplete: () => ScrollTrigger.refresh()
      });
    },

    // Prepara las animaciones del contenido nuevo (vistas internas).
    refresh(scope) {
      if (!animOn) return;
      const view = document.getElementById('areaDetailView');
      const target = scope || (view && view.style.display !== 'none' ? view : null);
      if (target) scan(target);
      cleanupTriggers();
      ScrollTrigger.refresh();
    }
  };
  global.JNMotion = JNMotion;

  // Compatibilidad con el código anterior (site.js y noticias.js llaman a AOS.refresh()).
  global.AOS = {
    init() {},
    refresh() { JNMotion.refresh(); }
  };

  /* ---------------- Barra de progreso (funciona con o sin GSAP) ---------------- */
  function initScrollProgress() {
    const fill = document.querySelector('#scrollProgress span');
    if (!fill) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - global.innerHeight;
      const pct = max > 0 ? Math.min(1, Math.max(0, global.scrollY / max)) : 0;
      fill.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
      ticking = false;
    };
    global.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    global.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ---------------- Preguntas frecuentes: acordeón con altura animada ---------------- */
  function bindFaq(scope) {
    scope.querySelectorAll('.faq-list details').forEach((details) => {
      if (details.dataset.faqBound) return;
      details.dataset.faqBound = '1';
      const summary = details.querySelector('summary');
      const answer = details.querySelector('.faq-answer');
      if (!summary || !answer) return;
      if (details.open) details.classList.add('is-open');
      summary.addEventListener('click', (event) => {
        if (!animOn) {
          details.classList.toggle('is-open', !details.open);
          return;
        }
        event.preventDefault();
        gsap.killTweensOf(answer);
        if (details.classList.contains('is-open')) {
          details.classList.remove('is-open');
          gsap.to(answer, {
            height: 0, opacity: 0, duration: 0.45, ease: 'power3.inOut',
            onComplete: () => {
              details.open = false;
              gsap.set(answer, { clearProps: 'height,opacity' });
              ScrollTrigger.refresh();
            }
          });
        } else {
          details.open = true;
          details.classList.add('is-open');
          gsap.fromTo(answer, { height: 0, opacity: 0 }, {
            height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out',
            onComplete: () => {
              gsap.set(answer, { clearProps: 'height' });
              ScrollTrigger.refresh();
            }
          });
        }
      });
    });
  }

  /* ---------------- Primitivas de animación ---------------- */
  const EASE = 'expo.out';

  function splitTitle(el) {
    done.add(el);
    global.SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      aria: 'none', // solo líneas/palabras completas: el texto sigue siendo legible para lectores de pantalla
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: EASE,
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      }
    });
  }

  function eyebrow(el) {
    done.add(el);
    gsap.fromTo(el, { '--line': 0, opacity: 0, x: -10 }, {
      '--line': 1, opacity: 1, x: 0, duration: 1, ease: EASE, clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  }

  function fade(el) {
    done.add(el);
    const kind = el.dataset.aos || 'fade-up';
    const from = { opacity: 0, y: 30 };
    if (kind === 'fade-right') { from.x = -30; from.y = 0; }
    if (kind === 'fade-left') { from.x = 30; from.y = 0; }
    if (kind === 'zoom-in') { from.scale = 0.94; from.y = 0; }
    const delay = (Number(el.dataset.aosDelay) || 0) / 1000;
    gsap.fromTo(el, from, {
      opacity: 1, x: 0, y: 0, scale: 1, duration: 1.1, ease: EASE, delay,
      clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  }

  function stagger(el) {
    done.add(el);
    // Los hijos con animación propia (máscara, títulos divididos...) se animan aparte.
    const children = Array.from(el.children);
    const items = children.filter((child) => !child.hasAttribute('data-anim') && !done.has(child));
    // El CSS oculta a todos los hijos; los excluidos recuperan la opacidad aquí.
    children.filter((child) => !items.includes(child)).forEach((child) => gsap.set(child, { opacity: 1 }));
    items.forEach((child) => done.add(child));
    if (!items.length) return;
    gsap.fromTo(items, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.08, clearProps: 'transform',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  }

  function mask(el) {
    done.add(el);
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    // Sin clearProps: si se borrara, volvería a aplicar el estado oculto del CSS.
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut'
    });
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: EASE, clearProps: 'transform' }, 0);
  }

  function scrubWords(el) {
    done.add(el);
    global.SplitText.create(el, {
      type: 'words',
      wordsClass: 'scrub-word',
      autoSplit: true,
      aria: 'none', // solo líneas/palabras completas: el texto sigue siendo legible para lectores de pantalla
      onSplit(self) {
        return gsap.fromTo(self.words, { opacity: 0.16 }, {
          opacity: 1, ease: 'none', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true }
        });
      }
    });
  }

  function counter(el) {
    done.add(el);
    const target = parseInt(el.dataset.target, 10);
    if (!target) return;
    const state = { val: 0 };
    el.textContent = '0';
    gsap.to(state, {
      val: target, duration: 2, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(state.val); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  }

  function areaCards(cards) {
    cards.forEach((card) => done.add(card));
    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: 70 }, {
        opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.1, clearProps: 'transform'
      })
    });
  }

  function parallax(img) {
    done.add(img);
    const trigger = img.parentElement;
    gsap.set(img, { scale: 1.2 });
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  function processLine(grid) {
    done.add(grid);
    const fill = grid.querySelector('.process-line-fill');
    if (!fill) return;
    gsap.fromTo(fill, { '--progress': 0 }, {
      '--progress': 1, ease: 'none',
      scrollTrigger: { trigger: grid, start: 'top 75%', end: 'bottom 55%', scrub: true }
    });
  }

  function signature(el) {
    done.add(el);
    global.SplitText.create(el, {
      type: 'chars',
      mask: 'chars',
      autoSplit: true,
      aria: 'none', // solo líneas/palabras completas: el texto sigue siendo legible para lectores de pantalla
      onSplit(self) {
        return gsap.from(self.chars, {
          yPercent: 100, duration: 1.4, ease: EASE, stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 95%', once: true }
        });
      }
    });
  }

  // Cinta de áreas: la velocidad responde a la del scroll y cambia de sentido.
  function practiceMarquee(inner) {
    done.add(inner);
    const loop = gsap.to(inner, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    loop.totalTime(loop.duration() * 200); // margen para poder ir hacia atrás
    let direction = 1;
    ScrollTrigger.create({
      trigger: inner,
      start: 'top bottom',
      end: 'max',
      onUpdate(self) {
        const velocity = self.getVelocity();
        direction = self.direction || direction;
        const boost = 1 + Math.min(Math.abs(velocity) / 250, 5);
        gsap.timeline({ overwrite: true })
          .to(loop, { timeScale: direction * boost, duration: 0.2, ease: 'power1.out' })
          .to(loop, { timeScale: direction, duration: 1.1, ease: 'power2.out' });
      }
    });
  }

  /* ---------------- Interacciones de escritorio ---------------- */
  function magnetic(el) {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = '1';
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.38);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  }

  function tilt(card) {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = '1';
    const rxTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ryTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    card.addEventListener('pointerenter', () => gsap.set(card, { transformPerspective: 900 }));
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rxTo(-py * 7);
      ryTo(px * 7);
      card.style.setProperty('--glow-x', ((px + 0.5) * 100).toFixed(1) + '%');
      card.style.setProperty('--glow-y', ((py + 0.5) * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => { rxTo(0); ryTo(0); });
  }

  function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    root.classList.add('has-cursor');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
    let visible = false;
    const HOVER_SEL = 'a, button, summary, label, select, [role="button"], [data-magnetic], .area-card-ugaz';
    const TEXT_SEL = 'input, textarea';

    global.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    }, { passive: true });

    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      root.classList.toggle('cursor-hover', !!(t.closest && t.closest(HOVER_SEL)));
      root.classList.toggle('cursor-text', !!(t.closest && t.closest(TEXT_SEL)));
    });
    document.addEventListener('pointerdown', () => root.classList.add('cursor-down'));
    document.addEventListener('pointerup', () => root.classList.remove('cursor-down'));
    document.documentElement.addEventListener('pointerleave', () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    });
  }

  /* ---------------- Escaneo de un bloque de contenido ---------------- */
  function pick(scope, selector) {
    return Array.from(scope.querySelectorAll(selector))
      .filter((el) => !done.has(el) && !el.closest('.hero'));
  }

  function scan(scope) {
    pick(scope, SPLIT_SEL).forEach(splitTitle);
    pick(scope, '[data-anim="eyebrow"]').forEach(eyebrow);
    pick(scope, '[data-anim="stagger"]').forEach(stagger);
    pick(scope, '[data-anim="fade"], [data-aos]').forEach(fade);
    pick(scope, '[data-anim="mask"]').forEach(mask);
    pick(scope, '[data-anim="scrub-words"]').forEach(scrubWords);
    pick(scope, '.counter-num').forEach(counter);
    pick(scope, PARALLAX_SEL).forEach(parallax);
    pick(scope, '.process-grid').forEach(processLine);
    pick(scope, '.footer-signature span').forEach(signature);
    pick(scope, '.practice-marquee-inner').forEach(practiceMarquee);
    // Arco de contorno detrás del retrato: crece desde la base.
    pick(scope, '.figure-curve-bg').forEach((curve) => {
      done.add(curve);
      gsap.from(curve, {
        scale: 0.82, opacity: 0, transformOrigin: '50% 100%', duration: 1.8, ease: EASE,
        scrollTrigger: { trigger: curve.parentElement, start: 'top 80%', once: true }
      });
    });
    const cards = pick(scope, '.area-card-ugaz');
    if (cards.length) areaCards(cards);

    bindFaq(scope);
    if (finePointer) {
      scope.querySelectorAll('[data-magnetic]').forEach(magnetic);
      scope.querySelectorAll('.area-card-ugaz, .equipo-card').forEach(tilt);
    }
  }

  // Elimina los ScrollTrigger de contenido que ya no existe (al cambiar de vista).
  function cleanupTriggers() {
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger && !st.trigger.isConnected) st.kill();
    });
  }

  /* ---------------- Hero ----------------
     La entrada del hero y la intro son CSS (modern.css) para que se vean desde el primer
     pintado sin esperar a GSAP. Aquí solo va lo que depende del scroll. */
  function heroScroll() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Al bajar, el contenido del hero se desvanece y sube; el fondo se desplaza más lento.
    const content = hero.querySelector('.hero-content');
    if (content) {
      gsap.to(content, {
        yPercent: -18, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    const media = hero.querySelector('.hero-media');
    if (media) {
      gsap.to(media, {
        yPercent: 18, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  // Prepara cada bloque de la página solo cuando se acerca a la pantalla,
  // para no dividir textos ni crear animaciones de toda la página al cargar.
  function lazyScan() {
    const blocks = Array.from(document.querySelectorAll('#mainSiteContent > :not(.hero)'));
    if (!('IntersectionObserver' in global)) {
      blocks.forEach(scan);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        scan(entry.target);
      });
    }, { rootMargin: '0px 0px 120% 0px' });
    blocks.forEach((block) => io.observe(block));
  }

  /* ---------------- Inicio ---------------- */
  function initLenis() {
    if (!global.Lenis) return;
    lenis = new global.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: false
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Enlaces internos (#seccion) con scroll suave y compensación del header.
  function bindAnchors() {
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#' || hash.length < 2) return;
      const target = resolveTarget(hash);
      const main = document.getElementById('mainSiteContent');
      if (!target || (main && main.style.display === 'none' && main.contains(target))) return;
      e.preventDefault();
      JNMotion.scrollTo(target);
    });
  }

  // Refresca animaciones cuando cambia la vista (áreas, equipo, noticias, asesorías).
  function watchViews() {
    const view = document.getElementById('areaDetailView');
    const main = document.getElementById('mainSiteContent');
    if (!('MutationObserver' in global)) return;
    let queued = false;
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        JNMotion.refresh();
      });
    };
    if (view) new MutationObserver(queue).observe(view, { childList: true });
    if (main) new MutationObserver(queue).observe(main, { attributes: true, attributeFilter: ['style'] });
  }

  function fontsReady() {
    if (!document.fonts || !document.fonts.ready) return Promise.resolve();
    return Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]);
  }

  function start() {
    initScrollProgress();
    gsap = global.gsap;
    ScrollTrigger = global.ScrollTrigger;
    const libsOk = gsap && ScrollTrigger && global.SplitText;
    // Sin librerías, con movimiento reducido o si el respaldo de 4 s ya mostró todo: sin animaciones.
    // (La intro es CSS y termina sola; no se toca js-intro para no alterar los retrasos del hero.)
    if (!libsOk || reduceMotion || !root.classList.contains('js-anim')) {
      root.classList.remove('js-anim');
      bindFaq(document);
      return;
    }

    global.__jnAnimReady = true;
    gsap.registerPlugin(ScrollTrigger, global.SplitText);
    if (global.Flip) gsap.registerPlugin(global.Flip);
    animOn = true;
    root.classList.add('has-gsap');

    initLenis();
    bindAnchors();
    if (finePointer) initCursor();

    heroScroll();
    fontsReady().then(() => {
      lazyScan();
      watchViews();
      // Vista interna abierta desde la URL (#area-..., #equipo...) antes de iniciar
      const view = document.getElementById('areaDetailView');
      if (view && view.style.display !== 'none') JNMotion.refresh();
    });
  }

  // Este archivo carga con defer ANTES que las librerías del CDN: se espera a DOMContentLoaded,
  // que ocurre cuando todos los scripts defer (GSAP incluido) ya se ejecutaron.
  let started = false;
  const startOnce = () => {
    if (started) return;
    started = true;
    start();
  };
  if (document.readyState === 'complete') startOnce();
  else {
    document.addEventListener('DOMContentLoaded', startOnce);
    global.addEventListener('load', startOnce);
  }
})(window);
