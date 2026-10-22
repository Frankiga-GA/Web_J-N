// AOS init
    AOS.init({ once: true, duration: 800 });

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Accesos de sección, lectura de avance y navegación desde las vistas internas.
    const quickNav = document.querySelector('.section-quick-nav');
    if (quickNav) {
      quickNav.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        if (link.hash === '#equipo') {
          event.preventDefault();
          openEquipoPage();
          return;
        }
        const areaView = document.getElementById('areaDetailView');
        if (areaView && areaView.style.display !== 'none' && link.hash !== '#servicios') {
          event.preventDefault();
          returnToHome(link.hash);
        }
      });

      const quickLinks = [...quickNav.querySelectorAll('a[href^="#"]')];
      const quickTargets = quickLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
      if ('IntersectionObserver' in window) {
        const quickObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            quickLinks.forEach(link => {
              const current = link.hash === `#${entry.target.id}`;
              link.classList.toggle('active', current);
              if (current) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
        quickTargets.forEach(target => quickObserver.observe(target));
      }
    }
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
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              requestAnimationFrame(() => card.classList.add('area-filter-reveal'));
            }
          }
        });
        if (results) results.innerHTML = `<strong>${visibleCount}</strong> ${visibleCount === 1 ? 'área disponible' : 'áreas disponibles'}`;
        if (clearSearch) clearSearch.hidden = !search.value;
        if (emptyState) emptyState.hidden = visibleCount > 0;
        if (typeof AOS !== 'undefined') AOS.refresh();
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

    // Mobile menu
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    // Intercept navbar links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');

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
        } else if (href === '#servicios') {
          e.preventDefault();
          triggerAreasLoader('#servicios');
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
            triggerAreasLoader('#servicios');
          }
        });
      }
    });

    // ============ CONTROLADOR DE PANTALLA DE CARGA (AREAS LOADER) ============
    let isLoaderActive = false;
    function triggerAreasLoader(targetId = '#servicios') {
      if (isLoaderActive) return;
      isLoaderActive = true;

      const loader = document.getElementById('areasLoader');
      if (!loader) {
        const target = document.querySelector(targetId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        isLoaderActive = false;
        return;
      }

      if (hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }

      loader.classList.add('active');
      const bar = loader.querySelector('.areas-loader-bar');
      if (bar) bar.style.width = '0%';

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (bar) bar.style.width = '100%';
        }, 30);
      });

      setTimeout(() => {
        const target = document.querySelector(targetId);
        if (target) {
          const headerEl = document.getElementById('header');
          const headerH = headerEl ? headerEl.offsetHeight : 70;
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerH;
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }
      }, 850);

      setTimeout(() => {
        loader.classList.remove('active');
        setTimeout(() => {
          if (bar) bar.style.width = '0%';
          isLoaderActive = false;
          if (typeof AOS !== 'undefined') AOS.refresh();
        }, 350);
      }, 1150);
    }

    function triggerAreasLoaderCustom(callback) {
      const loader = document.getElementById('areasLoader');
      if (!loader) {
        if (callback) callback();
        return;
      }

      if (hamburger && navLinks) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      }

      loader.classList.add('active');
      const bar = loader.querySelector('.areas-loader-bar');
      if (bar) bar.style.width = '0%';

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (bar) bar.style.width = '100%';
        }, 30);
      });

      setTimeout(() => {
        if (callback) callback();
      }, 750);

      setTimeout(() => {
        loader.classList.remove('active');
        setTimeout(() => {
          if (bar) bar.style.width = '0%';
        }, 300);
      }, 1050);
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
          window.scrollTo(0, 0);

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

          if (targetAnchor) {
            setTimeout(() => {
              const target = document.querySelector(targetAnchor);
              if (target) {
                const header = document.getElementById('header');
                const headerH = header ? header.offsetHeight : 70;
                const y = target.getBoundingClientRect().top + window.pageYOffset - headerH;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }, 60);
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }

          if (typeof AOS !== 'undefined') AOS.refresh();
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
                <h2 class="area-page-detail-title" data-aos="fade-right">Detalle</h2>
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
              <div class="area-page-media-col" data-aos="fade-left" data-aos-delay="100">
                <div class="area-detail-img-wrap">
                  <img loading="lazy" decoding="async" src="${data.sideImg}" alt="${data.title} - J&N Asesoría Legal" class="area-detail-img">
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
            
            <div class="cta-asesoria-visual">
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
              <img loading="lazy" decoding="async" src="assets/img/cta-consultor-phone-jn2.webp" alt="Asesor de J&N mostrando la asesoría legal por celular" class="cta-asesoria-img">
            </div>

            <div class="cta-asesoria-content" data-aos="fade-left" data-aos-delay="80">
              <h3 class="cta-asesoria-title">Te brindamos asesoría legal en todas las áreas</h3>
              <a href="https://wa.me/51958212450?text=${encodeURIComponent('Hola Dra. Zinthia Garay, deseo solicitar asesoría legal')}" target="_blank" rel="noopener noreferrer" class="cta-asesoria-btn">
                <span>Solicitar asesoría</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>

          </div>
        </section>

        <!-- ==================== FOOTER MAPA (ESTILO UGAZ) ==================== -->
        <footer class="map-footer-section">
          <a href="https://maps.app.goo.gl/PxPZ3DqBa4GfCc3u7" target="_blank" rel="noopener noreferrer" class="map-link-wrapper" aria-label="Abrir Calle Grau 246A en Google Maps">
            <img loading="lazy" decoding="async" src="assets/img/mapa-chincha-alta.webp" alt="Ubicación Estudio J&N - Calle Grau 246A, Chincha Alta" class="map-background-img">
          </a>
          <div class="map-gradient-overlay"></div>

          <div class="map-content-container">
            <div class="map-content-inner">
              
              <div class="map-brand-logo">
                <img loading="lazy" decoding="async" src="assets/img/logo-placa-clean.webp" alt="J&N Asesoría Legal y Consultoría">
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
                <h4>Redes sociales</h4>
                <div class="map-socials-list">
                  <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" class="map-social-link">
                    <i class="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="map-social-link">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                  </a>
                  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" class="map-social-link">
                    <i class="fab fa-youtube"></i>
                    <span>YouTube</span>
                  </a>
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" class="map-social-link">
                    <i class="fab fa-facebook"></i>
                    <span>Facebook</span>
                  </a>
                  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="map-social-link">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          <div class="map-footer-bottom">
            <div class="map-footer-bottom-inner">
              <div>
                &copy; 2026 J&N Asesoría Legal y Consultoría | Zinthia Garay Paucar – Reg. CAI 3534.
              </div>
              <div>
                <a href="https://maps.app.goo.gl/PxPZ3DqBa4GfCc3u7" target="_blank" rel="noopener noreferrer">
                  <i class="fas fa-map-marked-alt"></i>
                  <span>Cómo llegar / Abrir en Google Maps</span>
                  <i class="fas fa-external-link-alt" style="font-size:0.75rem;"></i>
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
          window.scrollTo(0, 0);

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

        <!-- Grilla de Miembros del Equipo -->
        <section class="equipo-section">
          <div class="container">
            <div class="equipo-grid">
              ${equipoPageData.map((m, i) => `
                <div class="equipo-card ${m.isCutout ? 'is-cutout' : ''}" data-aos="fade-up" data-aos-delay="${(i % 4) * 100}" onclick="openMemberModal(${i})" role="button" tabindex="0" aria-label="Ver perfil de ${m.nombre}" onkeydown="if(event.key === 'Enter'){ openMemberModal(${i}); }">
                  <div class="equipo-card-photo">
                    <img loading="lazy" decoding="async" src="${m.foto}" alt="${m.nombre}" class="${m.isCutout ? 'equipo-card-cutout' : ''}">
                  </div>
                  <div class="equipo-card-body">
                    <h4 class="equipo-card-name">${m.nombre}</h4>
                    <div class="equipo-card-role" title="${m.cargo}">${m.cargo}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Plantilla del Modal: Perfil Detallado del Miembro (bottom sheet).
             Se monta en document.body al abrir, para que position:fixed
             se ancle a la pantalla SIEMPRE (independiente de la vista). -->
        <template id="memberModalTpl">
          <div class="member-modal-overlay" id="memberModal" onclick="closeMemberModal()">
            <div class="member-modal-panel" role="dialog" aria-modal="true" onclick="event.stopPropagation();">
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
    }

    function closeMemberModal() {
      const modal = document.getElementById('memberModal');
      if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
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

      window.open('https://wa.me/' + CONTACT_WHATSAPP_NUM + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');

      alert('¡Gracias por su consulta! Se abrirá WhatsApp para que envíe su mensaje con los datos de su caso.');
      this.reset();
    });

    // ============ HERO SLIDER CONTROLLER ============
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const progressBar = document.getElementById('sliderProgress');

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideDuration = 6000; // 6 seconds per slide
    let slideTimer = null;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');

      currentSlide = (index + totalSlides) % totalSlides;

      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');

      resetProgress();
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function resetProgress() {
      if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        setTimeout(() => {
          progressBar.style.transition = `width ${slideDuration}ms linear`;
          progressBar.style.width = '100%';
        }, 50);
      }
    }

    function startAutoSlide() {
      stopAutoSlide();
      resetProgress();
      slideTimer = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
      if (slideTimer) clearInterval(slideTimer);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        goToSlide(idx);
        startAutoSlide();
      });
    });

    // Pause on hover
    const sliderElem = document.getElementById('inicio');
    if (sliderElem) {
      sliderElem.addEventListener('mouseenter', stopAutoSlide);
      sliderElem.addEventListener('mouseleave', startAutoSlide);
    }

    // Start auto slide immediately
    startAutoSlide();

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

    // ============ ANIMATED STATS COUNTER ON SCROLL ============
    const counterElements = document.querySelectorAll('.counter-num');
    let countersStarted = false;

    if ('IntersectionObserver' in window && counterElements.length > 0) {
      const expObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counterElements.forEach(el => {
              const target = parseInt(el.getAttribute('data-target'), 10);
              const duration = 1600;
              const stepTime = 30;
              const steps = duration / stepTime;
              const increment = target / steps;
              let current = 0;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  el.textContent = target;
                  clearInterval(timer);
                } else {
                  el.textContent = Math.floor(current);
                }
              }, stepTime);
            });
          }
        });
      }, { threshold: 0.25 });

      const expSec = document.querySelector('.experiencia-section');
      if (expSec) expObserver.observe(expSec);
    }

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
