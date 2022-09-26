const orderInput = document.getElementById("selectOrder");
const numItems = document.getElementById("numItems");
let allProducts = true;
window.addEventListener('load', () => {
    orderBy(0);
});

class Producto {
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
}

async function getData() {
    return fetch('./assets/json/products.json').then(response => response.json());
}

async function getAllProducts() {
    const data = await getData();
    let productos = [];
    data.forEach(p => {
        productos.push(new Producto(p.idProducto, p.nombre, p.marca, p.categoria, parseFloat(p.precio), p.imagen, p.ratio));
    });
    return productos;
}


async function orderBy(order) {
    let products = await getAllProducts();
    actualizarIndicadores(products);
    switch (order) {
        case 0:
            products.sort((i, j) => j.ratio - i.ratio);
            break;
        case 1:
            products.sort((i, j) => i.precio - j.precio);
            break;
        case 2:
            products.sort((i, j) => j.precio - i.precio);
            break;
        case 3:
            products.sort((i, j) => i.nombre.localeCompare(j.nombre));
            break;
        case 4:
            products.sort((i, j) => j.nombre.localeCompare(i.nombre));
            break;
    }
    //console.table(products);
    mostrarProductos(products);
}

orderInput.addEventListener("change", function () {
    orderBy(parseInt(this.value));
});

function actualizarIndicadores(products) {
    numItems.innerText = products.length;
    if (allProducts) {
        let celulares = products.filter(prod => prod.categoria == "Celulares").length;
        document.getElementById("catCelulares").innerText = celulares;
        let laptops = products.filter(prod => prod.categoria == "Laptops").length;
        document.getElementById("catLaptops").innerText = laptops;
        let tablets = products.filter(prod => prod.categoria == "Tablets").length;
        document.getElementById("catTablets").innerText = tablets;
        let accesorios = products.filter(prod => prod.categoria == "Accesorios").length;
        document.getElementById("catAccesorios").innerText = accesorios;
    }
    const marcas = [... new Set(products.map(data => data.marca))];
    let marcasHTML = "";
    marcas.forEach(marca => {
        marcasHTML += `
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="box`+marca+`">
            <label class="form-check-label" for="box`+marca+`">
                `+marca+`
            </label>
        </div>
        `;
    });
    document.getElementById("MarcasCollapse").innerHTML = marcasHTML;
    const precios = products.map(data => parseInt(data.precio));

    let min = Math.min.apply(null,precios);
    let max = Math.max.apply(null,precios);
    document.getElementById("price-1").min = min;
    document.getElementById("price-1").max = max;
    document.getElementById("price-1").value = min;
    document.getElementById("price-2").min = min;
    document.getElementById("price-2").max = max;
    document.getElementById("price-2").value = max;
    slideOne();
    slideTwo();
}

function mostrarProductos(products) {
    let html = "";
    products.forEach(p => {
        html += `
        <div class="col-12 col-sm-6 col-md-4 col-xl-3">
            <div class="shadow card rounded-3">
                <img src="`+p.imagen+`" class="card-img-top rounded-top rounded-3 p-2">
                <div class="card-body py-1">
                    <p class="name-p m-0">`+p.nombre+`</p>
                    <p class="text-muted mark-p">Marca: <span>`+p.marca+`</span></p>
                    <p class="price-p m-0 mb-1">S/<span>`+p.precio+`</span></p>
                    <hr class="my-2">
                    <div class="row">
                        <div class="input-group mb-1 px-1 col">
                            <button class="btn px-1" type="button">
                                -
                            </button>
                            <input type="number" class="form-control text-center px-0" value="1">
                            <button class="btn px-1" type="button">
                                +
                            </button>
                        </div>
                        <button class="h-100 btn btn-quantity rounded-pill col">Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        `; 
    });
    document.getElementById("lista-p").innerHTML = html;
}