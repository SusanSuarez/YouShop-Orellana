import { Producto } from "./Producto.js";
import { Carrito } from "./Carrito.js";

const orderInput = document.getElementById("selectOrder");
const numItems = document.getElementById("numItems");
const filter_nav = document.getElementById("normal-filter");
const off_filter = document.getElementById("offcanvas-filter");
const shopping_items = document.getElementById("cartItems");
const tableSub = document.querySelector('[data-table-sub]');
const tableIGV = document.querySelector('[data-table-igv]');
const tableTotal = document.querySelector('[data-table-total]');

let isNewFilter = false;
let newFilter;
let allProducts = true;
let totalProducts = [];
let actualProducts = [];
let filterProducts = [];

// EventListener Load
window.addEventListener('load', () => {
    orderBy(0);
    responsiveFilter();
    initUI();
    cargarCarrito();
});

window.addEventListener("resize", responsiveFilter);

// Fetch to get products of JSON file
async function getData() {
    return fetch('./assets/json/products.json').then(response => response.json());
}

// Function to assign products in Arrays
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

// Function to sort product list
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

// EventListener for InputOrder
orderInput.addEventListener("change", function () {
    if (filterProducts.length == 0) {
        orderBy(parseInt(this.value), actualProducts);
    } else {
        orderBy(parseInt(this.value), filterProducts);
    }
});

// Refresh indicators from Filter
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
                <input class="form-check-input switch-marca" type="checkbox" id="box`+marca+`" data-mark="`+marca+`">
                <label class="form-check-label" for="box`+marca+`">
                    `+marca+`
                </label>
            </div>
            `;
        });
        
        document.getElementById("MarcasCollapse").innerHTML = marcasHTML;
        
        // Search by Marks
        const boxMarcas = document.querySelectorAll(".switch-marca");
        let listMarcasChecked = [];

        boxMarcas.forEach((mark) => {
            mark.addEventListener('change',(e) => {
                if (e.target.checked) {
                    listMarcasChecked.push(e.target.dataset.mark);
                } else {
                    listMarcasChecked = listMarcasChecked.filter(i => i != e.target.dataset.mark);
                }
                filterProducts = buscarMarcas(listMarcasChecked,actualProducts);
                filterProducts = (listMarcasChecked.length == 0)? actualProducts: filterProducts;
                orderBy(parseInt(orderInput.value),filterProducts);            
            })
        });

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

function mostrarProductos(products) {
    let html = "";
    products.forEach(p => {
        html += p.cardProduct(); 
    });
    document.getElementById("lista-p").innerHTML = html;

    $(".item-minus").on("click", (e) => {
        let inputCant = e.target.parentElement.childNodes[3];
        let cant = parseInt(inputCant.value);
        inputCant.value = (cant > 1)? cant-1: cant;
    });
    
    $(".item-plus").on("click", (e) => {
        let inputCant = e.target.parentElement.childNodes[3];
        let cant = parseInt(inputCant.value);
        inputCant.value = cant+1;
    });

    const btnAddCartProducts = document.querySelectorAll("[data-product]");

    btnAddCartProducts.forEach((btn) => {
        btn.addEventListener('click',(e) => {
            const input = e.target.parentElement.childNodes[1].childNodes[3];

            const id = e.target.dataset.product;
            const cant = parseInt(input.value);
            
            const i = totalProducts.findIndex((item) => item.idProducto === id);
            const producto = totalProducts[i];
            const carrito = JSON.parse(localStorage.getItem('cart')) || [];

            if (carrito.length == 0) {
                const tableShopping = document.querySelector('[data-table-shopping]');
                carrito.push(new Carrito(uuid.v4(),producto,cant));
                tableShopping.className = 'd-block';
            } else {
                const j = carrito.findIndex((item) => item.producto.idProducto === id);
                
                if (j != -1) {
                    carrito[j].cantidad = parseInt(carrito[j].cantidad) + cant;
                    carrito[j].monto = carrito[j].cantidad * carrito[j].producto.precio;
                } else {
                    carrito.push(new Carrito(uuid.v4(),producto,cant));
                }
            }

            localStorage.setItem('cart', JSON.stringify(carrito));

            cargarCarrito();
            actualizarTablaResumen();
        });
    });

}

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const itemsCartHTML = document.querySelector('.shopping-items');
    const tableShopping = document.querySelector('[data-table-shopping]');

    shopping_items.innerText = carrito.length;

    if (carrito.length == 0) {
        itemsCartHTML.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">Agrega Productos al Carrito</td>  
        </tr>
        `;
        tableShopping.className = 'd-none';
        return;
    }

    actualizarTablaResumen();
    let html = '';

    carrito.forEach((item) => {
        html += new Carrito(item.id, item.producto, item.cantidad).templateItemCart();
    });

    itemsCartHTML.innerHTML = html;
    const deleteItems = document.querySelectorAll(".trash-shopping");

    $(".shopping-minus").on("click", (e) => {
        let inputCant = e.target.parentElement.childNodes[3];
        let cant = parseInt(inputCant.value);
        inputCant.value = (cant > 1)? cant-1: cant;
        actualizarItemCart(inputCant.dataset.itemcart, inputCant.value);
    });
    
    $(".shopping-plus").on("click", (e) => {
        let inputCant = e.target.parentElement.childNodes[3];
        let cant = parseInt(inputCant.value);
        inputCant.value = cant+1;
        actualizarItemCart(inputCant.dataset.itemcart, inputCant.value);
    });

    function actualizarItemCart (id, cant) {
        const carrito = JSON.parse(localStorage.getItem('cart')) || [];
        const i = carrito.findIndex((item) => item.id === id);

        carrito[i].cantidad = parseInt(cant);
        carrito[i].monto = carrito[i].cantidad * carrito[i].producto.precio;

        localStorage.setItem('cart', JSON.stringify(carrito));
        actualizarTablaResumen();
    }

    $(".shopping-cant").on("change",(e) => {
        actualizarItemCart(e.target.dataset.itemcart, e.target.value);
    });

    deleteItems.forEach((item) => {
        item.addEventListener('click',(e) => {
            const id = e.target.dataset.itemtrash;
            const carrito = JSON.parse(localStorage.getItem('cart')) || [];
            const i = carrito.findIndex((item) => item.id === id);

            carrito.splice(i,1);
            localStorage.setItem('cart', JSON.stringify(carrito));
            item.parentElement.parentElement.remove();
            actualizarTablaResumen();
            shopping_items.innerText = carrito.length;
        });
    });
}

function actualizarTablaResumen() {
    const montos = [];
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    carrito.forEach((item) => {
        montos.push(item.monto);
    });
    const total = montos.reduce((i,j) => i+j,0);
    tableTotal.innerText = parseFloat(total).toFixed(2);
    tableSub.innerText = parseFloat(total*.82).toFixed(2);
    tableIGV.innerText = parseFloat(total*.18).toFixed(2);
}

function responsiveFilter() {
    let ancho = window.innerWidth;

    if (ancho <= 991) {
        if(!isNewFilter) {
            newFilter = filter_nav.innerHTML;
            filter_nav.innerHTML = "";
            off_filter.innerHTML = newFilter;
            initUI();
            isNewFilter = true;
            filterProducts = [];
            orderBy(parseInt(orderInput.value),actualProducts);
        }

    } else {
        if(isNewFilter) {
            newFilter = off_filter.innerHTML;
            off_filter.innerHTML = "";
            filter_nav.innerHTML = newFilter;
            initUI();
            isNewFilter = false;
            filterProducts = [];
            orderBy(parseInt(orderInput.value),actualProducts);
        }
    }
}

function initUI() {

    document.getElementById("iNombre").addEventListener("input", () => {
        actualProducts = searchNombre(totalProducts);
        filterProducts = [];
        orderBy(parseInt(orderInput.value),actualProducts);
    });
    
    // Buscar por Nombre
    function searchNombre(products) {
        let nombre = document.getElementById("iNombre").value;
        
        let result = products.filter(item => {
            if(item.nombre.toLowerCase().includes(nombre)) {
                return item;
            }
        });
    
        return result;
    }

    //Search by Category
    const headerCategorias = document.querySelectorAll(".filter-all-cat");

    headerCategorias.forEach((category) => {
        category.addEventListener('click', (e) => {
            let cat = e.target.dataset.cat;
            actualProducts = searchCategoria(cat, totalProducts);
            filterProducts = [];
            orderBy(parseInt(orderInput.value), actualProducts);
        });
    });
    
    const anchorCategorias = document.querySelectorAll(".filter-cat");

    anchorCategorias.forEach((category) => {
        category.addEventListener('click', (e) => {
            let cat  = e.target.dataset.cat2;
            actualProducts = searchCategoria(cat, actualProducts);
            filterProducts = [];
            orderBy(parseInt(orderInput.value),actualProducts);
        });
    });

    function searchCategoria(cat, products){
        let result = products.filter(item => {
            if (item.categoria == cat) {
                return item;
            }
        });
        return result;
    }
}