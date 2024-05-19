import React, {useState, useEffect, Fragment} from 'react';
import {
    CardElement,
    useStripe,
    useElements
  } from "@stripe/react-stripe-js";
import { NumericFormat } from 'react-number-format';

const CheckoutForm = ({totalPrice, checkoutSuccess, apiPath, customer, cartItems}) => {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        let description = '';
        cartItems.forEach((item, index) => {
            if(index == cartItems.length - 1){
                description += `${item.name}`
            }else{
                description += `${item.name}, `
            }
        });

        let chargeObj = {totalPrice, customer, description};

        window.fetch(`${apiPath}/petalosarte/charge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({chargeObj})
        })
        .catch(err => {
            console.log(err);
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            setClientSecret(data.clientSecret)
        })


    }, []);

    const cardStyle = {
        style: {
            base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#32325d"
            }
            },
            invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if(payload.error){
            console.log(`ERROR: ${payload.error?.message}`)
            setError('Payment failed');
            setProcessing(false);
        }else{
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            setTimeout(() => {checkoutSuccess(payload), 2000});
        }
    }

    return (
        <Fragment>
            <form id='my-payment-form' onSubmit={handleSubmit}>
                <CardElement id='card-element' options={cardStyle} onChange={handleChange}/>
                <button 
                    className='btn btn-primary w-100 mt-3'
                    disabled={processing || disabled || succeeded}
                    id='submit'>
                    <span id="button-text">
                        {processing ?
                            <div className="spinner" id="spinner"></div>
                            : <Fragment>
                                Pay <NumericFormat value={totalPrice.toFixed(2)} prefix={'$'} displayType={'text'} thousandSeparator={true} />
                            </Fragment>
                        }
                    </span>
                </button>
                {error && <div className='card-error' role='alert'>{error}</div>}
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Payment succeeded, redirecting to your receipt
                </p>
            </form>
        </Fragment>
    )
}

export default CheckoutForm