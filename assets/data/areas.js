// ============ BASE DE DATOS COMPLETA DE PÁGINAS DE ÁREAS ============
    const areasPageData = {
      'penal': {
        title: 'Defensa Penal Estratégica',
        heroImg: 'assets/img/areas/area-penal.jpg',
        sideImg: 'assets/img/area-penal-despacho.jpg',
        intro: 'En J&N Asesoría Legal y Consultoría contamos con amplia solvencia técnica y experiencia en la defensa penal de alta complejidad. Patrocinamos a personas naturales y directivos en investigaciones ante la Policía Nacional, Ministerio Público y juzgados penales del Poder Judicial en Chincha, Ica y otras jurisdicciones del país, salvaguardando en todo momento sus derechos constitucionales y libertad individual.',
        subcards: [
          {
            title: 'Investigación Preliminar y Preparatoria',
            desc: 'Asistencia inmediata en detenciones policiales, declaraciones ante la Fiscalía y articulación de mecanismos de tutela de derechos procesales.'
          },
          {
            title: 'Medidas Cautelares y Prisión Preventiva',
            desc: 'Defensa técnica rigurosa en audiencias de coerción personal, solicitudes de cese de prisión preventiva e impedimentos de salida del país.'
          },
          {
            title: 'Juicio Oral y Litigación Avanzada',
            desc: 'Control de acusación, debate probatorio, objeciones y alegatos de clausura ante Juzgados Unipersonales, Colegiados y Salas Penales.'
          }
        ]
      },
      'admin-publica': {
        title: 'Delitos contra la Administración Pública',
        heroImg: 'assets/img/areas/area-admin.jpg',
        sideImg: 'assets/img/areas/area-corporativo.jpg',
        intro: 'El Estudio J&N lidera la defensa penal especializada de autoridades, exfuncionarios públicos, servidores y empresarios investigados por el Sistema Especializado en Delitos de Corrupción de Funcionarios. Implementamos estrategias procesales y periciales rigurosas para desvirtuar imputaciones penales del Ministerio Público.',
        subcards: [
          {
            title: 'Colusión y Contrataciones Estatales',
            desc: 'Defensa penal frente a presuntas irregularidades en procesos de selección, licitaciones públicas y ejecución de obras con entidades del Estado.'
          },
          {
            title: 'Peculado y Malversación de Fondos',
            desc: 'Patrocinio especializado con peritajes contables y financieros de descargo ante imputaciones de apropiación o desvío de caudales públicos.'
          },
          {
            title: 'Cohecho, Concusión y Negociación Incompatible',
            desc: 'Representación técnica frente a investigaciones por presunto favorecimiento o interés indebido en contratos y actos de la administración pública.'
          }
        ]
      },
      'penal-tributario': {
        title: 'Penal Tributario y Financiero',
        heroImg: 'assets/img/areas/area-tributario-nueva.webp',
        sideImg: 'assets/img/areas/area-tributario-nueva.webp',
        intro: 'Contamos con amplia experiencia en la defensa y prevención de delitos tributarios y financieros. Asesoramos a corporaciones y directivos frente a acusaciones de fraude fiscal, lavado de activos y contingencias tributarias punitivas, implementando estrategias integrales que combinan gestión de riesgos, cumplimiento normativo y litigación penal efectiva.',
        subcards: [
          {
            title: 'Prevención Penal Tributaria',
            desc: 'Diseño de estrategias de cumplimiento fiscal, blindaje patrimonial y detección temprana de riesgos penales ante contingencias con SUNAT.'
          },
          {
            title: 'Litigios y Controversias Fiscales',
            desc: 'Defensa técnica en procesos de defraudación tributaria, auditorías fiscales punitivas y sanciones aduaneras ante fiscalías especializadas.'
          },
          {
            title: 'Estructuración y Asesoría Financiera',
            desc: 'Análisis de operaciones y flujos económicos en investigaciones por delitos bancarios, financieros y prevención de lavado de activos.'
          }
        ]
      },
      'civil': {
        title: 'Derecho Civil y Patrimonial',
        heroImg: 'assets/img/areas/area-civil.jpg',
        sideImg: 'assets/img/areas/area-civil.jpg',
        intro: 'Protegemos y defendemos el patrimonio de personas naturales, familias y empresas. Nuestro bufete ofrece asesoría jurídica integral en contratación civil, resolución de controversias sobre inmuebles y reclamaciones indemnizatorias de alta envergadura patrimonial.',
        subcards: [
          {
            title: 'Saneamiento Físico-Legal de Inmuebles',
            desc: 'Prescripción adquisitiva de dominio notarial y judicial, mejor derecho de propiedad, reivindicación, títulos y procesos de desalojo.'
          },
          {
            title: 'Contratos, Hipotecas y Garantías',
            desc: 'Redacción, negociación, resolución y rescisión de contratos de compraventa, arrendamiento, fideicomisos y levantamiento de gravámenes.'
          },
          {
            title: 'Responsabilidad Civil e Indemnizaciones',
            desc: 'Demandas por daños y perjuicios contractuales y extracontractuales (daño emergente, lucro cesante y daño moral a la persona).'
          }
        ]
      },
      'municipal': {
        title: 'Derecho Administrativo y Municipal',
        heroImg: 'assets/img/areas/area-corporativo.jpg',
        sideImg: 'assets/img/areas/area-admin.jpg',
        intro: 'Brindamos defensa jurídica y patrocinio técnico a comercios, empresas y ciudadanos frente a resoluciones arbitrarias emitidas por municipalidades provinciales, distritales y ministerios de Estado en la región Ica y a nivel nacional.',
        subcards: [
          {
            title: 'Defensa ante Sanciones y Multas',
            desc: 'Impugnación de actas de fiscalización, papeletas de infracción, multas excesivas y órdenes de clausura temporal o definitiva de locales.'
          },
          {
            title: 'Paralización de Cobranza Coactiva',
            desc: 'Interposición de recursos de queja y medidas cautelares para suspender embargos en cuentas bancarias y retenciones de fondos indebidos.'
          },
          {
            title: 'Licencias y Contencioso Administrativo',
            desc: 'Trámite de licencias de funcionamiento, zonificación, recursos de apelación y demandas judiciales de nulidad de actos administrativos.'
          }
        ]
      },
      'laboral': {
        title: 'Derecho Laboral y Corporativo',
        heroImg: 'assets/img/areas/area-laboral.jpg',
        sideImg: 'assets/img/areas-hero-banner.webp',
        intro: 'Asesoramos estratégicamente a empleadores y trabajadores para prevenir contingencias y litigar controversias laborales complejas, asegurando el estricto cumplimiento de la normativa laboral peruana y la defensa ante el Poder Judicial y SUNAFIL.',
        subcards: [
          {
            title: 'Despidos y Reposición Judicial',
            desc: 'Patrocinio en demandas por despido incausado, arbitrario, fraudulento o nulo, solicitando reposición al puesto de trabajo o indemnización.'
          },
          {
            title: 'Reclamo de Beneficios Sociales',
            desc: 'Liquidación judicial de CTS, gratificaciones, vacaciones truncas, horas extras, utilidades y asignaciones familiares adeudadas.'
          },
          {
            title: 'Inspecciones ante SUNAFIL',
            desc: 'Asesoría y acompañamiento patronal en comparecencias inspectivas, descargos frente a requerimientos y reducción de sanciones laborales.'
          }
        ]
      },
      'familia': {
        title: 'Familia y Sucesiones',
        heroImg: 'assets/img/areas/area-familia.jpg',
        sideImg: 'assets/img/areas/area-civil.jpg',
        intro: 'Atendemos los asuntos de derecho de familia con alta sensibilidad humana, discreción y firmeza jurídica. Velamos prioritariamente por el interés superior de los hijos y la justa distribución del patrimonio forjado durante la unión conyugal.',
        subcards: [
          {
            title: 'Divorcios y Liquidación de Gananciales',
            desc: 'Tramitación de divorcio por mutuo acuerdo (rápido notarial/municipal) o por causales judiciales con partición de bienes conyugales.'
          },
          {
            title: 'Alimentos, Tenencia y Régimen de Visitas',
            desc: 'Fijación de pensión alimenticia, aumentos, reducciones y exoneraciones, así como acuerdos judiciales de tenencia y visitas compartidas.'
          },
          {
            title: 'Sucesiones Intestadas y Herencias',
            desc: 'Declaratoria notarial o judicial de herederos, división y partición de masa hereditaria, anticipos de legítima y testamentos.'
          }
        ]
      },
      'agrario': {
        title: 'Derecho Agrario y Tierras',
        heroImg: 'assets/img/areas/area-agrario.jpg',
        sideImg: 'assets/img/areas/area-agrario.jpg',
        intro: 'Nuestra firma posee amplia experiencia en el valle costero de Chincha, Pisco e Ica, asesorando a propietarios de fundos, parceleros y empresas agroindustriales en el saneamiento legal de predios rurales y gestión de recursos hídricos.',
        subcards: [
          {
            title: 'Titulación y Formalización Rural',
            desc: 'Regularización de la propiedad agraria, inmatriculación de fundos rústicos y eriazos ante COFOPRI, MIDAGRI y los Gobiernos Regionales.'
          },
          {
            title: 'Controversias de Linderos y Servidumbres',
            desc: 'Delimitación pericial de linderos, litigios sobre límites de parcelas y constitución legal de servidumbres de paso y acueducto.'
          },
          {
            title: 'Recursos Hídricos y Juntas de Regantes',
            desc: 'Gestión de licencias y permisos de uso de agua de pozo y río ante la Autoridad Nacional del Agua (ANA) y Juntas de Usuarios.'
          }
        ]
      },
      'ambiental-maritimo': {
        title: 'Derecho Ambiental y Marítimo',
        heroImg: 'assets/img/areas/area-maritimo.jpg',
        sideImg: 'assets/img/areas/area-maritimo.jpg',
        intro: 'Brindamos consultoría jurídica especializada en regulación pesquera, portuaria y ambiental a lo largo del litoral peruano, garantizando el estricto cumplimiento normativo frente a las autoridades marítimas y fiscalizadores ambientales.',
        subcards: [
          {
            title: 'Compliance Ambiental y OEFA',
            desc: 'Auditorías preventivas de cumplimiento ambiental y defensa técnica frente a procedimientos administrativos sancionadores del OEFA.'
          },
          {
            title: 'Permisos de Pesca y Autorizaciones',
            desc: 'Obtención y transferencia de derechos de pesca artesanal e industrial, cuotas de captura y licencias ante el Ministerio de la Producción.'
          },
          {
            title: 'Contratos Marítimos y Puerto',
            desc: 'Contratos de fletamento, seguros marítimos, resolución de controversias navales ante Capitanía de Puerto (DICAPI) y la Autoridad Portuaria.'
          }
        ]
      },
      'digital': {
        title: 'Derecho Digital',
        heroImg: 'assets/img/areas/area-digital.webp',
        sideImg: 'assets/img/areas/area-digital.webp',
        intro: 'Asesoramos a personas, empresas e instituciones en el entorno digital: protección de datos personales conforme a la Ley N° 29733, delitos informáticos, comercio electrónico, contratos digitales y ciberseguridad legal. Acompañamos a nuestros clientes frente a los riesgos y oportunidades de las nuevas tecnologías.',
        subcards: [
          {
            title: 'Protección de Datos Personales',
            desc: 'Cumplimiento de la Ley N° 29733 y su Reglamento: políticas de privacidad, gestión del consentimiento, transferencias internacionales y procedimientos ante la Autoridad Nacional de Protección de Datos Personales.'
          },
          {
            title: 'Delitos Informáticos',
            desc: 'Denuncias y defensa técnica ante fraudes electrónicos, suplantación de identidad, interceptación indebida de comunicaciones y accesos ilícitos a sistemas informáticos, conforme al Código Penal.'
          },
          {
            title: 'Contratos Digitales y E-commerce',
            desc: 'Redacción y revisión de términos y condiciones, contratos de desarrollo de software, licencias de uso, marketplaces, facturación electrónica y resolución de disputas en el comercio digital.'
          }
        ]
      },
      'constitucional': {
        title: 'Derecho Constitucional',
        heroImg: 'assets/img/areas/area-constitucional.webp',
        sideImg: 'assets/img/areas/area-constitucional.webp',
        intro: 'Defendemos los derechos fundamentales frente a cualquier poder público o particular. Litigamos con rigor técnico los procesos de amparo, hábeas corpus, hábeas data, cumplimiento, inconstitucionalidad y conflicto de competencias ante el Poder Judicial y el Tribunal Constitucional.',
        subcards: [
          {
            title: 'Amparo y Hábeas Data',
            desc: 'Tutela urgente y eficaz de derechos constitucionales vulnerados: debido proceso, igualdad y no discriminación, libertades de expresión e información, ante el Poder Judicial y el TC.'
          },
          {
            title: 'Hábeas Corpus y Libertad Personal',
            desc: 'Protección inmediata frente a detenciones arbitrarias, tratos inhumanos y toda afectación de la libertad individual, con actuación articulada con la defensa penal.'
          },
          {
            title: 'Inconstitucionalidad y Cumplimiento',
            desc: 'Impugnación de normas contrarias a la Constitución, procesos de cumplimiento de mandatos legales y conflictos de competencia ante el Tribunal Constitucional.'
          }
        ]
      },
      'inmobiliario': {
        title: 'Propiedad Inmobiliaria',
        heroImg: 'assets/img/areas/area-inmobiliario.webp',
        sideImg: 'assets/img/areas/area-inmobiliario.webp',
        intro: 'Asesoría integral en el ciclo de vida del inmueble: compraventas, saneamiento físico-legal, prescripción adquisitiva, contratos de construcción, arrendamientos y resolución de conflictos sobre linderos, títulos y posesión. Tutelamos la inversión familiar y empresarial en bienes raíces en Chincha, Ica y todo el Perú.',
        subcards: [
          {
            title: 'Compraventas y Saneamiento de Títulos',
            desc: 'Diligencia debida registral y notarial, negociación y redacción de compraventas, saneamiento por vicios y evicción, y rectificación de partidas ante SUNARP.'
          },
          {
            title: 'Prescripción Adquisitiva de Dominio',
            desc: 'Consolidación de la propiedad por posesión pacífica, continua y pública, con acompañamiento desde la prueba del posesorio hasta la inscripción del derecho.'
          },
          {
            title: 'Desalojos, Interdictos y Posesión',
            desc: 'Desalojo por vencimiento del plazo, precario e intrusión, interdictos de retener y recobrar, y defensa del mejor derecho de propiedad en el Poder Judicial.'
          }
        ]
      }
    };
