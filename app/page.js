"use client";
import {useContext, useState, useEffect} from 'react';
import MyContext from '@/context/MyContext';
import ArrangementCard from './components/ArrangementCard';
import DashHeader from './components/DashHeader';
import "bootstrap-icons/font/bootstrap-icons.css";

const HomePage = () => {
  const itemsPerPage = 12
  const sortList= [
      {name: 'new', label: 'Newest'},
      {name: 'popular', label: 'Most Popular'},
      {name: 'price1', label: 'Price: High to Low'},
      {name: 'price2', label: 'Price: Low to High'},
  ];
  const [currentSort, setCurrentSort] = useState(sortList[0].name);
  const [arrangementPages, setArrangementPages] = useState([]);

  const {
    arrangements,
    currentPage,
    handlePageNavigation
  } =  useContext(MyContext);
  

  useEffect(() => {
    handleSort();
  }, [arrangements, currentSort]);

  const handleSort = () => {
    if(currentSort == 'new'){
        arrangements.sort((a,b) => b.id - a.id);
    }else if(currentSort == 'popular'){
        arrangements.sort((a,b) => b.popularity - a.popularity);
    }else if(currentSort == 'price1'){
        arrangements.sort((a,b) => b.price - a.price);
    }else if(currentSort == 'price2'){
        arrangements.sort((a,b) => a.price - b.price);
    }
    let counter = 0;
    let page = [];
    let docs = []
    arrangements.forEach(doc => {
        if(counter == itemsPerPage){
            docs.push(page);
            page = [];
            counter = 1;
            page.push({...doc});
        }else{
            page.push({...doc});
            counter++;
        }
    })
    if(page.length > 0){
        docs.push(page);
    }
    setArrangementPages(docs);
  }

  let onNavButtonClick = (e) => {
    if(e.target.name === 'prevButton'){
        if(currentPage > 0){
            handlePageNavigation(currentPage - 1);
            window.scrollTo(0,0);
        }
    }else if(e.target.name === 'nextButton'){
        if(currentPage < arrangementPages.length - 1){
            handlePageNavigation(currentPage + 1);
            window.scrollTo(0,0);
        }
    }
  }

  let onPageClick = (e) => {
    e.preventDefault();
    let newPage = e.target.text - 1;
    if(newPage !== currentPage){
        handlePageNavigation(newPage)
        window.scrollTo(0,0);
    }
  }

  let pageButtons = arrangementPages.map((page, index) => (
    <li className={index == currentPage ? 'pageItem active' : 'pageItem'} onClick={onPageClick} key={index}>
        <a className='pageLink'>{index + 1}</a>
    </li>
  ));

  // TODO: bring in loading 
  return (
    <div className='container'>
      <div className="row">
        <DashHeader/>
        <div className="col-12 my-3">

          {/* Sort Widget*/}
          <div className="row mb-3">
            <div className="col-3 col-md-4"></div>
            <div className="col-3 col-md-4"></div>
            <div className="col-6 col-md-4 text-end">
              <select className='custom-select' onChange={e => setCurrentSort(e.target.value)}>
                {sortList.map(sort => (
                    <option key={sort.name} value={sort.name}>{(currentSort == sort.name ? '' : '') + sort.label }</option>
                ))}
              </select>
            </div>
          </div>

          {/* Arrangements */}
          <div className="row">
            {arrangementPages[currentPage]?.map(item => (
              <ArrangementCard key={item.id} arrangement={item}/>
            ))}
          </div>

          {/* Bottom Pagination */}
          <div className="row text-center">
            <div className="col-12 ">
                <ul className='pagination'>
                    <li className={currentPage == 0 ? 'pageItem disabled' : 'pageItem'}>
                        <a name='prevButton' className='pageLink' onClick={onNavButtonClick}>Previous</a>
                    </li>
                    {pageButtons}
                    <li className={currentPage == arrangementPages.length-1 ? 'pageItem disabled' :'pageItem'}>
                        <a name='nextButton' className='pageLink' onClick={onNavButtonClick}>Next</a>
                    </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;