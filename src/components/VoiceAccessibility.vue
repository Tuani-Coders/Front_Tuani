<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const liveMessage = ref('')
let hasSpokenIntro = false
let isVisuallyImpairedMode = false
let spokenHistory = []
let utteranceReferences = [] // Prevents Chrome Garbage Collector from randomly killing speech

let recognition = null
let synth = null
let isListening = false

let speechQueue = []
let isProcessingQueue = false

const processQueue = () => {
  if (speechQueue.length === 0) {
    isProcessingQueue = false
    return
  }
  
  isProcessingQueue = true
  const t = speechQueue.shift()
  
  const utterance = new SpeechSynthesisUtterance(t)
  utterance.lang = "es-ES"
  utterance.rate = 1
  utterance.pitch = 1
  
  utterance.onstart = () => {
    spokenHistory.push(t)
    if (spokenHistory.length > 20) spokenHistory.shift()
  }
  
  utterance.onend = () => {
    const idx = utteranceReferences.indexOf(utterance)
    if (idx > -1) utteranceReferences.splice(idx, 1)
    // Dejar respirar al motor 50ms antes de la siguiente
    setTimeout(processQueue, 50)
  }
  
  utterance.onerror = (e) => {
    console.warn("TTS Error:", e)
    const idx = utteranceReferences.indexOf(utterance)
    if (idx > -1) utteranceReferences.splice(idx, 1)
    setTimeout(processQueue, 50)
  }
  
  utteranceReferences.push(utterance)
  synth.speak(utterance)
}

const speakMsg = (input, cancelPrevious = true) => {
  if (!synth) return

  const texts = Array.isArray(input) ? input : [input]
  
  if (cancelPrevious) {
    speechQueue = [] // Vaciar mensajes pendientes
    if (synth.speaking || synth.pending) {
      synth.cancel()
    }
    // Set to false to allow the new timeout to re-trigger it safely
    isProcessingQueue = false
    
    // Timeout para que el sistema operativo limpie la síntesis antes de reanudar
    setTimeout(() => {
      speechQueue.push(...texts)
      if (!isProcessingQueue) processQueue()
    }, 150)
  } else {
    speechQueue.push(...texts)
    if (!isProcessingQueue) processQueue()
  }
}

const readPage = (target = 'main', cancelQueue = true) => {
  const extractNavbarText = () => {
    const header = document.querySelector('header') || document.querySelector('nav')
    if (!header) return ''
    const elements = header.querySelectorAll('a, button, [role="button"]')
    const textsArray = Array.from(elements).map(el => {
      let txt = el.getAttribute('aria-label') || el.title || el.innerText || el.textContent || ''
      if (!txt) {
        const img = el.querySelector('img')
        if (img) txt = img.getAttribute('alt') || ''
      }
      return txt.trim()
    })
    return [...new Set(textsArray.filter(t => t.length > 0))].join('\n')
  }

  let rawText = ''
  
  if (target === 'navbar') {
    rawText = extractNavbarText()
  } else if (target === 'full') {
    const mainText = document.querySelector('main')?.innerText || document.getElementById('content')?.innerText || ''
    const footerText = document.querySelector('footer')?.innerText || ''
    rawText = extractNavbarText() + '\n' + mainText + '\n' + footerText
  } else {
    // target === 'main'
    const mainNode = document.querySelector('main') || document.getElementById('content')
    rawText = mainNode ? mainNode.innerText : document.body.innerText
  }
  
  // Material symbols ligatures that the Spanish TTS might mispronounce
  const iconLigatures = [
    'expand_more', 'school', 'arrow_forward', 'arrow_back', 'menu', 'close', 
    'search', 'email', 'mail', 'phone', 'location_on', 'dashboard', 'logout', 
    'account_circle', 'person', 'chevron_right', 'chevron_left'
  ]

  const texts = rawText
    // Troceamos por saltos de línea Y por puntos para evitar el bug de 15 segundos en Chrome
    .split(/[\n]+|\.\s+/)
    .map(line => line.trim())
    // Remove empty lines and standalone material icon ligatures
    .filter(line => line.length > 0 && !iconLigatures.includes(line))
    .map(line => line.replace(/\s+/g, ' ')) // normalize spaces

  if (texts.length > 0) {
    if (cancelQueue) spokenHistory = [] // Only clear history if it actually interrupts
    speakMsg(texts, cancelQueue)
  }
}

const normalizeText = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()

const handleCommand = (rawTranscript) => {
  const transcript = normalizeText(rawTranscript)
  console.log("Voice Command Recognized:", transcript)

  // 1. ALWAYS check for 'read page' command (this acts as the wake-word to activate the assistant)
  const readCommands = [
    'lee la pagina', 'leer la pagina', 'leer pagina', 'lee esto', 'empieza a leer', 
    'leeme la pagina', 'leer', 'leeme', 'leelo', 'narrar pagina', 'narra esto', 
    'lee el contenido', 'quiero escuchar la pagina', 'activa lectura', 'dime que hay aqui', 
    'lee', 'leeme esto', 'cuentame la pagina', 'leeme todo', 'leer todo',
    'que hay aqui', 'que pone', 'lee lo que pone'
  ]
  if (readCommands.some(cmd => transcript === cmd || transcript.includes(" " + cmd) || transcript.startsWith(cmd + " "))) {
    const isHomePage = route.path === '/';
    const readingTarget = isHomePage ? 'full' : 'main';

    if (!isVisuallyImpairedMode) {
      isVisuallyImpairedMode = true
      speakMsg("Modo de asistencia visual activado. Leyendo página actual.", true)
      readPage(readingTarget, false) // Encolar la lectura sin cancelar el aviso
    } else {
      readPage(readingTarget, true) // Cancelar lo anterior porque el usuario lo ha pedido explícitamente
    }
    return
  }

  // 1.1 Check for deactivate command
  const deactivateCommands = [
    'desactivar modo ciego', 'desactivar el modo ciego', 'apaga el asistente', 
    'apagar modo ciego', 'apagar el modo ciego', 'salir del modo ciego', 'salir de modo ciego', 
    'apaga la asistencia', 'desactiva el modo ciego', 'quita el modo ciego', 'quitar modo ciego',
    'desactivar asistencia visual', 'apagar el asistente', 'desactiva el asistente',
    'desconectar modo ciego', 'detener asistencia visual', 'finalizar lectura', 'modo normal'
  ]
  if (deactivateCommands.some(cmd => transcript === cmd || transcript.includes(" " + cmd) || transcript.startsWith(cmd + " "))) {
    if (isVisuallyImpairedMode) {
      isVisuallyImpairedMode = false
      speechQueue = []
      if (synth) synth.cancel()
      speakMsg("Modo de asistencia visual desactivado.")
    }
    return
  }

  // Si no hemos activado el modo ciego, debemos ignorar CUALQUIER comando o conversación de fondo.
  if (!isVisuallyImpairedMode) return;

  // 1.2. Check for 'help / options' command (Reads navbar)
  const helpCommands = [
    'ayuda', 'que opciones tengo', 'dime mis opciones', 'menu', 'que apartados hay', 
    'opciones', 'que puedo hacer', 'dime el menu', 'que menu hay'
  ]
  if (helpCommands.some(cmd => transcript === cmd || transcript.includes(" " + cmd) || transcript.startsWith(cmd + " "))) {
    speechQueue = []
    if (synth) synth.cancel()
    speakMsg("Estas son las opciones de navegación principales:")
    setTimeout(() => { readPage('navbar') }, 3500)
    return
  }

  // 1.3. Check for 'location' command
  const locationCommands = ['donde estoy', 'en que pagina estoy', 'cual es mi ubicacion', 'que pagina es esta']
  if (locationCommands.some(cmd => transcript === cmd || transcript.includes(" " + cmd) || transcript.startsWith(cmd + " "))) {
    speechQueue = []
    if (synth) synth.cancel()
    let locName = route.name || route.path.replace(/-/g, ' ').replace(/\//g, ' ').trim()
    if (!locName || locName === 'inicio' || route.path === '/') locName = 'Inicio'
    speakMsg(`Estás en la página de ${locName}.`)
    return
  }

  // 2. Check for 'stop/silence' command
  const stopCommands = [
    'callate', 'silencio', 'para de leer', 'para', 'detente', 'deja de hablar', 
    'callar', 'shh', 'no leas mas', 'cortar', 'basta', 'silenciar', 'detener', 'apaga la voz'
  ]
  if (stopCommands.some(cmd => transcript === cmd || transcript.includes(" " + cmd) || transcript.startsWith(cmd + " "))) {
    speechQueue = []
    if (synth) synth.cancel()
    return
  }

  // 1.5. Check for 'repeat' command
  const repeatCommands = [
    'repite', 'repetir', 'otra vez', 'vuelve a leer', 'leelo otra vez', 'repitelo', 
    'repite la pagina', 'repiteme', 'dimelo de nuevo', 'leer de nuevo', 'una vez mas'
  ]
  if (repeatCommands.some(cmd => transcript === cmd || transcript.includes(" " + cmd) || transcript.startsWith(cmd + " "))) {
    speechQueue = []
    if (synth) synth.cancel()
    const allWords = spokenHistory.join(' ').split(/\s+/).filter(w => w.trim() !== '')
    const lastWords = allWords.slice(-20).join(' ')
    if (lastWords) {
      speakMsg("Repitiendo últimas palabras: " + lastWords)
    } else {
      speakMsg("No hay nada reciente que repetir.")
    }
    return
  }

  // 2. Identify the action and target
  const actionVerbs = [
    'quiero ir a', 'llevame a', 'ir a', 've a', 'abrir', 'abre', 'pulsa', 'pulsar', 
    'presiona', 'presionar', 'entrar en', 'entrar a', 'entra en', 'entra a', 
    'hacer clic', 'hacer click', 'click en', 'clic en'
  ]
  
  let targetText = transcript
  let hasActionVerb = false
  
  for (const verb of actionVerbs) {
    const idx = targetText.indexOf(verb)
    if (idx !== -1) {
      // If found, strip everything before and including the verb
      targetText = targetText.substring(idx + verb.length).trim()
      // Remove any trailing connecting words like "el", "la", "al" just in case someone says "ir a la cooperativa"
      if (targetText.startsWith('el ')) targetText = targetText.substring(3).trim()
      if (targetText.startsWith('la ')) targetText = targetText.substring(3).trim()
      if (targetText.startsWith('los ')) targetText = targetText.substring(4).trim()
      if (targetText.startsWith('las ')) targetText = targetText.substring(4).trim()
      if (targetText.startsWith('al ')) targetText = targetText.substring(3).trim()
      hasActionVerb = true
      break // First matched verb applies
    }
  }

  if (!targetText) return

  // 3. Find the best matching element in the DOM
  const interactiveElements = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [role="button"], [tabindex="0"]'))
  
  let bestMatch = null
  let bestScore = 0
  let bestSemanticAlias = ""

  interactiveElements.forEach(el => {
    // Check semantic implicit matches. A user says "teléfono" but the link text is "94 400 12 12".
    const href = (el.getAttribute('href') || '').toLowerCase()
    if ((targetText.includes('telefono') || targetText.includes('llamar')) && href.startsWith('tel:')) {
      if (100 > bestScore) {
        bestScore = 100
        bestMatch = el
        bestSemanticAlias = "el teléfono"
      }
      return
    }
    if ((targetText.includes('gmail') || targetText.includes('correo') || targetText.includes('email') || targetText.includes('mail')) && href.startsWith('mailto:')) {
      if (100 > bestScore) {
        bestScore = 100
        bestMatch = el
        bestSemanticAlias = "el correo electrónico"
      }
      return
    }

    let elText = normalizeText(el.ariaLabel || el.title || el.textContent || el.value || '')
    if (!elText) return
    
    // Normalize spaces and remove line breaks
    elText = elText.replace(/\s+/g, ' ')

    if (elText === targetText) {
      bestScore = 100
      bestMatch = el
      bestSemanticAlias = elText
    } else if (elText.includes(targetText) || targetText.includes(elText)) {
      const score = Math.min(elText.length, targetText.length) / Math.max(elText.length, targetText.length) * 100
      if (score > bestScore) {
        bestScore = score
        bestMatch = el
        bestSemanticAlias = elText
      }
    }
  })

  // 4. Validate if this is a literal echo of itself talking
  let isEcho = false
  if (synth && (synth.speaking || synth.pending) && !hasActionVerb) {
    // Look back at the last 3 chunks of text spoken (approx ~5 seconds of speech)
    const recentHistory = spokenHistory.slice(-3).map(t => normalizeText(t))
    if (recentHistory.some(historyText => historyText.includes(targetText) || targetText.includes(historyText))) {
      console.log("Echo detectado y silenciado:", targetText)
      isEcho = true
    }
  }

  // 5. Execute click if match is reasonable (score > 30)
  if (bestMatch && bestScore > 30 && !isEcho) {
    const elName = (bestSemanticAlias || bestMatch.ariaLabel || bestMatch.title || bestMatch.textContent || '').trim().replace(/\s+/g, ' ')
    // Clear speech completely, allow Chrome 150ms to digest the cancel, then execute button action
    if (synth && (synth.speaking || synth.pending)) {
      speechQueue = []
      synth.cancel();
      setTimeout(() => {
        speakMsg(`Accediendo a ${elName}`)
        setTimeout(() => { bestMatch.click() }, 1000)
      }, 150)
    } else {
      speakMsg(`Accediendo a ${elName}`)
      setTimeout(() => { bestMatch.click() }, 1000)
    }
  }
}

const initializeSpeech = () => {
  synth = window.speechSynthesis
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    console.warn("SpeechRecognition is not supported in this browser.")
    return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'es-ES'
  // To keep it listening in the background without constantly re-prompting, continuous = true
  recognition.continuous = true
  recognition.interimResults = false

  recognition.onstart = () => {
    isListening = true
    console.log("Micrófono escuchando...")
  }

  recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1
    const transcript = event.results[lastResultIndex][0].transcript

    // Do NOT arbitrarily cancel speech here, as the microphone often
    // hears its own TTS voice! Cancel it only in handleCommand on a valid trigger.
    handleCommand(transcript)
  }

  recognition.onend = () => {
    isListening = false
    if (recognition && hasSpokenIntro) {
      try {
        recognition.start()
      } catch (e) {
        // Ignored
      }
    }
  }
  
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error)
  }
  
  // Welcome message when loaded
  const speakLoadingMessage = () => {
    liveMessage.value = "La página ha cargado correctamente. Puedes pedirme que lea la página o indicarme dónde quieres ir."
    if (!hasSpokenIntro) {
      speakMsg("La página ha cargado correctamente. Puedes pedirme que lea la página o indicarme dónde quieres ir.")
      hasSpokenIntro = true
      
      try {
        if (recognition) recognition.start()
      } catch (e) { console.error(e) }
    }
  }

  // Workaround for synthesis voices loading asynchronously in some browsers
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => {
      speakLoadingMessage()
      synth.onvoiceschanged = null
    }
  } else {
    speakLoadingMessage()
  }
}

watch(
  () => route.path,
  () => {
    setTimeout(() => {
      // Find a suitable name for the current page
      let pageTitle = "la nueva sección"
      const mainHeading = document.querySelector('h1')
      if (mainHeading && mainHeading.textContent) {
        pageTitle = mainHeading.textContent.trim()
      } else if (document.title) {
        // Strip out generic site names like " - Tuani"
        pageTitle = document.title.split('-')[0].trim()
      }

      const isHomePage = route.path === '/';
      const readingTarget = isHomePage ? 'full' : 'main';

      const msg = `Página de ${pageTitle} cargada correctamente.`
      liveMessage.value = msg
      
      // If speech is initialized and unlocked, speak automatically
      if (hasSpokenIntro && isVisuallyImpairedMode) {
        speakMsg(msg, false) // False ensures it doesn't cut off 'Accediendo a...'
        // Auto-read continuous flow without cancelling the load message
        readPage(readingTarget, false)
      }
    }, 600) // Delay to wait for router transition fade
  }
)

onMounted(() => {
  // Delay initialization slightly to let the page render
  setTimeout(() => {
    initializeSpeech()
  }, 500)
})

onUnmounted(() => {
  if (recognition) {
    recognition.onend = null
    recognition.stop()
    recognition = null
  }
  if (synth) {
    synth.cancel()
    synth = null
  }
})
</script>

<template>
  <div 
    aria-live="assertive" 
    aria-atomic="true" 
    style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;"
  >
    {{ liveMessage }}
  </div>
</template>
