"use client";
import {useContext} from 'react';
import MyContext from '@/context/MyContext';
import testImg from '../assets/20240512_173209.jpg'

const DashHeader = () => {
    const {away, awayMessage, notice, noticeMessage} =  useContext(MyContext);
    return (
        <>
            {away && <div className="col-12 text-center mb-4 awayMessage">
                <h4>{awayMessage}</h4>
            </div>}
            {notice && <div className="col-12 text-center mb-4 noticeMessage">
                <h6>{noticeMessage}</h6>
            </div>}
            <div className="col-12">
                {/* <img className="mainImage" src="https://images.pexels.com/photos/428611/bouquet-roses-colorful-floral-428611.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb" alt="Header Image" /> */}
                <img className="mainImage" src={testImg.src} alt="Header Image" />
            </div>
        </>
    )
}

export default DashHeader