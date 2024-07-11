import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import {Navigate, Outlet } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';

const ProtectedRoute = () => {

    const { loading, isAuthenticated, user} = useSelector((state)=>state.user);
    
    if (loading) {
        return <Fragment>
            <Loader/>
        </Fragment>; 
    }

    if (isAuthenticated === false) {
        return <Navigate to="/login" />;
    }

    if(user.role === 'user'){
        return <Navigate to='/login' />
    }

    return <Outlet />;
}

export default ProtectedRoute 