const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function encrypt(text) {
    return text.split('').map(char => {
        const index = alphabet.indexOf(char);
        return index !== -1 ? (index + 1) % 26 : char; // Desplazamiento
    }).join('');
}

function decrypt(code) {
    return code.split('').map(char => {
        const index = parseInt(char);
        return index !== -1 ? alphabet[(index + 25) % 26] : char; // Desplazamiento inverso
    }).join('');
}

const palabraSecretaEncriptada = encrypt("PAPAS");
const palabraSecreta = decrypt(palabraSecretaEncriptada);

let intentos = 0; // Contador de intentos
const maxIntentos = 5; // Número máximo de intentos
const mensaje = document.getElementById("message");
const board = document.getElementById("board");

document.getElementById("submit").addEventListener("click", validarEntrada);
document.getElementById("guess").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        validarEntrada();
    }
});

function generarCodigoReclamo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

function validarEntrada() {
    const guess = document.getElementById("guess").value.toUpperCase();

    if (guess.length !== 5) {
        mensaje.innerText = "¡Por favor, ingresa una palabra de 5 letras!";
        return;
    }

    const row = document.createElement("div");
    row.classList.add("row");

    for (let i = 0; i < 5; i++) {
        const letter = document.createElement("div");
        letter.classList.add("cell");

        if (guess[i] === palabraSecreta[i]) {
            letter.classList.add("correct");
            letter.innerText = guess[i];
        } else if (palabraSecreta.includes(guess[i])) {
            letter.classList.add("wrong-position");
            letter.innerText = guess[i];
        } else {
            letter.classList.add("incorrect");
            letter.innerText = guess[i];
        }
        row.appendChild(letter);
    }

    board.appendChild(row);
    intentos++;

    if (guess === palabraSecreta) {
        const codigoReclamo = generarCodigoReclamo(); 
        mensaje.innerText = `¡Felicidades! Has adivinado la palabra del día. Tu código para reclamar es: ${codigoReclamo}.`;
        document.getElementById("guess").disabled = true;

        const qrCodeData = `CÓDIGO_COMBO:${codigoReclamo}`; 
        $("#qr-code").qrcode({
            width: 128,
            height: 128,
            text: qrCodeData
        });

    } else {
        if (intentos < maxIntentos) {
            mensaje.innerText = `Intenta de nuevo. Te quedan ${maxIntentos - intentos} intentos.`;
        } else {
            mensaje.innerText = `Lo siento, la palabra correcta era: ${palabraSecreta}.`;
            document.getElementById("guess").disabled = true;
        }
    }

    document.getElementById("guess").value = ""; 
}
