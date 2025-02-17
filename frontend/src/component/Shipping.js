import React,{Fragment,useState} from 'react';
import './Shipping.css';
import {useSelector,useDispatch} from 'react-redux';
import { saveShippingInfo } from '../actions/cartAction';
import PinDropIcon from '@material-ui/icons/PinDrop';
import HomeIcon from '@material-ui/icons/Home';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import PublicIcon from '@material-ui/icons/Public';
import PhoneIcon from '@material-ui/icons/Phone';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import {Country, State} from 'country-state-city';
import { useAlert } from 'react-alert';
import MetaData from './layout/MetaData';
import CheckoutSteps from './Cart/CheckoutSteps.js';
import { useNavigate } from 'react-router-dom';


const Shipping = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const alert = useAlert();
    const { shippingInfo } = useSelector((state)=> state.cart);

    const [address, setaddress] = useState(shippingInfo.address);
    const [city, setcity] = useState(shippingInfo.city);
    const [state, setstate] = useState(shippingInfo.state);
    const [country, setcountry] = useState(shippingInfo.country);
    const [pinCode, setpinCode] = useState(shippingInfo.pinCode);
    const [phoneNo, setphoneNo] = useState(shippingInfo.phoneNo);

    const shippingSubmit = (e) =>{
        e.preventDefault();

        if(phoneNo.length<10 || phoneNo.length>10){
            alert.error('Phone Number should be 10 digits long');
            return;
        }
        dispatch(
            saveShippingInfo({address,city,state,country,pinCode,phoneNo})
        )
        navigate('/order/confirm');
    }

  return (
    <Fragment>
        <MetaData title='SHIPPING'/>
        <div className='space'>
            <CheckoutSteps activeStep={0}/>
        </div>

        <div className="shippingContainer">
            <div className="shippingBox">
                <h2 className="shippingHeading">Shipping Details</h2>
                
                
                <form 
                    className='shippingForm'
                    encType='multipart/form-data'
                    onSubmit={shippingSubmit}
                >

                    <div>
                        <HomeIcon />
                        <input 
                            type='text'
                            placeholder='Address'
                            required
                            value={address}
                            onChange={(e)=>setaddress(e.target.value)}
                        />
                    </div>

                    <div>
                        <LocationCityIcon />
                        <input 
                            type='text'
                            placeholder='City'
                            required
                            value={city}
                            onChange={(e)=>setcity(e.target.value)}
                        />
                    </div>

                    <div>
                        <PinDropIcon />
                        <input 
                            type='number'
                            placeholder='Pin Code'
                            required
                            value={pinCode}
                            onChange={(e)=>setpinCode(e.target.value)}
                        />
                    </div>

                    <div>
                        <PhoneIcon />
                        <input 
                            type='number'
                            placeholder='Phone Number'
                            required
                            value={phoneNo}
                            onChange={(e)=>setphoneNo(e.target.value)}
                        />
                    </div>

                    <div>
                        <PublicIcon />
                        <select
                            required
                            value={country}
                            onChange={(e)=>setcountry(e.target.value)}
                        >
                            <option value=''>Country</option> 
                            {Country && Country.getAllCountries().map( (item)=>(
                                <option 
                                    key={item.isoCode}
                                    value={item.isoCode}
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {country && (
                        <div>
                            <TransferWithinAStationIcon />
                            <select
                                required
                                value={state}
                                onChange={(e)=>setstate(e.target.value)}
                                >
                                    <option value=''>State</option> 
                                    {State && State.getStatesOfCountry(country).map( (item)=>(
                                        <option 
                                            key={item.isoCode}
                                            value={item.isoCode}
                                        >
                                            {item.name}
                                        </option>
                                    ))}

                            </select>
                        </div>
                    )}

                    <input 
                        type="submit" 
                        value='Continue'
                        className='shippingBtn'
                        disabled={state ? false : true}
                    />

                </form>
            </div>
        </div>
    </Fragment>
  )
}

export default Shipping