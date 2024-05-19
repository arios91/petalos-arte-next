"use client";
import { useContext } from 'react';
import MyContext from '@/context/MyContext';
import PropTypes from 'prop-types';
import Link from 'next/link'

const ArrangementCard = ({arrangement}) => {
    const {handleArrangementSelect} = useContext(MyContext)

    let formatPrice = () => {
        let formatted = arrangement.price.toString();
        if(!formatted.includes('.')){
            formatted = `${formatted}.00`
        }

        return `$${formatted}`
    }

    return (
        <div className="col-6 col-md-4 arrangementCard">
            <Link href='/viewItem' className="arrangementContainer card mb-4 " onClick={e => handleArrangementSelect(arrangement)}>
                <div className="arrangementDiv">
                    <img src={arrangement.imageUrl} alt="arrangement image" className='dashboardArrangementImage' style={{aspectRatio: 6/7}} />
                </div>
                <div className="card-body row arrangementCardDetails">
                    <h6 className="col-12 pb-2 arrangementTitle">{arrangement.name}</h6>
                    <p className="col-12 mb-0">{formatPrice()}</p>
                </div>
            </Link>
        </div>
    )
}

ArrangementCard.propTypes ={
    itarrangementem: PropTypes.object
}

export default ArrangementCard