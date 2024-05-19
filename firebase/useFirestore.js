import { getFirestore, collection, getDocs, query, doc, onSnapshot, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { projectFirestore } from './config';

const useFirestore = (col) => {
  
  const [arrangements, setArrangements] = useState([]);
  const [addons, setAddons] = useState([]);
  const [deliveryZones, setDeliveryZones] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [settings, setSettings] = useState(new Map());
  const itemsPerPage = 12;

  let setDocs = (documents, col) => {
    if(col === 'addons'){
      setAddons(documents);
    }else if(col === 'arrangements'){
      setArrangements(documents);
    }else if(col === 'deliveryZones'){
      setDeliveryZones(documents)
    }else if(col ==='discounts'){
      setDiscounts(documents);
    }else if(col === 'settings'){
      let tmpMap = new Map();
      documents.forEach(doc => {
        return tmpMap.set(doc.name, doc.value);
      })
      setSettings(tmpMap);
    }
  }

  useEffect(() => {
    let collectionRef = collection(projectFirestore, col);

    let q = query(collectionRef)
    if(col === 'arrangements'){
        q = query(collectionRef, where("active", "==", true));
      }
    if(col === 'addons'){
      q = query(collectionRef, where("active", "==", true));
    }

    console.log(`getting:  ${col}`)

    const unsub = onSnapshot(q, (snap) => {
        let documents = [];
        snap.forEach(doc => {
          documents.push({...doc.data(), id: doc.id});
        });
        setDocs(documents, col);
    })

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [col]);

  return { arrangements, addons, deliveryZones, discounts, settings };
}

export default useFirestore;