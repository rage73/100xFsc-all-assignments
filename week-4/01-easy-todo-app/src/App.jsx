import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [todoId, setTodoId] = useState(-1)
  const [isEdit, setIsEdit] = useState(false)

  // fetch all todos from server
  useEffect(() => {
    fetchTodos();
  }, [])

  const resetInput = () => {
    setNewTitle("")
    setNewDescription("")
  }

  const fetchTodos = () => {
    fetch("http://localhost:3000/todos").then((data) => {
      data.json().then((todos) => {
        setTodos(todos)
      })
    })
  }

  const deleteTodo = (id) => {
    console.log("Delete " + id);
    fetch("http://localhost:3000/todos/" + id, {
      method: "DELETE"
    }).then(() => {
      fetchTodos();
    })
  }

  const addTodo = () => {
    const data = {
      title: newTitle,
      description: newDescription
    }
    fetch("http://localhost:3000/todos/", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      fetchTodos();
      resetInput();
    })
  }

  const editTodo = (todo) => {
    setIsEdit(true)
    setNewTitle(todo.title)
    setNewDescription(todo.description)
    setTodoId(todo.id)
  }

  const updateTodo = () => {
    const data = {
      title: newTitle,
      description: newDescription
    }
    fetch("http://localhost:3000/todos/" + todoId, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      fetchTodos();
      resetInput();
      setTodoId(-1);
      setIsEdit(false);
    })
  }

  const addButton = () => {
    if (isEdit) {
      updateTodo();
    } else {
      addTodo();
    }
  }

  return (
    <>
      <div>
        <h1>Easy Todo App</h1>
        <input type="text" placeholder='title' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />&nbsp;
        <input type="text" placeholder='description' value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />&nbsp;
        <button onClick={addButton}>Add</button>&nbsp;
        <button onClick={resetInput}>Reset</button>
        <br /><br />
        <div>
          {todos.map((todo) => {
            return <ul key={todo.id}>
              <li>
                <Todo title={todo.title} description={todo.description} deleteTodo={() => deleteTodo(todo.id)} editTodo={() => editTodo(todo)} />
              </li>
            </ul>
          })}
        </div>
      </div>
    </>
  )
}

function Todo(props) {
  // Add a delete button here so user can delete a TODO.
  return <div>
    <h4>{props.title}</h4>
    <p>{props.description}</p>
    <button onClick={props.deleteTodo}>Delete</button>&nbsp;
    <button onClick={props.editTodo}>Edit</button>
  </div>
}

export default App
