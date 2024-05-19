"use client";
import { Fragment, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import MyContext from '@/context/MyContext';
import Modal from 'react-modal';
import Link from 'next/link'
import { NumericFormat } from 'react-number-format';
import balloonIcon from '../assets/balloon.png';
import bearIcon from '../assets/bear.png';
import chocolateIcon from '../assets/chocolate.png';


const page = () => {
    const {currentArrangement, currentAddons, away, addToCart} = useContext(MyContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderedBalloons, setOrderedBalloons] = useState(false);
    const router = useRouter();

    let [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if(!currentArrangement.name){
            router.push('/');
        }else{
            setTotalPrice(currentArrangement.price);
        }
    }, []);

    let toggleAddon = (e, itemName) => {
        currentAddons.forEach(item => {
            if(item.name == itemName){
                if(item.inCart){
                    setTotalPrice(totalPrice - item.price);
                }else{
                    setTotalPrice(totalPrice + item.price);
                }

                if(item.name === 'balloon'){
                    setOrderedBalloons(!orderedBalloons);
                }

                item.inCart = !item.inCart;
            }
        });
    }

    let toCart = (e) => {
        e.preventDefault();
        let productAddons = currentAddons.filter(addon => addon.inCart);
        let itemToAdd = {...currentArrangement, productAddons : productAddons, totalPrice: totalPrice};
        addToCart(itemToAdd);
        setModalOpen(true);
    }

    let getIconSource = (name) => {
        if(name == 'bear'){
            return bearIcon.src;
        }else if(name == 'balloon'){
            return balloonIcon.src;
        }else if(name == 'chocolates'){
            return chocolateIcon.src;
        }
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
            padding: '0'
          },
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-lg-6 p-0">
                    <img 
                        className="w-100" 
                        src={currentArrangement.imageUrl} 
                        alt={currentArrangement.name}
                    />
                </div>
                <div className="col-12 col-lg-6 px-0 px-lg-5 pt-lg-5">
                    <div className="card border-0">
                        <div className="card-body text-center p-0 d-flex flex-column">
                            <div className="row">
                                <div className="col-8 col-md-12 text-start">
                                    <h1>{currentArrangement.name}</h1>
                                </div>
                                <div className="col-4 col-md-12 text-end text-md-start fw-light">
                                    <h1 className='fw-light'>
                                    <NumericFormat value={totalPrice.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                    </h1>
                                </div>
                                <div className="col-9 text-start mt-2">
                                    <span>{currentArrangement.longDescription}</span>
                                </div>
                            </div>
                            
                            
                            {currentAddons.length > 0 ? 
                            <div className="pt-4">
                                <div className="row">
                                    <div className="col-12 text-start">
                                        <h3>Make it Special!</h3>
                                    </div>
                                </div>
                                <div className="row addonContainer mb-4">
                                    {currentAddons.map(item => (
                                        <Fragment key={item.id}>
                                            <div className={(`col-2 mx-2 addonCard`)} onClick={(e => {toggleAddon(e, item.name)})}>
                                                <button className={"btn btn-outline-secondary addonButton" + (item.inCart ? ' active' : '')}>
                                                    <img src={getIconSource(item.name)} alt={item.name} height={50}/>
                                                </button>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>: <Fragment/>
                            }
                            {orderedBalloons ? 
                                <div className="mt-4">
                                    Note: When ordering ballons, please add the occasion in the "special instructions" input in the cart before checking out in order to ensure proper balloon is used.
                                </div> 
                                : <Fragment/>
                            }
                            <div className="row">
                                <div className="col-12 col-lg-9">
                                    <button 
                                        className="align-self-end btn btn-primary btn-block mt-auto mb-1 mt-4 w-100"
                                        disabled={away}
                                        onClick={(e => toCart(e))}>
                                            Add To Cart
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal 
                ariaHideApp={false}
                isOpen={isModalOpen}
                style={modalStyle}>
                <div className="container text-center p-0">
                    <div className="row my-2 text-center">
                        <div className="col-12 mx-0">
                            <h6>Successfully Added to Cart!</h6>
                        </div>
                    </div>
                    <hr></hr>
                    <div className="row mb-3 text-right">
                        <div className="col-12">
                            <Link className="btn btn-secondary mx-2"
                                href='/'>
                                Continue Shopping
                            </Link>
                            <Link className={"btn btn-primary mx-2" + (away ? ' disabled' : '')}
                                href='/cart'>
                                Go To Cart
                            </Link>

                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default page