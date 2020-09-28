import "regenerator-runtime/runtime";

const Dom = {
    isClicked: false,
    currentParam: '',
    productCategory: ['teddies', 'cameras', 'furniture'],
    catalog: document.getElementById('catalog'),
    product: document.getElementById('template-index'),

    //This function will let appear the products
    buildProducts: async function (productType) {
        const url               = ProductApi.baseUrl(productType)
        const products          = await ProductApi.getProducts(url)

        //Set a loop forEach to show one by one the products of a category thanks to a template
        products.forEach((product, i) => {
            const template      = document.importNode(Dom.product.content, true)
            const item          = template.getElementById('products')
            let link            = template.getElementById('link')
            let productName     = template.getElementById('title')
            let image           = template.getElementById('image')

            link.href           = '/pages/product.html?type=' + productType + '&id=' + product._id
            
            productName.innerHTML = product.name
            
            image.src           = product.imageUrl
            image.alt           = 'Image de l\'article : ' + product.name
            image.title         = 'Image de l\'article : ' + product.name
            
            item.setAttribute('id', 'products-' + i)
            
            Dom.catalog.appendChild(template)
        })
    },
    
    //This function will remove the template
    refreshProductsList: function () {
        document.getElementById('catalog').innerHTML = " "
    },

    /* This function will show the product pass by the boolean Dom.isClicked and the string Dom.currentParam
    the @param productType is a categorie product set thanks to the function toggleItems */
    showProductPage: function (productType) {   
        //Conditional to check if the category has been clicked once
        if ((Dom.isClicked == true && Dom.currentParam == '') || (Dom.isClicked == true && Dom.currentParam == productType)) {
            Dom.currentParam        = productType
            Dom.buildProducts(Dom.currentParam)
        }
        //Conditional to check if a different category has been clicked once
        if (Dom.isClicked == false && Dom.currentParam != productType) {
            Dom.currentParam        = productType
            Dom.isClicked           = !Dom.isClicked
            Dom.refreshProductsList()
            Dom.buildProducts(Dom.currentParam)
        }
        //Conditional to check if a category has already been clicked
        if (Dom.isClicked == false && Dom.currentParam == productType) {
            Dom.currentParam         = ''
            Dom.refreshProductsList()
        }
    },
    
    toggleItems: function () {
        //This function will modify the boolean Dom.isClicked after a click on productCategory and call a function
        function show(category) {
            Dom.isClicked           = !Dom.isClicked
            Dom.showProductPage(category.currentTarget.id)
        }
        //Set a loop for to listen for a click for all product type in html
        for (let i = 0; i < Dom.productCategory.length; i++) {
            document.getElementById(Dom.productCategory[i]).addEventListener("click", show, false)
        }
    },

    getItems: function () {

        Dom.updateCartNumber()
        
        //Conditional to call a function only in homepage
        if (window.location.pathname == '/index.html' || window.location.pathname == '/') {
            Dom.toggleItems()
        }
    },
    
    //This function parse the localStorage and put it in the HTML
    cartProductsNumber: function () {
      let productsAdded = JSON.parse(localStorage.getItem('cart')).length
      document.getElementById('cart-num').innerHTML = "( " + productsAdded + " )"
    },

    //This function will update the number next to the cart
    updateCartNumber: function () {
        if (JSON.parse(localStorage.getItem('cart')) !== null) {
            Dom.cartProductsNumber()
        }
        else {
            document.getElementById('cart-num').innerHTML = '(' + 0 + ')'
        }
    }
}

window.onload = Dom.getItems()