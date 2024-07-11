import React from 'react';
import { useEffect, useState } from "react";
import './App.css';
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import WebFont from "webfontloader";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import loginSignUp from './component/User/loginSignUp.js';
import store from './store.js';
import { loadUser } from './actions/userActions.js';
import UserOptions from './component/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';
import Profile from './component/User/Profile.js'
import UpdateProfile from './component/User/UpdateProfile.js';
import ProtectedRoute from './component/Route/ProtectedRoute.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from './component/Cart/Cart.js';
import Shipping from './component/Shipping.js';
import ConfirmOrder from './component/Cart/ConfirmOrder.js'
import axios from 'axios';
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import NotFound from './component/layout/NotFound/NotFound.js';
import OrderSuccess from './component/Cart/OrderSuccess.js';
import MyOrders from './component/Order/MyOrders.js';
import OrderDetails from './component/Order/OrderDetails.js';  
import Dashboard from './component/admin/Dashboard.js';
import ProductList from './component/admin/ProductList.js';
import NewProduct from './component/admin/NewProduct.js';
import UpdateProduct from './component/admin/UpdateProduct.js';
import OrderList from './component/admin/OrderList.js';
import ProcessOrder from './component/admin/ProcessOrder.js';
import UserList from './component/admin/UserList.js';
import UpdateUser from './component/admin/UpdateUser.js';



function App() {

  const {isAuthenticated, user} = useSelector(state => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  
  
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(()=>{
    WebFont.load({
      google:{
        families:["Roboto","Droid Sans", "Chilanka"]
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();

  },[]); 



  return(
    <Router>
      <Header/>
      
      {isAuthenticated && <UserOptions user={user}/>}
        
      <Elements stripe={loadStripe(stripeApiKey)}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route exact path="/process/payment" Component={Payment} />
          </Route>
        </Routes>
      </Elements>


      <Routes>
      <Route exact path='/' Component={Home} />
      <Route exact path='/product/:id' Component={ProductDetails} />
      <Route exact path='/products' Component={Products} />
      <Route path="/products/:keyword" Component={Products}/>

      <Route exact path='/search' Component={Search} />
      <Route exact path='/login' Component={loginSignUp} />
      <Route exact path='/password/forgot' Component={ForgotPassword} />  
      <Route exact path='/password/reset/:token' Component={ResetPassword} />  
      <Route exact path='/cart' Component={Cart} />


      <Route element={<ProtectedRoute />}>
        <Route exact path='/account' Component={Profile} />
        <Route exact path='/me/update' Component={UpdateProfile} />
        <Route exact path='/password/update' Component={UpdatePassword} />  
        <Route exact path='/shipping' Component={Shipping} />  
        <Route exact path='/success' Component={OrderSuccess} />  
        <Route exact path='/orders' Component={MyOrders} />  
        <Route exact path='/order/confirm' Component={ConfirmOrder} />
        <Route exact path='/order/:id' Component={OrderDetails} />  
        <Route exact path='/admin/dashboard' Component={Dashboard} />
        <Route exact path='/admin/products' Component={ProductList} />
        <Route exact path='/admin/product' Component={NewProduct} />
        <Route exact path='/admin/product/:id' Component={UpdateProduct} />
        <Route exact path='/admin/orders' Component={OrderList} />
        <Route exact path='/admin/order/:id' Component={ProcessOrder} />
        <Route exact path='/admin/users' Component={UserList} />
        <Route exact path='/admin/user/:id' Component={UpdateUser} />
      </Route>

      </Routes>

      <Footer/>
    </Router>
  );
}

export default App;