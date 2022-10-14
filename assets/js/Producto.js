export class Producto {
    // Atributos
    idProducto;
    nombre;
    marca;
    categoria;
    precio;
    imagen;
    ratio;
    // Constructor
    constructor(idProducto,nombre,marca,categoria,precio,imagen,ratio){
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.marca = marca;
        this.categoria = categoria;
        this.precio = precio;
        this.imagen = imagen;
        this.ratio = ratio;
    }
    // Funciones
    cardProduct() {
        return `
        <div class="col-12 col-sm-6 col-md-4 col-xl-3">
            <div class="shadow card rounded-3">
                <img src="${this.imagen}" class="card-img-top rounded-top rounded-3 p-2">
                <div class="card-body py-1">
                    <p class="name-p m-0">${this.nombre}</p>
                    <p class="text-muted mark-p">Marca: <span>${this.marca}</span></p>
                    <p class="price-p m-0 mb-1">S/<span>${this.precio}</span></p>
                    <hr class="my-2">
                    <div class="row">
                        <div class="input-group mb-1 px-1 col">
                            <button class="btn px-1 item-minus" type="button">
                                -
                            </button>
                            <input type="number" class="form-control text-center px-0" value="1" min="1">
                            <button class="btn px-1 item-plus" type="button">
                                +
                            </button>
                        </div>
                        <button class="h-100 btn btn-quantity rounded-pill col" data-product="${this.idProducto}">Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        `; 
    }
}