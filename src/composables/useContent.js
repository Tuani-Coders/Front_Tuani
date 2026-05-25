import { ref, watch } from 'vue'

// --- Mock Data Constants (Initial States) ---
const INITIAL_NEWS = [
  { 
    id: 1, 
    tag: 'Formación', 
    tagClass: 'chip-green', 
    title: 'Nueva convocatoria de cursos 2024: Automoción y Hostelería', 
    excerpt: 'Abrimos el plazo de inscripción para los nuevos módulos formativos que comenzarán el próximo septiembre.', 
    date: '12 Mayo 2024', 
    status: 'Publicado', 
    author: 'Marta Ruiz', 
    image: 'school',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80',
    imageName: 'automocion_hosteleria.jpg'
  },
  { 
    id: 2, 
    tag: 'Empresas', 
    tagClass: 'chip-blue', 
    title: 'Convenio con la Asociación de Hostelería de Bizkaia', 
    excerpt: 'Firmamos un nuevo acuerdo que garantizará prácticas remuneradas a más de 50 alumnos de la cooperativa.', 
    date: '08 Mayo 2024', 
    status: 'Publicado', 
    author: 'Jon Korta', 
    image: 'handshake',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    imageName: 'convenio_hosteleria.jpg'
  },
  { 
    id: 3, 
    tag: 'Institucional', 
    tagClass: 'chip-amber', 
    title: 'Publicada nuestra Memoria de Sostenibilidad 2023', 
    excerpt: 'Ya está disponible el informe anual donde recogemos el impacto social y medioambiental de nuestra actividad.', 
    date: '25 Abril 2024', 
    status: 'Borrador', 
    author: 'Ane Silva', 
    image: 'menu_book',
    imageUrl: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop&q=80',
    imageName: 'sostenibilidad_2023.jpg'
  },
  { 
    id: 4, 
    tag: 'Formación', 
    tagClass: 'chip-green', 
    title: 'Alumnos de mecanizado ganan el premio de innovación', 
    excerpt: 'Un proyecto desarrollado íntegramente en nuestros talleres es reconocido a nivel autonómico.', 
    date: '14 Abril 2024', 
    status: 'Publicado', 
    author: 'Marta Ruiz', 
    image: 'engineering',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    imageName: 'premio_innovacion.jpg'
  },
  { 
    id: 5, 
    tag: 'Institucional', 
    tagClass: 'chip-amber', 
    title: 'Visita institucional a nuestras instalaciones en Bolueta', 
    excerpt: 'Representantes del Gobierno Vasco conocen de primera mano nuestros programas de inserción laboral.', 
    date: '02 Abril 2024', 
    status: 'Publicado', 
    author: 'Marta Ruiz', 
    image: 'diversity_3',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
    imageName: 'visita_bolueta.jpg'
  },
  { 
    id: 6, 
    tag: 'Empresas', 
    tagClass: 'chip-blue', 
    title: 'Peñascal inaugura una nueva línea de montaje para automoción', 
    excerpt: 'Esta nueva instalación permitirá ampliar las competencias prácticas de nuestro alumnado en entornos reales.', 
    date: '18 Marzo 2024', 
    status: 'Publicado', 
    author: 'Jon Korta', 
    image: 'precision_manufacturing',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80',
    imageName: 'linea_montaje.jpg'
  }
]

const INITIAL_COURSES = [
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

const INITIAL_COLLABS = [
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

const INITIAL_MESSAGES = [
  { id: 1, date: '20 Mayo 2024 09:20', name: 'Laura Mendibil', email: 'laura@example.com', phone: '654321098', subject: 'Información sobre cursos', message: 'Hola, me gustaría saber cuándo se abren las inscripciones para el curso de soldadura de Grado Medio en Peñascal. Muchas gracias.', status: 'Pendiente' },
  { id: 2, date: '19 Mayo 2024 16:45', name: 'Iñaki Gabilondo', email: 'inaki@empresa.com', phone: '611223344', subject: 'Colaboración para empresas', message: 'Buenas tardes. Queremos colaborar con vuestra cooperativa para contratar jóvenes graduados en hostelería para prácticas en nuestra cadena de hoteles.', status: 'Leído' },
  { id: 3, date: '18 Mayo 2024 11:15', name: 'Sara Ortiz', email: 'sara.ortiz@gmail.com', phone: '600998877', subject: 'Otros', message: '¿Ofrecen algún taller de orientación gratuito para desempleados este fin de semana en Bilbao?', status: 'Leído' }
]

const INITIAL_SETTINGS = {
  siteName: 'Grupo Peñascal Kooperatiba',
  siteEmail: 'info@grupopenascal.com',
  sitePhone: '+34 944 43 00 00',
  siteAddress: 'Barrio Peñascal, s/n. 48002 Bilbao',
  isActive: true,
  isMaintenance: false,
  description: 'Cooperativa de iniciativa social que trabaja para la inserción sociolaboral de personas en situación de exclusión a través de la formación.'
}

// Helper to load and migrate local storage data with initial mock images
const loadAndMigrate = (key, initialData) => {
  const stored = localStorage.getItem(key)
  if (!stored) return initialData

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return initialData

    return parsed.map(item => {
      const match = initialData.find(initItem => initItem.id === item.id)
      const isWikimedia = item.imageUrl && item.imageUrl.includes('upload.wikimedia.org')
      if (match && (!item.imageUrl || isWikimedia) && match.imageUrl) {
        return { ...item, imageUrl: match.imageUrl, imageName: match.imageName }
      }
      return item
    })
  } catch (e) {
    return initialData
  }
}

// --- Global Reactive States ---
const newsList = ref(loadAndMigrate('pen_news', INITIAL_NEWS))
const coursesList = ref(loadAndMigrate('pen_courses', INITIAL_COURSES))
const collaborationsList = ref(loadAndMigrate('pen_collabs', INITIAL_COLLABS))
const messagesList = ref(JSON.parse(localStorage.getItem('pen_messages')) || INITIAL_MESSAGES)
const settings = ref(JSON.parse(localStorage.getItem('pen_settings')) || INITIAL_SETTINGS)

// --- Watchers to persist in LocalStorage ---
watch(newsList, (val) => localStorage.setItem('pen_news', JSON.stringify(val)), { deep: true })
watch(coursesList, (val) => localStorage.setItem('pen_courses', JSON.stringify(val)), { deep: true })
watch(collaborationsList, (val) => localStorage.setItem('pen_collabs', JSON.stringify(val)), { deep: true })
watch(messagesList, (val) => localStorage.setItem('pen_messages', JSON.stringify(val)), { deep: true })
watch(settings, (val) => localStorage.setItem('pen_settings', JSON.stringify(val)), { deep: true })

export function useContent() {
  const addMessage = (msg) => {
    messagesList.value.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'Pendiente',
      ...msg
    })
  }

  return {
    newsList,
    coursesList,
    collaborationsList,
    messagesList,
    settings,
    addMessage
  }
}
