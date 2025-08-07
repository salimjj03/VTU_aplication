import React, {useEffect, useState, createContext, useCallback} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"

const DataContext = createContext(null)

function DataProvider({children}) {

    const navigate = useNavigate()

    const getData = (url, load) => {


        const [data, setData] = useState(null)
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(false)

        useEffect(() => {

            if (url) {
                const token = JSON.parse(localStorage.getItem("data")).token
                axios.get(url, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                        }
                    })
                .then((res) => {
                    setData(res.data)
                    setLoading(false)
                    })
                .catch((err) => {
                    setLoading(false)
                    setError(true)
                    if (err?.response?.status === 401){
                        localStorage.removeItem("data")
                        toast.error("Error: Session expired")
                        navigate("/403_admn_auth25_login", {replace: true});
                        }
                    })
            }
        },[load])

        return({data, loading, error})

    }

    return(<>
        <DataContext.Provider value={{getData}}>
            {children}
        </DataContext.Provider>
        </>)
}

export { DataProvider as default, DataContext}