import React, { Fragment, useEffect, useMemo } from "react";
import {useTable,useSortBy, usePagination} from 'react-table';
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  deleteOrder,
  getAllOrders
} from "../../actions/orderAction";
import {Link, useNavigate} from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import SideBar from "./Sidebar";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";




const columns = [
  {
    Header:'Order ID',
    accessor: 'id',
  },
  {
    Header:'Status',
    accessor: 'status',
  },
  {
    Header:'Items Oty',
    accessor: 'qty',
  },
  {
    Header:'Amount',
    accessor: 'amount',
  },
  {
    Header:'Delete',
    accessor: 'deleteAction',
  },
  {
    Header:'Edit',
    accessor: 'editAction',
  },
];



const OrderList = () => {
  const dispatch = useDispatch();

  const alert = useAlert();
  const navigate = useNavigate();

  const { error, orders } = useSelector((state) => state.allOrders);


  //This solved the page breakage problem, HOLYSHITEEEEE
  const data = useMemo(() => (
    orders ? orders.map((item) => ({
      id: item._id,
      status: item.orderStatus,
      qty: item.orderItems.length,
      amount: item.totalPrice,
      deleteAction: (
        <Button onClick={() => deleteOrderHandler(item._id)}>
          <DeleteIcon />
        </Button>
      ),
      editAction: (
        <Link to={`/admin/order/${item._id}`}>
          <EditIcon />
        </Link>
      )
    })) : []
  ), [orders]);





  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.order
  );

  const deleteOrderHandler = async(id) => {
     
      await dispatch(deleteOrder(id));
      
  }





  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) { 
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError,isDeleted,navigate]);


      const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        state:{pageIndex},
        pageCount,
        gotoPage
      } = useTable({
          columns,
          data,
          initialState:{pageSize:10}
        },
        useSortBy,
        usePagination
      );

  return (
    <Fragment>
      <MetaData title={`ALL ORDERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          <table className="productTable" {...getTableProps()}>
            <thead className="productHeader">
              {
                headerGroups.map(hg=>(
                  <tr {...hg.getHeaderGroupProps()} >
                    {hg.headers.map((column)=>(
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        {
                          column.isSorted && (<span className="sortIcon">{column.isSortedDesc?
                            ' 🔽':' 🔼'
                          }</span>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
            </thead>
            <tbody className="productBody" {...getTableBodyProps()}>
                {page.map(row=>{

                  prepareRow(row);

                  return <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell=>(
                        <td {...cell.getCellProps()}
                        className={cell.column.id === 'status' && cell.value === 'Delivered' ? 'status-delivered' : ''}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))
                    }
                  </tr>
                })}
            </tbody>
          </table>
          <div className="btnDiv">
            <button disabled={pageIndex===0} className="nextBtn" onClick={()=>gotoPage(0)}>First</button>
            <button disabled={!canPreviousPage} className="prevBtn" onClick={previousPage}>Prev</button>
            <button className="pageBtn">{pageCount ? pageIndex+1 : pageIndex} of {pageCount}</button>
            <button disabled={!canNextPage} className="nextBtn" onClick={nextPage}>Next</button>
            <button disabled={pageIndex >= pageCount-1} className="nextBtn" onClick={()=>gotoPage(pageCount-1)}>Last</button>
            
            <input type="number" className="pageInput"
            
              placeholder="Go To Page..." 
            
              onChange={(e)=>{
                const Page = Number(e.target.value);
                if (!isNaN(Page) && Page > 0 && Page <= pageCount) {
                  gotoPage(Page-1);
                }
            }}/>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;