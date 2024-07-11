import React, { Fragment } from 'react';
import './Cart.css';
import CartItemCard from './CartItemCard.js';
import { useDispatch, useSelector } from 'react-redux';
import { addItemsToCart, removeItemsFromCart } from '../../actions/cartAction.js';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart.js';
import { useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData.js';

const Cart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state)=>state.cart);

    const increaseQuantity = (id,quantity,stock) =>{
        const newQty = quantity+1;
        if(stock<=quantity) return;
        dispatch(addItemsToCart(id,newQty));
    }
    const decreaseQuantity = (id,quantity,stock) =>{
        const newQty = quantity-1;
        if(1>=quantity) return;
        dispatch(addItemsToCart(id,newQty));
    }
    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }
    const checkOutHandler = () =>{
        navigate('/login?redirect=shipping');
    }


  return (
    <Fragment>
        <MetaData title='CART' />
        {cartItems.length === 0 ? (
            <div className='emptyCart'>
                <RemoveShoppingCartIcon />
                <Typography>No Products In Your Cart</Typography>
                <Link to='/products'>View Products</Link>
            </div>
        ) : (
            <Fragment>
            <div className="cartPage">
                <div className="cartHeader">
                    <p>Product</p>
                    <p>Quantity</p>
                    <p>Subtotal</p>
                </div>
    
                {cartItems && cartItems.map((item)=>(
                    <div className="cartContainer" key={item.product}> 
                    <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
                    <div className="cartInput">
                        <button className='buttonn' onClick={()=>decreaseQuantity(item.product,item.quantity)}>-</button>
                        <input readOnly type="number" value={item.quantity} />
                        <button className='buttonp' onClick={()=>increaseQuantity(item.product,item.quantity,item.stock)}>+</button>
                    </div>
                    <p className='cartSubtotal'>{ `$${item.price * item.quantity}` }</p>
                </div>
                ))} 
    
                <div className="cartGrossProfit">
                    <div></div>
                    <div className="cartGrossProfitBox">
                        <p>Gross Total</p>
                        <p>{ `$${cartItems.reduce(
                            (acc,item) => acc + item.quantity * item.price,
                            0
                        )}` }</p>
                    </div>
                    <div></div>
                    <div className="checkOutBtn">
                        <button onClick={checkOutHandler}>Check Out</button>
                    </div>
                </div>
            </div>
        </Fragment>
        )}
    </Fragment>
  )
}

export default Cart