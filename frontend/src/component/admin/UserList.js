import React, { Fragment, useEffect, useMemo, } from "react";
import {useTable,useSortBy, usePagination} from 'react-table';
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
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
import { deleteUser, getAllUsers } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstant";




const columns = [
    {
        Header:'ID',
        accessor: 'id',
    },
    {
        Header:'E-Mail',
        accessor: 'email',
    },
    {
        Header:'Name',
        accessor: 'name',
    },
    {
        Header:'Role',
        accessor: 'role',
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



const UserList = () => {
    const dispatch = useDispatch();

    const alert = useAlert();
    const navigate = useNavigate();

    const { error, users } = useSelector((state) => state.allUsers);
    


    //This solved the page breakage problem, HOLYSHITEEEEE
    const data = useMemo(() => (
        users ? users.map((item) => ({
        id: item._id,
        email: item.email,
        name: item.name,
        role: item.role,
        deleteAction: (
            <Button onClick={() => deleteUserHandler(item._id)}>
            <DeleteIcon />
            </Button>
        ),
        editAction: (
            <Link to={`/admin/user/${item._id}`}>
            <EditIcon />
            </Link>
        )
        })) : []
    ), [users]);





    const {
        error: deleteError,
        isDeleted,
        message,
      } = useSelector((state) => state.profile);


    const deleteUserHandler = async(id) => {
        
        await dispatch(deleteUser(id));
        
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
        alert.success(message);
        navigate("/admin/users");
        dispatch({ type: DELETE_USER_RESET});
        }


        dispatch(getAllUsers());
    }, [dispatch, alert, error, deleteError,isDeleted,navigate,message]);


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
                    gotoPage(Page-1);
                    }
                }}/>

            </div>
            </div>
        </div>
        </Fragment>
    );
};

export default UserList;