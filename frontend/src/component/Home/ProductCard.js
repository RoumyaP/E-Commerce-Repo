import React from 'react'
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";



const ProductCard = ({ product }) => {

  const options = {
    edit: false,
    color: "#808080",
    activeColor: "#00ffff",
    size: window.innwewidth<600?20:20,
    value: product.ratings,
    isHalf:true,
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
        
        <img src={ product.image[0].url } alt='productimage'/>
        <p id='p1'>{product.name}</p>
        <div>
            <ReactStars {...options} /> 
        </div>
        <p id='p2'>{`$${product.price}`}</p>
    </Link>
  )
}

export default ProductCard