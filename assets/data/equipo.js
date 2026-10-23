// ============ PÁGINA DEDICADA: NUESTRO EQUIPO ============
    // Para añadir un nuevo miembro al equipo, agrega un objeto a esta lista
    // (nombre, cargo, foto, bio y credenciales). La página se actualiza sola.
    // Banderas en SVG mini (Windows/Chrome no renderiza emojis de bandera)
    const FLAG_ES = '<svg class="flag-idioma" viewBox="0 0 30 20" aria-label="España"><rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/></svg>';
    const FLAG_PE = '<svg class="flag-idioma" viewBox="0 0 30 20" aria-label="Perú"><rect width="30" height="20" fill="#d91023"/><rect x="10" width="10" height="20" fill="#ffffff"/><rect x="20" width="10" height="20" fill="#d91023"/></svg>';
    const FLAG_GB = '<svg class="flag-idioma" viewBox="0 0 30 20" aria-label="Reino Unido"><rect width="30" height="20" fill="#00247d"/><path d="M0 0 L30 20 M30 0 L0 20" stroke="#ffffff" stroke-width="4"/><path d="M15 0 V20 M0 10 H30" stroke="#ffffff" stroke-width="6"/><path d="M15 0 V20 M0 10 H30" stroke="#cf142b" stroke-width="3.5"/></svg>';

    const equipoPageData = [
      {
        nombre: 'Zinthia Garay Paucar',
        cargo: 'Fundadora y Directora',
        foto: 'assets/img/zinthia-garay-equipo.webp', // PNG recortado con fondo transparente
        isCutout: true,
        bio: 'Fundadora y directora de J&N, con más de 18 años de experiencia profesional y académica. Es magíster en Gestión Pública y cuenta con formación en el CAEN.',
        bioCompleta: 'Zinthia Garay Paucar (Reg. CAI N.º 3534) es abogada egresada de la Universidad Nacional San Luis Gonzaga de Ica y cuenta con más de 18 años de experiencia profesional y académica. Es magíster en Gestión Pública y cuenta con formación en el Centro de Altos Estudios Nacionales (CAEN). Como fundadora y directora de J&N Asesoría Legal y Consultoría, brinda asesoría y patrocinio legal a personas, empresas e instituciones.',
        idiomas: 'Español ' + FLAG_ES + ' • Quechua ' + FLAG_PE + ' • Inglés ' + FLAG_GB,
        cred: 'Reg. CAI Nº 3534 • Magíster en Gestión Pública • Especialista CAEN'
      },
      // ================= MIEMBRO 2: WALTER LLERENA =================
      {
        nombre: 'Abg. David Llerena Ramos',
        cargo: 'Especialista en Derecho Notarial y Registral',
        foto: 'assets/img/abg-david-llerena-nuevo.webp',
        isCutout: true,
        bio: 'Abogado con más de diez años de experiencia en los sectores público y privado. Su práctica incluye Derecho Notarial y Registral, además de experiencia en materia penal y administrativa.',
        bioCompleta: 'David Llerena Ramos es abogado colegiado y habilitado (Reg. CAL N.º 72306 – CAV N.º 143), con más de diez años de experiencia en los sectores público y privado. Su práctica comprende Derecho Notarial y Registral, Penal, Procesal Penal, Administrativo y Ejecución Coactiva. Ha elaborado escritos, revisado expedientes fiscales y judiciales y realizado seguimiento de diligencias y plazos procesales. También cuenta con experiencia como practicante asistente en función fiscal en el Ministerio Público de Ica.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Reg. CAL Nº 72306 • CAV N° 143 • Egresado de Maestría en Derecho Notarial y Registral (USS)'
      },
      // ================= MIEMBRO 3: JHONY ZAPATA =================
      {
        nombre: 'Abg. Jhony Zapata',
        cargo: 'Abogado Asociado',
        foto: 'assets/img/abg-jhony-zapata.webp?v=2',
        isCutout: true,
        bio: 'Cuenta con más de 20 años de experiencia en el sistema de justicia: diez años como secretario judicial y diez años como defensor público.',
        bioCompleta: 'Jhony Zapata es abogado y cuenta con más de 20 años de experiencia en el sistema de justicia peruano: diez años como secretario judicial del Poder Judicial y diez años como defensor público. Ha realizado pasantías en Medellín (Colombia) y Arica (Chile), y un curso de Derecho Global en Medellín.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Más de 20 años en el sistema de justicia • Poder Judicial • Defensa Pública'
      },
      // ================= MIEMBRO 4: WALTER LLERENA PEÑA =================
      {
        nombre: 'Abg. Walter Llerena Peña',
        cargo: 'Especialista en Derecho Municipal, Administrativo y Laboral',
        foto: 'assets/img/abg-walter-llerena-pena-nuevo.webp',
        isCutout: true,
        bio: 'Abogado de la Universidad Nacional San Luis Gonzaga de Ica, con más de 25 años de experiencia. Se especializa en Derecho Municipal, Administrativo y Laboral.',
        bioCompleta: 'Walter Llerena Peña es abogado egresado de la Universidad Nacional San Luis Gonzaga de Ica y cuenta con más de 25 años de experiencia profesional. Su práctica se enfoca en Derecho Municipal, Administrativo y Laboral. Tiene estudios de maestría en Derecho Penal y realizó el mismo curso en el Centro de Altos Estudios Nacionales (CAEN) que la Dra. Zinthia Garay Paucar.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Universidad Nacional San Luis Gonzaga de Ica • +25 años de experiencia • Estudios de maestría en Derecho Penal • Curso de especialización en el CAEN'
      },
      // ================= MIEMBRO 5: JIMENA LLERENA =================
      {
        nombre: 'Jimena Llerena',
        cargo: 'Asistente Administrativa y de Dirección',
        foto: 'assets/img/asistente-jimena-llerena.webp',
        isCutout: true,
        bio: 'Brinda apoyo administrativo y asiste a la Dra. Zinthia Garay. Cuenta con conocimientos de computación e inglés y conoce herramientas de inteligencia artificial.',
        bioCompleta: 'Jimena Llerena brinda apoyo administrativo y asistencia a la Dra. Zinthia Garay. Cuenta con conocimientos de computación e inglés, y conoce el uso de herramientas de inteligencia artificial.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Apoyo administrativo • Computación • Inglés • Herramientas de inteligencia artificial'
      }
    ];
