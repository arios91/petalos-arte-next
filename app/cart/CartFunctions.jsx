import axios from 'axios';
const discountChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function buildReceipt(isDelivery, deliveryDate, recipient, deliveryAddress, cartItems, details, totalPrice, paymentId, apiPath){
    let receipt = getDeliveryDateInfo(isDelivery, deliveryDate);
    receipt += getDeliveryPersonInfo(isDelivery, recipient, deliveryAddress, false);
    receipt += getOrderInfo(cartItems, totalPrice)
    if(details.cardMessage !== '' || details.instructions !== ''){
        receipt += getAdditionalInfo(details);
    }
    receipt += getDiscountInfo(totalPrice, apiPath);
    receipt += closeTable(paymentId);
    return receipt;
}

export function buildOrderEmail(isDelivery, deliveryDate, recipient, deliveryAddress, customer, cartItems, details, totalPrice, paymentId){
    let orderEmail = getDeliveryDateInfo(isDelivery, deliveryDate);
    orderEmail += getDeliveryPersonInfo(isDelivery, recipient, deliveryAddress, true);
    orderEmail += getContactPersonInfo(customer);
    orderEmail += getOrderInfo(cartItems, totalPrice)
    if(details.cardMessage !== '' || details.instructions !== ''){
        orderEmail += getAdditionalInfo(details);
    }
    orderEmail += closeTable(paymentId);
    return orderEmail;
}

export function getDeliveryDateInfo(isDelivery, deliveryDate){
    let deliveryDateInfo = `
        <table style="width: 90%;" align="center">
        <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">${isDelivery ? 'Delivery' : 'Pickup'} Date:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${deliveryDate.getMonth() + 1}/${deliveryDate.getDate()}/${deliveryDate.getFullYear()}</td>
        
        </tr>`;


    return deliveryDateInfo;
}

export function getDeliveryPersonInfo(isDelivery, recipient, deliveryAddress, emailBody){
    let deliveryInfo = `
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">${isDelivery ? 'Deliver To' : 'For'}:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${recipient.fullName}</td>
    </tr>`;

    if(isDelivery){
        

        deliveryInfo += `
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Street Address:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${deliveryAddress.address}</td>
            
        </tr>`;

        if(emailBody){
            let spacer = '%20';
            let mapString = deliveryAddress.address.split(' ').join(spacer);
            mapString += ',' + spacer + deliveryAddress.city + ',' + spacer + 'TX' + spacer + deliveryAddress.zip;
            deliveryInfo += `
            <tr>
                <td style="width: 35%; text-align:right; font-weight: bold;">Mapa:</td>
                <td style="width: 65%; text-align:left; padding-left: 25px;"><a href="http://maps.google.com/?q=${mapString}">${deliveryAddress.address}</a></td>
            </tr>`;
        }
        deliveryInfo += `
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">City, State, Zip:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${deliveryAddress.city}, TX ${deliveryAddress.zip}</td>
        </tr>`;
    }

    deliveryInfo += `
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">Phone:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${recipient.phone}</td>
    </tr>`;

    return deliveryInfo;
}

export function getContactPersonInfo(customer){
    let contactInfo = 
    `<tr>
        <td>
            <br/>
        </td>
    </tr>
    
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">Customer Name:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${customer.fullName}</td>
    </tr>
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">Customer Phone:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${customer.phone}</td>
    </tr>
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">Customer Email:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${customer.email}</td>
    </tr>
    
    <tr>
        <td>
            <br/>
        </td>
    </tr>`;

    return contactInfo;
}
export function getOrderInfo(cartItems, totalPrice){
    let orderInfo = '';

    for(let product of cartItems){
        orderInfo += `
        <tr>
            <td style="width: 35%; text-align:right; font-weight: bold;">Product Details:</td>
            <td style="width: 65%; text-align:left; padding-left: 25px;">${product.name}</td>
        </tr>`
        for(let addon of product.productAddons){
            orderInfo += `
            <tr>
                <td style="width: 35%; text-align:right; font-weight: bold;">Addons:</td>
                <td style="width: 65%; text-align:left; padding-left: 25px;">${addon.name}</td>
            </tr>`;
            }
    }

    orderInfo += `
    <tr>
    <td style="width: 35%; text-align:right; font-weight: bold;">Total Price:</td>
    <td style="width: 65%; text-align:left; padding-left: 25px;">$${totalPrice}</td>
    </tr>`

    return orderInfo;

}
export function getAdditionalInfo(details){
    let info = 
    `<tr>
        <td>
        <br/>
        </td>
    </tr>
    ${details.cardMessage !== '' ? `
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">Card Message:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${details.cardMessage}</td>
    </tr>`: ``}
    ${details.instructions !== '' ? `
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">Special Instructions:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${details.instructions}</td>
    </tr>`: ``}`;

    return info;
}

export function getDiscountInfo(totalPrice, apiPath){
    let discountCode = '';
    let discountAmount = 0;

    for (var i = 0; i < 7; i++){
        discountCode += discountChars.charAt(Math.floor(Math.random() * discountChars.length));
    }

    if(totalPrice > 149){
        discountAmount = 15;
    }else if(totalPrice > 99){
        discountAmount = 10;
    }else if(totalPrice){
        discountAmount = 5;
    }

    axios.post(`${apiPath}/petalosarte/createDiscountCode`, {discountCode, discountAmount});

    let discountInfo = `
    <tr>
        <td>
        <br/>
        </td>
    </tr>
    <tr>
        <td style="width: 35%; text-align:right; font-weight: bold;">${discountAmount}% Discount Code:</td>
        <td style="width: 65%; text-align:left; padding-left: 25px;">${discountCode}</td>
    </tr>`;

    return discountInfo;
}

export function closeTable(paymentIntent){
    var cardToken = paymentIntent.substring(paymentIntent.length - 6, paymentIntent.length);
    let info = `
    <tr>
    <td style="width: 35%; font-weight: bold; text-align:right;">Confirmation Code:</td>
    <td style="width: 65%; text-align:left; padding-left: 25px;">${cardToken}</td>
    </tr>
    </table>`
    return info;
}