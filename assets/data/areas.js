// ============ BASE DE DATOS COMPLETA DE PÁGINAS DE ÁREAS ============
    const areasPageData = {
      'penal': {
        title: 'Defensa Penal Estratégica',
        heroImg: 'assets/img/areas/area-penal.webp',
        sideImg: 'assets/img/area-penal-despacho.webp',
        intro: '¿Recibiste una citación, una denuncia o una notificación fiscal? Brindamos asesoría y defensa en investigaciones y procesos penales ante la Policía, el Ministerio Público y los juzgados. Revisamos la información disponible y explicamos las alternativas según la etapa y las circunstancias de cada caso.',
        subcards: [
          {
            title: 'Investigación Preliminar y Preparatoria',
            desc: 'Orientación para declaraciones, citaciones y otras diligencias. Revisamos las actuaciones y los plazos para definir los pasos de defensa que correspondan.'
          },
          {
            title: 'Medidas Cautelares y Prisión Preventiva',
            desc: 'Preparación y defensa en audiencias sobre comparecencia, prisión preventiva y otras restricciones. La estrategia depende de los hechos y de la información del expediente.'
          },
          {
            title: 'Juicio Oral y Litigación Avanzada',
            desc: 'Preparación para la etapa intermedia y el juicio oral: revisión de la acusación y las pruebas, participación en audiencias y exposición de argumentos.'
          }
        ]
      },
      'admin-publica': {
        title: 'Delitos contra la Administración Pública',
        heroImg: 'assets/img/areas/area-admin.webp',
        sideImg: 'assets/img/areas/area-corporativo.webp',
        intro: 'Asesoramos y ejercemos la defensa de autoridades, servidores públicos, exfuncionarios y particulares investigados por presuntos delitos vinculados con la función pública. Revisamos la imputación, los documentos y las actuaciones fiscales para explicar las opciones de defensa en cada etapa.',
        subcards: [
          {
            title: 'Colusión y Contrataciones Estatales',
            desc: 'Asesoría y defensa en investigaciones relacionadas con contrataciones públicas, procesos de selección, licitaciones y ejecución de obras.'
          },
          {
            title: 'Peculado y Malversación de Fondos',
            desc: 'Revisión de imputaciones, documentación y elementos contables en investigaciones por presunta apropiación o uso irregular de recursos públicos.'
          },
          {
            title: 'Cohecho, Concusión y Negociación Incompatible',
            desc: 'Defensa en investigaciones por presunto favorecimiento, beneficios indebidos o conflictos de interés en decisiones y contratos públicos.'
          }
        ]
      },
      'penal-tributario': {
        title: 'Penal Tributario y Financiero',
        heroImg: 'assets/img/areas/area-tributario-nueva.webp',
        sideImg: 'assets/img/areas/area-tributario-nueva.webp',
        intro: 'Asesoramos a empresas y directivos ante controversias tributarias y financieras que puedan tener implicancias legales o penales. Revisamos la información disponible, identificamos los puntos que requieren atención y explicamos las opciones de respuesta o defensa.',
        subcards: [
          {
            title: 'Prevención Penal Tributaria',
            desc: 'Revisión de obligaciones y documentación tributaria para identificar contingencias y definir medidas de atención frente a requerimientos de SUNAT.'
          },
          {
            title: 'Litigios y Controversias Fiscales',
            desc: 'Orientación en fiscalizaciones y procedimientos tributarios, así como defensa en investigaciones penales relacionadas con presuntos delitos tributarios.'
          },
          {
            title: 'Estructuración y Asesoría Financiera',
            desc: 'Revisión de operaciones y documentación financiera vinculada con investigaciones o controversias para preparar una respuesta legal adecuada.'
          }
        ]
      },
      'civil': {
        title: 'Derecho Civil y Patrimonial',
        heroImg: 'assets/img/areas/area-civil.webp',
        sideImg: 'assets/img/areas/area-civil.webp',
        intro: 'Brindamos asesoría en contratos, obligaciones y conflictos patrimoniales para personas, familias y empresas. Revisamos los documentos y los hechos para explicar las alternativas de negociación o las acciones legales que podrían corresponder.',
        subcards: [
          {
            title: 'Saneamiento Físico-Legal de Inmuebles',
            desc: 'Orientación sobre títulos, prescripción adquisitiva, reivindicación y desalojo. La vía aplicable depende de los antecedentes y documentos del inmueble.'
          },
          {
            title: 'Contratos, Hipotecas y Garantías',
            desc: 'Revisión y elaboración de contratos de compraventa, arrendamiento y otras obligaciones; orientación ante incumplimientos, garantías y gravámenes.'
          },
          {
            title: 'Responsabilidad Civil e Indemnizaciones',
            desc: 'Evaluación de reclamos por daños y perjuicios derivados del incumplimiento de un contrato o de otros hechos, según las pruebas disponibles.'
          }
        ]
      },
      'municipal': {
        title: 'Derecho Administrativo y Municipal',
        heroImg: 'assets/img/areas/area-corporativo.webp',
        sideImg: 'assets/img/areas/area-admin.webp',
        intro: 'Asesoramos a personas, comercios y empresas en trámites y procedimientos ante municipalidades y otras entidades públicas. Revisamos resoluciones, notificaciones y expedientes para explicar los recursos o acciones que podrían presentarse.',
        subcards: [
          {
            title: 'Defensa ante Sanciones y Multas',
            desc: 'Revisión y respuesta ante actas de fiscalización, multas, órdenes de clausura y otras sanciones administrativas.'
          },
          {
            title: 'Paralización de Cobranza Coactiva',
            desc: 'Orientación en procedimientos de cobranza coactiva, medidas de embargo y recursos disponibles. La suspensión de una medida depende de los requisitos legales y de la autoridad competente.'
          },
          {
            title: 'Licencias y Contencioso Administrativo',
            desc: 'Asesoría en licencias, zonificación y recursos administrativos; revisión de opciones judiciales cuando corresponda.'
          }
        ]
      },
      'laboral': {
        title: 'Derecho Laboral y Corporativo',
        heroImg: 'assets/img/areas/area-laboral.webp',
        sideImg: 'assets/img/areas-hero-banner.webp',
        intro: 'Orientamos a trabajadores y empleadores sobre relaciones laborales, contratos, beneficios y controversias. También brindamos asesoría en procedimientos inspectivos y procesos ante las autoridades competentes.',
        subcards: [
          {
            title: 'Despidos y Reposición Judicial',
            desc: 'Evaluación de despidos y asesoría sobre las alternativas disponibles, como solicitar reposición o indemnización cuando corresponda.'
          },
          {
            title: 'Reclamo de Beneficios Sociales',
            desc: 'Revisión y cálculo de conceptos como CTS, gratificaciones, vacaciones, horas extras y otros beneficios laborales reclamados.'
          },
          {
            title: 'Inspecciones ante SUNAFIL',
            desc: 'Orientación a empleadores durante inspecciones, atención de requerimientos y presentación de descargos ante SUNAFIL.'
          }
        ]
      },
      'familia': {
        title: 'Familia y Sucesiones',
        heroImg: 'assets/img/areas/area-familia.webp',
        sideImg: 'assets/img/areas/area-civil.webp',
        intro: 'Brindamos orientación confidencial en asuntos familiares y sucesorios, con atención cuidadosa a la situación de cada persona y, cuando corresponda, al bienestar de niñas, niños y adolescentes.',
        subcards: [
          {
            title: 'Divorcios y Liquidación de Gananciales',
            desc: 'Orientación en divorcios por mutuo acuerdo o en procesos judiciales, además de asuntos relacionados con la liquidación de bienes.'
          },
          {
            title: 'Alimentos, Tenencia y Régimen de Visitas',
            desc: 'Asesoría en solicitudes o cambios de pensión de alimentos, tenencia y régimen de visitas, de acuerdo con las circunstancias familiares.'
          },
          {
            title: 'Sucesiones Intestadas y Herencias',
            desc: 'Orientación en sucesiones intestadas, identificación de herederos, división de bienes y planificación sucesoria.'
          }
        ]
      },
      'agrario': {
        title: 'Derecho Agrario y Tierras',
        heroImg: 'assets/img/areas/area-agrario.webp',
        sideImg: 'assets/img/areas/area-agrario.webp',
        intro: 'Asesoramos a propietarios, productores y organizaciones agrarias en asuntos relacionados con predios rurales, linderos, servidumbres y uso del agua. Revisamos los antecedentes registrales y administrativos para orientar los trámites pertinentes.',
        subcards: [
          {
            title: 'Titulación y Formalización Rural',
            desc: 'Orientación en formalización, titulación e inscripción de predios rurales ante las entidades que correspondan, según sus antecedentes.'
          },
          {
            title: 'Controversias de Linderos y Servidumbres',
            desc: 'Asesoría en controversias sobre límites de parcelas y en la constitución o revisión de servidumbres de paso y de agua.'
          },
          {
            title: 'Recursos Hídricos y Juntas de Regantes',
            desc: 'Orientación en solicitudes y procedimientos sobre derechos de uso de agua ante la Autoridad Nacional del Agua y organizaciones de usuarios.'
          }
        ]
      },
      'ambiental-maritimo': {
        title: 'Derecho Ambiental y Marítimo',
        heroImg: 'assets/img/areas/area-maritimo.webp',
        sideImg: 'assets/img/areas/area-maritimo.webp',
        intro: 'Asesoramos a empresas y organizaciones en asuntos legales vinculados con actividades pesqueras, portuarias y ambientales, así como en procedimientos ante las autoridades competentes.',
        subcards: [
          {
            title: 'Gestión ambiental y procedimientos',
            desc: 'Revisión de obligaciones ambientales y orientación para responder a requerimientos o procedimientos administrativos, incluidos los tramitados ante el OEFA.'
          },
          {
            title: 'Permisos de Pesca y Autorizaciones',
            desc: 'Asesoría en permisos y autorizaciones para actividades pesqueras, de acuerdo con el tipo de operación y los requisitos aplicables.'
          },
          {
            title: 'Contratos Marítimos y Puerto',
            desc: 'Revisión de contratos relacionados con transporte y operaciones marítimas; orientación en controversias ante las autoridades competentes.'
          }
        ]
      },
      'digital': {
        title: 'Derecho Digital',
        heroImg: 'assets/img/areas/area-digital.webp',
        sideImg: 'assets/img/areas/area-digital.webp',
        intro: 'Ayudamos a personas y organizaciones a atender asuntos legales relacionados con datos personales, actividad comercial en línea y delitos informáticos. Revisamos documentos y explicamos las alternativas según la situación.',
        subcards: [
          {
            title: 'Protección de Datos Personales',
            desc: 'Revisión de avisos de privacidad, formularios y prácticas de tratamiento de datos; orientación para atender consultas o procedimientos ante la autoridad competente.'
          },
          {
            title: 'Delitos Informáticos',
            desc: 'Orientación y patrocinio ante fraudes en línea, suplantación de identidad y otros hechos que puedan constituir delitos informáticos.'
          },
          {
            title: 'Contratos y comercio digital',
            desc: 'Elaboración y revisión de términos de uso, políticas de privacidad y contratos para servicios digitales, plataformas y comercio electrónico.'
          }
        ]
      },
      'constitucional': {
        title: 'Derecho Constitucional',
        heroImg: 'assets/img/areas/area-constitucional.webp',
        sideImg: 'assets/img/areas/area-constitucional.webp',
        intro: 'Brindamos orientación y patrocinio cuando una decisión de una autoridad o de un particular podría afectar derechos fundamentales. Revisamos los hechos y explicamos si existe una vía constitucional aplicable.',
        subcards: [
          {
            title: 'Amparo y Hábeas Data',
            desc: 'Evaluación de posibles afectaciones al debido proceso, igualdad, privacidad y otros derechos, así como de las vías legales disponibles.'
          },
          {
            title: 'Hábeas Corpus y Libertad Personal',
            desc: 'Asesoría ante posibles afectaciones a la libertad personal y coordinación con la defensa penal cuando el caso lo requiera.'
          },
          {
            title: 'Inconstitucionalidad y Cumplimiento',
            desc: 'Análisis de procesos de cumplimiento y otros mecanismos constitucionales, según la legitimación y los requisitos aplicables.'
          }
        ]
      },
      'inmobiliario': {
        title: 'Propiedad Inmobiliaria',
        heroImg: 'assets/img/areas/area-inmobiliario.webp',
        sideImg: 'assets/img/areas/area-inmobiliario.webp',
        intro: 'Asesoramos antes y después de comprar, vender o alquilar un inmueble. Revisamos títulos y antecedentes, y orientamos en saneamiento, posesión, contratos y conflictos sobre propiedad.',
        subcards: [
          {
            title: 'Compraventas y Saneamiento de Títulos',
            desc: 'Revisión de partidas y antecedentes registrales, elaboración o revisión de contratos y orientación para rectificar o regularizar información.'
          },
          {
            title: 'Prescripción Adquisitiva de Dominio',
            desc: 'Evaluación de los requisitos y documentos para solicitar la prescripción adquisitiva por la vía que corresponda. La procedencia depende de cada caso.'
          },
          {
            title: 'Desalojos, Interdictos y Posesión',
            desc: 'Asesoría en desalojos, conflictos de posesión y controversias sobre propiedad, con revisión de contratos, títulos y demás pruebas.'
          }
        ]
      }
    };
