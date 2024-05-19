import React from 'react'
import {Sacramento} from 'next/font/google'

const sac = Sacramento({subsets: ['latin'], weight: '400'});

const Header = () => {
  return (
    <div id="header" className="container text-center">
        <div className="row headerRow">
            <div className="col-12 col-lg-3 headerSubscript d-none d-lg-block">
                <span>
                    Locally owned flower shop in Palmview, TX
                </span>
            </div>
            <div className="col-12 col-lg-6 headerMain">
                <span className={sac.className}>
                    Petalos y Arte        
                </span>
            </div>
            <div className="col-12 col-lg-3  headerSubscript d-none d-lg-block">
                <span>Providing same day flower delivery for the valley</span>
            </div>
        </div>
    </div>
  )
}

export default Header