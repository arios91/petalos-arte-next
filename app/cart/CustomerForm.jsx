import React from 'react'
import PhoneInput from 'react-phone-number-input/input'

const CustomerForm = ({customer, setCustomer}) => {
  return (
    <div className="col-12 col-md-6">
        <h4>1. Your Info</h4>
        <div className="form-group">
            <input 
                id="fullNameInput" 
                type="text" 
                name="fullName"
                placeholder='Full Name'
                className='form-control'
                value={customer.fullName}
                onChange={e => setCustomer({...customer, [e.target.name]: e.target.value})}
                required/>
        </div>
        <div className="form-group">
          <PhoneInput
              name="phone"
              country="US"
              value={customer.phone}
              placeholder='(123) 456-7890'
              className='form-control mt-3'
              onChange={(value) => setCustomer({...customer, phone: value})}
              rules={{required:true}}/>
        </div>
        <div className="form-group">
            <input type="email" 
                name="email" 
                id="emailInput" 
                className='form-control mt-3' 
                placeholder='Email'
                value={customer.email}
                onChange={(e) => setCustomer({...customer, [e.target.name]: e.target.value})}
                required/>
        </div>
    </div>
  )
}

export default CustomerForm