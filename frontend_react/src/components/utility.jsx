import React, { useState, useMemo, useContext, useEffect, createContext} from 'react';
import { useTable, useGlobalFilter, usePagination } from "react-table";
import axios from "axios"
import {toast} from "react-toastify"
import {useNavigate} from "react-router-dom"
import { saveAs } from 'file-saver';
import {DataContext} from "../apiRequest"
import { BsPatchQuestionFill } from "react-icons/bs";
import config from "../config"


export const FormContext = createContext(null);

export function Form({element, title}){
    return(<>
        <div className="shadow rounded bg-white mb-5 p-2" >
              <div className="h5 p-2 border-bottom "><b>{title}</b></div>
              {element}
        </div>
        </>)
}

export function Alert({status, message}){
    return (<>
             {status === "success" ? (
                  <div className="alert alert-success alert-dismissible addName">
                    <strong>{message}</strong>
                  </div> ) :
              status === "error" ? (
                 <div className="alert alert-danger alert-dismissible addName">
                      <strong>{message}</strong>
                  </div>
                 ) : null
             }

        </>)
    }


export function SubmitButton({loading}){
    return (<>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ?
                   <span className="hidden-message spinner-border spinner-border-sm"></span> :
                   <span>GO</span>
                  }
                </button>
        </>)
    }

export function ConfirmAlert({isConfirm, confirm, cancel, message}) {


      return(
      <>
        <div className="modal-overlay" id="confirm-alert">
            <div className="modal-dialog shadow-lg">
                <div className="modal-content shadow-lg">
                    <div className="modal-header d-flex justify-content-center m-0 p-0">
                        <div style={{ width: "300px" }} className="justify-content-center d-flex">
                        <span className="text-primary m-0 p-0" style={{ fontSize: "70px" }}> <BsPatchQuestionFill /> </span>
                        </div>
                    </div>

                    <div className="modal-body  d-flex flex-column align-items-center justify-content-center scrollable">
                        <h4 className="modal-title mb-2"><b>Are you sure?</b></h4>

                        <p>{message}</p>
                    </div>
            <div className="modal-footer">
                <button type="button" onClick={confirm} className="btn btn-primary">Continue</button>
                <button type="button" onClick={cancel} className="btn btn-danger">Cancel</button>
            </div>
            </div>
          </div>
        </div>
      </>)
}

export const Model = ({children, title, isOpen, setIsOpen}) => {

      const handleClose = () => setIsOpen(false)

      return(
      <>
      {isOpen && (
        <div className="modal-overlay">
            <div className="modal-dialog shadow-lg">
                <div className="modal-content shadow-lg">
                    <div className="modal-header p-2 pr-3 pl-3">
                        <h5 className="modal-title p-0" id="signupModalLabel" style={{fontSize: "35px"}}><b>{title}</b></h5>
                        <button type="button" onClick={handleClose} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" >&times;</span>
                        </button>
                    </div>

                    <div className="modal-body scrollable">

                        {children}
                    </div>
            <div className="modal-footer">
                <button type="button" onClick={handleClose} className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </div>
          </div>
        </div>
        )}
      </>)
}

export const EditModel = ({children}) => {

      const [isOpen, setIsOpen] = useState(false);

      const handleEdit = () => {
          setIsOpen(true)
      }

      const handleClose = () => {
          setIsOpen(false)
      }

      return(
      <>
      {isOpen && (
        <div className="modal-overlay">
            <div className="modal-dialog shadow-lg">
                <div className="modal-content shadow-lg">
                    <div className="modal-header">
                        <h5 className="modal-title text-secondary" id="signupModalLabel" style={{fontSize: "20px"}}><b>Update</b></h5>
                        <button type="button" onClick={handleClose} className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" >&times;</span>
                        </button>
                    </div>

                    <div className="modal-body scrollable">

                        {children}
                    </div>
            <div className="modal-footer">
                <button type="button" onClick={handleClose} className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
            </div>
          </div>
        </div>
        )}
        <button type="button" className="btn btn-primary p-1 mr-1" onClick={handleEdit} style={{fontSize: "11px"}} >update</button>
      </>)
}


export function Table({children, url, arr, col, title, del, update, arrLoading, activate, setRefresh }) {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [isActive, setIsActive] = useState(false)
  const [isDel, setIsDel] = useState(false)
//   const [refresh, setRefresh] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setFilterData(arr)
  }, [arr])

  const data = useMemo(() => filterData, [filterData]);

  const columns = useMemo(() => [

    {
      Header:  del || update ? "Actions" : " ",
      Cell: ({ row }) => (
        <>
       <div className="d-flex">
         { update && (
             <FormContext.Provider value={ row.original }>
               {children}
             </FormContext.Provider>
         )
         }

        { del && (
          <button disabled={loading === row.original.id} onClick={() => handleDelete(row.original)} className="btn btn-danger btn-sm" style={{ fontSize: "11px"}}>
               {loading === row.original.id  && isDel?
                  <span className="hidden-message spinner-border spinner-border-sm"> </span> :

               <span>Delete</span>
               }
          </button>
        )
        }

        { activate && (
          <button disabled={loading === row.original.id} onClick={() => handleStatus(row.original)} className={`btn ${row.original.status === "off" ? "btn-danger" : "btn-success" } btn-sm ml-1`} style={{ fontSize: "11px"}}>
               {loading === row.original.id  && isActive?
                  <span className="hidden-message spinner-border spinner-border-sm"> </span> :

               <span>{`${ row.original.status === "off" ? "Deactivated" : "Activated" }`}</span>
               }
          </button>
        )
        }

        </div>
        </>
      )

    },

    ...col

  ] , [loading, filterData]);

  // Table instance with pagination
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // use `page` instead of `rows` to display paginated rows
    prepareRow,
    setGlobalFilter,
    // Pagination properties and methods
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    usePagination
  );

  const handleSearch = (e) => {
    const value = e.target.value || "";
    setGlobalFilter(value);
    setSearchInput(value);
  };

  const [isConfirm, setIsConfirm] = useState(false);
  const [currentData, setCurrentData] = useState(null);

    const handleDelete = (rowData) => {
        setIsConfirm(true);
        setCurrentData(rowData)
    }

    function handleClose() {
        setIsConfirm(false);
        setCurrentData(null)
    }

    function handleStatus(rowData) {
        //setIsConfirm(false);
    setIsActive(true)
    setCurrentData(rowData)
    setLoading(rowData?.id)
    axios.put(`${url + rowData.id}`, {"id": rowData?.id}, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
    .then((res) => {
        toast.success(res?.data?.message)
        setLoading(null)
        setIsActive(false)
        setRefresh(r => !r)
        })
    .catch((err) => {
        setLoading(null)
        setIsActive(false)
        toast.error(err?.response?.data?.message);
        setCurrentData(null);
        if (err?.response?.status  === 401){
            localStorage.removeItem("data");
            toast.error("Error: Session Expired");
            navigate("/403_admn_auth25_login", {replace: true});
            }
        })
  };

    function handleConfirm() {
        setIsConfirm(false);
        setIsDel(true)
    setLoading(currentData.id)
    axios.delete(`${url + currentData.id}`, {
        headers: {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("data")).token}`
            }
        })
    .then((res) => {
        toast.success(res?.data?.message)
        setFilterData(f => f.filter((v) => v.id != currentData.id ))
        setLoading(null)
        setIsDel(false)
        })
    .catch((err) => {
        setLoading(null)
        setIsDel(false)
        toast.error(err?.response?.data?.message);
        setCurrentData(null);
        if (err?.response?.status  === 401){
            localStorage.removeItem("data");
            toast.error("Error: Session Expired");
            navigate("/403_admn_auth25_login", {replace: true});
            }
        })
  };

  // Print the table
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = columns.map(col => col.Header).join(",");
    const rowsData = page.map(row => row.cells.map(cell => cell.value).join(","));
    const csvContent = [headers, ...rowsData].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "table-data.csv");
  };

  return (<>
      {isConfirm && (
          <ConfirmAlert
          isConfirm={setIsConfirm}
          confirm={handleConfirm}
          cancel={handleClose}
          message={`You want to delete this record`}
          />

          )}
     <div style={{  height: "70px", backgroundColor: config.color}}
      className="h5  text-secondary m-4 rounded-lg d-flex align-items-center shadow">
      <span className="pl-4 text-white"><b>{title} ({ arr?.length })</b></span>
      </div>
    <div className="shadow rounded bg-white mb-5 p-2 overflow-auto mx-4">

        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
        <div >
        <div className="d-flex" style={{ marginBottom: "10px" }}>
        <input
          className="form-control"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Search..."
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button  onClick={handlePrint} className="btn btn-secondary mr-2 text-nowrap" style={{fontSize: "12px" }}>Print</button>
        <button  onClick={exportToCSV} className="btn btn-secondary text-nowrap" style={{fontSize: "12px" }}>Export</button>
      </div>
      </div>
      </div>

      <table className="table table-hover mb-5 " style={{ fontSize: "11px"}} {...getTableProps()}>
        { !arrLoading ?
        <>
        <thead className="text-nowrap">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
        </>  :
        <tbody style={{ height: "100px", width: "auto"}} className="d-flex  justify-content-center align-items-center">
            <span className="spinner-border spinner-sm"></span>
        </tbody>
        }

      </table>

      {/* Pagination Controls */}
      <div className="pagination d-flex items-align-center ml-5 mb-4">
{/*         <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}> */}
{/*           {"<<"} */}
{/*         </button>{" "} */}
        <button className="bg-white border-0" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <span style={{ width: "30px", height: "30px"}}
         className="rounded-circle bg-primary d-flex justify-content-center align-items-center mx-2">
          {" "}
          <strong className="text-white">
            {pageIndex + 1}
{/*              of {pageOptions.length} */}
          </strong>{" "}
        </span>
        <button className="bg-white border-0" onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
{/*         <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}> */}
{/*           {">>"} */}
{/*         </button>{" "} */}

{/*         <span> */}
{/*           | Go to page:{" "} */}
{/*           <input */}
{/*             type="number" */}
{/*             defaultValue={pageIndex + 1} */}
{/*             onChange={e => { */}
{/*               const page = e.target.value ? Number(e.target.value) - 1 : 0; */}
{/*               gotoPage(page); */}
{/*             }} */}
{/*             style={{ width: "50px" }} */}
{/*           /> */}
{/*         </span>{" "} */}
        <select
        className="rounded-lg bg-white ml-2"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option  key={pageSize} value={pageSize}>
                {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  </>);
};

const modalStyles = `
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.6); /* Shadow effect */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    max-height: 80vh; /* Limits modal height */
    overflow: hidden;
    width: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-body.scrollable {
    overflow-y: auto;
    max-height: 60vh; /* Scrollable body */
    padding: 1rem;
  }

  #confirm-alert{
       z-index: 5000;
      }
`;

// Inject styles into the page
const style = document.createElement('style');
style.textContent = modalStyles;
document.head.append(style);
