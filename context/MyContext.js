"use client";
import { createContext, useEffect, useReducer } from "react";
import useFirestore from "@/firebase/useFirestore";
import contextReducer from "./ContextReducer";

/* export const MyContext = createContext({}) */

const MyContext = createContext();

export const ContextProvider = ({children}) => {
    const {arrangements} = useFirestore('arrangements');
    const {addons} = useFirestore('addons')
    const {settings} = useFirestore('settings');
    const {discounts} = useFirestore('discounts');
    const {deliveryZones} = useFirestore('deliveryZones');
    
    
    const inititalState = {
        cartItems: [],
        currentPage: 0,
        currentArrangement: {},
        currentAddons: [],
        awayMessage: '',
        away: false,
        noticeMessage: '',
        notice: false,
        isLoading: true,
        receipt: ''
    }

    const [state, dispatch] = useReducer(contextReducer, inititalState);

    useEffect(() => {
        if(settings.size === 0 || addons.length === 0 || arrangements.length === 0){
            dispatch({
                type: 'SET_LOADING',
                payload: true
            })
        }else{
            dispatch({
                type: 'SET_AWAY_MESSAGE',
                payload: settings.get('awayMessage')
            })
            dispatch({
                type: 'SET_NOTICE_MESSAGE',
                payload: settings.get('noticeMessage')
            })

            let beginDate = new Date(0);
            beginDate.setUTCSeconds(settings.get('beginAwayDate').seconds);

            let endDate = new Date(0);
            endDate.setUTCSeconds(settings.get('endAwayDate').seconds);


            let noticeBeginDate = new Date(0);
            noticeBeginDate.setUTCSeconds(settings.get('beginNoticeDate').seconds);

            let noticeEndDate = new Date(0);
            noticeEndDate.setUTCSeconds(settings.get('endNoticeDate').seconds);

            
            let currentDate = new Date();
            let awayBool = false;
            if(currentDate >= beginDate && currentDate <= endDate){
                awayBool = true;
            }
            dispatch({type: 'SET_AWAY', payload: awayBool})

            let noticeBool = false;
            if(currentDate >= noticeBeginDate && currentDate <= noticeEndDate){
                noticeBool = true;
            }
            dispatch({type: 'SET_NOTICE', payload: noticeBool})
            

            dispatch({type: 'SET_LOADING', payload: false})
        }
    }, [settings, arrangements, addons, deliveryZones, discounts])

    const handlePageNavigation = newPage => {
        dispatch({
            type: 'SET_CURRENT_PAGE',
            payload: newPage
        })

    }



    const handleArrangementSelect = arrangement => {
        if(arrangement.addonNames && arrangement.addonNames.length > 0){
            let tmpAddons = addons.filter(addon => arrangement.addonNames.includes(addon.name));
            tmpAddons = tmpAddons.map(addon => {
                return {...addon, inCart: false}
            })
            dispatch({
                type: 'SET_CURRENT_ADDONS',
                payload: tmpAddons
            })
        }else{
            dispatch({
                type: 'SET_CURRENT_ADDONS',
                payload: []
            })
        }
        dispatch({
            type: 'SET_CURRENT_ARRANGEMENT',
            payload: arrangement
        })
    }

    const addToCart = (item) => {
        //if no item, alert somehow
        if(item){
            dispatch({
                type: 'ADD_TO_CART',
                payload: item
            })
        }else{
          alert('Error adding item to your cart')
        }
    }

    const setCart = newItems => {
        dispatch({
            type: 'SET_CART',
            payload: newItems
        })
    }

    const setReceipt = receipt => {
        dispatch({
            type: 'SET_RECEIPT',
            payload: receipt
        })
    }


    return <MyContext.Provider value = {{
        ...state,
        settings,
        arrangements,
        addons,
        deliveryZones,
        discounts,
        handlePageNavigation,
        handleArrangementSelect,
        addToCart,
        setCart,
        setReceipt
    }}>
        {children}
    </MyContext.Provider>
}

export default MyContext