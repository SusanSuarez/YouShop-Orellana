export class Cliente {
    // Atributos
    nombres;
    correo;
    celular;
    direccion;
    // Constructor
    constructor (nombres,correo,celular,direccion) {
        this.nombres = nombres;
        this.correo = correo;
        this.celular = celular;
        this.direccion = direccion;
    }

    templateCliente() {
        return `
        <p>¡Gracias <span class="text-youshop">${this.nombres}</span> por su compra!</p>
                <p>¡El pago fue realizado con exito!</p>
                <p>Puede ver el resumen de su compra en su correo: <a href="https://mail.google.com/" class="text-youshop">${this.correo}</a></p>
                <p>Su pedido llegara de 2 a 3 dias habiles a la dirección: <span class="text-primary">${this.direccion}</span></p>
                <p>Nos comunicaremos al celular: <a class="text-youshop">${this.celular}</a> para coordinar la entrega</p>
        `;
    }
}