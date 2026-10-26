// Las animaciones de aparición (data-aos / data-anim) las gestiona assets/js/animations.js.

    // Desplazamiento a un ancla: usa el scroll suave de animations.js si está activo.
    function scrollToTarget(selector, immediate = false) {
      if (window.JNMotion && window.JNMotion.scrollTo) {
        window.JNMotion.scrollTo(selector, { immediate });
        return;
      }
      const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!target) return;
      const headerEl = document.getElementById('header');
      const headerH = headerEl ? headerEl.offsetHeight : 70;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
    }

    // Header: fondo de vidrio al bajar; se oculta al bajar y reaparece al subir.
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    function updateHeader() {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 50);
      const menuOpen = document.body.classList.contains('menu-open');
      const goingDown = y > lastScrollY + 4;
      const goingUp = y < lastScrollY - 4;
      if (!menuOpen && goingDown && y > 160) header.classList.add('header--hidden');
      else if (goingUp || y <= 160 || menuOpen) header.classList.remove('header--hidden');
      if (goingDown || goingUp) lastScrollY = y;
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
    // Al navegar con teclado, el header siempre debe estar visible.
    header.addEventListener('focusin', () => header.classList.remove('header--hidden'));
    // Búsqueda y filtros del directorio de áreas legales.
    (function initAreaDiscovery() {
      const cards = Array.from(document.querySelectorAll('.area-card-ugaz[data-area-key]'));
      const search = document.getElementById('areaSearch');
      const clearSearch = document.getElementById('clearAreaSearch');
      const filterButtons = Array.from(document.querySelectorAll('.areas-filter'));
      const results = document.getElementById('areasResults');
      const emptyState = document.getElementById('areasEmpty');
      if (!cards.length || !search || !filterButtons.length) return;

      let activeFilter = 'all';
      const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

      function applyAreaFilter() {
        const query = normalize(search.value.trim());
        // Estado previo de las tarjetas para animar el reordenamiento (técnica FLIP).
        const flipState = window.JNMotion && window.JNMotion.captureCards ? window.JNMotion.captureCards(cards) : null;
        const useCssReveal = !flipState && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let visibleCount = 0;
        cards.forEach((card, index) => {
          const audiences = card.dataset.audience.split(/\s+/);
          const searchableText = normalize(`${card.dataset.search || ''} ${card.textContent}`);
          const matches = (activeFilter === 'all' || audiences.includes(activeFilter)) && (!query || searchableText.includes(query));
          card.hidden = !matches;
          card.setAttribute('aria-hidden', String(!matches));
          card.classList.remove('area-filter-reveal');
          if (matches) {
            visibleCount++;
            card.style.setProperty('--filter-delay', `${Math.min(index, 7) * 45}ms`);
            if (useCssReveal) {
              requestAnimationFrame(() => card.classList.add('area-filter-reveal'));
            }
          }
        });
        if (flipState) window.JNMotion.animateCards(flipState);
        if (results) results.innerHTML = `<strong>${visibleCount}</strong> ${visibleCount === 1 ? 'área disponible' : 'áreas disponibles'}`;
        if (clearSearch) clearSearch.hidden = !search.value;
        if (emptyState) emptyState.hidden = visibleCount > 0;
      }

      filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          activeFilter = button.dataset.filter;
          filterButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', String(active));
          });
          applyAreaFilter();
        });
      });
      search.addEventListener('input', applyAreaFilter);
      clearSearch?.addEventListener('click', () => {
        search.value = '';
        applyAreaFilter();
        search.focus();
      });
      document.getElementById('areasReset')?.addEventListener('click', () => {
        search.value = '';
        activeFilter = 'all';
        filterButtons.forEach((button) => {
          const active = button.dataset.filter === 'all';
          button.classList.toggle('active', active);
          button.setAttribute('aria-pressed', String(active));
        });
        applyAreaFilter();
        search.focus();
      });
    })();

    // Menú móvil a pantalla completa
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    function setMenuOpen(open) {
      hamburger.classList.toggle('active', open);
      navLinks.classList.toggle('active', open);
      document.body.classList.toggle('menu-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Menú');
      if (window.JNMotion && window.JNMotion.onMenuToggle) window.JNMotion.onMenuToggle(open);
    }
    function closeMenu() {
      if (navLinks.classList.contains('active')) setMenuOpen(false);
    }
    hamburger.addEventListener('click', () => {
      setMenuOpen(!navLinks.classList.contains('active'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    // Intercept navbar links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        closeMenu();

        if (href === '#equipo') {
          e.preventDefault();
          openEquipoPage();
          return;
        }

        // Las páginas Noticias y Asesorías se administran solas (mini-SPA): no aplicar la lógica de anchors
        if (href === '#noticias' || href === '#asesorias') {
          if (e && e.preventDefault) e.preventDefault();
          return;
        }

        const areaView = document.getElementById('areaDetailView');
        const isAreaViewOpen = areaView && areaView.style.display !== 'none';

        if (isAreaViewOpen) {
          e.preventDefault();
          returnToHome(href);
        } else if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          scrollToTarget(href);
        }
      });
    });

    // Header logo click
    const headerLogoLink = document.querySelector('.header-logo');
    if (headerLogoLink) {
      headerLogoLink.addEventListener('click', (e) => {
        const areaView = document.getElementById('areaDetailView');
        if (areaView && areaView.style.display !== 'none') {
          e.preventDefault();
          returnToHome('#inicio');
        }
      });
    }

    // Intercept any button/link pointing to #servicios
    document.querySelectorAll('a[href="#servicios"]').forEach(link => {
      if (!link.closest('#navLinks')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const areaView = document.getElementById('areaDetailView');
          if (areaView && areaView.style.display !== 'none') {
            returnToHome('#servicios');
          } else {
            scrollToTarget('#servicios');
          }
        });
      }
    });

    // ============ CORTINA DE TRANSICIÓN ENTRE VISTAS ============
    // La cortina sube y cubre la pantalla, se cambia la vista y luego sale por arriba.
    let isCurtainActive = false;
    function triggerAreasLoaderCustom(callback) {
      const loader = document.getElementById('areasLoader');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      closeMenu();
      if (!loader || reduceMotion || isCurtainActive) {
        if (callback) callback();
        return;
      }
      isCurtainActive = true;
      loader.classList.remove('leaving');
      loader.classList.add('active');

      setTimeout(() => {
        if (callback) callback();
        loader.classList.remove('active');
        loader.classList.add('leaving');
        setTimeout(() => {
          loader.classList.remove('leaving');
          isCurtainActive = false;
        }, 750);
      }, 650);
    }

    // ============ CONTROLADOR DE APERTURA DE PÁGINA DE ÁREA ============
    function openAreaPage(areaKey, pushHistory = true) {
      const data = areasPageData[areaKey];
      if (!data) return;

      triggerAreasLoaderCustom(() => {
        const main = document.getElementById('mainSiteContent');
        const areaView = document.getElementById('areaDetailView');

        if (main && areaView) {
          main.style.display = 'none';
          areaView.style.display = 'block';

          renderAreaPage(areaKey, data);
          scrollToTarget(document.body, true);

          if (pushHistory) {
            history.pushState({ view: 'area', id: areaKey }, '', '#area-' + areaKey);
          }

          if (typeof AOS !== 'undefined') AOS.refresh();
        }
      });
    }

    function returnToHome(targetAnchor = '#inicio') {
      triggerAreasLoaderCustom(() => {
        const main = document.getElementById('mainSiteContent');
        const areaView = document.getElementById('areaDetailView');

        if (main && areaView) {
          areaView.style.display = 'none';
          main.style.display = 'block';

          history.pushState({ view: 'home' }, '', window.location.pathname + (targetAnchor || ''));
          if (typeof AOS !== 'undefined') AOS.refresh();

          // Saltar directo al destino mientras la cortina aún lo cubre.
          if (targetAnchor) {
            requestAnimationFrame(() => scrollToTarget(targetAnchor, true));
          } else {
            scrollToTarget(document.body, true);
          }
        }
      });
    }

    function renderAreaPage(areaKey, data) {
      const container = document.getElementById('areaDetailView');
      if (!container) return;

      container.innerHTML = `
        <!-- Hero Banner de la Página de Área -->
        <section class="area-page-hero">
          <img loading="lazy" decoding="async" src="${data.heroImg}" alt="${data.title}" class="area-page-hero-bg">
          <div class="area-page-hero-overlay"></div>
          <div class="container area-page-hero-content">
            <h1 class="area-page-hero-title">${data.title}</h1>
          </div>
        </section>

        <!-- Migas de Pan (Breadcrumbs) -->
        <div class="area-page-breadcrumbs-bar">
          <div class="container">
            <nav class="area-page-breadcrumbs">
              <a href="javascript:void(0)" onclick="returnToHome('#inicio')"><i class="fas fa-arrow-left"></i> Inicio</a>
              <span class="breadcrumb-sep">/</span>
              <a href="javascript:void(0)" onclick="returnToHome('#servicios')">Áreas</a>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">${data.title}</span>
            </nav>
          </div>
        </div>

        <!-- Sección de Detalle: Texto, 3 Sub-Cards y Foto -->
        <section class="area-page-detail-section">
          <div class="container">
            <div class="area-page-detail-grid">
              
              <!-- Columna Izquierda: Detalle y 3 Subcards -->
              <div class="area-page-text-col">
                <h2 class="area-page-detail-title">Detalle</h2>
                <p class="area-page-detail-intro" data-aos="fade-right" data-aos-delay="80">${data.intro}</p>

                <div class="area-page-subcards-grid">
                  ${data.subcards.map((sub, idx) => `
                    <div class="area-subcard" data-aos="fade-up" data-aos-delay="${100 + idx * 100}">
                      <h4 class="area-subcard-title">${sub.title}</h4>
                      <p class="area-subcard-desc">${sub.desc}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Columna Derecha: Foto de Consulta / Oficina -->
              <div class="area-page-media-col">
                <div class="area-detail-img-wrap" data-anim="mask">
                  <img loading="lazy" decoding="async" src="${data.sideImg}" alt="${data.title}, J&N Asesoría Legal" class="area-detail-img">
                </div>
              </div>

            </div>
          </div>
        </section>

        ${viewCtaAndFooterHtml()}
      `;
    }

    // ==================== BLOQUE COMPARTIDO: CTA + FOOTER MAPA ====================
    function viewCtaAndFooterHtml() {
      return `
        <!-- ==================== BANNER ASESORÍA LEGAL (ESTILO UGAZ) ==================== -->
        <section class="cta-asesoria-section">
          <div class="cta-asesoria-container">
            
            <div class="cta-asesoria-visual" data-anim="mask">
              <svg class="cta-asesoria-curve-svg" viewBox="0 0 460 340" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ctaNavyGradArea" x1="0%" y1="0%" x2="100%" y2="80%">
                    <stop offset="0%" stop-color="#0A1E3D"/>
                    <stop offset="60%" stop-color="#122C52"/>
                    <stop offset="100%" stop-color="#1E3A5F"/>
                  </linearGradient>
                  <linearGradient id="ctaSilverAccentArea" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#CBD5E1" stop-opacity="0.5"/>
                    <stop offset="100%" stop-color="#94A3B8" stop-opacity="0.2"/>
                  </linearGradient>
                </defs>
                <path d="M -30,0 L 260,0 C 330,0 370,42 370,105 C 370,168 330,205 260,205 L -30,205 Z" fill="url(#ctaNavyGradArea)" />
                <path d="M -30,210 L 220,210 C 260,210 280,225 280,240 C 280,255 260,265 220,265 L -30,265 Z" fill="url(#ctaSilverAccentArea)" />
                <path d="M -30,340 L 85,340 L 155,245 L 45,245 L -30,340 Z" fill="url(#ctaNavyGradArea)" opacity="0.92" />
              </svg>
              <img width="1131" height="1600" loading="lazy" decoding="async" src="assets/img/cta-asesoria-consultor.webp" alt="Asesor de J&N mostrando a la Dra. Zinthia Garay en el teléfono" class="cta-asesoria-img">
            </div>

            <div class="cta-asesoria-content">
              <h3 class="cta-asesoria-title" data-anim="scrub-words">¿Necesitas orientación legal? Cuéntanos tu situación</h3>
              <a href="https://wa.me/51958212450?text=${encodeURIComponent('Hola Dra. Zinthia Garay, deseo solicitar asesoría legal')}" target="_blank" rel="noopener noreferrer" class="cta-asesoria-btn" data-anim="fade" data-magnetic>
                <span>Solicitar asesoría</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>

          </div>
        </section>

        <!-- ==================== FOOTER MAPA (ESTILO UGAZ) ==================== -->
        <footer class="map-footer-section">
          <a href="https://maps.app.goo.gl/PxPZ3DqBa4GfCc3u7" target="_blank" rel="noopener noreferrer" class="map-link-wrapper" aria-label="Abrir Calle Grau 246A en Google Maps">
            <img loading="lazy" decoding="async" src="assets/img/mapa-chincha-alta.webp" alt="Ubicación del Estudio J&N, Calle Grau 246A, Chincha Alta" class="map-background-img" width="1536" height="512">
          </a>
          <div class="map-gradient-overlay"></div>

          <div class="map-content-container">
            <div class="map-content-inner" data-anim="stagger">
              
              <div class="map-brand-logo">
                <img loading="lazy" decoding="async" src="assets/img/logo-placa-clean.webp" alt="J&N Asesoría Legal y Consultoría" width="920" height="300">
                <div class="map-brand-text">
                  <span class="map-brand-title">J&N ASESORÍA LEGAL</span>
                  <span class="map-brand-sub">Y CONSULTORÍA • DRA. ZINTHIA GARAY</span>
                </div>
              </div>

              <div class="map-info-grid">
                <div class="map-info-col">
                  <h4>Dirección</h4>
                  <p>
                    Calle Grau 246A<br>
                    Chincha Alta, Ica – 11702
                  </p>
                </div>

                <div class="map-info-col">
                  <h4>Teléfonos</h4>
                  <div class="map-phones-list">
                    <a href="tel:+51958212450" class="map-phone-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>(+51) 958 212 450</span>
                    </a>
                    <a href="https://wa.me/51958212450" target="_blank" rel="noopener noreferrer" class="map-phone-item">
                      <i class="fab fa-whatsapp"></i>
                      <span>(+51) 958 212 450</span>
                    </a>
                  </div>
                </div>
              </div>

              <div class="map-socials-block">
                <h4>Canales de contacto</h4>
                <div class="map-socials-list">
                  <a href="https://wa.me/51958212450" target="_blank" rel="noopener noreferrer" class="map-social-link">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                  </a>
                  <a href="mailto:asesorialegal.jyn@gmail.com" class="map-social-link">
                    <i class="fas fa-envelope"></i>
                    <span>Correo electrónico</span>
                  </a>
                  <a href="tel:+51958212450" class="map-social-link">
                    <i class="fas fa-phone"></i>
                    <span>Llamar al estudio</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          <div class="footer-signature" aria-hidden="true"><span>J&amp;N</span></div>

          <div class="map-footer-bottom">
            <div class="map-footer-bottom-inner">
              <div>
                &copy; 2026 J&N Asesoría Legal y Consultoría | Zinthia Garay Paucar – Reg. CAI 3534.
              </div>
              <div>
                <a href="https://maps.app.goo.gl/PxPZ3DqBa4GfCc3u7" target="_blank" rel="noopener noreferrer">
                  <i class="fas fa-map-marked-alt"></i>
                  <span>Cómo llegar / Abrir en Google Maps</span>
                  <i class="fas fa-external-link-alt icon-xs" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      `;
    }

    function openEquipoPage(pushHistory = true) {
      triggerAreasLoaderCustom(() => {
        const main = document.getElementById('mainSiteContent');
        const areaView = document.getElementById('areaDetailView');
        if (main && areaView) {
          main.style.display = 'none';
          areaView.style.display = 'block';

          renderEquipoPage();
          initEquipoCarousel();
          scrollToTarget(document.body, true);

          if (pushHistory) {
            history.pushState({ view: 'equipo' }, '', '#equipo');
          }

          if (typeof AOS !== 'undefined') AOS.refresh();
        }
      });
    }

    function renderEquipoPage() {
      const container = document.getElementById('areaDetailView');
      if (!container) return;

      container.innerHTML = `
        <!-- Hero Banner: Nuestro Equipo -->
        <section class="area-page-hero">
          <img loading="lazy" decoding="async" src="assets/img/boardroom-executive.webp" alt="Nuestro Equipo J&N" class="area-page-hero-bg">
          <div class="area-page-hero-overlay"></div>
          <div class="container area-page-hero-content">
            <span class="equipo-hero-tag">EXPERIENCIA Y SERVICIO</span>
            <h1 class="area-page-hero-title">Nuestro Equipo</h1>
          </div>
        </section>

        <!-- Migas de Pan (Breadcrumbs) -->
        <div class="area-page-breadcrumbs-bar">
          <div class="container">
            <nav class="area-page-breadcrumbs">
              <a href="javascript:void(0)" onclick="returnToHome('#inicio')"><i class="fas fa-arrow-left"></i> Inicio</a>
              <span class="breadcrumb-sep">/</span>
              <a href="javascript:void(0)" onclick="returnToHome('#nosotros')">Quiénes somos</a>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">Nuestro Equipo</span>
            </nav>
          </div>
        </div>

        <!-- Carrusel del equipo: la persona activa al centro (grande) y las demás a los lados -->
        <section class="equipo-section">
          <div class="container">
            <div class="equipo-carousel" id="equipoCarousel" data-aos="fade-up" role="region" aria-roledescription="carrusel" aria-label="Nuestro equipo">
              <div class="equipo-stage" id="equipoStage">
                ${equipoPageData.map((m, i) => `
                  <button type="button" class="equipo-slide" data-index="${i}" aria-label="Ver a ${m.nombre}">
                    <img loading="lazy" decoding="async" src="${m.foto}" alt="${m.nombre}" draggable="false">
                  </button>
                `).join('')}
                <button type="button" class="equipo-nav equipo-nav--prev" id="equipoPrev" aria-label="Integrante anterior"><i class="fas fa-arrow-left" aria-hidden="true"></i></button>
                <button type="button" class="equipo-nav equipo-nav--next" id="equipoNext" aria-label="Integrante siguiente"><i class="fas fa-arrow-right" aria-hidden="true"></i></button>
              </div>

              <div class="equipo-info" id="equipoInfo" aria-live="polite">
                <span class="eyebrow equipo-info-count"><span class="section-index" id="equipoCount">01</span> de ${String(equipoPageData.length).padStart(2, '0')}</span>
                <h2 class="equipo-info-name" id="equipoName"></h2>
                <p class="equipo-info-role" id="equipoRole"></p>
                <p class="equipo-info-bio" id="equipoBio"></p>
                <button type="button" class="btn-pill btn-pill--dark" id="equipoProfile"><span>Ver perfil completo</span><i class="fas fa-arrow-right" aria-hidden="true"></i></button>
              </div>

              <div class="equipo-dots" aria-label="Elegir integrante">
                ${equipoPageData.map((m, i) => `<button type="button" class="equipo-dot" data-index="${i}" aria-label="Ver a ${m.nombre}"></button>`).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- Plantilla del Modal: Perfil Detallado del Miembro (bottom sheet).
             Se monta en document.body al abrir, para que position:fixed
             se ancle a la pantalla SIEMPRE (independiente de la vista). -->
        <template id="memberModalTpl">
          <div class="member-modal-overlay" id="memberModal" onclick="closeMemberModal()">
            <div class="member-modal-panel" role="dialog" aria-modal="true" data-lenis-prevent onclick="event.stopPropagation();">
              <div class="member-modal-body">
                <div class="member-modal-photo" id="memberModalPhoto"></div>
                <div class="member-modal-info">
                  <h3 class="member-modal-name" id="memberModalName"></h3>
                  <div class="member-modal-role" id="memberModalRole"></div>
                  <div class="member-modal-idiomas" id="memberModalIdiomas"></div>
                  <div class="member-modal-bio">
                    <strong>Biografía:</strong>
                    <p class="member-modal-bio-text" id="memberModalBio"></p>
                    <button type="button" class="member-modal-vermas" id="memberModalVerMas" onclick="toggleMemberBio()">Ver más</button>
                  </div>
                </div>
              </div>
              <div class="member-modal-footer">
                <button type="button" class="member-modal-close" onclick="closeMemberModal()">Cerrar</button>
              </div>
            </div>
          </div>
        </template>

        ${viewCtaAndFooterHtml()}
      `;
    }
    // ---------- Carrusel del equipo ----------
    // Cada foto recibe data-pos (0 = centro, ±1 y ±2 = laterales) y el CSS la ubica y escala.
    function initEquipoCarousel() {
      const root = document.getElementById('equipoCarousel');
      if (!root) return;
      if (window.__equipoCarouselStop) {
        window.__equipoCarouselStop();
      }
      const slides = Array.from(root.querySelectorAll('.equipo-slide'));
      const dots = Array.from(root.querySelectorAll('.equipo-dot'));
      const info = document.getElementById('equipoInfo');
      const stage = document.getElementById('equipoStage');
      const total = slides.length;
      const AUTOPLAY_MS = 3500;
      let current = 0;
      let timer = null;
      let paused = false;

      // Distancia circular al activo: con 5 integrantes va de -2 a 2.
      function relative(i) {
        let d = (i - current) % total;
        if (d > total / 2) d -= total;
        if (d < -total / 2) d += total;
        return d;
      }

      function fillInfo() {
        const m = equipoPageData[current];
        document.getElementById('equipoCount').textContent = String(current + 1).padStart(2, '0');
        document.getElementById('equipoName').textContent = m.nombre;
        document.getElementById('equipoRole').textContent = m.cargo;
        document.getElementById('equipoBio').textContent = m.bio;
      }

      function render(animateInfo) {
        slides.forEach((slide, i) => {
          const pos = relative(i);
          slide.dataset.pos = Math.abs(pos) > 2 ? 'hidden' : String(pos);
          slide.setAttribute('aria-current', pos === 0 ? 'true' : 'false');
          slide.tabIndex = Math.abs(pos) <= 1 ? 0 : -1;
          slide.setAttribute('aria-label', pos === 0
            ? 'Ver perfil completo de ' + equipoPageData[i].nombre
            : 'Ver a ' + equipoPageData[i].nombre);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === current);
          dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
        if (!animateInfo) {
          fillInfo();
          return;
        }
        info.classList.add('is-changing');
        setTimeout(() => {
          fillInfo();
          info.classList.remove('is-changing');
        }, 280);
      }

      function stop() {
        if (timer) clearInterval(timer);
        timer = null;
      }
      window.__equipoCarouselStop = stop;

      function restart() {
        stop();
        timer = setInterval(() => {
          // Si se cerró la vista de equipo, el carrusel ya no existe: se detiene solo.
          if (!root.isConnected) return stop();
          const modal = document.getElementById('memberModal');
          if (modal && modal.style.display === 'flex') return;
          if (!document.hidden && !paused) goTo(current + 1);
        }, AUTOPLAY_MS);
      }

      function goTo(index) {
        const next = (index + total) % total;
        if (next === current) return;
        current = next;
        render(true);
        restart();
      }

      slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
          if (stage.dataset.swiped === '1') { stage.dataset.swiped = ''; return; }
          if (i === current) openMemberModal(i);
          else goTo(i);
        });
      });
      dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
      document.getElementById('equipoPrev').addEventListener('click', () => goTo(current - 1));
      document.getElementById('equipoNext').addEventListener('click', () => goTo(current + 1));

      const profileBtn = document.getElementById('equipoProfile');
      if (profileBtn) {
        profileBtn.addEventListener('click', () => openMemberModal(current));
        profileBtn.addEventListener('mouseenter', () => { paused = true; });
        profileBtn.addEventListener('mouseleave', () => { paused = false; restart(); });
      }

      // Teclado: flechas izquierda/derecha cuando el foco está dentro del carrusel.
      root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      });

      // Deslizar con el dedo (o arrastrar con el mouse) sobre las fotos.
      let startX = null;
      stage.addEventListener('pointerdown', (e) => {
        paused = true;
        startX = e.clientX;
      });
      window.addEventListener('pointerup', () => {
        if (paused) {
          paused = false;
          restart();
        }
      });
      stage.addEventListener('pointerup', (e) => {
        if (startX === null) return;
        const dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) > 45) {
          stage.dataset.swiped = '1'; // el clic que sigue al deslizamiento no abre nada
          setTimeout(() => { stage.dataset.swiped = ''; }, 0);
          goTo(current + (dx < 0 ? 1 : -1));
        }
      });

      render(false);
      restart();
    }

    // ---------- Modal de Perfil del Miembro del Equipo ----------
    // El modal se monta DIRECTO en document.body (fuera de la vista de equipo),
    // garantizando que el position:fixed se ancle al viewport al 100%.
    function ensureMemberModal() {
      let modal = document.getElementById('memberModal');
      if (!modal) {
        const tpl = document.getElementById('memberModalTpl');
        if (tpl) {
          document.body.insertAdjacentHTML('beforeend', tpl.innerHTML);
          modal = document.getElementById('memberModal');
        }
      }
      return modal;
    }

    function openMemberModal(i) {
      const m = equipoPageData[i];
      const modal = ensureMemberModal();
      if (!m || !modal) return;

      document.getElementById('memberModalPhoto').innerHTML =
        '<img loading="lazy" decoding="async" src="' + m.foto + '" alt="' + m.nombre + '" class="' + (m.isCutout ? 'is-cutout' : '') + '">';
      document.getElementById('memberModalName').textContent = m.nombre;
      document.getElementById('memberModalRole').textContent = m.cargo;
      document.getElementById('memberModalIdiomas').innerHTML = '<strong>Idiomas:</strong> ' + (m.idiomas || 'Español');

      const bioText = document.getElementById('memberModalBio');
      // Capturar el botón ANTES de sobrescribir el innerHTML (el innerHTML lo
      // saca del DOM si vive dentro del párrafo; la referencia sobrevive)
      const btnVerMas = document.getElementById('memberModalVerMas');
      if (m.bioCompleta) {
        // Resumen: corte por JS en límite de palabra (sin "..." automático del CSS)
        const LIMITE_BIO = 220;
        const texto = m.bioCompleta;
        const corto = texto.length > LIMITE_BIO
          ? texto.slice(0, texto.lastIndexOf(' ', LIMITE_BIO)) + '\u2026'
          : texto;
        modal.dataset.bioShort = corto;
        modal.dataset.bioFull = texto;
        bioText.classList.remove('expanded');
        bioText.textContent = corto + ' ';
        btnVerMas.style.display = 'inline-block';
        btnVerMas.textContent = 'Ver más';
      } else {
        bioText.textContent = m.bio;
        btnVerMas.style.display = 'none';
      }
      // Colocar el botón "Ver más" inline al final del texto resumido
      bioText.appendChild(btnVerMas);

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (window.JNMotion && window.JNMotion.lockScroll) window.JNMotion.lockScroll(true);
    }

    function closeMemberModal() {
      const modal = document.getElementById('memberModal');
      if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        if (window.JNMotion && window.JNMotion.lockScroll) window.JNMotion.lockScroll(false);
      }
    }

    function toggleMemberBio() {
      const modal = document.getElementById('memberModal');
      const txt = document.getElementById('memberModalBio');
      const btn = document.getElementById('memberModalVerMas');
      const expanded = txt.classList.toggle('expanded');
      txt.textContent = expanded ? modal.dataset.bioFull : (modal.dataset.bioShort + ' ');
      txt.appendChild(btn);
      btn.textContent = expanded ? 'Ver menos' : 'Ver más';
    }

    // Cerrar el modal con la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMemberModal();
    });

    // Navegación con Historial (Back/Forward) y Carga Directa por URL Hash
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.view === 'area') {
        openAreaPage(e.state.id, false);
      } else if (e.state && e.state.view === 'equipo') {
        openEquipoPage(false);
      } else if (e.state && e.state.view === 'noticias') {
        openNoticiasPage(null, false);
      } else if (e.state && e.state.view === 'asesorias') {
        openAsesoriasPage(null, false);
      } else {
        const main = document.getElementById('mainSiteContent');
        const areaView = document.getElementById('areaDetailView');
        if (main && areaView && areaView.style.display !== 'none') {
          areaView.style.display = 'none';
          main.style.display = 'block';
        }
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#area-')) {
        const areaKey = hash.replace('#area-', '');
        if (areasPageData[areaKey]) {
          openAreaPage(areaKey, false);
        }
      } else if (hash === '#equipo') {
        openEquipoPage(false);
      } else if (hash === '#noticias') {
        openNoticiasPage(null, false);
      } else if (hash === '#asesorias') {
        openAsesoriasPage(null, false);
      }

    });

    // ============ FORMULARIO DE CONTACTO (ENVÍO POR WHATSAPP) ============
    // Sin backend: arma el mensaje con los datos del formulario y lo envía por WhatsApp
    // al número institucional del estudio (el mismo de todos los enlaces del sitio).
    const CONTACT_WHATSAPP_NUM = '51958212450';
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const nombre   = document.getElementById('nombre').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      const email    = document.getElementById('email').value.trim();
      const areaSel  = document.getElementById('area');
      const area     = areaSel.value ? areaSel.options[areaSel.selectedIndex].text : 'Consulta general';
      const mensaje  = document.getElementById('mensaje').value.trim();

      const texto =
        'Hola Dra. Zinthia Garay, deseo solicitar asesoría legal.' + '\n\n' +
        '*Nombre:* ' + nombre + '\n' +
        '*Teléfono:* ' + (telefono || 'No indicado') + '\n' +
        '*Correo:* ' + email + '\n' +
        '*Área:* ' + area + '\n' +
        '*Mensaje:* ' + mensaje;

      // window.open debe ir dentro del mismo gesto del usuario para que el navegador no lo bloquee.
      window.open('https://wa.me/' + CONTACT_WHATSAPP_NUM + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');

      const form = this;
      const submitBtn = form.querySelector('.btn-submit');
      const status = document.getElementById('formStatus');
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }
        if (status) {
          status.textContent = '¡Gracias por su consulta! Se abrirá WhatsApp para que envíe su mensaje con los datos de su caso.';
          status.classList.add('is-visible');
        }
        form.reset();
      }, 900);
    });

    // ============ ACTIVE NAV LINK ON SCROLL ============
    const trackedSections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;
      trackedSections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (navLink && !navLink.classList.contains('nav-btn-contact')) {
          if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-links a:not(.nav-btn-contact)').forEach(a => a.classList.remove('active'));
            navLink.classList.add('active');
          }
        }
      });
    });

    // Cinta continua de entidades: dos grupos idénticos permiten un bucle sin cortes.
    (function initCajasMarquee() {
      const track = document.getElementById('cajasTrack');
      if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const originalCards = Array.from(track.children);
      const firstGroup = document.createElement('div');
      firstGroup.className = 'cajas-marquee-group';
      originalCards.forEach((card) => firstGroup.appendChild(card));
      const secondGroup = firstGroup.cloneNode(true);
      secondGroup.setAttribute('aria-hidden', 'true');
      secondGroup.querySelectorAll('a, button, [tabindex]').forEach((item) => item.setAttribute('tabindex', '-1'));
      track.replaceChildren(firstGroup, secondGroup);
    })();
