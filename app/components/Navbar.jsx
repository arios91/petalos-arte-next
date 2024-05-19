
"use client"
import {useContext} from 'react';
import Link from 'next/link'
import MyContext from '@/context/MyContext';

const Navbar = () => {
    const {away} =  useContext(MyContext);

    return (
        <div className="container mb-3 headerRow">
            <div className="row mb-2 mt-2">
                <Link href='/' className='nav-item nav-link col-6 text-center'>
                    <h5 className="headerLinkText">Home</h5>
                </Link>
                <Link href='/cart' className={'nav-item nav-link col-6 text-center' + (away ? ' disabled' : '')}>
                    <h5 className="headerLinkText">Cart</h5>
                </Link>
            </div>
        </div>
    )
}

export default Navbar