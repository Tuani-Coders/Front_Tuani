import { ref, watch } from 'vue'

// --- Mock Data Constants (Initial States) ---
const INITIAL_NEWS = [
  { id: 1, tag: 'Formación', tagClass: 'chip-green', title: 'Nueva convocatoria de cursos 2024: Automoción y Hostelería', excerpt: 'Abrimos el plazo de inscripción para los nuevos módulos formativos que comenzarán el próximo septiembre.', date: '12 Mayo 2024', status: 'Publicado', author: 'Marta Ruiz', image: 'school' },
  { id: 2, tag: 'Empresas', tagClass: 'chip-blue', title: 'Convenio con la Asociación de Hostelería de Bizkaia', excerpt: 'Firmamos un nuevo acuerdo que garantizará prácticas remuneradas a más de 50 alumnos de la cooperativa.', date: '08 Mayo 2024', status: 'Publicado', author: 'Jon Korta', image: 'handshake' },
  { id: 3, tag: 'Institucional', tagClass: 'chip-amber', title: 'Publicada nuestra Memoria de Sostenibilidad 2023', excerpt: 'Ya está disponible el informe anual donde recogemos el impacto social y medioambiental de nuestra actividad.', date: '25 Abril 2024', status: 'Borrador', author: 'Ane Silva', image: 'menu_book' },
  { id: 4, tag: 'Formación', tagClass: 'chip-green', title: 'Alumnos de mecanizado ganan el premio de innovación', excerpt: 'Un proyecto desarrollado íntegramente en nuestros talleres es reconocido a nivel autonómico.', date: '14 Abril 2024', status: 'Publicado', author: 'Marta Ruiz', image: 'engineering' },
  { id: 5, tag: 'Institucional', tagClass: 'chip-amber', title: 'Visita institucional a nuestras instalaciones en Bolueta', excerpt: 'Representantes del Gobierno Vasco conocen de primera mano nuestros programas de inserción laboral.', date: '02 Abril 2024', status: 'Publicado', author: 'Marta Ruiz', image: 'diversity_3' },
  { id: 6, tag: 'Empresas', tagClass: 'chip-blue', title: 'Peñascal inaugura una nueva línea de montaje para automoción', excerpt: 'Esta nueva instalación permitirá ampliar las competencias prácticas de nuestro alumnado en entornos reales.', date: '18 Marzo 2024', status: 'Publicado', author: 'Jon Korta', image: 'precision_manufacturing' }
]

const INITIAL_COURSES = [
  { id: 'GB-COC', name: 'Grado Básico en Cocina y Restauración', category: 'Grado Básico', duration: '2000h', enrolled: 14, capacity: 15, status: 'Activo' },
  { id: 'GM-SOL', name: 'Grado Medio en Soldadura y Calderería', category: 'Grado Medio', duration: '2000h', enrolled: 18, capacity: 20, status: 'Activo' },
  { id: 'FP-SOCI', name: 'Atención Sociosanitaria en Domicilio', category: 'Empleo', duration: '600h', enrolled: 15, capacity: 15, status: 'Completo' },
  { id: 'GB-ELEC', name: 'Grado Básico en Electricidad y Electrónica', category: 'Grado Básico', duration: '2000h', enrolled: 10, capacity: 15, status: 'Activo' },
  { id: 'GM-MEC', name: 'Grado Medio en Mecanizado', category: 'Grado Medio', duration: '2000h', enrolled: 0, capacity: 20, status: 'Borrador' }
]

const INITIAL_COLLABS = [
  { id: 1, entity: 'Euskaltel', type: 'Apoyando Proyectos', date: '19 Mayo 2024', status: 'Pendiente' },
  { id: 2, entity: 'Gestamp', type: 'Apoyando Inserción', date: '15 Mayo 2024', status: 'Aprobada' },
  { id: 3, entity: 'Sidenor', type: 'Contratando Empresas', date: '10 Mayo 2024', status: 'Aprobada' },
  { id: 4, entity: 'Supermercados BM', type: 'Donando Productos', date: '05 Mayo 2024', status: 'Pendiente' },
  { id: 5, entity: 'Iberdrola', type: 'Apoyando Proyectos', date: '28 Abril 2024', status: 'Rechazada' }
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

// --- Global Reactive States ---
const newsList = ref(JSON.parse(localStorage.getItem('pen_news')) || INITIAL_NEWS)
const coursesList = ref(JSON.parse(localStorage.getItem('pen_courses')) || INITIAL_COURSES)
const collaborationsList = ref(JSON.parse(localStorage.getItem('pen_collabs')) || INITIAL_COLLABS)
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
