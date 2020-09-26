// Creating a class to add product selected
class Line {
    constructor (param, imgUrl, name, id, quantity, price) {
        this.param      = param
        this.imgUrl     = imgUrl
        this.name       = name
        this.id         = id
        this.quantity   = quantity
        this.price      = price
    }
}

const DomProduct = {
    productDescription: document.getElementById('product-details'),
    productInfo: document.getElementById('template-product'),

    //This function will set a template and show the information about the product
    showProductDetails: async function (productId) {
        let firstProperty               = ""
        let queryStr                    = window.location.search
        let urlStr                      = new URLSearchParams(queryStr)

        const urlItem                   = ProductApi.idUrl(productId)
        const productDetails            = await ProductApi.getProducts(urlItem)
        
        const template                  = document.importNode(DomProduct.productInfo.content, true)

        let productTitle                = template.getElementById('product-title')
        let productImage                = template.getElementById('product-image')
        let productSubtitle             = template.getElementById('product-subtitle')
        let productRef                  = template.getElementById('product-ref')
        let productDesc                 = template.getElementById('product-desc')
        let quantitySelect              = template.getElementById('product-quantity')

        productTitle.innerHTML          = urlStr.get('type') + ' ' + productDetails.name
        
        productImage.src                = productDetails.imageUrl
        productImage.alt                = 'Image de ' + urlStr.get('type') + ' ' + productDetails.name
        productImage.title              = urlStr.get('type') + ' ' + productDetails.name
        
        productSubtitle.innerHTML       = productDetails.name
        
        productRef.innerHTML            = 'Ref. n° ' + productDetails._id
        
        productDesc.innerHTML           = productDetails.description

        //Add a loop for to set number option for quantity
        for (let optionNumber = 1; optionNumber <= 8; optionNumber++) {
            let option                  = document.createElement('option')
            option.textContent          = optionNumber
            option.value                = optionNumber
            quantitySelect.appendChild(option)
        }

        let productPrice                = template.getElementById('product-price')
        productPrice.innerHTML          = 'Prix : ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(productDetails.price/100))
        
        DomProduct.productDescription.appendChild(template)

        //Search to the URL of the window to declare the type of the product
        switch (urlStr.get('type')) {
            case "teddies":
                firstProperty = 'colors';
                break;
            case "cameras":
                firstProperty = 'lenses';
                break;
            case "furniture":
                firstProperty = "varnish";
                break;
        }

        DomProduct.getAllOptions(firstProperty, productDetails)

        //Listen to the adding button and show a message when adding a product
        document.getElementById('add-btn').addEventListener('click', function (event) {
            let cartProductNumber       = JSON.parse(localStorage.getItem('cart'))
            const toastBox              = document.getElementById("toast")
            
            //Conditional to show a specific message when adding a product for the first time
            if (cartProductNumber === null) {
                cart = []
                firstAddProduct         = new Line(urlStr.get('type'), productDetails.imageUrl, productDetails.name, productDetails._id, parseInt(quantitySelect.value), productDetails.price)
                cart.push(firstAddProduct)
                localStorage.setItem('cart', JSON.stringify(cart))
                toastBox.innerHTML      = 'Produit ajouté au panier !'
                toastBox.className      = "show"
                document.getElementById('cart-num').innerHTML = "( " + 1 + " )"
                setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                
            }
            //Conditional to show a specific message if we already add a product to our cart
            else {

                productAlreadyAdded = false

                for (let product in cartProductNumber) {
                    if (cartProductNumber[product].id === productDetails._id) {
                        productAlreadyAdded = true
                        cartProductNumber[product].quantity = parseInt(cartProductNumber[k].quantity) + parseInt(quantitySelect.value)
                        toastBox.innerHTML = 'Quantité modifiée !'
                        toastBox.className = "show"
                        document.getElementById('cart-num').innerHTML = "( " + cartProductNumber.length + " )"
                        setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                        
                    }
                }
                if (!productAlreadyAdded) {
                    cartProductNumber.push(new Line(urlStr.get('type'), productDetails.imageUrl, productDetails.name, productDetails._id, parseInt(quantitySelect.value), productDetails.price))
                    toastBox.innerHTML = 'Produit ajouté au panier !'
                    toastBox.className = "show"
                    document.getElementById('cart-num').innerHTML = "( " + cartProductNumber.length + " )"
                    setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                    
                }
                localStorage.setItem('cart', JSON.stringify(cartProductNumber))
            }
        })
    },

    //This function will use the type of product into the window URL and get the option into the API
    getAllOptions: function (value, param) {
        param[value].forEach((value, i) => {
            let optionSelect        = document.getElementById('product-options')
            let optionChoice        = document.createElement('option')
            let optionValue         = document.createTextNode(value)
            optionChoice.appendChild(optionValue)
            optionSelect.appendChild(optionChoice)
        }) 
    },
}

window.onload = DomProduct.showProductDetails()