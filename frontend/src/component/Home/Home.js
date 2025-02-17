import React, { Fragment, useEffect } from 'react'
import { CgMouse } from "react-icons/cg"
import "./Home.css";
import MetaData from '../layout/MetaData.js'
import { clearErrors, getProduct } from '../../actions/productAction.js'
import { useSelector} from "react-redux" 
import {useDispatch } from "react-redux"
import Loader from "../layout/Loader/Loader.js"
import { useAlert } from "react-alert";
import ProductCard from './ProductCard.js'


const Home = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const {
        loading,error,products
    } = useSelector(state => state.products);

    useEffect(()=>{

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(getProduct());
    },[dispatch,error,alert])


  return(    
    <Fragment>
        {loading ?( <Loader /> ): (
        <Fragment>

            <MetaData title={"ECommerce.com"} />
                
            <div className='banner'>
                <p>AMAZON</p>
                <h1>Find Amazing Products Below</h1>

                <a href="#container">
                    <button>Scroll<CgMouse/></button>
                </a>
            </div>

            <h2 className='homeHeading'> Featured Products </h2>

            <div className="container" id='container'>
                {products && products.map(product => (<ProductCard key={product._id} product={product} />))}
            </div>

        </Fragment>
        )}
    </Fragment>
  );
};

export default Home;