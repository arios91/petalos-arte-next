"use client";
import MyContext from '@/context/MyContext';
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react';

const ReceiptPage = () => {
    const router = useRouter();
    const {receipt, setReceipt} = useContext(MyContext);
    const [localReceipt, setLocalReceipt] = useState('');
    useEffect(() => {
        if(!receipt || receipt == ''){
            router.push('/')
        }
        setLocalReceipt(receipt);
        setReceipt('');
    }, [])


  return (
    <div className="container">
        <div className="row">
            <div className="col-12 col-lg-2"></div>
            <div className="col-12 col-lg-10">
            <div dangerouslySetInnerHTML={{ __html: localReceipt}} />
            </div>
        </div>
    </div>
  )
}

export default ReceiptPage