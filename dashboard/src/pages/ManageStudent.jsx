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

import './ManageStudent.css';

// Styled Components
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

// Modal Style
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

export default function ManageStudent() {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const [studentForm, setStudentForm] = useState({
    idno: '',
    fn: '',
    ln: '',
    mn: '',
    course: '',
    year: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);
const fetchStudents = async () => {
    try {
        const { data } = await axios.get('http://localhost:1337/fetchstudents');
        const filteredData = data.filter(student => 
            student.idno && student.fn && student.ln && student.course && student.year
        );
        setStudents(filteredData);
    } catch (error) {
        console.error('ERROR Fetching Students:', error);
    }
};

  const handleOpenModal = (student = null) => {
    setSelectedStudent(student);
    setIsEditing(!!student);

    if (student) {
      setStudentForm({
        idno: student.idno,
        fn: student.fn,
        ln: student.ln,
        mn: student.mn,
        course: student.course,
        year: student.year,
      });
    } else {
      setStudentForm({ idno: '', fn: '', ln: '', mn: '', course: '', year: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handleSubmit = async () => {
    if (!studentForm.idno || !studentForm.fn || !studentForm.ln || !studentForm.course || !studentForm.year) {
        alert("All fields are required!");
        return;
    }

    try {
        if (isEditing) {
            await axios.put(`http://localhost:1337/editstudent/${selectedStudent.idno}`, studentForm);
        } else {
            await axios.post('http://localhost:1337/addstudents', studentForm);
        }
        fetchStudents();
        handleCloseModal();
    } catch (error) {
        console.error(`ERROR ${isEditing ? 'Updating' : 'Adding'} Student:`, error);
    }
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  //deltee student
  const handleDeleteStudent = async (idno) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }
  
    try {
      await axios.delete(`http://localhost:1337/deletestudent/${idno}`);
      fetchStudents(); 
    } catch (error) {
      console.error("ERROR Deleting Student:", error);
      alert("Error deleting student. Check console for details.");
    }
  };
  return (
    <div className="manageStudentCont">
      <Sidebar />
      <div className="manageStudentMain">
        <h1>Manage Student</h1>
        <div className="BTNADD">
          <Button variant="contained" sx={{ float: 'right', mb: 2 }} onClick={() => handleOpenModal()}>
            Add Student
          </Button>
        </div>
        <div className="studTableManagement">
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID Number</StyledTableCell>
                  <StyledTableCell>First Name</StyledTableCell>
                  <StyledTableCell>Middle Name</StyledTableCell>
                  <StyledTableCell>Last Name</StyledTableCell>
                  <StyledTableCell>Course</StyledTableCell>
                  <StyledTableCell>Year</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => (
                    <StyledTableRow key={student.idno}>
                      <StyledTableCell>{student.idno}</StyledTableCell>
                      <StyledTableCell>{student.fn}</StyledTableCell>
                      <StyledTableCell>{student.mn}</StyledTableCell>
                      <StyledTableCell>{student.ln}</StyledTableCell>
                      <StyledTableCell>{student.course}</StyledTableCell>
                      <StyledTableCell>{student.year}</StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon sx={{ cursor: 'pointer' }} onClick={() => handleOpenModal(student)} />
                        <DeleteIcon sx={{ cursor: 'pointer', ml: 1 }} onClick={() => handleDeleteStudent(student.idno)} />
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
        count={students.length}
        rowsPerPage={10}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]} 
/>
      </div>

      <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="student-modal-title">
        <Box className="studentModal">
          <h2 id="student-modal-title">{isEditing ? 'Edit Student' : 'Add Student'}</h2>
          <TextField
            label="ID Number"
            fullWidth
            margin="dense"
            value={studentForm.idno}
            onChange={(e) => setStudentForm({ ...studentForm, idno: e.target.value })}
            disabled={isEditing}
          />
          <TextField label="First Name" fullWidth margin="dense" value={studentForm.fn} onChange={(e) => setStudentForm({ ...studentForm, fn: e.target.value })} />
          <TextField label="Middle Name" fullWidth margin="dense" value={studentForm.mn} onChange={(e) => setStudentForm({ ...studentForm, mn: e.target.value })} />
          <TextField label="Last Name" fullWidth margin="dense" value={studentForm.ln} onChange={(e) => setStudentForm({ ...studentForm, ln: e.target.value })} />
          <TextField label="Course" fullWidth margin="dense" value={studentForm.course} onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })} />
          <TextField label="Year" fullWidth margin="dense" value={studentForm.year} onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })} />

          <Button variant="contained" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Student'}
          </Button>
          <Button variant="outlined" onClick={handleCloseModal} sx={{ ml: 1 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
