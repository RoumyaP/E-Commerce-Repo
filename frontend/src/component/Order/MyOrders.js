import React, { Fragment, useEffect, useState } from "react";
import "./MyOrders.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import Pagination from "react-js-pagination";

const MyOrders = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { loading, error, orders, ordersCount } = useSelector((state) => state.myOrders);
  const { user } = useSelector((state) => state.user);
  const perPage = 5; // Number of orders per page
  const [currentPage, setCurrentPage] = useState(1);


  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders(currentPage));
  }, [dispatch, alert, currentPage, error]);
  

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">

          <div className="container">
            <table className="table">
              <thead className="head">
      
                  <th>ID</th>
                  <th>Status</th>
                  <th>Quantity</th>
                  <th>Amount</th>
               
              </thead>
              <tbody className="body">
                {orders && orders.map((item)=>(
                  <tr key={item._id} className="row">
                    <td>
                        <Link className="link" to={`/order/${item._id}`}>
                          {item._id}
                        </Link>
                    </td>
                    <td className="status"><div style={{color: item.orderStatus === 'Processing'? 'aqua' : 'rgb(0, 255, 0)'}}>{item.orderStatus}</div></td>
                    <td>{item.orderItems.length}</td>
                    <td>${item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          
            <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
          </div>
          
                    <div className="paginationBox">
                        <Pagination 
                            activePage={currentPage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={ordersCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass='page-link'
                            activeClass='pageItemActive'
                            activeLinkClass='pageLinkActive'
                        />
                    </div>
        
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;