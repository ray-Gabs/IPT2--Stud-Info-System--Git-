/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Sidebar from './Sidebar.jsx';
import './Dashboard.css';
import { Button, TextField } from '@mui/material';

function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    window.location.href = "/login"; // Redirect to login page
  };
  const [student, setStudent] = React.useState({
    idno:"",
    firstName:"",
    lastName:"",
    middleName:"",
    coruse:"",
    yeeLevel:"",
  });

  function handleClick() {
    setStudent({
     idno: document.getElementById('idno').value,
     firstName: document.getElementById('firstName').value,
    });
  }
  
  return (
  <div className='DashMain'>
    <Sidebar />
    <div className='DashContent'>
        <div className='headers'>
        <h1>Welcome to Saint Mary's University</h1>
       </div>
       
    </div>
  </div>
  )
}

export default Dashboard
