// CONTROL DE VISTAS (HOME <-> CURSO)
async function mostrarVistaCurso() {
    let codigoGuardado = localStorage.getItem('escuela_codigo_activo');

    if (!codigoGuardado) {
        let codigoIngresado = prompt("Ingresa el código de acceso de tu escuela para entrar al curso (8 días de vigencia):");
        if (!codigoIngresado) {
            return; // Si le da cancelar, no hace nada y se queda en el home
        }
        codigoGuardado = codigoIngresado.trim();
    }

    // Validar con Supabase
    const resultado = await validarCodigoEscuela(codigoGuardado);

    if (resultado.valido) {
        localStorage.setItem('escuela_codigo_activo', codigoGuardado);
        document.getElementById('view-home').style.display = 'none';
        document.getElementById('view-curso').style.display = 'flex';
        cargarLeccionesNivel(1);
    } else {
        alert(resultado.mensaje);
        localStorage.removeItem('escuela_codigo_activo');
    }
}

function mostrarVistaHome() {
    document.getElementById('view-curso').style.display = 'none';
    document.getElementById('view-home').style.display = 'flex';
}

// CONTROL DE MODALES
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}
function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// BASE DE DATOS DE LAS 60 LECCIONES (4 NIVELES x 15 LECCIONES)
let nivelActual = 1;

function cambiarNivel(numNivel) {
    nivelActual = numNivel;
    
    // Cambiar clases activas en pestañas
    const tabs = document.querySelectorAll('.tab-nivel');
    tabs.forEach((tab, index) => {
        if((index + 1) === numNivel) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    cargarLeccionesNivel(numNivel);
}

function cargarNombresLeccion(nivel) {
    if(nivel === 1) {
        return [
            "¿Qué es la Inteligencia Artificial? / Fundamentos de LLMs",
            "¿Qué es un Prompt? Prompt Engineering Base",
            "Semejanzas y diferencias entre Chatgpt, Gemini AI, Copilot, Perplexity y Deepseek",
            "Tipos de Prompts: Secuenciales, Estructurales, Argumentales, Comparativos",
            "Prompts de comunicación personales / Creando tu propia comunicación",
            "Creando diferentes Prompts: canciones, música, imágenes, Ensayos, Resumen, videos",
            "Suno Música / Otras IA de Música",
            "Creacion de productos en Gemini y ChatGPT",
            "Conociendo bancos de audio, videos e imágenes para mis proyectos",
            "Trucos de Captura de pantalla y separación de audio y videos para crear tus propios Bancos de Videos, Imagenes y audios"
        ];
    } else if(nivel === 2) {
        return [
            "Creación de imagenes con IA: Microsoft Designer, Leonardo AI, DALL-E, Gemini,DeepAI Image Generator, Craiyon",
            "Creacion de imagenes 3D: Meshy AI, Hunyuan 3D, Trellis, Picasso IA",
            "Creación de voz en off: ElevenLabs, Descript, TTS Maker",
            "Creadores de Video Sintético y Cinemático (De texto a video): Runway / Pika / Kling / Hailuo",
            "Generadores de Video por IA con Ritmo Musical / Creativo: Seedance",
            "Avatares Parlantes y Presentadores Institucionales: HeyGen y Synthesia",
            "Editores de Video Inteligentes (Asistidos por IA): InVideo.io",
            "Generadores de presentaciones con IA: Gamma App, Tome (tome.app)",
            "Editor de código fuente y software VS CODE y estructura de Carpetas",
            "Haciendo mi primer landign page con VS CODE + GEMINI"
        ];
    } else if(nivel === 3) {
        return [
            "Creacion de Tarjeta de Presentación Digital o \"Link in Bio\" (Estilo Linktree)",
            "Creación de Mini Agenda / Calendario",
            "Creación de Temario para examen",
            "Creación de Juego de tic tac toe gato",
            "Creación de Juego de Memoria (Match Cards)",
            "Creación de Una estación de Radio (Vocaroo)",
            "Creación de juego de memoria con Estructura de carpetas",
            "Creacion de Tarjeta de Presentación Digital con estructura de carpetas",
            "Creación de Calendario con estructura de carpetas",
            "Usando Surge / Netifly / Github / Cloud falre para subir Proyectos"
        ];
    } else {
        return [
            "Creacion de una landign page o siti web propio con VS CODE + GEMINI",
            "Creacion de su propia y personal Tarjeta de Presentación Digital propia",
            "Creación de su propia y personal Mini Agenda / Calendario",
            "Creación de su propio y personal Temario para examen",
            "Creación de su propia estación de radio",
            "Preparando la Certificación Internacional 1: Elements of AI (Helsinki)",
            "Preparando la Certificación Microsoft & LinkedIn Learning: Career Essentials in Generative AI",
            "Google Cloud Skills Boost: Generative AI Fundamentals (Skill Badge)",
            "Certificación Cisco Networking Academy (Skills for All): Introduction to Data Science / AI Basics",
            "Examen final y Cierre de Semestre"
        ];
    }
}

function cargarLeccionesNivel(nivel) {
    const sidebar = document.getElementById('lista-lecciones');
    sidebar.innerHTML = '';
    
    const nombres = cargarNombresLeccion(nivel);

    nombres.forEach((nombre, index) => {
        const numLeccion = index + 1;
        const btn = document.createElement('button');
        btn.className = `btn-leccion ${index === 0 ? 'active' : ''}`;
        btn.innerText = `Lección ${numLeccion}: ${nombre}`;
        btn.onclick = () => seleccionarLeccion(nivel, numLeccion, nombre);
        sidebar.appendChild(btn);
    });

    // Cargar la primera por defecto
    seleccionarLeccion(nivel, 1, nombres[0]);
}

function seleccionarLeccion(nivel, leccionNum, nombre) {
    // Actualizar el estado visual activo en los botones de la barra lateral
    const botonesLeccion = document.querySelectorAll('#lista-lecciones .btn-leccion');
    botonesLeccion.forEach((btn, index) => {
        if ((index + 1) === leccionNum) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Actualizar título activo
    document.getElementById('titulo-leccion-activa').innerText = `Nivel ${nivel} - Lección ${leccionNum}: ${nombre}`;
    
    // Asignación dinámica del video por nivel y lección
    let urlVideo = "https://www.youtube.com/embed/LcqjlzUucIU"; // Video por defecto o respaldo

    if (nivel === 1) {
        if (leccionNum === 1) {
            urlVideo = "https://www.youtube.com/embed/_TCPuoHrbiQ";
        } else if (leccionNum === 2) {
            urlVideo = "https://www.youtube.com/embed/VWWM7CGwouw";
        } else if (leccionNum === 3) {
            urlVideo = "https://www.youtube.com/embed/V8GKTO6_wTw";
        } else if (leccionNum === 4) {
            urlVideo = "https://www.youtube.com/embed/DfbNqnjcDwA";
        } else if (leccionNum === 5) {
            urlVideo = "https://www.youtube.com/embed/ujJZO6ARCpA";
        } else if (leccionNum === 6) {
            urlVideo = "https://www.youtube.com/embed/V332AkH1h6A";
        } else if (leccionNum === 7) {
            urlVideo = "https://www.youtube.com/embed/1RumCMbUHUA";
        } else if (leccionNum === 8) {
            urlVideo = "https://www.youtube.com/embed/eEvwJRPhB90";
        } else if (leccionNum === 9) {
            urlVideo = "https://www.youtube.com/embed/mpPosPn8yjk";
        }
        // Aquí iremos agregando los demás links conforme subas los videos de las siguientes lecciones:
        // else if (leccionNum === 10) { urlVideo = "https://www.youtube.com/embed/OTRO_ID"; }
    }

    document.getElementById('video-leccion').src = urlVideo;
    
    // Cálculo de la numeración continua de los 40 PDFs de estudio por niveles (10 por nivel)
    let numeroGuia = leccionNum;
    if (nivel === 2) {
        numeroGuia = leccionNum + 10;
    } else if (nivel === 3) {
        numeroGuia = leccionNum + 20;
    } else if (nivel === 4) {
        numeroGuia = leccionNum + 30;
    }
    
    // Conexión dinámica a los subdominios independientes de cada nivel
    let rutaPdf = `https://nivel${nivel}.pideya.contact/lecc_${numeroGuia}_guia.pdf`;
    
    const btnPdf = document.getElementById('btn-pdf');
    btnPdf.href = rutaPdf;
    btnPdf.download = `lecc_${numeroGuia}_guia.pdf`;

    // Control visual del Examen: Solo aparece en la lección 10 (última del nivel)
    const panelEvaluacion = document.querySelector('.evaluacion-panel');
    if (leccionNum === 10) {
        panelEvaluacion.style.display = "block";
        const btnEval = panelEvaluacion.querySelector('.btn-eval');
        
        if (nivel === 1) {
            btnEval.href = "nivel1_examen.html";
            btnEval.onclick = null;
            btnEval.innerHTML = "📝 Presentar Examen de Nivel para pasar al siguiente nivel";
        } else if (nivel === 2) {
            btnEval.href = "nivel2_examen.html";
            btnEval.onclick = null;
            btnEval.innerHTML = "📝 Presentar Examen de Nivel para pasar al siguiente nivel";
        } else if (nivel === 3) {
            btnEval.href = "nivel3_examen.html";
            btnEval.onclick = null;
            btnEval.innerHTML = "📝 Presentar Examen de Nivel para pasar al siguiente nivel";
        } else if (nivel === 4) {
            btnEval.href = "nivel4_examen.html";
            btnEval.onclick = null;
            btnEval.innerHTML = "📝 Presentar Examen de Nivel (&gt;70% para Diploma)";
        } else {
            btnEval.href = "#";
            btnEval.onclick = function() { lanzarEvaluacionNivel(nivel); return false; };
            btnEval.innerHTML = "📝 Presentar Examen de Nivel para pasar al siguiente nivel";
        }
    } else {
        panelEvaluacion.style.display = "none";
    }
}

function lanzarEvaluacionNivel(nivelExamen) {
    const aciertos = prompt(`Evaluación del Nivel ${nivelExamen}:\n¿Cuántos aciertos obtuvo el alumno en el cuestionario? (Ingresa el número de aciertos):`);
    if(aciertos !== null) {
        const totalPreguntas = 10;
        const porcentaje = (parseInt(aciertos) / totalPreguntas) * 100;
        if(porcentaje >= 70) {
            alert(`¡Aprobado con ${porcentaje.toFixed(0)}% de aciertos! Has acreditado el Nivel ${nivelExamen} y puedes avanzar al siguiente nivel.`);
        } else {
            alert(`Calificación: ${porcentaje.toFixed(0)}%. Se requiere un mínimo de 70% de aciertos para aprobar este nivel.`);
        }
    }
}

// Configuración de Supabase para validación de escuelas
const SUPABASE_URL = "https://fjtzyxnpgxxsducxxobx.supabase.co"; // Tu URL de Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqdHp5eG5wZ3h4c2R1Y3h4b2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNDgwNjksImV4cCI6MjEwNTgyNDA2OX0.LlTw1ATsXpQTwzF72YjAe9ubgFWDZJSfBhRSCfj0aJw";

async function validarCodigoEscuela(codigoIngresado) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/escuelas_demo?codigo=eq.${codigoIngresado}&select=*`, {
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            return { valido: false, mensaje: "El código ingresado no existe." };
        }

        const escuela = data[0];

        if (!escuela.activo) {
            return { valido: false, mensaje: "Este código ha sido desactivado." };
        }

        // Validación automática de vigencia (calculada en días)
        const fechaCreacion = new Date(escuela.fecha_creacion);
        const diasVigencia = Number(escuela.dias_vigencia) || 8;
        
        // Calcular la fecha exacta de expiración sumando los días
        const fechaExpiracion = new Date(fechaCreacion.getTime());
        fechaExpiracion.setDate(fechaExpiracion.getDate() + diasVigencia);

        const fechaActual = new Date();

        // Si la fecha actual sobrepasa la fecha de expiración, se bloquea
        if (fechaActual > fechaExpiracion) {
            return { 
                valido: false, 
                mensaje: `El acceso de la escuela ${escuela.nombre_escuela} ha expirado (su periodo de prueba de ${diasVigencia} días ha finalizado).` 
            };
        }

        return { 
            valido: true, 
            mensaje: `¡Acceso concedido! Bienvenido, ${escuela.nombre_escuela}.`,
            escuela: escuela
        };

    } catch (error) {
        console.error("Error al conectar con Supabase:", error);
        return { valido: false, mensaje: "Error de conexión al validar el código." };
    }
}

// Carga normal libre para visitantes y directores
window.onload = function() {
    console.log("InnovaPro IA cargado con éxito. Presentación abierta para visitantes.");
};