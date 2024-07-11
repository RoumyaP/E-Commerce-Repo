import React, { Fragment, useState } from 'react';
import './Header.css';
import {SpeedDial, SpeedDialAction} from '@material-ui/lab';
import DashboadIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Person from '@material-ui/icons/Person';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';


const UserOptions = ({ user }) => {

    const { cartItems } = useSelector((state)=>state.cart);
  
    const alert = useAlert();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const options = [
      {icon: <ListAltIcon />, name:'Orders',func:orders},
      {icon: <Person />, name:'Profile',func:account},
      {icon: <ShoppingCartIcon style={{color:cartItems.length>0 ? 'aqua' : 'unset' }}/>, name:`Cart(${cartItems.length})`,func:cart},
      {icon: <ExitToAppIcon />, name:'Logout',func:logoutUser}
    ]
    if(user.role==='admin'){
      options.unshift({
        icon: <DashboadIcon />, 
        name:'Dashboard',
        func:dashboard
      });
    }

    function dashboard(){
      navigate('/admin/dashboard');
    }
    
    function orders(){
      navigate('/orders');
    }
    
    function account(){
      navigate('/account');
    }
    
    function cart(){
      navigate('/cart');
    }

    function logoutUser(){
      dispatch(logout());
      alert.success("Logged Out Successfully");
    }


    const [open,setOpen] = useState(false);
    return (
      <Fragment>
      <Backdrop open={open} style={{zIndex: '10'}}/>
        <SpeedDial
            ariaLabel='SpeedDial tooltip example'
            onClose={()=>setOpen(false)}
            onOpen={()=>setOpen(true)}
            style={{zIndex: '11'}}
            open = {open}
            direction='down'
            className='speedDial'
            icon={ <img 
                    className='speedDialIcon'
                    src={user.avatar.url?user.avatar.url:"/Profile.png"}
                    alt='Profile'
                   /> }
        >

          {options.map((item)=>(
            <SpeedDialAction 
              key={item.name}
              icon={item.icon} 
              tooltipTitle={item.name} 
              onClick={item.func}
              tooltipOpen={window.innerWidth<=600?true:false}
            />
          ))}
        </SpeedDial>
    </Fragment>
  )
}

export default UserOptions