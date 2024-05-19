"use client";
import MyContext from '@/context/MyContext'
import { useRouter } from 'next/navigation'
import { Fragment, useContext, useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CartItems from './CartItems';
import CustomerForm from './CustomerForm';
import RecipientForm from './RecipientForm';
import { NumericFormat } from 'react-number-format';
import axios from 'axios';
import Modal from 'react-modal';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import flower from '../assets/flower.png'
import {buildReceipt, buildOrderEmail} from './CartFunctions'


const CartPage = () => {
  const taxRate = .0825;
  

  
  
  const {cartItems, settings, deliveryZones, discounts, away, setCart, setReceipt} = useContext(MyContext);
  const router = useRouter();
  
  //const promise = loadStripe(settings.get('stripeDevKey'))
  const promise = loadStripe(settings.get('stripePublicKey'))
  const apiPath = settings.get('apiPath');
  //const apiPath = 'http://localhost:8080'
  const [isDelivery, setIsDelivery] = useState(true);
  const [customer, setCustomer] = useState({fullName: '', firstName: '', lastName: '', phone: '', email: ''});
  const [recipient, setRecipient] = useState({fullName: '', firstName: '',lastName: '', phone: ''});
  const [deliveryAddress, setDeliveryAddress] = useState({address: '', city: '', zip: ''});
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [deliveryZone, setDeliveryZone] = useState({price: 0});
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [details, setDetails] = useState({cardMessage: '', instructions: ''})
  const [show, setShow] = useState(false);
  const [sendToReceipt, setSendToReceipt] = useState(false);
  const [orderEmail, setOrderEmail] = useState('');

  useEffect(() => {
    if(away){
      router.push('/')
    }

    if(sendToReceipt){
      setCart([])
      setSendToReceipt(false);
      axios.post(`${apiPath}/email/sendEmail`, {
          emailBody: orderEmail,
          subject: 'Order In',
          toEmail: 'alx.rios91@gmail.com',
          fromEmail: 'order_in'
      });
      router.push('/receipt');
    }

    if(!deliveryDate){
      setDeliveryDate(new Date());
    }

    if(deliveryDate.getHours() >= settings.get('cutoffTime')){
        let tmpDate = new Date(deliveryDate);
        tmpDate.setDate(deliveryDate.getDate() + 1);
        setDeliveryDate(tmpDate)
        setMinDate(tmpDate)
    }

    if(cartItems.length > 0){
      calculateTotal();
    }
  }, [cartItems, sendToReceipt, discountApplied]);

  let calculateTotal = () => {
    let tmpSubtotal = 0;

    cartItems.forEach(item => {
      tmpSubtotal += item.price;
      if(item.productAddons.length > 0){
        item.productAddons.forEach(addon => {
          tmpSubtotal += addon.price;
        })
      }
    });

    if(discountApplied){
      let discountAmount = tmpSubtotal * (promoCode.discountAmount / 100);
      setDiscountAmount(discountAmount)
      tmpSubtotal = tmpSubtotal - discountAmount;
    }

    setSubTotal(tmpSubtotal);

    let tmpTaxes = tmpSubtotal * taxRate;
    setTaxes(tmpTaxes);
    
    setTotalPrice(Math.round(((tmpSubtotal + tmpTaxes) + Number.EPSILON) * 100) / 100)
  }

  let submitForm = async(e) => {
    e.preventDefault();

    if(!isDelivery){
      setShow(true);
    }else{
      let validZip = false;
      for(let zone of deliveryZones){
        if(zone.active){
          for(let zip of zone.zips){
            if(zip == deliveryAddress.zip){
              validZip = true;
              break;
            }
          }
        }
      }
      if(validZip){
        setShow(true);
      }else{
        alert('We are currently not servicing the delivery zip code you input, thank you for your understanding.')
      }
    }
  }

  let checkoutSuccess = (payload) => {
    setShow(false);
    buildReceiptAndOrderEmail(payload.paymentIntent);

    if(discountApplied){
      axios.post(`${apiPath}/petalosarte/removeDiscountCode/${promoCode.id}`);
    }
    
    cartItems.forEach(item => {
        axios.post(`${apiPath}/petalosarte/incrementPopularity/${item.id}`);
    })

    setSendToReceipt(true);
  }

  let buildReceiptAndOrderEmail = (paymentIntent) => {
    let receipt = buildReceipt(isDelivery, deliveryDate, recipient, deliveryAddress, cartItems, details, totalPrice, paymentIntent.id, apiPath);
    let orderEmail = buildOrderEmail(isDelivery, deliveryDate, recipient, deliveryAddress, customer, cartItems, details, totalPrice, paymentIntent.id);

      setReceipt(receipt);
      setOrderEmail(orderEmail);
  }

  let onDeliveryChange = e => {
    if(e.target.value === 'pickup' || e.target.name == 'pickup'){
      setIsDelivery(false);
      setDeliveryAddress({address: '', city: '', zip: ''});
      removeDeliveryFee();
    }else{
        setIsDelivery(true);
    }
  }

  let handleZipChange = value => {
    setDeliveryAddress({...deliveryAddress, zip: value});
    let result = deliveryZones.filter(zone => zone.zips.includes(value));
    
    if(result.length > 0){
        setDeliveryZone(result[0]);
        setTotalPrice(Math.round(((subTotal + taxes + result[0].price) + Number.EPSILON) * 100) / 100)
    }else{
        removeDeliveryFee();
    }
  }

  let handleDiscountApplied = (e) => {
    e.preventDefault();
    if(discountApplied){
        setDiscountCode('');
        setPromoCode({});
        setDiscountApplied(false);
    }else{
        if(!promoCode || promoCode.length < 5){
            alert('please enter valid promo code')
        }else{
            let tmpDiscount = discounts.filter(discount => discount.discountCode === discountCode);
            if(tmpDiscount.length > 0){
                tmpDiscount = tmpDiscount[0];
                setPromoCode(tmpDiscount);
                setDiscountApplied(true)
            }else{
                alert('Please enter a valid promo code');
            }
        }
    }
}

  let removeDeliveryFee = () => {
    setDeliveryZone({price: 0});
    setTotalPrice(Math.round(((subTotal + taxes) + Number.EPSILON) * 100) / 100);
  }

  let isDeliveryDay = date => {
    const day = date.getDay(date);
    return day !== 0;
  }

  let testFunc =  e => {
    console.log('test');
    setShow(false);
  }

  let modalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'none',
        borderRadius: '10px',
        minWidth: '25%',
        padding: '0',
        zIndex: '10',
      },
}


  return (
    <div className="wrapper container mh-77-83">
      {!cartItems || cartItems.length == 0 ? 
      <div className="row text-center h-25">
        <div className="col-12 mt-auto">
          <h2>You have no items in your cart</h2>
        </div>
      </div>
      :
      <Fragment>
        <CartItems cartItems={cartItems}/>
        <div className="mt-5">
          <form onSubmit={submitForm}>
            <div className="row">
              <CustomerForm customer={customer} setCustomer={setCustomer}/>
              <RecipientForm recipient={recipient} setRecipient={setRecipient}/>
            </div>
            <div className="row text-start text-md-center mt-3">
              <div className="col-12">
                <h4>3. Delivery Options</h4>
              </div>
              <div className="col-12">
                <div className="btn-group btn-group-sm mb-1" role='group' onChange={(e) => onDeliveryChange(e)}>
                  <input type="radio" className="btn-check" name="delivery" id="btnradio1" autocomplete="off" checked={isDelivery} onChange={(e) => e.preventDefault()}/>
                  <label className="btn btn-outline-custom" for="btnradio1">Delivery</label>

                  <input type="radio" className="btn-check" name="pickup" id="btnradio2" autocomplete="off" checked={!isDelivery} onChange={(e) => e.preventDefault()}/>
                  <label className="btn btn-outline-custom" for="btnradio2">Pickup</label>
                </div><br/>
                {isDelivery ? 
                  <Fragment>
                      <span className='text-muted'>{settings.get('deliveryDateMessage')}</span><br/>
                  </Fragment>
                  :
                  <Fragment>
                      <span className='text-muted'>{settings.get('pickupMessage')}</span><br/>
                  </Fragment>
                }
                <div className="form-grou mt-3">
                  <label htmlFor="deliveryDate">{isDelivery ? 'Delivery Date' : 'Pickup Date'}</label>
                    <DatePicker
                      filterDate={isDeliveryDay}
                      minDate={minDate}
                      selected={deliveryDate}
                      className='form-control text-center'
                      placeholder='test'
                      onChange={(date) => setDeliveryDate(date)}
                    />
                </div>
                <div className="row">
                  {isDelivery ?
                  <Fragment>
                    <div className="col-12 col-md-4 mt-3">
                      <input 
                          type="text" 
                          className='form-control' 
                          name="address" 
                          id="addressInputId"
                          placeholder='Address'
                          value={deliveryAddress.address}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, [e.target.name]: e.target.value})} 
                          required/>
                    </div>
                    <div className="col-6 col-md-4 mt-3">
                        <input 
                            type="text" 
                            name="city" 
                            id="cityInput"
                            placeholder='City'
                            className='form-control'
                            value={deliveryAddress.city}
                            onChange={(e) => setDeliveryAddress({...deliveryAddress, [e.target.name]: e.target.value})} 
                            required/>
                    </div>
                    <div className="col-6 col-md-4 mt-3">
                      <input 
                          type="text" 
                          name="addrZip" 
                          id="zipInput"
                          placeholder='ZIP'
                          className='form-control'
                          value={deliveryAddress.zip}
                          onChange={(e) => handleZipChange(e.target.value)}
                          required/>
                    </div>
                  </Fragment>
                  :<Fragment/>}
                  <div className="form-group col-12 col-lg-6 mt-3">
                    <input 
                        type="text" 
                        name="cardMessage" 
                        className='form-control'
                        placeholder='Card Message'
                        value={details.cardMessage}
                        onChange={(e) => setDetails({...details, [e.target.name]: e.target.value})}
                        id="cardMessageInput" />
                  </div>
                  <div className="form-group col-12 col-lg-6 mt-3">
                      <input 
                          type="text" 
                          name="instructions"
                          className='form-control'
                          placeholder='Special Instructions'
                          value={details.instructions}
                          onChange={(e) => setDetails({...details, [e.target.name]: e.target.value})}
                          id="specialInstructionsInput" />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <h4>4. Review Order</h4>
              </div>
              <div className="col-12 formContainer">
                <div className="col-12 mt-2">
                  <input type="text" 
                      name="discountCode" 
                      id="discountCodeInput"
                      placeholder='Promo Code'
                      className='promo-input'
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value)}/>
                  <button type='button'
                      name='discountButton'
                      onClick={handleDiscountApplied}
                      className='btn btn-outline-custom btn-sm'>
                      {discountApplied ? 'Remove' : 'Apply'}
                  </button>
                </div>
                {discountApplied && <div className='col-12'>Discount: <NumericFormat value={discountAmount.toFixed(2)} prefix={'$'} displayType={'text'} thousandSeparator={true} /></div>}
                <div className="col-12">
                  Subtotal: <NumericFormat value={subTotal.toFixed(2)} prefix={'$'} displayType={'text'} thousandSeparator={true} />
                </div>
                <div className="col-12">
                  Taxes: <NumericFormat value={taxes.toFixed(2)} prefix={'$'} displayType={'text'} thousandSeparator={true} />
                </div>
                <div className="col-12">
                  Delivery Fee: <NumericFormat value={deliveryZone.price.toFixed(2)} prefix={'$'} displayType={'text'} thousandSeparator={true} />
                </div>
                <div className="col-12">
                  Total: <NumericFormat value={totalPrice.toFixed(2)} prefix={'$'} displayType={'text'} thousandSeparator={true} />
                </div>
              </div>
            </div>
            <input type="submit" value="Check Out" className='btn btn-primary w-100 mt-2 mb-2'/>
          </form>
        </div>
      </Fragment>
      }
      <Modal isOpen={show} 
        ariaHideApp={false} 
        style={modalStyle}
        onRequestClose={testFunc}>
        <div className="container paymentModal modalContainer">
          <div className="row text-center">
            <div className="col-12 modal-title">
              <div className="col">
                <div className="modalImage">
                  <img src={flower.src} alt="" />
                </div>
                <div className="col modalHeader">
                  Petalos y Arte Flower Shop
                </div>
                <div className="col">
                  {cartItems.map((item, index) => {
                    return(
                      <div key={index}>{item.name}</div>
                    );
                  })}
                </div>
                <div className="col-12 modal-email py-1">
                  {customer.email}
                </div>
              </div>
            </div>
            <div className="col-12 pt-4 mb-3">
              <Elements stripe={promise}>
                <CheckoutForm 
                  totalPrice={totalPrice} 
                  checkoutSuccess={checkoutSuccess} 
                  apiPath={apiPath} 
                  customer={customer} 
                  cartItems={cartItems}/>
              </Elements>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CartPage