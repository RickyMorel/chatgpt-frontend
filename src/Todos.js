import React from 'react'

function Todos(props) {
    const todos = props.todos
    
    const todosHtml = todos.length > 0 ? (
        todos.map(todo => {
            return <div className="collection-item" key={todo.id}><span>{todo.content}</span></div>
        })
    ) : (<p>You have no todos left, yay!</p>)

    return (
        <div className="todos collection">
            {todosHtml}
        </div>
    )
}

export default Todos