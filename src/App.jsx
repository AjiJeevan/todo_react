import { useEffect, useState } from 'react'
import axios, { Axios } from 'axios'
import { useNavigate } from 'react-router-dom'
const api_domain = "http://localhost:3000"

function App() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState("")
  const [image, setImage] = useState("");
  const [images, setImages] = useState([])

  const getTask = ()=>{
    let token = localStorage.getItem("token")
    axios.get(api_domain,{
      headers:{
        Authorization : token
    }})
    .then(res =>{
      setTasks(res.data.todoList)
    })
    .catch(err => {
      console.log("Error")
    })
  }

  useEffect(()=>{
    let token = localStorage.getItem("token")
    if(token){
      axios.post(`${api_domain}/user/check-token`,{token})
      .then(res =>{
        getTask()
      })
      .catch(()=>{
        navigate("/login")
      })
      axios.get(`${api_domain}/images`)
      .then(res =>{
        setImages(res.data.images)
      })
      .catch(err =>{
        console.log("Error in fetching images")
      })
    }
    else{
      navigate("/login")
    }
  },[])

  const changeHandler = (event)=>{
    setTaskInput(event.target.value)
  }

  // Adding new Task
  const formSubmitHandler = (event)=>{
    event.preventDefault()
    let token = localStorage.getItem("token")
    axios.post(api_domain,{task : taskInput , token : token})
    .then(res =>{
      setTaskInput("")
      getTask()
    })
    .catch(()=>{
      console.log("Error...")
    })
    console.log(taskInput)
  }

  // Delete Button Function
  const deleteHandler = (index)=>{
    axios.delete(`${api_domain}/task/${index}`)
    .then(res =>{
      getTask()
    })
    .catch(err =>{
      alert(err.response.data.message)
    })
  }

  // Edit Button Function
  const editTask = (event,id,task)=>{
    const button = event.target
    const li = event.target.parentNode

    //Edit Button Press
    if( button.textContent == "Edit" ){
      const span = li.firstElementChild
      const input = document.createElement("input")
      input.type = "text"
      input.value = span.textContent
      li.insertBefore(input,span)
      li.removeChild(span)
      button.textContent = "Save"
    }
    //Save Button Press
    else if( button.textContent == "Save" ){
      const span = document.createElement("span")
      const input = li.firstElementChild
      span.textContent = input.value
      li.insertBefore(span,input)
      li.removeChild(input)

      axios.patch(api_domain, {id: id, task : input.value })
      .then((res)=>{
        getTask()
      })
      .catch((err) =>{
        console.log("error....")
      })
      button.textContent = "Edit"
    }
  }
const handleFileChange = (e) => {
  setImage(e.target.files[0]);
}

const fileSubmitHandler = (e)=>{
  e.preventDefault()
  const formData = new FormData();
  formData.append('image', image);

  axios.post(`${api_domain}/upload`,formData , {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(res =>{
    console.log(res.data)
  })
  .catch(err =>{
    console.log(err.response.data)
  })
}


  return ( 
    <>
      <form onSubmit={fileSubmitHandler}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type='submit'>Upload</button>
      </form>
      <br />
      {images.map((img , index) => {
        return(
          <img src={`${api_domain}${img.url}`} width={"300px"} />
        )
      })}
      {/* <img src={`${api_domain}/uploads/1735989829363-House.png`} width={300} /> */}
      <br />
      <h1>Todo app</h1>
      <form onSubmit={formSubmitHandler}>
        <input type='text' placeholder='Enter task' value={taskInput} onChange={changeHandler}/> <br/><br/>
        <input type='submit' value='Add Task'/>
      </form>
      {/* <br/>
      <button onClick={()=>{
        setTaskInput("")
      }}>Clear Input</button> */}
      <ul>
        {tasks.map((task,index)=>{
          return(
            <>
              <li key={index}>
                <span>{task.task}</span>
                <button onClick={(event)=>{editTask(event,task._id,task.task)}}>Edit</button>
                <button onClick={()=>{deleteHandler(task._id)}}>Delete</button>
             </li> 
            </>
          )
        })}
      </ul>

      {/* <button onClick= {()=>deleteHandler(10)}>Check Bad Request</button> */}
    </>
  )
}

export default App