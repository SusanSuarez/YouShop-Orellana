export function validar(input) {
    const tipoDeInput = input.dataset.tipo;
    
    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input);
    }

    input.parentElement.classList.add("was-validated");
    if (input.validity.valid) {
        input.parentElement.querySelector(".invalid-tooltip").innerHTML = "";
    } else {
        input.parentElement.querySelector(".invalid-tooltip").innerHTML = mostrarMensajeDeError(tipoDeInput, input);
    }
}

const tipoDeErrores = [
    "valueMissing",
    "typeMismatch",
    "patternMismatch",
    "customError",
];

const validadores = {
    expiracion: (input) => validarExpiracion(input),
    tarjeta: (input) => validarTarjeta(input),
};

const mensajesDeError = {
    nombres: {
        valueMissing: "Este campo es necesario",
    },
    email: {
        valueMissing: "Este campo es necesario",
        typeMismatch: "El correo no es valido",
    },
    celular: {
        valueMissing: "Este campo es necesario",
        patternMismatch: "El numero debe empezar con 9 seguido de 8 digitos"
    },
    direccion: {
        valueMissing: "Este campo es necesario",
    },
    tarjeta: {
        valueMissing: "Este campo es necesario",
        typeMismatch: "El numero de tarjeta no es correcto",
    },
    expiracion: {
        valueMissing: "Este campo es necesario",
        typeMismatch: "La fecha no es correcta",
    },
    cvv: {
        valueMissing: "Este campo es necesario",
        typeMismatch: "El codigo no es correcto",
    }
};

function mostrarMensajeDeError(tipoDeInput, input) {
    let mensaje = "";
    tipoDeErrores.forEach((error) => {
        if (input.validity[error]) {
            mensaje = mensajesDeError[tipoDeInput][error];
        }
    });
    return mensaje;
}

function validarExpiracion(input) {
    const fecha = input.value;
    const month = fecha.substring(0,2);
    const year = fecha.substring(5);
    let mensaje = "";
    if (parseInt(fecha.substring(0,2)) > 12) {
        mensaje = "Mes incorrecto";
    } else if (!payform.validateCardExpiry(month,year)) {
        mensaje = "Tarjeta expirada";
    }
    input.setCustomValidity(mensaje);
    mensajesDeError.expiracion.customError = mensaje;
}

function validarTarjeta(input) {
    const tarjeta = input.value;
    let mensaje = "";
    if (!payform.validateCardNumber(tarjeta)) {
        mensaje = "Numero de Tarjeta Incorrecta";
    }
    input.setCustomValidity(mensaje);
    mensajesDeError.tarjeta.customError = mensaje;
}