import React from 'react';
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/appstore.png";
import "./Footer.css";



const Footer = () => {
  return (
    <footer id='footer'>
        <div className='leftFooter'>
            <h4 id='kk'>Download Our App for Android and IOS</h4>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="appstore" />
        </div>
        <div className='midFooter'>
            <h1>AMAZON</h1>
            <p>Quality Is The Priority</p>

            <p>Copyrights 2024 &copy; RoumyaPratap</p>
        </div>
        <div className='rightFooter'>
            <h4>FOLLOW US</h4>
            <a href="http://instagram.com/roumya_pratap">Instagram</a>
            <a href="http://instagram.com/roumya_pratap">Youtube</a>
            <a href="http://instagram.com/roumya_pratap">Facebook</a>

        </div>

    </footer>  
  );
};

export default Footer