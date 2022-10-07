window.addEventListener("resize", responsiveFilter);

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
    
    const anchorCategorias = document.getElementsByClassName("filter-cat");

    for (let i = 0; i < anchorCategorias.length; i++) {
        anchorCategorias[i].addEventListener("click",() => {
            let cat = anchorCategorias[i].getAttribute("cat");
            actualProducts = searchCategoria(cat, actualProducts);
            filterProducts = [];
            orderBy(parseInt(orderInput.value),actualProducts);
        });
    }

    function searchCategoria(cat, products){
        let result = products.filter(item => {
            if (item.categoria == cat) {
                return item;
            }
        });
    
        return result;
    }

}