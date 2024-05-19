import MyContext from '@/context/MyContext';
import {Fragment, useContext} from 'react';
import { NumericFormat } from 'react-number-format';

const CartItems = ({cartItems}) => {
  const {setCart} = useContext(MyContext);

  let remove = indexToRemove => {
    let newItems = cartItems.filter((item, index) => {
        return index !== indexToRemove;
    });
    setCart(newItems);
  }
    
  return (
    <Fragment>
      {cartItems.map((item, index) => (
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="row mb-3" key={item.name}>
              <div className="col-4 p-0">
                <img src={item.imageUrl} alt={item.name} className='w-130'/>
              </div>
              <div className="col-4 text-center">
                <h4>{item.name}</h4>
                {item.productAddons && item.productAddons.length > 0 ?
                <Fragment>
                  <span className='text-decoration-underline'>Add Ons</span>
                  {item.productAddons.map(addon => (
                    <div key={addon.name}>{addon.name}</div> 
                  ))}
                </Fragment>
                :<Fragment/>}
              </div>
              <div className="col-4 text-center">
                <h4>
                  <NumericFormat 
                    value={item.totalPrice.toFixed(2)} 
                    displayType={'text'} 
                    thousandSeparator={true} 
                    prefix={'$'} 
                  />
                </h4>
              </div>
              <div className="col-4 p-0 mt-1">
                <button className="btn btn-outline-secondary w-130" onClick={() => remove(index)}>
                  Remove
                  </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">

          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default CartItems