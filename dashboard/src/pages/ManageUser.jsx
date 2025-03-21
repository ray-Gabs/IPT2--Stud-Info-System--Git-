/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';

import './ManageUser.css';

// Styled Table Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Modal Styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [showPassword, setShowPassword] = useState(false);

  const [userForm, setUserForm] = useState({
    userId: '',
    lastName: '',
    firstName: '',
    middleName: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:1337/fetchusers');
      const filteredData = data.filter(user =>
        user.userId && user.lastName && user.firstName && user.username && user.password
      );
      setUsers(filteredData);
    } catch (error) {
      console.error('ERROR Fetching Users:', error);
    }
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsEditing(!!user);

    if (user) {
      setUserForm({
        userId: user.userId,
        lastName: user.lastName,
        firstName: user.firstName,
        middleName: user.middleName,
        username: user.username,
        password: user.password,
      });
    } else {
      setUserForm({ userId: '', lastName: '', firstName: '', middleName: '', username: '', password: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    if (!userForm.userId || !userForm.lastName || !userForm.firstName || !userForm.username || !userForm.password) {
      alert('All fields are required!');
      return;
    }

    try {
      console.log("Submitting user data:", userForm);

      if (isEditing) {
        await axios.put(`http://localhost:1337/edituser/${selectedUser.userId}`, userForm);
      } else {
        await axios.post('http://localhost:1337/addusers', userForm);
      }

      handleCloseModal();
      await fetchUsers();
    } catch (error) {
      console.error(`ERROR ${isEditing ? 'Updating' : 'Adding'} User:`, error);
      alert(`Error ${isEditing ? 'updating' : 'adding'} user. Check console for details.`);
    }
  };
//show password
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
//change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
//delete user
const handleDelete = async (userId) => {
  if (!window.confirm(`Are you sure you want to delete user with ID ${userId}?`)) {
    return;
  }

  try {
    await axios.delete(`http://localhost:1337/deleteuser/${userId}`);
    fetchUsers(); 
  } catch (error) {
    console.error("ERROR Deleting User:", error);
    alert("Error deleting user. Check console for details.");
  }
};
  return (
    <div className="manageUserCont">
      <Sidebar />
      <div className="manageUserMain">
        <h1>Manage Users</h1>
        <div className="BTNADD">
          <Button variant="contained" sx={{ float: 'right', mb: 2 }} onClick={() => handleOpenModal()}>
            Add User
          </Button>
        </div>
        <div className="userTableManagement">
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>User ID</StyledTableCell>
                  <StyledTableCell>Last Name</StyledTableCell>
                  <StyledTableCell>First Name</StyledTableCell>
                  <StyledTableCell>Middle Name</StyledTableCell>
                  <StyledTableCell>Username</StyledTableCell>
                  <StyledTableCell>Password</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <StyledTableRow key={user.userId}>
                    <StyledTableCell>{user.userId}</StyledTableCell>
                    <StyledTableCell>{user.lastName}</StyledTableCell>
                    <StyledTableCell>{user.firstName}</StyledTableCell>
                    <StyledTableCell>{user.middleName}</StyledTableCell>
                    <StyledTableCell>{user.username}</StyledTableCell>
                    <StyledTableCell>{user.password}</StyledTableCell>
                    <StyledTableCell align="center">
                      <EditIcon sx={{ cursor: 'pointer' }} onClick={() => handleOpenModal(user)} />
                      <DeleteIcon
                        sx={{ cursor: 'pointer', ml: 1, color: 'red' }}
                        onClick={() => handleDelete(user.userId)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TablePagination
      className="custom-pagination"
        component="div"
        count={users.length}
        rowsPerPage={10} // Keep it constant
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]} // No dropdown for selection
        />
        
      </div>
      
      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="user-modal-title">
        <Box className="userModal">
          <h2 id="user-modal-title">{isEditing ? 'Edit User' : 'Add User'}</h2>
          <TextField label="User ID" fullWidth margin="dense" value={userForm.userId} onChange={(e) => setUserForm({ ...userForm, userId: e.target.value })} disabled={isEditing} />
          <TextField label="Last Name" fullWidth margin="dense" value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} />
          <TextField label="First Name" fullWidth margin="dense" value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} />
          <TextField label="Middle Name" fullWidth margin="dense" value={userForm.middleName} onChange={(e) => setUserForm({ ...userForm, middleName: e.target.value })} />
          <TextField label="Username" fullWidth margin="dense" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} />
          <FormControl fullWidth margin="dense" variant="filled">
            <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
            <FilledInput
              id="filled-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button variant="contained" onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Add User'}</Button>
          <Button variant="outlined" onClick={handleCloseModal} sx={{ ml: 1 }}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}