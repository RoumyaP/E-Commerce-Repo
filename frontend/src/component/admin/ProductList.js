import React, { Fragment, useEffect, useMemo, useState } from "react";
import {useTable,useSortBy, usePagination} from 'react-table';
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProduct,
  deleteProduct,
  getAdminProduct
} from "../../actions/productAction";
import {Link, useNavigate} from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import SideBar from "./Sidebar";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstant";




const columns = [
  {
    Header:'ID',
    accessor: 'id',
  },
  {
    Header:'Stock',
    accessor: 'stock',
  },
  {
    Header:'Price',
    accessor: 'price',
  },
  {
    Header:'Name',
    accessor: 'name',
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



const ProductList = () => {
  const dispatch = useDispatch();

  const alert = useAlert();
  const navigate = useNavigate();

  const [pageNo, setPageNo] = useState();

  const { error, products } = useSelector((state) => state.allProducts);


  //This solved the page breakage problem, HOLYSHITEEEEE
  const data = useMemo(() => (
    products ? products.map((item) => ({
      id: item._id,
      stock: item.stock,
      price: item.price,
      name: item.name,
      deleteAction: (
        <Button onClick={() => deleteProductHandler(item._id)}>
          <DeleteIcon />
        </Button>
      ),
      editAction: (
        <Link to={`/admin/product/${item._id}`}>
          <EditIcon />
        </Link>
      )
    })) : []
  ), [products]);





  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  const deleteProductHandler = async(id) => {
     
      await dispatch(deleteProduct(id));
      
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
      alert.success("Product Deleted Successfully");
      navigate("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProduct());
  }, [dispatch, alert, error, deleteError,isDeleted]);


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
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>

          <table className="productTable" {...getTableProps()}>
            <thead className="productHeader">
              {
                headerGroups.map(hg=>(
                  <tr {...hg.getHeaderGroupProps()} >
                    {hg.headers.map((column)=>(
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        {
                          column.isSorted && (<span>{column.isSortedDesc?
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
                        <td {...cell.getCellProps()}>
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
                  setPageNo(Page);
                  gotoPage(Page-1);
                }
            }}/>

          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;