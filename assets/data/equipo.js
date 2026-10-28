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
        bio: 'Abogada y directora de J&N Asesoría Legal y Consultoría, con más de 18 años de experiencia profesional. Es Magíster en Gestión Pública y cuenta con especialización en Gestión Pública por el CAEN. Sus especialidades son: Derecho Civil, Derecho Comercial y Recursos Hídricos.',
        bioCompleta: 'Abogada con estudios en la Universidad Nacional San Luis Gonzaga de Ica y más de 18 años de experiencia profesional. Es Magíster en Gestión Pública y cuenta con especialización en Gestión Pública por el CAEN. Dirige J&N Asesoría Legal y Consultoría. Sus especialidades son: Derecho Civil, Derecho Comercial y Recursos Hídricos.',
        idiomas: 'Español ' + FLAG_ES + ' • Quechua ' + FLAG_PE + ' • Inglés ' + FLAG_GB,
        cred: 'Reg. CAI 3534 • Magíster en Gestión Pública • Especialización en Gestión Pública (CAEN) • Derecho Civil - Comercial • Recursos Hídricos'
      },
      // ================= MIEMBRO 2: WALTER LLERENA =================
      {
        nombre: 'Abg. David Llerena Ramos',
        cargo: 'Abogado especialista en Derecho Notarial, Registral y Civil',
        foto: 'assets/img/abg-david-llerena-nuevo.webp',
        isCutout: true,
        bio: 'Abogado con más de 10 años de experiencia. Tiene estudios de maestría en Derecho Notarial y Registral y especialización en Derecho Administrativo. Sus especialidades son: Derecho Notarial, Derecho Registral y Derecho Civil.',
        bioCompleta: 'Abogado colegiado y habilitado (Reg. CAL 72306, CAV 143), con más de 10 años de experiencia profesional. Tiene estudios de maestría en Derecho Notarial y Registral y especialización en Derecho Administrativo. Sus especialidades son: Derecho Notarial, Derecho Registral y Derecho Civil.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Reg. CAL 72306 • CAV 143 • Estudios de maestría en Derecho Notarial y Registral • Especialización en Derecho Administrativo'
      },
      // ================= MIEMBRO 3: JHONY ZAPATA =================
      {
        nombre: 'Abg. Jhony Zapata',
        cargo: 'Abogado penal',
        foto: 'assets/img/abg-jhony-zapata.webp?v=2',
        isCutout: true,
        bio: 'Abogado penalista con más de 20 años de experiencia en el sistema de justicia: diez como secretario judicial y diez como defensor público. Sus especialidades son: Derecho Penal.',
        bioCompleta: 'Abogado penalista con más de 20 años de experiencia en el sistema de justicia: diez años como secretario judicial del Poder Judicial y diez como defensor público. Sus especialidades son: Derecho Penal.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Más de 20 años en el sistema de justicia • Poder Judicial • Defensa Pública'
      },
      // ================= MIEMBRO 4: WALTER LLERENA PEÑA =================
      {
        nombre: 'Abg. Walter Llerena Peña',
        cargo: 'Especialista en Derecho Municipal, Derecho Administrativo y Derecho Laboral',
        foto: 'assets/img/walter-llerena-retrato-20261026.png',
        isCutout: true,
        bio: 'Abogado con más de 25 años de experiencia profesional. Tiene estudios de maestría en Derecho Penal y alta especialización en Administración y Gestión Pública por el CAEN. Sus especialidades son: Derecho Municipal, Derecho Administrativo y Derecho Laboral.',
        bioCompleta: 'Abogado con más de 25 años de experiencia profesional. Tiene estudios de maestría en Derecho Penal y alta especialización en Administración y Gestión Pública por el CAEN. Sus especialidades son: Derecho Municipal, Derecho Administrativo y Derecho Laboral.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Más de 25 años de experiencia • Estudios de maestría en Derecho Penal • Alta especialización en Administración y Gestión Pública (CAEN) • Derecho Municipal, Administrativo y Laboral'
      },
      // ================= MIEMBRO 5: JIMENA LLERENA =================
      {
        nombre: 'Jimena Llerena',
        cargo: 'Asistente Administrativa y de Dirección',
        foto: 'assets/img/asistente-jimena-llerena.webp',
        isCutout: true,
        bio: 'Apoya la gestión administrativa y asiste a la Dra. Zinthia. Tiene conocimientos de computación, inglés y herramientas de inteligencia artificial.',
        bioCompleta: 'Asistente administrativa y de dirección. Apoya la gestión administrativa y asiste a la Dra. Zinthia. Tiene conocimientos de computación, inglés y herramientas de inteligencia artificial.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Apoyo administrativo • Computación • Inglés • Herramientas de IA'
      }
    ];
