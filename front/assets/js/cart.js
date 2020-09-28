// Creating class for sending contact infos
class Contact {
    constructor(firstName, lastName, address, city, email) {
        this.firstName  = firstName
        this.lastName   = lastName
        this.address    = address
        this.city       = city
        this.email      = email
    }
}

// Creating a class to post contact's object and product's array to server
class FormSent {
    constructor(user, products) {
        this.contact    = user
        this.products   = products
    }
}

// Creating a class to easily add product purchased info
class Confirm {
    constructor(param, name, imgUrl, id, quantity, price) {
        this.param      = param
        this.name       = name
        this.imgUrl     = imgUrl
        this.id         = id
        this.quantity   = quantity
        this.price      = price
    }
}

//Creating a class to stock orderId and type of product when we submit the form
class OrderConfirm {
    constructor(id, param){
        this.id = id
        this.param = param
    }
}

const DomCart = {
    cart: document.getElementById('cart'),
    cartProducts: document.getElementById('template-cart'),
    total: document.getElementById('total'),
    cartFinalPrice: document.getElementById('template-total'),
    form: document.getElementById('form'),
    cartForm: document.getElementById('template-form'),

    //This function will show the products into the cart thanks to a template
    buildCart: function () {
        let productsAddedToCart             = JSON.parse(localStorage.getItem('cart'))
        let toggleCartRemove                = false
        const toastBox                      = document.getElementById("toast")

        //Set a loop forEach to show product added one by one
        productsAddedToCart.forEach((product, i) => {
            const cartTemplate              = document.importNode(DomCart.cartProducts.content, true)
        
            let cartLink                    = cartTemplate.getElementById('cart-link')
            let cartImage                   = cartTemplate.getElementById('cart-image')
            let cartProductTitle            = cartTemplate.getElementById('cart-title')
            let cartProductPrice            = cartTemplate.getElementById('cart-price')
            let cartProductQuantity         = cartTemplate.getElementById('cart-quantity')
            let buttonMore                  = cartTemplate.getElementById('btn-more')
            let buttonLess                  = cartTemplate.getElementById('btn-less')
            let cartProductsTotal           = cartTemplate.getElementById('cart-products-total')
            
            cartLink.href                   = './product.html?type=' + product.param + '&id=' + product.id
            
            cartImage.src                   = product.imgUrl
            cartImage.alt                   = 'Image de ' + product.name
            cartImage.title                 = 'Image de ' + product.name
            
            cartProductTitle.innerHTML      = product.name
            
            cartProductPrice.innerHTML      = 'Prix unitaire : ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price/100))
            
            cartProductQuantity.innerHTML   = 'Quantité : ' + product.quantity
            
            //Set rules and message when we click on the button +
            buttonMore.setAttribute('id', 'btn-more-' + i)
            buttonMore.addEventListener('click', function (event) {
                product.quantity++
                localStorage.setItem('cart', JSON.stringify(productsAddedToCart))
                toastBox.innerHTML          = 'Quantité modifiée !'
                toastBox.className          = "show"
                setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                document.getElementById('cart-num').innerHTML = "( " + productsAddedToCart.length + " )"
                setTimeout(function() { location.reload(); }, 1500)
            });
        
            //Set rules and message when we click on the button -
            buttonLess.setAttribute('id', 'btn-less-' + i)
            buttonLess.addEventListener('click', function (event) {
                //Conditional when remove an unique product into cart
                if (productsAddedToCart[i].quantity === 1) {
                    toggleCartRemove = true
                    if (productsAddedToCart.length === 1) {
                        toastBox.innerHTML  = product.name + ' a été supprimé et votre panier est vide !'
                        toastBox.className  = "show"
                        setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                        document.getElementById('cart-num').innerHTML = "( " + productsAddedToCart.length + " )"
                        localStorage.clear()
                        setTimeout(function() { location.reload(); }, 3100)
                        
                    }
                    if (productsAddedToCart.length > 1) {
                        productsAddedToCart[i].quantity--
                        productsAddedToCart.splice(i, 1)
                        localStorage.setItem('cart', JSON.stringify(productsAddedToCart))
                        toastBox.innerHTML  = product.name + ' a été supprimé du panier !'
                        toastBox.className  = "show"
                        setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                        document.getElementById('cart-num').innerHTML = "( " + productsAddedToCart.length + " )"
                        setTimeout(function() { location.reload(); }, 1500)
                    }
                }
                //Conditional when remove a product among others
                if (productsAddedToCart[i].quantity > 1 && toggleCartRemove == false) {
                    productsAddedToCart[i].quantity--
                    localStorage.setItem('cart', JSON.stringify(productsAddedToCart))
                    toastBox.innerHTML      = 'Quantité modifiée !'
                    toastBox.className      = "show"
                    setTimeout(function(){ toastBox.className = toastBox.className.replace("show", ""); }, 3000)
                    document.getElementById('cart-num').innerHTML = "( " + productsAddedToCart.length + " )"
                    setTimeout(function() { location.reload(); }, 1500)
                }
            })
        
            cartProductsTotal.innerHTML     = 'Prix total pour cet article : ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((product.quantity * product.price)/100))
            
            DomCart.cart.appendChild(cartTemplate)
        })      
    },

    //This function will calculate the total price of the product and show it thanks to a template 
    buildTotalPrice: function () {
        let productsAddedToCart             = JSON.parse(localStorage.getItem('cart'))
        let calculationTotalOrder           = 0;
        
        const cartTotalTemplate             = document.importNode(DomCart.cartFinalPrice.content, true)
        
        let cartTotal                       = cartTotalTemplate.getElementById('cart-total')
        
        for (let product in productsAddedToCart) {
            calculationTotalOrder += productsAddedToCart[product].price * productsAddedToCart[product].quantity
        }

        cartTotal.innerHTML                 = 'Prix total de votre commande: ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(calculationTotalOrder/100))

        DomCart.total.appendChild(cartTotalTemplate)
    },

    //This function will set a form thanks to a template and send the information entered to a class
    buildForm: function () {
        let productsAddedToCart             = JSON.parse(localStorage.getItem('cart'))
        let orderIds                        = []
        const toastBox                      = document.getElementById("toast")
        
        const formTemplate = document.importNode(DomCart.cartForm.content, true)
        DomCart.form.appendChild(formTemplate)

        //This function will send the @param order if the @param URL answer correctly
        function sending (url, order) {
            return new Promise(function (resolve, reject) {
                let request = new XMLHttpRequest();
                request.onreadystatechange = function (response) {
                    if (this.readyState === 4) {
                        if (this.status === 201) {
                            resolve(response = JSON.parse(this.responseText), orderIds.push(new OrderConfirm(response.orderId, JSON.parse(localStorage.getItem('paramOrder')))), localStorage.setItem('orderId', JSON.stringify(orderIds)), localStorage.setItem('contact', JSON.stringify(response.contact)));
                        } else {
                            reject(
                                toastBox.innerHTML = this.satus + '\n' + 'Une erreur est survenue, merci de réessayer ultérieurement',
                                toastBox.className = "show show--alert",
                                setTimeout(function(){ toastBox.className = toastBox.className.replace("show show--alert", ""); }, 3000)
                            )
                        }
                    }
                }
                request.open("POST", url);
                request.setRequestHeader("Content-Type", "application/json");
                request.send(JSON.stringify(order));
            })
        }

        //Listening to the submit button to get infos and put them in arrays
        document.getElementById('btn-submit').addEventListener('click', function (event) {
            
            //Initializing array for products Ordered
            let productsOrdered = []
                    
            //Conditional to check the form validity
            if (!document.getElementById('cart-form').checkValidity()) {
                //Form isn't valid: preventing the submit and show an error message
                event.preventDefault()
                toastBox.innerHTML = 'Formulaire invalide, merci de bien renseigner tous les champs du formulaire !'
                toastBox.className = "show show--alert"
                setTimeout(function(){ toastBox.className = toastBox.className.replace("show show--alert", ""); }, 3000)
            }
            else {
                //Form is valid: creating the user contact infos
                let newContact = new Contact(document.getElementById('firstName').value, document.getElementById('lastName').value, document.getElementById('address').value, document.getElementById('city').value, document.getElementById('email').value)

                //Initializing an array to push the Confirm class into it
                let confirm = []

                for (let product in productsAddedToCart) {
                    //if it's the first time we have this type of product, we create sub array
                    if (typeof productsOrdered[productsAddedToCart[product].param] == "undefined") {
                        productsOrdered[productsAddedToCart[product].param] = [];
                    }
                    //we push product on dedicate subarray
                    productsOrdered[productsAddedToCart[product].param].push(productsAddedToCart[product].id.toString())
                    confirm.push(new Confirm(productsAddedToCart[product].param, productsAddedToCart[product].name, productsAddedToCart[product].imgUrl, productsAddedToCart[product].id, productsAddedToCart[product].quantity, productsAddedToCart[product].price))
                }

                //Initializing an array to get the param used to the POST request and adding it to orderIds
                let paramOrder = []

                //Set a loop for to get the type of product added and use it in the sending function, then change the localStorage and redirect
                for (let typeOfProduct in productsOrdered) {
                    paramOrder.push(typeOfProduct)
                    localStorage.setItem('paramOrder', JSON.stringify(paramOrder))

                    sending("http://localhost:3000/api/" + typeOfProduct + "/order", new FormSent(newContact, productsOrdered[typeOfProduct]))
                    .then(function () {
                        if(Object.keys(productsOrdered).length === orderIds.length) {
                            localStorage.setItem('confirm', JSON.stringify(confirm))
                            localStorage.removeItem('cart')
                            window.location.pathname = '/pages/order.html'
                        }
                    })
                }
            }
        })
            
    },
    
    //This function will build the cart if some products has been added, else the function redirect to the homepage
    displayCart: function () {
        if (JSON.parse(localStorage.getItem('cart') !== null)) {
            DomCart.buildCart()
            DomCart.buildTotalPrice()
            DomCart.buildForm()
        }
        else {
            setTimeout(function() { alert('Panier vide !\n\nVous allez être redirigé vers la page d\'accueil'); }, 500)
            setTimeout(function() { window.location.pathname = '/index.html'; }, 600)
            
        }
    }
}

window.onload = DomCart.displayCart()
