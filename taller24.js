const ejercicios = [
    { n: "-5", val: -5, sol: ['Z', 'Q', 'R'], min: -10, max: 0, exp: "-5 es Entero, Racional y Real." },
    { n: "√2", val: 1.414, sol: ['I', 'R'], min: 1, max: 2, exp: "√2 ≈ 1.41... es Irracional y Real." },
    { n: "3/4", val: 0.75, sol: ['Q', 'R'], min: 0, max: 1, exp: "3/4 = 0.75 es Racional y Real." },
    { n: "π", val: 3.141, sol: ['I', 'R'], min: 3, max: 4, exp: "π ≈ 3.14... es Irracional y Real." },
    { n: "√25", val: 5, sol: ['N', 'Z', 'Q', 'R'], min: 0, max: 10, exp: "√25 = 5 es Natural, Entero, Q y R." }
];

let idx = 0;
let seleccion = [];
let puntos = 0;
const canvas = document.getElementById('rectaCanvas');
const ctx = canvas.getContext('2d');

function marcar(celda, conjunto) {
    celda.classList.toggle('seleccionado');
    if (seleccion.includes(conjunto)) {
        seleccion = seleccion.filter(c => c !== conjunto);
    } else {
        seleccion.push(conjunto);
    }
}

function verificarMatriz() {
    const actual = ejercicios[idx];
    const celdas = document.querySelectorAll('#tabla-reales td');
    const conjuntos = ['N', 'Z', 'Q', 'I', 'R'];
    let aciertos = 0;

    conjuntos.forEach((conj, i) => {
        const esCorrecto = actual.sol.includes(conj) === seleccion.includes(conj);
        celdas[i].className = esCorrecto ? 'correct-cell' : 'error-cell';
        if (esCorrecto) aciertos++;
    });

    const fContainer = document.getElementById('feedback-container');
    const fTexto = document.getElementById('feedback-texto');
    fContainer.style.display = 'block';

    if (aciertos === 5) {
        fContainer.style.background = "#e8f5e9";
        fTexto.innerHTML = "✅ ¡Correcto! Ubícalo en la recta dinámica.";
        document.getElementById('seccion-recta').classList.remove('oculto');
        dibujarRecta(actual.min, actual.max);
    } else {
        fContainer.style.background = "#ffebee";
        fTexto.innerHTML = "❌ Revisa la clasificación. Falta o sobra alguna X.";
    }
}

function dibujarRecta(min, max) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    
    // Línea de la recta
    ctx.beginPath();
    ctx.moveTo(30, 50);
    ctx.lineTo(370, 50);
    ctx.stroke();

    // Marcas de los extremos (Zoom aplicado)
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(min, 30, 80);
    ctx.fillText(max, 370, 80);

    // Marca central para referencia
    let medio = (min + max) / 2;
    ctx.beginPath();
    ctx.moveTo(200, 45); ctx.lineTo(200, 55);
    ctx.stroke();
    ctx.font = "12px Arial";
    ctx.fillText(medio.toFixed(1), 200, 80);
}

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const xEnCanvas = (e.clientX - rect.left) * (canvas.width / rect.width);
    const actual = ejercicios[idx];
    
    // Regla de tres para convertir X en valor numérico según el zoom
    const valorUser = actual.min + ((xEnCanvas - 30) / 340) * (actual.max - actual.min);

    // Margen de error del 5% del rango actual
    const margen = (actual.max - actual.min) * 0.05;

    if (Math.abs(valorUser - actual.val) < margen) {
        puntos += 10;
        document.getElementById('puntos-val').innerText = puntos;
        document.getElementById('feedback-texto').innerHTML = `🌟 ¡Excelente! ${actual.exp}`;
        document.getElementById('btn-siguiente').style.display = 'block';
        marcarPunto(actual.val, "#4caf50");
    } else {
        document.getElementById('feedback-texto').innerHTML = "🧐 Intenta tocar con más precisión.";
        marcarPunto(valorUser, "#f44336");
    }
});

function marcarPunto(v, col) {
    const actual = ejercicios[idx];
    const x = 30 + ((v - actual.min) / (actual.max - actual.min)) * 340;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(x, 50, 6, 0, Math.PI * 2); ctx.fill();
}

function proximoEjercicio() {
    idx = (idx + 1) % ejercicios.length;
    seleccion = [];
    document.getElementById('numero-display').innerText = ejercicios[idx].n;
    document.querySelectorAll('#tabla-reales td').forEach(td => td.className = '');
    document.getElementById('seccion-recta').classList.add('oculto');
    document.getElementById('feedback-container').style.display = 'none';
    document.getElementById('btn-siguiente').style.display = 'none';
}

// Inicializar primer número
document.getElementById('numero-display').innerText = ejercicios[0].n;