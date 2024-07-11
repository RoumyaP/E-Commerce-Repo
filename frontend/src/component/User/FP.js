import React, { Fragment, useState, useEffect } from 'react';
import './ForgotPassword.css';
import Loader from '../layout/Loader/Loader';
import  MailOutlineIcon from '@material-ui/icons/MailOutline';
import {useDispatch,useSelector} from 'react-redux';
import {clearErrors,forgotPassword} from '../../actions/userActions';
import {useAlert} from 'react-alert';
import MetaData from '../layout/MetaData';

const FP = () => {


    const {error, message, loading} = useSelector((state)=>state.forgotPasword);
    
    const [email, setEmail] = useState('');

  return (
    <Fragment>
        {loading? <Loader/> :(
            <Fragment>
            <MetaData title='Forgot Password' />
            <div className="forgotPasswordContainer">
                <div className="forgotPasswordBox">
                    <h2>Forgot Password</h2>
                <form 
                        className='forgotPasswordForm'
                    >
                  
                            <div className="forgotPasswordEmail">
                                <MailOutlineIcon />
                                <input 
                                    type="email" 
                                    placeholder='Email'
                                    required
                                    name='email'
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>
                            
                            <input 
                                type="submit" 
                                value='SEND'
                                className='forgotPasswordBtn'
                            />
                    </form>
                </div>
            </div> 
        </Fragment>
        )}
    </Fragment>
  )
}


export default FP