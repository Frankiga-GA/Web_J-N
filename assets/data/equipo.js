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
        cargo: 'Directora',
        foto: 'assets/img/zinthia-garay-equipo.webp', // PNG recortado con fondo transparente
        isCutout: true,
        bio: 'Directora de J&N Asesoría Legal y Consultoría. Cuenta con más de 18 años de experiencia profesional y académica, es Magíster en Gestión Pública y especialista en Derecho Civil, Derecho Comercial y Recursos Hídricos.',
        bioCompleta: 'Zinthia Garay Paucar (Reg. CAI 3534) es egresada de la Universidad Nacional San Luis Gonzaga de Ica y cuenta con más de 18 años de experiencia profesional y académica. Es Magíster en Gestión Pública y cuenta con una especialización en Gestión Pública por el Centro de Altos Estudios Nacionales (CAEN). Dirige J&N Asesoría Legal y Consultoría y es especialista en Derecho Civil, Derecho Comercial y Recursos Hídricos.',
        idiomas: 'Español ' + FLAG_ES + ' • Quechua ' + FLAG_PE + ' • Inglés ' + FLAG_GB,
        cred: 'Reg. CAI 3534 • Magíster en Gestión Pública • Especialización en Gestión Pública (CAEN) • Derecho Civil, Comercial y Recursos Hídricos'
      },
      // ================= MIEMBRO 2: WALTER LLERENA =================
      {
        nombre: 'Abg. David Llerena Ramos',
        cargo: 'Abogado especialista en Derecho Notarial, Registral y Civil',
        foto: 'assets/img/abg-david-llerena-nuevo.webp',
        isCutout: true,
        bio: 'Abogado con más de 10 años de experiencia profesional. Tiene estudios de maestría en Derecho Notarial y Registral y especialización en Derecho Administrativo. Es especialista en Derecho Notarial, Registral y Civil.',
        bioCompleta: 'David Llerena Ramos es abogado colegiado y habilitado (Reg CAL 72306, CAV 143), con más de 10 años de experiencia profesional. Tiene estudios de maestría en Derecho Notarial y Registral y especialización en Derecho Administrativo. Es especialista en Derecho Notarial, Registral y Civil.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Reg CAL 72306, CAV 143, estudios de maestría en Derecho Notarial y Registral, especialización en Derecho Administrativo'
      },
      // ================= MIEMBRO 3: JHONY ZAPATA =================
      {
        nombre: 'Abg. Jhony Zapata',
        cargo: 'Abogado penal',
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
        cargo: 'Especialista en Derecho Municipal, Derecho Administrativo y Derecho Laboral',
        foto: 'assets/img/walter-llerena-retrato-20261026.png',
        isCutout: true,
        bio: 'Abogado con más de 25 años de experiencia profesional. Tiene estudios de maestría en Derecho Penal y alta especialización en Administración y Gestión Pública por el CAEN. Sus especialidades son Derecho Municipal, Derecho Administrativo y Derecho Laboral.',
        bioCompleta: 'Abogado con más de 25 años de experiencia profesional. Tiene estudios de maestría en Derecho Penal y alta especialización en Administración y Gestión Pública por el CAEN. Sus especialidades son Derecho Municipal, Derecho Administrativo y Derecho Laboral.',
        bioResaltados: ['Abogado', 'más de 25 años de experiencia profesional', 'estudios de maestría en Derecho Penal', 'alta especialización en Administración y Gestión Pública por el CAEN', 'Sus especialidades son', 'Derecho Municipal', 'Derecho Administrativo', 'Derecho Laboral'],
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Más de 25 años de experiencia • Estudios de maestría en Derecho Penal • Alta especialización en Administración y Gestión Pública (CAEN) • Derecho Municipal, Administrativo y Laboral'
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
