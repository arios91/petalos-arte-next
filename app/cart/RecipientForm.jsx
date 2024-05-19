import React from 'react'
import PhoneInput from 'react-phone-number-input/input'

const RecipientForm = ({recipient, setRecipient}) => {
  return (
    <div className="col-12 col-md-6 mt-3 mt-lg-0">
        <h4>2. Their Info</h4>
        <div className="form-group">
            <input type="text" 
                name="fullName" 
                id="recipientNameInput" 
                className='form-control'
                placeholder='Full Name'
                value={recipient.fullName}
                onChange={(e) => setRecipient({...recipient, [e.target.name]: e.target.value})}
                required/>
        </div>
        <div className="form-group">
            <PhoneInput 
                country="US"
                className='form-control mt-3'
                name="recipientPhoneNumber" 
                value={recipient.phone}
                onChange={(value) => setRecipient({...recipient, phone: value})}
                placeholder="(123) 456-7890"/>
        </div>
    </div>
  )
}

export default RecipientForm