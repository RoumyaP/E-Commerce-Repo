import React from 'react';
import { Rating } from "@material-ui/lab";
import profilePng from "../../images/profile.png";

const ReviewCard = ({ review }) => {
    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5
    };


    return ( <div className='reviewCard'>
        <img src={profilePng} className='User' alt="User" />
        <p> {review.name} </p>
        <Rating {...options} />
        <span className='reviewCardComment'>{review.comment}</span>
    </div>
    );
};

export default ReviewCard;