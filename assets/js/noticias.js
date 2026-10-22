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
        'Áreas': 'assets/img/noticias/noticia-martillo.jpg',
        'Estudio': 'assets/img/noticias/noticia-firma.jpg'
      };

      function renderNoticias() {
        const grid = document.getElementById('noticiasGrid');
        const vacio = document.getElementById('noticiasVacio');
        if (!grid) return;
        NOTICIAS.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
        grid.innerHTML = '';
        if (!NOTICIAS.length) { vacio.style.display = 'block'; return; }
        vacio.style.display = 'none';
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
        ov.style.cssText = 'position:fixed; inset:0; z-index:3000; background:rgba(10,30,61,0.55); display:flex; align-items:center; justify-content:center; padding:20px; overflow-y:auto;';
        const card = document.createElement('div');
        card.style.cssText = 'background:#FFFFFF; border-radius:14px; max-width:640px; width:100%; max-height:82vh; overflow-y:auto; box-shadow:0 30px 70px rgba(0,0,0,0.35);';
        card.innerHTML =
          '<div style="display:flex; justify-content:space-between; align-items:center; background:var(--azul-oscuro); padding:16px 22px; border-radius:14px 14px 0 0;">' +
            '<span style="color:#FFFFFF; font-family:var(--font-heading); font-weight:700; font-size:0.95rem;"><i class="far fa-newspaper" style="margin-right:8px;"></i>Noticia</span>' +
            '<button id="noticiaModalCerrar" aria-label="Cerrar" style="background:rgba(255,255,255,0.14); border:none; cursor:pointer; color:#FFFFFF; font-size:1.05rem; padding:6px 12px; border-radius:8px;"><i class="fas fa-times"></i></button>' +
          '</div>' +
          '<div style="padding:28px 30px;">' +
            '<img loading="lazy" decoding="async" src="' + (n.imagen || IMG_POR_TAG[String(n.tag || '')] || 'assets/img/areas-hero-banner.webp') + '" alt="Imagen referencial" style="width:100%; height:200px; object-fit:cover; border-radius:10px; margin-bottom:18px;">' +
            '<span class="noticia-tag">' + (n.tag || 'Noticia') + '</span>' +
            '<h4 style="font-family:var(--font-heading); font-size:1.3rem; color:var(--azul-oscuro); margin:16px 0 6px; line-height:1.35;">' + n.titulo + '</h4>' +
            '<p style="font-size:0.8rem; color:#64748B; margin-bottom:16px;"><i class="far fa-calendar" style="margin-right:6px;"></i>' + formatearFecha(n.fecha) + '</p>' +
            '<p style="font-size:0.95rem; color:#334155; line-height:1.75;">' + n.texto + '</p>' +
          '</div>';
        ov.appendChild(card);
        document.body.appendChild(ov);
        document.body.style.overflow = 'hidden';
        function cerrar() { ov.remove(); document.body.style.overflow = ''; }
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
        'assets/img/noticias/noticia-palacio-justicia.jpg',
        'assets/img/noticias/noticia-martillo.jpg',
        'assets/img/noticias/noticia-balanza.jpg',
        'assets/img/noticias/noticia-libros.jpg',
        'assets/img/noticias/noticia-biblioteca.webp',
        'assets/img/noticias/noticia-corte.webp',
        'assets/img/noticias/noticia-constitucion.jpg',
        'assets/img/noticias/noticia-firma.jpg'
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
        listaFb.innerHTML = '<li class="media-cargando"><i class="fas fa-rss" style="margin-right:8px; color:#94A3B8;"></i>Titulares legales en camino — se activan al publicar el sitio en internet.</li>';
      }
      // ============ PÁGINA SEPARADA "NOTICIAS" (mini-SPA, mismo sistema que Equipo) ============
      function renderNoticiasPage() {
        const container = document.getElementById('areaDetailView');
        if (!container) return;
        container.innerHTML = `
          <!-- Hero Banner: Noticias -->
          <section class="area-page-hero">
            <img loading="lazy" decoding="async" src="assets/img/area-penal-despacho.jpg" alt="Noticias J&N" class="area-page-hero-bg">
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
              <p class="section-subtitle">Actualidad del estudio y del mundo jurídico, siempre al día.</p>

              <div class="noticias-grid" id="noticiasGrid"></div>
              <p class="noticias-vacio" id="noticiasVacio" style="display:none;">Pronto publicaremos las primeras noticias del estudio.</p>

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
          window.scrollTo(0, 0);

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
          img: 'assets/img/zinthia-recepcion-placa.jpg',
          imgAlt: 'Dra. Zinthia Garay frente al rótulo de J&N Asesoría Legal y Consultoría',
          esFoto: true,
          intro: 'Orientación legal clara y directa para personas, familias y emprendedores: anticípanse al problema con el respaldo del estudio. Atendemos presencialmente en nuestro estudio de Chincha Alta o a distancia, como usted prefiera.',
          items: [
            {
              icono: 'fa-shield-halved',
              titulo: 'Asesoría Legal Preventiva',
              desc: 'Para personas y familias que quieren decidir con seguridad.',
              bullets: [
                'Revisión y orientación sobre documentos y contratos',
                'Aclaración de sus derechos y obligaciones',
                'Ruta de acción recomendada para su caso'
              ],
              chips: ['Presencial', 'Virtual']
            },
            {
              icono: 'fa-store',
              titulo: 'Asesoría a Emprendedores y Negocios',
              desc: 'Respaldo jurídico para iniciar y operar su negocio con pie derecho.',
              bullets: [
                'Elección de la forma adecuada para su negocio',
                'Contratos claros con clientes y proveedores',
                'Prevención de conflictos comerciales'
              ],
              chips: ['Presencial', 'Virtual']
            },
            {
              icono: 'fa-comments',
              titulo: 'Orientación y Seguimiento Continuo',
              desc: 'Sus consultas legales recurrentes, siempre respondidas.',
              bullets: [
                'Respuesta directa del equipo del estudio',
                'Seguimiento de cada consulta hasta resolverla',
                'Canal de atención a su medida'
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
          intro: 'Soporte jurídico especializado para empresas e instituciones, con visión preventiva y estratégica. Trabajamos junto a sus equipos para que cada decisión cuente con respaldo legal.',
          items: [
            {
              icono: 'fa-building',
              titulo: 'Consultoría Corporativa',
              desc: 'Diagnóstico y prevención de riesgos legales de la operación.',
              bullets: [
                'Diagnóstico de riesgos legales de su actividad',
                'Revisión de contratos y procesos internos',
                'Recomendaciones prácticas para decidir mejor'
              ],
              chips: ['A medida', 'Confidencial']
            },
            {
              icono: 'fa-landmark',
              titulo: 'Entidades y Organizaciones',
              desc: 'Acompañamiento a cajas, municipalidades, juntas y comunidades campesinas.',
              bullets: [
                'Consultas y procesos propios de su gestión',
                'Coordinación con sus equipos internos',
                'Prioridad de atención a sus requerimientos'
              ],
              chips: ['Presencial', 'Chincha y región']
            },
            {
              icono: 'fa-file-signature',
              titulo: 'Convenios y Negociaciones',
              desc: 'Acuerdos entre partes, por escrito y sin ambigüedades.',
              bullets: [
                'Redacción y revisión de convenios y actas',
                'Acompañamiento en la mesa de negociación',
                'Enfoque preventivo para evitar conflictos'
              ],
              chips: ['Presencial', 'Virtual']
            }
          ]
        },
        {
          titulo: 'Asesoría Especializada',
          img: 'assets/img/areas/area-corporativo.jpg',
          imgAlt: 'Edificios corporativos: respaldo para asesoría especializada',
          esFoto: true,
          intro: 'Líneas especializadas que complementan nuestra asesoría legal y consultoría. Atendemos a empresas, entidades públicas y organizaciones de Chincha y la región.',
          items: [
            {
              icono: 'fa-file-invoice-dollar',
              titulo: 'Tributario y Cobranza Coactiva',
              desc: 'Orientación y defensa frente a deudas tributarias y procedimientos de cobranza.',
              bullets: [
                'Cobranza tributaria y no tributaria',
                'Fiscalización de acreencias y recuperación de adeudos',
                'Asesoría en cobranza coactiva y vía ordinaria'
              ],
              chips: ['Empresas', 'Instituciones']
            },
            {
              icono: 'fa-building-columns',
              titulo: 'Gestión Pública y Contrataciones del Estado',
              desc: 'Acompañamiento a entidades y empresas en la gestión pública y la contratación estatal.',
              bullets: [
                'Elaboración de instrumentos de gestión municipal',
                'Capacitación en la Ley de Procedimiento Administrativo General',
                'Contrataciones y adquisiciones con el Estado'
              ],
              chips: ['Municipalidades', 'Empresas']
            },
            {
              icono: 'fa-compass-drafting',
              titulo: 'Proyectos y Expedientes Técnicos',
              desc: 'Consultoría técnica para estructurar y sustentar proyectos y obras públicas y privadas.',
              bullets: [
                'Elaboración de perfiles y expedientes técnicos',
                'Consultoría en proyectos de obras públicas y privadas',
                'Evaluación y asesoramiento técnico en obras'
              ],
              chips: ['Público', 'Privado']
            }
          ]
        }
      ];

      const PASOS_TRABAJO = [
        { titulo: 'Cuéntanos su caso', desc: 'Escríbanos por WhatsApp o visítenos en el estudio. La primera conversación es simple y clara.' },
        { titulo: 'Evaluamos su tema', desc: 'El equipo revisa sus documentos y le explica sus opciones sin tecnicismos.' },
        { titulo: 'Acordamos el plan', desc: 'Definimos juntos el alcance de la asesoría o consultoría y los siguientes pasos.' },
        { titulo: 'Lo acompañamos', desc: 'Ejecutamos y damos seguimiento hasta cerrar su consulta o proceso.' }
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
                  <h3 class="section-title" style="margin-bottom:12px;">${g.titulo}</h3>
                  <p class="section-subtitle" style="margin-bottom:0;">${g.intro}</p>
                </div>
              </div>

              <div class="area-page-subcards-grid" style="max-width: 980px; margin: 0 auto 44px;">
                ${g.items.map(it => `
                  <div class="area-subcard" data-aos="fade-up">
                    <h4 class="area-subcard-title"><i class="fas ${it.icono}" style="color:var(--azul-oscuro); margin-right:8px;"></i>${it.titulo}</h4>
                    <p class="area-subcard-desc" style="font-style:italic;">${it.desc}</p>
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
              <p class="ases-hero-sub">Orientación jurídica clara para personas, familias y empresas de Chincha y la región.</p>
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

          <section class="section" id="asesoriasRoot" style="padding-top: 55px;">
            <div class="container">
              ${gruposHtml}

              <h3 class="section-title">¿Cómo trabajamos?</h3>
              <p class="section-subtitle">Un proceso simple y transparente, de la primera consulta al cierre de su tema.</p>

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
                  <h4>Hable hoy mismo con nosotros</h4>
                  <p>Respondemos sus consultas y agendamos su visita: Calle Grau 246A, Chincha Alta.</p>
                </div>
                <a class="ases-wa-btn" href="https://wa.me/51958212450" target="_blank" rel="noopener"><i class="fab fa-whatsapp" style="font-size:1.3rem;"></i> WhatsApp +51 958 212 450</a>
              </div>

              <div style="text-align:center; margin-top:30px;" data-aos="fade-up">
                <button class="btn btn-dark" onclick="goContactoDesdeAsesorias()" style="display:inline-flex; align-items:center; gap:10px; cursor:pointer;">Agende su consulta <i class="fas fa-arrow-right"></i></button>
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
          const t = document.querySelector('#contacto');
          if (!t) return;
          const h = document.getElementById('header');
          const y = t.getBoundingClientRect().top + window.pageYOffset - (h ? h.offsetHeight : 70);
          window.scrollTo({ top: y, behavior: 'instant' }); /* instant: el smooth del sitio anula scrolls largos */
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
          window.scrollTo(0, 0);

          if (pushHistory) {
            history.pushState({ view: 'asesorias' }, '', '#asesorias');
          }

          if (typeof AOS !== 'undefined') AOS.refresh();
        });
      };
    })();
