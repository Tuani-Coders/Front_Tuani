# Grupo Peñascal — Frontend (Vue 3 + Vite)

Rediseño del sitio web [grupopenascal.com](https://www.grupopenascal.com/) utilizando **Vue 3** con **Vite** como bundler.

## Requisitos

- Node.js ≥ 18
- npm ≥ 9

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build de producción

```bash
npm run build
```

## Estructura del proyecto

```
src/
├── assets/              # Imágenes, iconos y fuentes
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/          # Componentes Vue reutilizables
│   ├── layout/          # Header, Footer, Nav
│   ├── sections/        # Secciones de página (Hero, CTA, etc.)
│   └── ui/              # Botones, Cards, Inputs, etc.
├── composables/         # Lógica reutilizable (hooks)
├── router/              # Configuración de Vue Router
├── styles/              # Hojas de estilo globales
│   ├── main.css         # Punto de entrada CSS
│   ├── variables.css    # Design tokens (colores, tipografía, etc.)
│   ├── reset.css        # Normalización CSS
│   ├── typography.css   # Escala tipográfica
│   └── utilities.css    # Clases utilitarias
├── utils/               # Funciones de utilidad
├── views/               # Vistas (una por ruta)
├── App.vue              # Componente raíz
└── main.js              # Entry point
```

## Rutas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | HomeView | Página principal |
| `/formacion-profesional` | FormacionView | Formación Profesional |
| `/formacion-profesional/grado-basico` | GradoBasicoView | Grado Básico |
| `/formacion-profesional/grado-medio` | GradoMedioView | Grado Medio |
| `/formacion-profesional/formacion-para-el-empleo` | FormacionEmpleoView | Formación para el Empleo |
| `/la-cooperativa` | CooperativaView | Quiénes Somos |
| `/la-cooperativa/que-hacemos` | QueHacemosView | Qué Hacemos |
| `/la-cooperativa/cooperan-con-nosotros` | CooperanView | Cooperantes |
| `/la-cooperativa/servicio-de-orientacion` | OrientacionView | Servicio de Orientación |
| `/colabora` | ColaboraView | Colabora |
| `/noticias` | NoticiasView | Noticias |
| `/contacto` | ContactoView | Contacto |

## Estado

🟡 **Estructura lista** — pendiente de definir el diseño visual.
