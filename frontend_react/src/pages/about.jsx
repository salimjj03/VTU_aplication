import {useState, useEffect} from "react"
import {useParams, Link, useLoaderData} from "react-router-dom"
import React from "react"
import apiUrl from "../config"


function About() {
    const {id} = useParams()
    const data = useLoaderData()

    return (<>
        <h2>About</h2>
        <p>{data.length }</p>
        <Link to="/">Home</Link>
        </>)
    }

const  loadUsers = async () => {

    const res = await fetch(`${apiUrl.url}/users/4`)
    const data = await res.json()
         return (<>
        <a href="/dashboard" className="list-group-item list-group-item-action"><span className="fas fa-home"></span> Home</a>
        <a href="/dashboard/buy_data" className="list-group-item list-group-item-action"><span className="fas fa-globe"></span> Buy Data </a>
        <a href="/dashboard/buy_airtime" className="list-group-item list-group-item-action"><span className="fas fa-phone"></span> Buy Airtime</a>
        <a href="/dashboard/transactions" className="list-group-item list-group-item-action"> <span className="far fa-file-alt"></span> Transactions</a>
        <a href="/dashboard/send_money" className="list-group-item list-group-item-action"> <span className="fas fa-exchange-alt"></span> Send Money</a>
        </>)
    }

export {About as default, loadUsers}