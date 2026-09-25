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
            "Introducción y Visión WEF", "Fundamentos de LLMs", "Prompt Engineering Base", "ChatGPT Práctico",
            "Google Gemini Avanzado", "Perplexity & Búsqueda", "GitHub Copilot", "DeepSeek Asistente",
            "Cuadro Comparativo IAs", "Locuciones Vocaroo", "TTSMaker Audios", "Pixabay & Ética",
            "Google Forms Educativo", "Suno y Udio Música", "Publicación en Netlify"
        ];
    } else if(nivel === 2) {
        return [
            "DALL-E 3 Imágenes", "Leonardo AI Estilos", "Clipchamp Edición", "Descript Guiones",
            "Meshy AI Modelado", "Spline AI Interfaces", "Luma AI Genie 3D", "Pika 2.5 Video",
            "Hailuo 2.3 Sintético", "Veo 3 Animación", "Seedance 2 Cinemática", "Combinación Multimedia",
            "Optimización de Assets", "Proyecto Multimedia", "Cierre Evaluación Nivel 2"
        ];
    } else if(nivel === 3) {
        return [
            "VS Code Instalación", "Configuración y Atajos", "Extensiones Clave", "Sintaxis HTML5",
            "Diseño CSS3 Moderno", "JavaScript Variables", "JavaScript Eventos", "JavaScript Funciones",
            "Copilot en el Editor", "DeepSeek para Código", "Estructura PWA Local", "Embed de Videos",
            "Paneles de Recursos", "Depuración de Errores", "Evaluación Nivel 3"
        ];
    } else {
        return [
            "Proyecto 1: Landing Page", "Proyecto 2: Generador Prompts", "Proyecto 3: Memorama", "Proyecto 4: Solitario",
            "Proyecto 5: Calculadora", "Proyecto 6: Mini CRM", "Proyecto 7: Calendario", "Proyecto 8: Quiz Evaluador",
            "Proyecto 9: Reproductor Media", "Proyecto 10: Bloc Notas", "Proyecto 11: Talent Cards", "Proyecto 12: Reloj Mundial",
            "Proyecto 13: Catálogo Web", "Proyecto 14: Tablero Kanban", "Proyecto 15: PWA Final"
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
    
    // Video de la lección
    document.getElementById('video-leccion').src = "https://www.youtube.com/embed/LcqjlzUucIU";
    
    // Cálculo de la numeración continua de los 60 PDFs de estudio por niveles
    let numeroGuia = leccionNum;
    if (nivel === 2) {
        numeroGuia = leccionNum + 15;
    } else if (nivel === 3) {
        numeroGuia = leccionNum + 30;
    } else if (nivel === 4) {
        numeroGuia = leccionNum + 45;
    }
    
    // Cálculo de la ruta y subcarpeta dinámica según el nivel del 1 al 4
    let nombreCarpetaNivel = `Nivel${nivel}`;
    let rutaPdf = `recursos/${nombreCarpetaNivel}/lecc_${numeroGuia}_guia.pdf`;
    
    const btnPdf = document.getElementById('btn-pdf');
    btnPdf.href = rutaPdf;
    btnPdf.download = `lecc_${numeroGuia}_guia.pdf`;

    // Control visual del Examen: Solo aparece en la lección 15 (última del nivel)
    const panelEvaluacion = document.querySelector('.evaluacion-panel');
    if (leccionNum === 15) {
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
        const totalPreguntas = 15;
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