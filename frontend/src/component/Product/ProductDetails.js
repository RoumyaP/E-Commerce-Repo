import React, { Fragment, useEffect, useState } from 'react';
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css"
import {useSelector,useDispatch} from "react-redux";
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
import { useParams } from 'react-router-dom';
import ReviewCard from "./ReviewCard.js";
import Loader from '../layout/Loader/Loader.js';
import {useAlert} from "react-alert"
import MetaData from '../layout/MetaData.js';
import { addItemsToCart } from '../../actions/cartAction.js';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
  } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstant.js";


const ProductDetails = () => {

    const {id} = useParams();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {product,loading,error} = useSelector(state => state.productDetails);
    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
      );

    useEffect(() => {

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        
        if (reviewError){
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        
        if (success){
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(id));

    }, [dispatch,id,error,alert,reviewError,success]);

    const options = {
        size: 'large',
        value: product.ratings,
        readOnly: true,
        precision: 0.5
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");


    const increaseQuantity = () =>{
        if(product.stock <= quantity) return;

        const qty = quantity + 1;
        setQuantity(qty);
    }
    const decreaseQuantity = () =>{
        if(quantity<=1) return;

        const qty = quantity - 1;
        setQuantity(qty);
    }
    const addToCartHandler = () =>{
        dispatch(addItemsToCart(id,quantity));
        alert.success('Item Added to Cart');
    }
    const reviewSubmitHandler = () => {
        const myForm = new FormData();
    
        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);
    
        dispatch(newReview(myForm));
    
        setOpen(false);
    };
    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
      };

    

  return (
    <Fragment>
        {loading? <Loader/> : (
        <Fragment>

        <MetaData title={`${product.name} -- ECOMMERCE`}/>

        <div className="ProductDetails">
            <div className='carouselDiv'>
                <Carousel className="carousel">
                {product.image && product.image.length > 0 ? (
                            product.image.map((item, i) => (
                                <img
                                    id='img'
                                    src={item.url}
                                    key={item.url}
                                    className="CarouselImage"
                                    alt={`${i} Slide`}
                                />
                            ))
                        ) : (
                            <div>No images available</div>
                        )}
                </Carousel>
            </div>
            <div>
                <div className="details1">
                    <h2 className='name'> {product.name} </h2>
                    <p>Product # {product._id}</p>
                </div>
                <div className="details2">
                    <Rating {...options} />
                    <span className='details2-span'>({product.numReviews} Reviews)</span>
                </div>
                <div className="details3">
                    <h1> ${product.price} </h1>
                    <div className="details31">
                        <div className="details311">
                        <button className='buttonn' onClick={decreaseQuantity}>-</button>
                        <input readOnly type="Number" value={quantity}/>
                        <button className='buttonp' onClick={increaseQuantity}>+</button>
                        </div>
                        <button disabled={product.stock <1 ? true : false} className='addtocart' onClick={addToCartHandler}>Add To Cart</button>
                    </div>
                    <p className='stock'>
                        Status : {""}
                        <b className={product.stock < 1 ? 'redColor' : 'greenColor' }>
                            {product.stock < 1 ? "Out of Stock" : "In Stock" }
                        </b>
                    </p>
                </div>
                
                <div className='details4'>
                    Description : <p> {product.description} </p>
                </div>

                <button onClick={submitReviewToggle} className='submitReview'> Submit Review </button>
            </div>
        </div>

        <h3 className='reviewsHeading'>REVIEWS</h3>

        <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
        >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              /> 

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
        </Dialog>

        {product.reviews && product.reviews[0] ? (
            <div className="reviews">
                {product.reviews && product.reviews.map((review) => <ReviewCard review = {review}/>)}
            </div>
        ) : (
            <p className='noReviews'>No Reviews Yet</p>
        )}
    </Fragment>)}
    </Fragment>
  )
}

export default ProductDetails