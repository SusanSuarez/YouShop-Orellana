const orderInput = document.getElementById("selectOrder");
const numItems = document.getElementById("numItems");
const filter_nav = document.getElementById("normal-filter");
const off_filter = document.getElementById("offcanvas-filter");
const shopping_items = document.getElementById("cartItems");
let isNewFilter = false;
let newFilter;
let allProducts = true;
let totalProducts = [];
let actualProducts = [];
let filterProducts = [];

window.addEventListener('load', () => {
    orderBy(0);
    responsiveFilter();
    initUI();
});

class Producto {
    //Atributos
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
                        <button class="h-100 btn btn-quantity rounded-pill col" id-product="${this.idProducto}">Agregar</button>
                    </div>
                </div>
            </div>
        </div>
        `; 
    }
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
    totalProducts = productos;
    actualProducts = totalProducts;
    return productos;
}


async function orderBy(order, lista) {
    let products;
    if (lista == undefined) {
        products = await getAllProducts();
    } else {
        products = lista;
    }
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

    actualizarIndicadores(products);

    mostrarProductos(products);
}


orderInput.addEventListener("change", function () {
    if (filterProducts.length == 0) {
        orderBy(parseInt(this.value), actualProducts);
    } else {
        orderBy(parseInt(this.value), filterProducts);
    }
});

// Actualizar los items del Filtrador
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

    if (filterProducts.length == 0) {
        const marcas = [... new Set(products.map(data => data.marca))];
        let marcasHTML = "";
        marcas.forEach(marca => {
            marcasHTML += `
            <div class="form-check form-switch">
                <input class="form-check-input switch-marca" type="checkbox" id="box`+marca+`" mark="`+marca+`">
                <label class="form-check-label" for="box`+marca+`">
                    `+marca+`
                </label>
            </div>
            `;
        });
        
        document.getElementById("MarcasCollapse").innerHTML = marcasHTML;
        
        // Buscar por Marcas
        const boxMarcas = document.getElementsByClassName("switch-marca");

        for (let i = 0; i < boxMarcas.length; i++) {
            boxMarcas[i].addEventListener('change',(e) => {
                let marcas = [];
                for (let j = 0; j < boxMarcas.length; j++) {
                    if (boxMarcas[j].checked) {
                        marcas.push(boxMarcas[j].getAttribute("mark"));
                    }
                }
                filterProducts = buscarMarcas(marcas,actualProducts);
                filterProducts = (marcas.length == 0)? actualProducts: filterProducts;
                orderBy(parseInt(orderInput.value),filterProducts);
            });
        }

        function buscarMarcas(marcas,products) {
            let result = products.filter(item => {
                if (marcas.includes(item.marca)) {
                    return item;
                }
            });
            return result;
        }

    }

}

//Buscar por Categoria
const headerCategorias = document.getElementsByClassName("filter-all-cat");

for (let i = 0; i < headerCategorias.length; i++) {
    headerCategorias[i].addEventListener("click",() => {
        let cat = headerCategorias[i].getAttribute("cat");
        actualProducts = searchCategoria(cat, totalProducts);
        filterProducts = [];
        orderBy(parseInt(orderInput.value),actualProducts);
    });
}


function mostrarProductos(products) {
    let html = "";
    products.forEach(p => {
        html += p.cardProduct(); 
    });
    document.getElementById("lista-p").innerHTML = html;

    $(".item-minus").on("click", function() {
        let inputCant = this.parentElement.childNodes[3];
        let cant = parseInt(inputCant.value);
        inputCant.value = (cant > 1)? cant-1: cant;
    });
    
    $(".item-plus").on("click", function() {
        let inputCant = this.parentElement.childNodes[3];
        let cant = parseInt(inputCant.value);
        inputCant.value = cant+1;
    });
}