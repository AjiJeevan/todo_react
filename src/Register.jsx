import axios from 'axios'
import React, { useState } from 'react'
const api = "http://localhost:3000"

function Register() {

    const [data, setData] =useState({
        email:"",
        username:"",
        password:""
    })

    const changeHandler = (event)=>{
        let temData = {...data}
        temData[event.target.name] = event.target.value
        setData(temData)
    }

    const registerUser = (e)=>{
        e.preventDefault()
        axios.post(`${api}/user/register`, data)
        .then(res =>{
            alert(res.data.message)
        })
        .catch(err =>{
            console.log(err.response)
            alert("Something went wrong")
        })
        console.log(data)
    }

  return (
    <div>
        <h1>Register</h1>
        <form onSubmit={registerUser}>
            <input type='email' placeholder='Email ID' name='email' onChange={changeHandler} value={data.email}/> <br /><br />
            <input type='text' placeholder='User Name' name='username' onChange={changeHandler} value={data.username} /> <br /><br />
            <input type='password' placeholder='Password' name='password' onChange={changeHandler} value={data.password} /> <br /><br />
            <input type='submit' value="Register" />
        </form>
    </div>
  )
}

export default Register