export class Carrito {
    // Atributos
    id;
    producto;
    cantidad;
    monto;
    // Constructor
    constructor (id,producto,cantidad) {
        this.id = id;
        this.producto = producto;
        this.cantidad = cantidad;
        this.calcularMonto();
    }
    // Funciones
    calcularMonto() {
        this.monto = (this.producto.precio) * this.cantidad;
    }

    templateItemCart() {
        return `
        <tr>
            <td class="align-middle">
                <img src="${this.producto.imagen}" alt="item">
            </td>
            <td class="align-middle item-name">${this.producto.nombre}</td>
            <td class="item-price align-middle">S/<span>${this.producto.precio}</span></td>
            <td class="align-middle">
                <div class="input-group mb-1 px-1 col">
                    <button class="btn px-1 shopping-minus" type="button">
                        -
                    </button>
                    <input type="number" class="form-control text-center px-0 shopping-cant" value="${this.cantidad}" data-itemcart="${this.id}">
                    <button class="btn px-1 shopping-plus" type="button">
                        +
                    </button>
                </div>
            </td>
            <td class="item-trash align-middle">
                <button class="btn p-0 m-0 trash-shopping" data-itemtrash="${this.id}">
                    <i class="fa-regular fa-trash text-danger" data-itemtrash="${this.id}"></i>
                </button>
            </td>
        </tr>
        `;
    }
}