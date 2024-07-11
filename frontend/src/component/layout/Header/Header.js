import React from 'react';
import {ReactNavbar} from "overlay-navbar"
import logo from '../../../images/logo.png'
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa"

const Header = () => {
  return ( 
  <ReactNavbar
    burgerColorHover="#00FFFF"
    logo={logo}
    logoWidth="20vmax"
    navColor1="#ffffff"
    logoHoverSize="10px"
    logoHoverColor="#00FFFF"
    link1Text="Home"
    link2Text="Products"
    link3Text="Contact"
    link4Text="About"
    link1Url="/"
    link2Url="/products"
    link3Url="/contact"
    link4Url="/about"
    link1Size="1.3vmax"
    link1Color="rgba(35,35,35,0.8)"
    nav1justifyContent="flex-end"
    nav2justifyContent="flex-end"
    nav3justifyContent="flex-start"
    nav4justifyContent="flex-start"
    link1ColorHover="#00FFFF"
    link1Margin="1vmax"
    profileIcon={true}
    ProfileIconElement={FaUser}
    profileIconUrl='/login'
    searchIcon={true}
    SearchIconElement={FaSearch}
    cartIcon={true}
    CartIconElement={FaShoppingCart}
    profileIconColor="#00FFFF"
    searchIconColor="#00FFFF"
    cartIconColor="#00FFFF"
    profileIconColorHover="#111111"
    searchIconColorHover="#111111"
    cartIconColorHover="#111111"
    cartIconMargin="1vmax"
        
  />
  );
};

export default Header;