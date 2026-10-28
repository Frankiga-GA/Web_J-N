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
        bio: 'Abogada (CAI N° 3534), con estudios en la Universidad Nacional San Luis Gonzaga de Ica y más de 18 años de experiencia profesional. Magíster en Gestión Pública y cuenta con especialización en Gestión Pública (CAEN). Dirige J&N Asesoría Legal y Consultoría.\n\nEspecialidades:\nDerecho Civil\nComercial y Recursos Hídricos.',
        bioCompleta: 'Abogada (CAI N° 3534), con estudios en la Universidad Nacional San Luis Gonzaga de Ica y más de 18 años de experiencia profesional. Magíster en Gestión Pública y cuenta con especialización en Gestión Pública (CAEN). Dirige J&N Asesoría Legal y Consultoría.\n\nEspecialidades:\nDerecho Civil\nComercial y Recursos Hídricos.',
        idiomas: 'Español ' + FLAG_ES + ' • Quechua ' + FLAG_PE + ' • Inglés ' + FLAG_GB,
        cred: 'Reg. CAI 3534 • Magíster en Gestión Pública • Especialización en Gestión Pública (CAEN) • Derecho Civil - Comercial • Recursos Hídricos'
      },
      // ================= MIEMBRO 2: WALTER LLERENA =================
      {
        nombre: 'Abg. David Llerena Ramos',
        cargo: 'Abogado especialista en Derecho Notarial, Registral y Civil',
        foto: 'assets/img/abg-david-llerena-nuevo.webp',
        isCutout: true,
        bio: 'Abogado con más de 10 años de experiencia. Tiene estudios de maestría en Derecho Notarial y Registral y especialización en Derecho Administrativo.\n\nEspecialidades:\nDerecho Notarial\nDerecho Registral\nDerecho Civil.',
        bioCompleta: 'Abogado colegiado y habilitado (Reg. CAL 72306, CAV 143), con más de 10 años de experiencia profesional. Tiene estudios de maestría en Derecho Notarial y Registral y especialización en Derecho Administrativo.\n\nEspecialidades:\nDerecho Notarial\nDerecho Registral\nDerecho Civil.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Reg. CAL 72306 • CAV 143 • Estudios de maestría en Derecho Notarial y Registral • Especialización en Derecho Administrativo'
      },
      // ================= MIEMBRO 3: JHONY ZAPATA =================
      {
        nombre: 'Abg. Jhony Zapata',
        cargo: 'Abogado penalista',
        foto: 'assets/img/abg-jhony-zapata.webp?v=2',
        isCutout: true,
        bio: 'Abogado penalista con más de 20 años de experiencia en el sistema de justicia. Cuenta con estudios de maestría en Derecho Penal y especialización en Derecho Penal y Procesal Penal.\n\nEspecialidades:\nDerecho Penal\nProcesal Penal.',
        bioCompleta: 'Abogado penalista con más de 20 años de experiencia en el sistema de justicia: diez años como secretario judicial del Poder Judicial y diez como defensor público. Cuenta con estudios de maestría en Derecho Penal y especialización en Derecho Penal y Procesal Penal.\n\nEspecialidades:\nDerecho Penal\nProcesal Penal.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Más de 20 años en el sistema de justicia • Estudios de maestría en Derecho Penal • Especialización en Derecho Penal y Derecho Procesal Penal'
      },
      // ================= MIEMBRO 4: WALTER LLERENA PEÑA =================
      {
        nombre: 'Abg. Walter Llerena Peña',
        cargo: 'Abogado con más de 25 años de experiencia municipal',
        foto: 'assets/img/walter-llerena-retrato-20261026.png',
        isCutout: true,
        bio: 'Abogado con más de 25 años de experiencia profesional. Tiene estudios de maestría en Derecho Penal y alta especialización en Administración y Gestión Pública por el CAEN.\n\nEspecialidades:\nDerecho Municipal\nDerecho Administrativo\nDerecho Laboral.',
        bioCompleta: 'Abogado con más de 25 años de experiencia profesional. Tiene estudios de maestría en Derecho Penal y alta especialización en Administración y Gestión Pública por el CAEN.\n\nEspecialidades:\nDerecho Municipal\nDerecho Administrativo\nDerecho Laboral.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Más de 25 años de experiencia • Estudios de maestría en Derecho Penal • Alta especialización en Administración y Gestión Pública (CAEN) • Derecho Municipal, Administrativo y Laboral'
      },
      // ================= MIEMBRO 5: JIMENA LLERENA =================
      {
        nombre: 'Jimena Llerena',
        cargo: 'Asistente Administrativa y de Dirección',
        foto: 'assets/img/asistente-jimena-llerena.webp',
        isCutout: true,
        bio: 'Apoya la gestión administrativa, de dirección y marketing. Tiene conocimientos de computación, inglés y herramientas de inteligencia artificial.',
        bioCompleta: 'Asistente administrativa y de dirección. Apoya la gestión administrativa y de marketing. Tiene conocimientos de computación, inglés y herramientas de inteligencia artificial.',
        idiomas: 'Español ' + FLAG_ES,
        cred: 'Apoyo administrativo • Marketing • Computación • Inglés • Herramientas de IA'
      }
    ];
