(function initNoticiasModule() {
      // ============ NOTICIAS PROPIAS ============
      // El contenido vive en assets/data/noticias.js; este archivo solo lo presenta.
      let NOTICIAS = Array.isArray(window.NOTICIAS_DATA) ? window.NOTICIAS_DATA.slice() : [];

      function formatearFecha(iso) {
        try { return new Date(iso + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }); }
        catch (e) { return iso; }
      }

      // Imagen referencial por categoría: solo Equipo usa una foto real del estudio;
      // Áreas y Estudio usan fotos de noticias propias (NO las de la sección de áreas)
      const IMG_POR_TAG = {
        'Equipo': 'assets/img/boardroom-executive.webp',
        'Áreas': 'assets/img/noticias/noticia-martillo.webp',
        'Estudio': 'assets/img/noticias/noticia-firma.webp'
      };

      function renderNoticias() {
        const grid = document.getElementById('noticiasGrid');
        const vacio = document.getElementById('noticiasVacio');
        if (!grid) return;
        NOTICIAS.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
        grid.innerHTML = '';
        if (!NOTICIAS.length) { vacio.hidden = false; return; }
        vacio.hidden = true;
        NOTICIAS.forEach((n, i) => {
          const card = document.createElement('article');
          card.className = 'noticia-card';
          const extracto = n.texto.length > 150 ? n.texto.slice(0, 150).replace(/\s+\S*$/, '') + '…' : n.texto;
          const imgCard = n.imagen || IMG_POR_TAG[String(n.tag || '')] || 'assets/img/areas-hero-banner.webp';
          card.innerHTML =
            '<img loading="lazy" decoding="async" class="noticia-card-img" src="' + imgCard + '" alt="Imagen referencial">' +
            '<div class="noticia-top">' +
              '<span class="noticia-tag">' + (n.tag || 'Noticia') + '</span>' +
              '<span class="noticia-fecha"><i class="far fa-calendar"></i>' + formatearFecha(n.fecha) + '</span>' +
            '</div>' +
            '<h4 class="noticia-titulo">' + n.titulo + '</h4>' +
            '<p class="noticia-extracto">' + extracto + '</p>' +
            '<button class="noticia-btn" data-i="' + i + '"><span>Leer nota</span><i class="fas fa-arrow-right"></i></button>';
          card.querySelector('.noticia-btn').addEventListener('click', () => abrirNoticiaModal(n));
          grid.appendChild(card);
        });
      }

      // ============ MODAL DE NOTICIA ============
      function abrirNoticiaModal(n) {
        document.getElementById('noticiaModal')?.remove();
        const ov = document.createElement('div');
        ov.id = 'noticiaModal';
        ov.className = 'noticia-modal-overlay';
        const card = document.createElement('div');
        card.className = 'noticia-modal-card';
        card.setAttribute('role', 'dialog');
        card.setAttribute('aria-modal', 'true');
        card.setAttribute('data-lenis-prevent', '');
        card.innerHTML =
          '<div class="noticia-modal-head">' +
            '<span class="noticia-modal-kicker"><i class="far fa-newspaper" aria-hidden="true"></i>Noticia</span>' +
            '<button id="noticiaModalCerrar" class="noticia-modal-close" aria-label="Cerrar"><i class="fas fa-times" aria-hidden="true"></i></button>' +
          '</div>' +
          '<div class="noticia-modal-body">' +
            '<img loading="lazy" decoding="async" class="noticia-modal-img" src="' + (n.imagen || IMG_POR_TAG[String(n.tag || '')] || 'assets/img/areas-hero-banner.webp') + '" alt="Imagen referencial">' +
            '<span class="noticia-tag">' + (n.tag || 'Noticia') + '</span>' +
            '<h4 class="noticia-modal-title">' + n.titulo + '</h4>' +
            '<p class="noticia-modal-date"><i class="far fa-calendar" aria-hidden="true"></i>' + formatearFecha(n.fecha) + '</p>' +
            '<p class="noticia-modal-text">' + n.texto + '</p>' +
          '</div>';
        ov.appendChild(card);
        document.body.appendChild(ov);
        document.body.style.overflow = 'hidden';
        if (window.JNMotion && window.JNMotion.lockScroll) window.JNMotion.lockScroll(true);
        function cerrar() {
          ov.remove();
          document.body.style.overflow = '';
          if (window.JNMotion && window.JNMotion.lockScroll) window.JNMotion.lockScroll(false);
        }
        document.getElementById('noticiaModalCerrar')?.addEventListener('click', cerrar);
        ov.addEventListener('click', (e) => { if (e.target === ov) cerrar(); });
        document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', esc); } });
      }

      // Datos editables de assets/data/noticias.js
      function aplicarDatosEditables() {
        NOTICIAS = Array.isArray(window.NOTICIAS_DATA) ? window.NOTICIAS_DATA.slice() : [];
        renderNoticias();
      }

      // ============ RSS: MEDIOS LEGALES (auto-actualizado) ============
      const FEED_NOMBRE = 'Medios legales de Perú';
      // Google News RSS: titulares legales de medios peruanos, actualizado 24/7
      const FEED_URL = 'https://news.google.com/rss/search?q=Poder+Judicial+Peru&hl=es-419&gl=PE&ceid=PE:es';

      function titularesDesdeXml(xml) {
        try {
          const doc = new DOMParser().parseFromString(xml, 'text/xml');
          return Array.from(doc.querySelectorAll('item')).slice(0, 8).map(it => {
            const fuente = (it.querySelector('source')?.textContent || '').trim();
            let title = (it.querySelector('title')?.textContent || '').trim();
            // Google News agrega " - Medio" al final del título: lo quitamos
            if (fuente && title.endsWith(' - ' + fuente)) title = title.slice(0, title.length - 3 - fuente.length);
            return {
              title: title,
              link: (it.querySelector('link')?.textContent || '#').trim(),
              pubDate: (it.querySelector('pubDate')?.textContent || '').trim(),
              fuente: fuente || FEED_NOMBRE
            };
          }).filter(x => x.title);
        } catch (e) { return []; }
      }

      // Imágenes referenciales PROPIAS de noticias (fotos libres de Wikimedia Commons / Openverse)
      // NO reutilizan las fotos de áreas. Créditos: assets/img/noticias/CREDITS.txt
      const IMG_TITULARES = [
        'assets/img/noticias/noticia-palacio-justicia.webp',
        'assets/img/noticias/noticia-martillo.webp',
        'assets/img/noticias/noticia-balanza.webp',
        'assets/img/noticias/noticia-libros.webp',
        'assets/img/noticias/noticia-biblioteca.webp',
        'assets/img/noticias/noticia-corte.webp',
        'assets/img/noticias/noticia-constitucion.webp',
        'assets/img/noticias/noticia-firma.webp'
      ];

      function renderTitulares(items) {
        const lista = document.getElementById('noticiasMediaList');
        if (!lista) return;
        lista.innerHTML = '';
        // Orden: el titular más reciente primero
        const orden = items
          .map(x => ({ it: x, d: x.pubDate ? new Date(x.pubDate) : null }))
          .sort((a, b) => ((b.d && !isNaN(b.d)) ? b.d.getTime() : 0) - ((a.d && !isNaN(a.d)) ? a.d.getTime() : 0))
          .slice(0, 8);
        orden.forEach(({ it, d }, i) => {
          const li = document.createElement('li');
          li.className = 'noticias-media-card';
          const img = it.imagen || IMG_TITULARES[i % IMG_TITULARES.length];
          const f = (d && !isNaN(d)) ? d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
          const fuente = it.fuente || FEED_NOMBRE;
          li.innerHTML = '<a class="noticias-media-card-link" href="' + (it.link || '#') + '" target="_blank" rel="noopener noreferrer">' +
            '<img loading="lazy" decoding="async" class="noticias-media-card-img" src="' + img + '" alt="Imagen referencial de la noticia">' +
            '<div class="noticias-media-card-body">' +
              '<div class="noticias-media-card-chip">' +
                '<span class="noticias-media-card-media">' + fuente + '</span>' +
                (f ? '<span class="noticias-media-card-fecha">' + f + '</span>' : '') +
              '</div>' +
              '<h4 class="noticias-media-card-title">' + it.title + '</h4>' +
            '</div>' +
          '</a>';
          lista.appendChild(li);
        });
      }

      async function cargarTitulares() {
        // 1) Datos regenerados cada día en assets/data/noticias-medios.js
        //    (cargan también abriendo el index.html con doble click, sin CORS)
        if (window.TITULARES_MEDIOS_DATA && Array.isArray(window.TITULARES_MEDIOS_DATA) && window.TITULARES_MEDIOS_DATA.length) {
          renderTitulares(window.TITULARES_MEDIOS_DATA);
          return;
        }

        // 2) Publicado en internet sin archivo de datos: proxies públicos en cascada
        if (location.protocol !== 'file:') {
          try {
            const r = await fetch('noticias-medios.json', { cache: 'no-store' });
            if (r.ok) {
              const d = await r.json();
              if (Array.isArray(d) && d.length) { renderTitulares(d); return; }
            }
          } catch (e) { /* sigue con los proxies */ }

          const intentos = [
            { url: 'https://api.rss2json.com/v1/api.json?count=6&rss_url=' + encodeURIComponent(FEED_URL), esJson: true },
            { url: 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(FEED_URL) },
            { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent(FEED_URL) }
          ];
          for (const t of intentos) {
            try {
              const r = await fetch(t.url);
              if (!r.ok) continue;
              const items = t.esJson ? (await r.json()).items : titularesDesdeXml(await r.text());
              if (items && items.length) { renderTitulares(items); return; }
            } catch (e) { /* siguiente proxy */ }
          }
        }

        const listaFb = document.getElementById('noticiasMediaList');
        if (!listaFb) return;
        listaFb.innerHTML = '<li class="media-cargando"><i class="fas fa-rss media-cargando-icon" aria-hidden="true"></i>Titulares legales en camino — se activan al publicar el sitio en internet.</li>';
      }
      // ============ PÁGINA SEPARADA "NOTICIAS" (mini-SPA, mismo sistema que Equipo) ============
      function renderNoticiasPage() {
        const container = document.getElementById('areaDetailView');
        if (!container) return;
        container.innerHTML = `
          <!-- Hero Banner: Noticias -->
          <section class="area-page-hero">
            <img loading="lazy" decoding="async" src="assets/img/area-penal-despacho.webp" alt="Noticias J&N" class="area-page-hero-bg">
            <div class="area-page-hero-overlay"></div>
            <div class="container area-page-hero-content">
              <span class="equipo-hero-tag">ACTUALIDAD JURÍDICA</span>
              <h1 class="area-page-hero-title">Noticias</h1>
            </div>
          </section>

          <!-- Migas de Pan (Breadcrumbs) -->
          <div class="area-page-breadcrumbs-bar">
            <div class="container">
              <nav class="area-page-breadcrumbs">
                <a href="javascript:void(0)" onclick="returnToHome('#inicio')"><i class="fas fa-arrow-left"></i> Inicio</a>
                <span class="breadcrumb-sep">/</span>
                <span class="breadcrumb-current">Noticias</span>
              </nav>
            </div>
          </div>

          <section class="noticias section" id="noticias">
            <div class="container">
              <h3 class="section-title">Últimas noticias</h3>
              <p class="section-subtitle">Novedades del estudio y una selección de titulares de medios jurídicos.</p>

              <div class="noticias-grid" id="noticiasGrid"></div>
              <p class="noticias-vacio" id="noticiasVacio" hidden>Pronto publicaremos las primeras noticias del estudio.</p>

              <div class="noticias-media">
                <h4 class="noticias-media-title">
                  <i class="fas fa-rss"></i> Del mundo jurídico
                  <span class="noticias-media-tag">auto-actualizado</span>
                </h4>
                <ul class="noticias-media-list" id="noticiasMediaList">
                  <li class="media-cargando">Cargando titulares legales...</li>
                </ul>
              </div>
            </div>
          </section>`;
      }

      function initPaginaNoticias() {
        aplicarDatosEditables();
        cargarTitulares();
      }

      window.openNoticiasPage = function(ev, pushHistory = true) {
        if (typeof triggerAreasLoaderCustom !== 'function') return;
        // Si ya está abierta esta página, no la recarga
        const avActual = document.getElementById('areaDetailView');
        if (avActual && avActual.style.display !== 'none' && document.getElementById('noticiasGrid')) {
          if (ev && ev.preventDefault) ev.preventDefault();
          return;
        }
        if (ev && ev.preventDefault) ev.preventDefault();
        triggerAreasLoaderCustom(() => {
          const main = document.getElementById('mainSiteContent');
          const areaView = document.getElementById('areaDetailView');
          if (!main || !areaView) return;

          main.style.display = 'none';
          areaView.style.display = 'block';

          renderNoticiasPage();
          initPaginaNoticias();
          scrollToTarget(document.body, true);

          if (pushHistory) {
            history.pushState({ view: 'noticias' }, '', '#noticias');
          }

          if (typeof AOS !== 'undefined') AOS.refresh();
        });
      };
    })();

    // ============ PÁGINA SEPARADA "ASESORÍAS Y CONSULTORÍAS" (mini-SPA, mismo sistema que Noticias) ============
    (function initAsesoriasModule() {
      const GRUPOS_ASESORIAS = [
        {
          titulo: 'Asesoría Legal',
          img: 'assets/img/zinthia-recepcion-placa.webp',
          imgAlt: 'Dra. Zinthia Garay frente al rótulo de J&N Asesoría Legal y Consultoría',
          esFoto: true,
          intro: 'Orientación legal para personas, familias y emprendedores. Revisamos tu consulta y coordinamos la atención presencial en Chincha Alta o virtual, según disponibilidad.',
          items: [
            {
              icono: 'fa-shield-halved',
              titulo: 'Asesoría Legal Preventiva',
              desc: 'Para comprender una situación legal antes de tomar una decisión.',
              bullets: [
                'Revisión y orientación sobre documentos y contratos',
                'Explicación de derechos, obligaciones y alternativas',
                'Orientación sobre los siguientes pasos posibles'
              ],
              chips: ['Presencial', 'Virtual']
            },
            {
              icono: 'fa-store',
              titulo: 'Asesoría a Emprendedores y Negocios',
              desc: 'Asesoría para organizar y atender las necesidades legales de un negocio.',
              bullets: [
                'Orientación para formalizar el negocio',
                'Revisión de acuerdos con clientes y proveedores',
                'Identificación de riesgos en la actividad comercial'
              ],
              chips: ['Presencial', 'Virtual']
            },
            {
              icono: 'fa-comments',
              titulo: 'Orientación y Seguimiento Continuo',
              desc: 'Atención coordinada para consultas legales recurrentes.',
              bullets: [
                'Canal de contacto acordado con el estudio',
                'Seguimiento de los asuntos incluidos en el servicio',
                'Coordinación según el alcance convenido'
              ],
              chips: ['Virtual', 'A distancia']
            }
          ]
        },
        {
          titulo: 'Consultoría',
          img: 'assets/img/boardroom-opt1.webp',
          imgAlt: 'Reunión de consultoría corporativa',
          esFoto: true,
          intro: 'Consultoría legal para empresas e instituciones que requieren revisar riesgos, documentos o procedimientos. El alcance se define según las necesidades de cada organización.',
          items: [
            {
              icono: 'fa-building',
              titulo: 'Consultoría Corporativa',
              desc: 'Revisión de aspectos legales de la actividad y de sus procesos internos.',
              bullets: [
                'Identificación de asuntos que requieren atención legal',
                'Revisión de contratos y procedimientos',
                'Recomendaciones para evaluar alternativas'
              ],
              chips: ['A medida', 'Confidencial']
            },
            {
              icono: 'fa-landmark',
              titulo: 'Entidades y Organizaciones',
              desc: 'Asesoría a entidades y organizaciones en asuntos de gestión y procedimientos.',
              bullets: [
                'Consultas relacionadas con sus funciones y servicios',
                'Revisión de procedimientos y documentos de gestión',
                'Coordinación con los equipos responsables'
              ],
              chips: ['Presencial', 'Chincha y región']
            },
            {
              icono: 'fa-file-signature',
              titulo: 'Convenios y Negociaciones',
              desc: 'Apoyo legal para preparar, revisar y negociar acuerdos.',
              bullets: [
                'Redacción y revisión de convenios y actas',
                'Orientación durante la negociación',
                'Identificación de obligaciones y posibles contingencias'
              ],
              chips: ['Presencial', 'Virtual']
            }
          ]
        },
        {
          titulo: 'Asesoría Especializada',
          img: 'assets/img/areas/area-corporativo.webp',
          imgAlt: 'Edificios corporativos: respaldo para asesoría especializada',
          esFoto: true,
          intro: 'Servicios legales y de consultoría para empresas, entidades públicas y organizaciones. La disponibilidad y el alcance se coordinan de acuerdo con cada requerimiento.',
          items: [
            {
              icono: 'fa-file-invoice-dollar',
              titulo: 'Tributario y Cobranza Coactiva',
              desc: 'Orientación en obligaciones tributarias y procedimientos de cobranza.',
              bullets: [
                'Cobranza tributaria y no tributaria',
                'Revisión de acreencias y documentación de respaldo',
                'Asesoría en cobranza coactiva y otras vías de cobro'
              ],
              chips: ['Empresas', 'Instituciones']
            },
            {
              icono: 'fa-building-columns',
              titulo: 'Gestión Pública y Contrataciones del Estado',
              desc: 'Acompañamiento a entidades y empresas en la gestión pública y la contratación estatal.',
              bullets: [
                'Elaboración de instrumentos de gestión municipal',
                'Capacitación en procedimientos administrativos',
                'Contrataciones y adquisiciones con el Estado'
              ],
              chips: ['Municipalidades', 'Empresas']
            },
            {
              icono: 'fa-compass-drafting',
              titulo: 'Proyectos y Expedientes Técnicos',
              desc: 'Consultoría para la preparación y revisión de proyectos y expedientes técnicos.',
              bullets: [
                'Elaboración de perfiles y expedientes técnicos',
                'Asesoría en proyectos de obras públicas y privadas',
                'Revisión de documentación y avances de obra'
              ],
              chips: ['Público', 'Privado']
            }
          ]
        }
      ];

      const PASOS_TRABAJO = [
        { titulo: 'Cuéntanos tu consulta', desc: 'Escríbenos por WhatsApp o visítanos en la oficina. Indica el tema y cualquier fecha importante.' },
        { titulo: 'Revisamos la información', desc: 'El equipo identifica el asunto y te explica qué datos adicionales pueden ser necesarios.' },
        { titulo: 'Definimos el alcance', desc: 'Coordinamos el servicio, la modalidad de atención, las condiciones y los siguientes pasos.' },
        { titulo: 'Iniciamos el servicio', desc: 'El equipo realiza las tareas acordadas y comunica el avance conforme al alcance convenido.' }
      ];

      function renderAsesoriasPage() {
        const container = document.getElementById('areaDetailView');
        if (!container) return;
        const gruposHtml = GRUPOS_ASESORIAS.map(g => `
              <div class="ases-intro-row" data-aos="fade-up">
                <div class="ases-intro-img">
                  <img loading="lazy" decoding="async" src="${g.img}" alt="${g.imgAlt}" class="${g.esFoto ? 'foto' : ''}">
                </div>
                <div class="ases-intro-text">
                  <h3 class="section-title ases-group-title">${g.titulo}</h3>
                  <p class="section-subtitle ases-group-intro">${g.intro}</p>
                </div>
              </div>

              <div class="area-page-subcards-grid ases-subcards-grid">
                ${g.items.map(it => `
                  <div class="area-subcard" data-aos="fade-up">
                    <h4 class="area-subcard-title"><i class="fas ${it.icono} ases-item-icon" aria-hidden="true"></i>${it.titulo}</h4>
                    <p class="area-subcard-desc ases-item-desc">${it.desc}</p>
                    <ul class="ases-bullets">
                      ${it.bullets.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                    <div class="ases-chips">
                      ${it.chips.map(c => `<span class="ases-chip">${c}</span>`).join('')}
                    </div>
                  </div>`).join('')}
              </div>`).join('\n\n          ');

        container.innerHTML = `
          <!-- Hero Banner: Asesorías y Consultorías -->
          <section class="area-page-hero">
            <img loading="lazy" decoding="async" src="assets/img/boardroom-executive.webp" alt="Asesorías y Consultorías J&N" class="area-page-hero-bg">
            <div class="area-page-hero-overlay"></div>
            <div class="container area-page-hero-content">
              <span class="equipo-hero-tag">ASESORÍA LEGAL Y CONSULTORÍA</span>
              <h1 class="area-page-hero-title">Asesorías y Consultorías</h1>
              <p class="ases-hero-sub">Brindamos asesoría legal y consultoría a personas, empresas privadas e instituciones públicas. Atendemos presencialmente en Chincha Alta y coordinamos consultas virtuales según cada caso.</p>
              <div class="ases-hero-registro-wrap">
                <span class="ases-hero-registro"><i class="fas fa-certificate"></i> Objeto social inscrito en SUNARP · Partida Electrónica N° 11049198</span>
              </div>
            </div>
          </section>

          <!-- Migas de Pan (Breadcrumbs) -->
          <div class="area-page-breadcrumbs-bar">
            <div class="container">
              <nav class="area-page-breadcrumbs">
                <a href="javascript:void(0)" onclick="returnToHome('#inicio')"><i class="fas fa-arrow-left"></i> Inicio</a>
                <span class="breadcrumb-sep">/</span>
                <span class="breadcrumb-current">Asesorías y Consultorías</span>
              </nav>
            </div>
          </div>

          <section class="section ases-root" id="asesoriasRoot">
            <div class="container">
              ${gruposHtml}

              <h3 class="section-title">¿Cómo trabajamos?</h3>
              <p class="section-subtitle">Conoce cómo coordinamos la consulta y definimos el alcance del servicio.</p>

              <div class="ases-steps" data-aos="fade-up">
                ${PASOS_TRABAJO.map((p, i) => `
                  <div class="ases-step">
                    <div class="ases-step-num">${i + 1}</div>
                    <h5>${p.titulo}</h5>
                    <p>${p.desc}</p>
                  </div>`).join('')}
              </div>

              <div class="ases-contact-strip" data-aos="fade-up">
                <div>
                  <h4>Coordina una consulta</h4>
                  <p>Escríbenos por WhatsApp o <a href="mailto:asesorialegal.jyn@gmail.com">correo electrónico</a> para consultar disponibilidad. También puedes visitarnos en Calle Grau 227, segundo piso, Chincha Alta.</p>
                </div>
                <a class="ases-wa-btn" href="https://wa.me/51958212450" target="_blank" rel="noopener"><i class="fab fa-whatsapp icon-lg" aria-hidden="true"></i> WhatsApp +51 958 212 450</a>
              </div>

              <div class="ases-cta-wrap" data-aos="fade-up">
                <button class="btn-pill btn-pill--dark" onclick="goContactoDesdeAsesorias()" data-magnetic><span>Ir al formulario de contacto</span><i class="fas fa-arrow-right" aria-hidden="true"></i></button>
              </div>
            </div>
          </section>`;
      }

      // CTA: volver a home y aterrizar en Contacto con corrección de scroll (multiples pasadas instantaneas)
      window.goContactoDesdeAsesorias = function() {
        returnToHome('#contacto');
        [400, 1000, 1800].forEach(ms => setTimeout(() => {
          const m = document.getElementById('mainSiteContent');
          if (!m || m.style.display === 'none') return;
          scrollToTarget('#contacto', true); /* instant: un scroll suave largo se ve lento tras la cortina */
        }, ms));
      };

      window.openAsesoriasPage = function(ev, pushHistory = true) {
        if (typeof triggerAreasLoaderCustom !== 'function') return;
        // Si ya está abierta esta página, no la recarga
        const avActual = document.getElementById('areaDetailView');
        if (avActual && avActual.style.display !== 'none' && document.getElementById('asesoriasRoot')) {
          if (ev && ev.preventDefault) ev.preventDefault();
          return;
        }
        if (ev && ev.preventDefault) ev.preventDefault();
        triggerAreasLoaderCustom(() => {
          const main = document.getElementById('mainSiteContent');
          const areaView = document.getElementById('areaDetailView');
          if (!main || !areaView) return;

          main.style.display = 'none';
          areaView.style.display = 'block';

          renderAsesoriasPage();
          scrollToTarget(document.body, true);

          if (pushHistory) {
            history.pushState({ view: 'asesorias' }, '', '#asesorias');
          }

          if (typeof AOS !== 'undefined') AOS.refresh();
        });
      };
    })();
