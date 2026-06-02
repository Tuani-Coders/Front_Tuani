// --- Mock Data Constants (Initial States) ---
export const INITIAL_NEWS = [
  { 
    id: 1, 
    tag: 'Formación', 
    tagClass: 'chip-green', 
    title: 'Nueva convocatoria de cursos 2024: Automoción y Hostelería', 
    excerpt: 'Abrimos el plazo de inscripción para los nuevos módulos formativos que comenzarán el próximo septiembre.', 
    content: 'Grupo Peñascal anuncia la apertura de la nueva convocatoria de inscripción para los cursos especializados en las áreas de Automoción y Hostelería para el periodo formativo 2024-2025. Estos cursos están dirigidos a jóvenes y adultos que deseen formarse profesionalmente en sectores con alta empleabilidad y demanda laboral directa.\n\nNuestras instalaciones cuentan con talleres equipados con la última tecnología y aulas de simulación adaptadas a entornos de trabajo reales. Durante el periodo de formación, los estudiantes tendrán la oportunidad de realizar prácticas en empresas líderes de la región, abriendo la puerta a su inserción laboral.\n\nRequisitos e inscripciones:\nLos interesados pueden formalizar su solicitud acudiendo de manera presencial a nuestras oficinas o completando el formulario habilitado en la sección de contacto de la web. Las plazas son limitadas y se asignarán por orden de inscripción tras la correspondiente entrevista de orientación.',
    date: '12 Mayo 2024', 
    status: 'Publicado', 
    author: 'Marta Ruiz', 
    image: 'school',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    imageName: 'automocion_hosteleria.jpg',
    additionalImages: [
      { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80', name: 'clase_teorica.jpg' },
      { url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80', name: 'taller_automocion.jpg' }
    ]
  },
  { 
    id: 2, 
    tag: 'Empresas', 
    tagClass: 'chip-blue', 
    title: 'Convenio con la Asociación de Hostelería de Bizkaia', 
    excerpt: 'Firmamos un nuevo acuerdo que garantizará prácticas remuneradas a más de 50 alumnos de la cooperativa.', 
    content: 'En nuestro compromiso continuo por potenciar la inserción sociolaboral, Grupo Peñascal ha suscrito un acuerdo de colaboración estratégica con la Asociación de Hostelería de Bizkaia. Este convenio permitirá a más de 50 alumnos de los últimos cursos de Hostelería y Servicios de Restauración acceder a prácticas formativas no laborales tuteladas en prestigiosos establecimientos del territorio.\n\nEl presidente de la asociación ha destacado el excelente nivel de preparación del alumnado de Peñascal, señalando que este tipo de sinergias son clave para cubrir la alta demanda de profesionales cualificados en el sector hostelero. Las prácticas comenzarán a partir del próximo mes de junio, y se espera que un porcentaje muy significativo de los participantes logre una contratación directa tras finalizar el periodo de formación práctica.',
    date: '08 Mayo 2024', 
    status: 'Publicado', 
    author: 'Jon Korta', 
    image: 'handshake',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    imageName: 'convenio_hosteleria.jpg',
    additionalImages: [
      { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=80', name: 'reunion_convenio.jpg' }
    ]
  },
  { 
    id: 3, 
    tag: 'Institucional', 
    tagClass: 'chip-amber', 
    title: 'Publicada nuestra Memoria de Sostenibilidad 2023', 
    excerpt: 'Ya está disponible el informe anual donde recogemos el impacto social y medioambiental de nuestra actividad.', 
    content: 'Grupo Peñascal ha hecho pública su Memoria de Sostenibilidad correspondiente al ejercicio 2023. En este documento detallado, se reflejan los avances conseguidos por la cooperativa en sus tres ejes de actuación prioritarios: social, medioambiental y económico.\n\nDurante el año 2023, más de 1200 personas en situación de vulnerabilidad o exclusión social participaron en nuestros programas formativos, alcanzando una tasa media de inserción laboral del 68%. En el plano medioambiental, se ha consolidado el plan de reducción de huella de carbono mediante la instalación de paneles solares fotovoltaicos en nuestros centros de Bilbao y San Sebastián, así como una gestión avanzada de residuos en los talleres de carpintería y metal.\n\nLa memoria completa puede ser descargada en formato PDF de manera pública a través de nuestra web institucional en el apartado de transparencia.',
    date: '25 Abril 2024', 
    status: 'Borrador', 
    author: 'Ane Silva', 
    image: 'menu_book',
    imageUrl: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop&q=80',
    imageName: 'sostenibilidad_2023.jpg',
    additionalImages: []
  },
  { 
    id: 4, 
    tag: 'Formación', 
    tagClass: 'chip-green', 
    title: 'Alumnos de mecanizado ganan el premio de innovación', 
    excerpt: 'Un proyecto desarrollado íntegramente en nuestros talleres es reconocido a nivel autonómico.', 
    content: 'El talento y el esfuerzo de nuestro alumnado de Mecanizado y Construcciones Metálicas ha sido galardonado con el prestigioso Premio de Innovación Tecnológica en Formación Profesional del País Vasco. El proyecto presentado consiste en un sistema automatizado de bajo coste para la optimización y control de calidad en piezas metálicas complejas.\n\nEl jurado valoró muy positivamente la viabilidad del proyecto, el uso eficiente de materiales reciclados del propio taller de prácticas y su potencial aplicación real en pequeñas y medianas empresas industriales de la zona. ¡Nuestra más sincera enhorabuena a todo el equipo de alumnos y a los tutores que han guiado este gran trabajo!',
    date: '14 Abril 2024', 
    status: 'Publicado', 
    author: 'Marta Ruiz', 
    image: 'engineering',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    imageName: 'premio_innovacion.jpg',
    additionalImages: []
  },
  { 
    id: 5, 
    tag: 'Institucional', 
    tagClass: 'chip-amber', 
    title: 'Visita institucional a nuestras instalaciones en Bolueta', 
    excerpt: 'Representantes del Gobierno Vasco conocen de primera mano nuestros programas de inserción laboral.', 
    content: 'Una delegación institucional encabezada por representantes del Departamento de Trabajo y Empleo del Gobierno Vasco visitó en la mañana de ayer nuestras instalaciones de Bolueta, en Bilbao. El objetivo de la visita era conocer de primera mano la metodología de aprendizaje práctico aplicada en los talleres de Peñascal, que integra la formación teórica con una experiencia de taller real.\n\nDurante el recorrido, los representantes gubernamentales conversaron con el equipo docente y con el propio alumnado en formación activa. Se destacó el papel crucial de las empresas de inserción de Peñascal como puente hacia la incorporación definitiva de colectivos desfavorecidos al mercado de trabajo ordinario, y se acordó estudiar vías de ampliación para las líneas de subvención de programas de empleo y formación dual.',
    date: '02 Abril 2024', 
    status: 'Publicado', 
    author: 'Marta Ruiz', 
    image: 'diversity_3',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
    imageName: 'visita_bolueta.jpg',
    additionalImages: []
  },
  { 
    id: 6, 
    tag: 'Empresas', 
    tagClass: 'chip-blue', 
    title: 'Peñascal inaugura una nueva línea de montaje para automoción', 
    excerpt: 'Esta nueva instalación permitirá ampliar las competencias prácticas de nuestro alumnado en entornos reales.', 
    content: 'Grupo Peñascal ha dado un paso de gigante en la modernización de su oferta formativa de la rama del metal con la inauguración oficial de una nueva línea de pre-montaje industrial para automoción. Esta línea replica con máxima fidelidad los estándares tecnológicos que los alumnos encontrarán posteriormente al incorporarse a trabajar en las factorías reales de la zona.\n\nLa inversión, que ha contado con la cofinanciación de fondos públicos y aportaciones privadas de empresas colaboradoras de automoción, capacitará anualmente a cerca de 80 alumnos del ciclo formativo de grado básico y medio. El nuevo taller se orienta a la mejora de la destreza técnica, la seguridad laboral y la automatización de procesos industriales.',
    date: '18 Marzo 2024', 
    status: 'Publicado', 
    author: 'Jon Korta', 
    image: 'precision_manufacturing',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    imageName: 'linea_montaje.jpg',
    additionalImages: []
  }
]

export const INITIAL_COURSES = [
  { 
    id: 'GB-COC', 
    name: 'Grado Básico en Cocina y Restauración', 
    category: 'Grado Básico', 
    duration: '2000h', 
    enrolled: 14, 
    capacity: 15, 
    status: 'Activo',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80',
    imageName: 'cocina.jpg'
  },
  { 
    id: 'GM-SOL', 
    name: 'Grado Medio en Soldadura y Calderería', 
    category: 'Grado Medio', 
    duration: '2000h', 
    enrolled: 18, 
    capacity: 20, 
    status: 'Activo',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=80',
    imageName: 'soldadura.jpg'
  },
  { 
    id: 'FP-SOCI', 
    name: 'Atención Sociosanitaria en Domicilio', 
    category: 'Empleo', 
    duration: '600h', 
    enrolled: 15, 
    capacity: 15, 
    status: 'Completo',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
    imageName: 'sociosanitaria.jpg'
  },
  { 
    id: 'GB-ELEC', 
    name: 'Grado Básico en Electricidad y Electrónica', 
    category: 'Grado Básico', 
    duration: '2000h', 
    enrolled: 10, 
    capacity: 15, 
    status: 'Activo',
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=80',
    imageName: 'electricidad.jpg'
  },
  { 
    id: 'GM-MEC', 
    name: 'Grado Medio en Mecanizado', 
    category: 'Grado Medio', 
    duration: '2000h', 
    enrolled: 0, 
    capacity: 20, 
    status: 'Borrador',
    imageUrl: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?w=600&auto=format&fit=crop&q=80',
    imageName: 'mecanizado.jpg'
  }
]

export const INITIAL_COLLABS = [
  { 
    id: 1, 
    entity: 'Euskaltel', 
    type: 'Apoyando Proyectos', 
    date: '19 Mayo 2024', 
    status: 'Pendiente',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="8" fill="%23FF6600"/><text x="60" y="25" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="15" text-anchor="middle" letter-spacing="0.5">euskaltel</text></svg>',
    imageName: 'euskaltel_logo.svg'
  },
  { 
    id: 2, 
    entity: 'Gestamp', 
    type: 'Apoyando Inserción', 
    date: '15 Mayo 2024', 
    status: 'Aprobada',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="8" fill="%2300539B"/><text x="60" y="25" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="15" text-anchor="middle" letter-spacing="0.5">Gestamp</text></svg>',
    imageName: 'gestamp_logo.svg'
  },
  { 
    id: 3, 
    entity: 'Sidenor', 
    type: 'Contratando Empresas', 
    date: '10 Mayo 2024', 
    status: 'Aprobada',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="8" fill="%23E30613"/><text x="60" y="25" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="15" text-anchor="middle" letter-spacing="0.5">sidenor</text></svg>',
    imageName: 'sidenor_logo.svg'
  },
  { 
    id: 4, 
    entity: 'Supermercados BM', 
    type: 'Donando Productos', 
    date: '05 Mayo 2024', 
    status: 'Pendiente',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="8" fill="%231b5e20"/><text x="60" y="26" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="18" text-anchor="middle" letter-spacing="1">BM</text></svg>',
    imageName: 'bm_logo.svg'
  },
  { 
    id: 5, 
    entity: 'Iberdrola', 
    type: 'Apoyando Proyectos', 
    date: '28 Abril 2024', 
    status: 'Rechazada',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" width="120" height="40"><rect width="120" height="40" rx="8" fill="%2331A136"/><text x="60" y="25" fill="white" font-family="system-ui, sans-serif" font-weight="800" font-size="14" text-anchor="middle" letter-spacing="0.5">IBERDROLA</text></svg>',
    imageName: 'iberdrola_logo.svg'
  }
]

export const INITIAL_MESSAGES = [
  { id: 1, date: '20 Mayo 2024 09:20', name: 'Laura Mendibil', email: 'laura@example.com', phone: '654321098', subject: 'Información sobre cursos', message: 'Hola, me gustaría saber cuándo se abren las inscripciones para el curso de soldadura de Grado Medio en Peñascal. Muchas gracias.', status: 'Pendiente' },
  { id: 2, date: '19 Mayo 2024 16:45', name: 'Iñaki Gabilondo', email: 'inaki@empresa.com', phone: '611223344', subject: 'Colaboración para empresas', message: 'Buenas tardes. Queremos colaborar con vuestra cooperativa para contratar jóvenes graduados en hostelería para prácticas en nuestra cadena de hoteles.', status: 'Leído' },
  { id: 3, date: '18 Mayo 2024 11:15', name: 'Sara Ortiz', email: 'sara.ortiz@gmail.com', phone: '600998877', subject: 'Otros', message: '¿Ofrecen algún taller de orientación gratuito para desempleados este fin de semana en Bilbao?', status: 'Leído' }
]

export const INITIAL_SETTINGS = {
  siteName: 'Grupo Peñascal Kooperatiba',
  siteEmail: 'info@grupopenascal.com',
  sitePhone: '+34 944 43 00 00',
  siteAddress: 'Barrio Peñascal, s/n. 48002 Bilbao',
  isActive: true,
  isMaintenance: false,
  description: 'Cooperativa de iniciativa social que trabaja para la inserción sociolaboral de personas en situación de exclusión a través de la formación.'
}
