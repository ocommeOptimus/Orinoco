const DomOrder = {
    order: document.getElementById('order'),
    orderTemplate: document.getElementById('template-order'),
    orderList: document.getElementById('order-list'),
    orderTemplateList: document.getElementById('template-order-list'),
    
    //This function will show the info stocked in localStorage in the previous pages thanks to a template
    buildOrderText: function () {
        let contact                     = JSON.parse(localStorage.getItem('contact'))
        let orderId                     = JSON.parse(localStorage.getItem('orderId'))

        const orderTemplate             = document.importNode(DomOrder.orderTemplate.content, true)
        
        let orderRefList                = orderTemplate.getElementById('order-refs')
        let orderContact                = orderTemplate.getElementById('order-contact')
        let orderEmail                  = orderTemplate.getElementById('order-email')
        
        //Set a loop for to show the ref of product
        for (let i in orderId) {
            let newRef = document.createElement('li');
            newRef.textContent = `${orderId[i].param[i]} : ${orderId[i].id}`;
            orderRefList.appendChild(newRef);
        }

        orderContact.innerHTML          = contact.firstName + ' ' + contact.lastName
        
        orderEmail.innerHTML            = contact.email

        DomOrder.order.appendChild(orderTemplate)

        DomOrder.buildOrderList()

    },

    //This function will show the product info and set the total price
    buildOrderList: function () {
        let orderConfirmation           = JSON.parse(localStorage.getItem('confirm'))
        let finalPriceOrder             = 0

        //Set a loop forEach to set a template for each products selected
        orderConfirmation.forEach((c) => {
            const orderProductTemplate  = document.importNode(DomOrder.orderTemplateList.content, true)
            let orderImage              = orderProductTemplate.getElementById('order-image')
            let orderTitle              = orderProductTemplate.getElementById('order-title')
            let orderProductPrice       = orderProductTemplate.getElementById('order-price')
            let orderProductTotal       = orderProductTemplate.getElementById('order-product-total')

            orderImage.src              = c.imgUrl
            orderImage.alt              = 'Image de ' + c.name
            orderImage.title            = 'Image de ' + c.name
            
            orderTitle.innerHTML        = c.name
            
            orderProductPrice.innerHTML = 'Prix : ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(c.price/100))
            orderProductQuantity        = orderProductTemplate.getElementById('order-quantity')
            orderProductQuantity.innerHTML = 'Quantité : ' + c.quantity
            
            orderProductTotal.innerHTML = 'Prix total pour cet article : ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((c.quantity * c.price)/100))
            
            DomOrder.orderList.appendChild(orderProductTemplate)
        })


        for (let i in orderConfirmation) {
            finalPriceOrder             += orderConfirmation[i].price * orderConfirmation[i].quantity
        }

        let orderTotal                  = document.getElementById('order-total')
        orderTotal.innerHTML            = 'Prix de votre commande : ' + (new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(finalPriceOrder/100))
    }
}
window.onload = DomOrder.buildOrderText()