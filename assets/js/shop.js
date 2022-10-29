import { Cliente } from "./Cliente.js";

window.addEventListener('load', () => {
    const local = JSON.parse(localStorage.getItem('cliente')) ?? false;
    if (!local) {
        window.location.href = "./index.html"
    }
    const divData = document.getElementById("client-shop");
    const cliente = new Cliente(local.nombres,local.correo,local.celular,local.direccion);

    divData.innerHTML = cliente.templateCliente();
    localStorage.clear();
});