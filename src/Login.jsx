import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const api = "http://localhost:3000"

function Login() {

    const navigate = useNavigate()
    const [data, setData] =useState({
        email:"",
        password:""
    })

    const changeHandler = (event)=>{
        let temData = {...data}
        temData[event.target.name] = event.target.value
        setData(temData)
    }

    const userLogin = (e)=>{
        e.preventDefault()
        axios.post(`${api}/user/login`, data)
        .then(res =>{
            alert(res.data.message)
            localStorage.setItem("token",res.data.token)
            navigate("/")
        })
        .catch(err =>{
            console.log(err.response)
            alert(err.response.data.message)
        })
        console.log(data)
    }

  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={userLogin}>
            <input type='email' placeholder='Email ID' name='email' onChange={changeHandler} value={data.email}/> <br /><br />
            <input type='password' placeholder='Password' name='password' onChange={changeHandler} value={data.password} /> <br /><br />
            <input type='submit' value="Login" />
        </form>
    </div>
  )
}

export default Login