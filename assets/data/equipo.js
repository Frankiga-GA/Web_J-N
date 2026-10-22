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
        bio: 'Lidera el estudio con más de 18 años de experiencia profesional y académica, atendiendo personalmente cada caso de inicio a fin.',
        bioCompleta: 'La Zinthia Garay Paucar (Reg. CAI Nº 3534) es una prestigiosa abogada peruana egresada de la Universidad Nacional San Luis Gonzaga de Ica, con más de 18 años de experiencia profesional y académica. Magíster en Gestión Pública y especialista por el Centro de Altos Estudios Nacionales (CAEN), lidera J&N Asesoría Legal y Consultoría brindando patrocinio legal estratégico y de alta efectividad a personas naturales, empresas e instituciones públicas.',
        idiomas: 'Español ' + FLAG_ES + ' • Quechua ' + FLAG_PE + ' • Inglés ' + FLAG_GB,
        cred: 'Reg. CAI Nº 3534 • Magíster en Gestión Pública • Especialista CAEN'
      },
      // ================= MIEMBRO 2: WALTER LLERENA =================
      {
        nombre: 'Abg. David Llerena Ramos',
        cargo: 'Especialista en Derecho Notarial y Registral',
        foto: 'assets/img/abg-walter-llerena.webp?v=2',
        isCutout: true,
        bio: 'Especialista en Derecho Notarial y Registral, con más de diez años de experiencia en los sectores público y privado. También cuenta con experiencia en Derecho Penal, Procesal Penal y Ejecución Coactiva.',
        bioCompleta: 'Abogado colegiado y habilitado (Reg. CAL Nº 72306 – CAV N° 143), especialista en Derecho Notarial y Registral, con más de diez años de trayectoria en el ámbito jurídico y experiencia en Derecho Penal y Procesal Penal. Ha brindado asesoría en casos penales, elaborado denuncias y escritos, analizado expedientes fiscales y judiciales, y realizado seguimiento de diligencias y plazos procesales, tras haber sido practicante asistente en función fiscal en el Ministerio Público de Ica. Su trayectoria comprende además el Derecho Administrativo y la ejecución coactiva, tanto en el sector público como en el privado, con sólida capacidad de análisis jurídico, redacción de documentos legales y gestión de expedientes en distintas áreas del Derecho.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Reg. CAL Nº 72306 • CAV N° 143 • Egresado de Maestría en Derecho Notarial y Registral (USS)'
      },
      // ================= MIEMBRO 3: JHONY ZAPATA =================
      {
        nombre: 'Abg. Jhony Zapata',
        cargo: 'Abogado Asociado',
        foto: 'assets/img/abg-jhony-zapata.webp?v=2',
        isCutout: true,
        bio: 'Abogado con una trayectoria de más de 20 años en el sistema de justicia: 10 años como secretario judicial del Poder Judicial y 10 años como defensor público.',
        bioCompleta: 'Abogado con una amplia trayectoria de más de 20 años en el sistema de justicia peruano: 10 años como secretario judicial del Poder Judicial y 10 años como defensor público. Complementa su formación con pasantías en Medellín (Colombia), pasantías en Arica (Chile) y un curso de Derecho Global en Medellín, además de una activa participación en congresos y certámenes jurídicos nacionales e internacionales.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Reg. CAL Nº (por confirmar)'
      },
      // ================= MIEMBRO 4: WALTER LLERENA PEÑA =================
      {
        nombre: 'Abg. Walter Llerena Peña',
        cargo: 'Especialista en Derecho Municipal, Administrativo y Laboral',
        foto: 'assets/img/abg-walter-llerena-pena-nuevo.webp',
        isCutout: true,
        bio: 'Abogado egresado de la Universidad Nacional San Luis Gonzaga de Ica, con más de 25 años de experiencia profesional. Especialista en Derecho Municipal, Administrativo y Laboral.',
        bioCompleta: 'Abogado egresado de la Universidad Nacional San Luis Gonzaga de Ica, con más de 25 años de experiencia profesional. Su práctica se especializa en Derecho Municipal, Administrativo y Laboral, brindando asesoría y patrocinio en procedimientos, sanciones, licencias y controversias laborales. Cuenta con estudios de maestría en Derecho Penal y realizó el mismo curso de especialización en el Centro de Altos Estudios Nacionales (CAEN) que la Dra. Zinthia Garay Paucar.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Universidad Nacional San Luis Gonzaga de Ica • +25 años de experiencia • Estudios de maestría en Derecho Penal • Curso de especialización en el CAEN'
      },
      // ================= MIEMBRO 5: JIMENA LLERENA =================
      {
        nombre: 'Jimena Llerena',
        cargo: 'Asistente Administrativa y de Dirección',
        foto: 'assets/img/asistente-jimena-llerena.webp',
        isCutout: true,
        bio: 'Brinda apoyo administrativo y asistencia directa a la Dra. Zinthia Garay. Cuenta con conocimientos de computación e inglés y conoce herramientas de inteligencia artificial.',
        bioCompleta: 'Brinda apoyo administrativo y asistencia directa a la Dra. Zinthia Garay. Cuenta con conocimientos de computación e inglés, y conoce el uso de herramientas de inteligencia artificial.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Apoyo administrativo • Computación • Inglés • Herramientas de inteligencia artificial'
      }
    ];
