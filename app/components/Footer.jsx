import {BsTelephone} from 'react-icons/bs'
import {SiGooglemaps} from 'react-icons/si'


const Footer = () => {
  return (
    <div id="footer"  className="container footer">
        <div className="row">
            <div className="col-6 text-start contact-icons">
                <a href="tel:+1-956-607-6047" className="footerContent mx-1"><BsTelephone/></a>

                <a href="https://goo.gl/maps/v2TucsdmAw22" target='_blank' className='mx-1'><SiGooglemaps/></a>

                <div className="fb-like"
                    data-href="https://www.facebook.com/Petalos-y-Arte-Flower-Shop-362503580513879/" data-width="300"
                    data-layout="button_count" data-action="like" data-size="large" data-show-faces="false" data-share="false">
                </div>
            </div>
            <div className="col-6 text-end">
                <p className="text-muted">Version 24.4.20</p>

            </div>
        </div>

    </div>
  )
}

export default Footer