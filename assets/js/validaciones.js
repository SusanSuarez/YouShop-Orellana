export function validar(input) {
    const tipoDeInput = input.dataset.tipo;
    
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

const mensajesDeError = {
    nombres: {
        valueMissing: "Este campo no puede estar vacio",
    },
    email: {
        valueMissing: "Este campo no puede estar vacio",
        typeMismatch: "El correo no es valido",
    },
    celular: {
        valueMissing: "Este campo no puede estar vacio",
        typeMismatch: "El numero no es correcto",
        patternMismatch: "El numero debe empezar con 9 seguido de 8 digitos"
    },
    direccion: {
        valueMissing: "Este campo no puede estar vacio",
    },
    tarjeta: {
        valueMissing: "Este campo no puede estar vacio",
        typeMismatch: "El numero de tarjeta no es correcto",
    },
    cvv: {
        valueMissing: "Este campo no puede estar vacio",
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