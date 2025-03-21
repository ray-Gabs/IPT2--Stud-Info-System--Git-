/* eslint-disable no-unused-vars */
import React from 'react'
import './TaskTracker.css';
import { useState } from 'react';
``
function TaskTracker() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    const addTask = () => {
        if (task) {
            setTasks([...tasks, { text: task, completed: false }]);
            setTask('');
        }
    };  
     const toggleComplete = (index) => {
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
    };

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div className='TaskTrackMain' >
            <h1>Task Tracker</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a task"
            />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map((t, index) => (
                    <li key={index}>
                        <div className='Task'>
                        <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
                            {t.text}
                        </span>
                        <button onClick={() => toggleComplete(index)}>Toggle</button>
                        <button onClick={() => removeTask(index)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskTracker;