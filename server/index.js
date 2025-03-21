const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());

const usersFile = path.join(__dirname, "User.json");

const loadUsers = () => {
    try {
        if (!fs.existsSync(usersFile)) {
            return []; // Don't create a file, just return empty data
        }

        const data = fs.readFileSync(usersFile, "utf8");

        if (!data.trim()) {  // If file is empty, return empty array
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading users:", error);
        return [];
    }
};
// Function to save users to file
const saveUsers = (users) => {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
    } catch (error) {
        console.error("Error saving users:", error);
    }
};

// Initialize users array
let users = loadUsers();

const cors = require("cors");
app.use(cors());

// ==================== STUDENT ROUTES ====================

let students = [];

// Fetch all students
app.get("/fetchstudents", (req, res) => {
    const validStudents = students.filter(student =>
        student.idno && student.fn && student.ln && student.course && student.year
    );
    res.json(validStudents);
});

// Add a new student
app.post("/addstudents", (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    res.status(201).json(newStudent);
    console.log("New student added:", newStudent);
});

// Edit a student by ID
app.put("/editstudent/:idno", (req, res) => {
    const { idno } = req.params;
    const updatedStudent = req.body;

    const index = students.findIndex(student => student.idno === idno);
    if (index !== -1) {
        students[index] = { ...students[index], ...updatedStudent };
        res.json(students[index]);
        console.log("Updated student:", students[index]);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

//Delete a student by ID
app.delete("/deletestudent/:idno", (req, res) => {
    const { idno } = req.params;
    const initialLength = students.length;
    
    students = students.filter(student => student.idno !== idno);

    if (students.length < initialLength) {
        res.json({ message: `Student with ID ${idno} deleted successfully` });
        console.log(`Deleted student with ID ${idno}`);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

// ==================== USER ROUTES ====================

// Fetch all users
app.get("/fetchusers", (req, res) => {
    users = loadUsers();
    res.json(users);
});

// Add a new user
app.post("/addusers", (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    saveUsers(users);
    res.status(201).json(newUser);
    console.log("New user added:", newUser);
});

// Edit a user by userId
app.put("/edituser/:userId", (req, res) => {
    const { userId } = req.params;
    const updatedUser = req.body;

    const index = users.findIndex(user => user.userId === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        saveUsers(users);
        res.json(users[index]);
        console.log("User updated:", users[index]);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

// Delete a user by userId
app.delete("/deleteuser/:userId", (req, res) => {
    const { userId } = req.params;
    const initialLength = users.length;

    users = users.filter(user => user.userId !== userId);
    saveUsers(users);

    if (users.length < initialLength) {
        res.json({ message: `User with ID ${userId} deleted successfully` });
        console.log(`Deleted user with ID ${userId}`);
    } else {
        res.status(404).json({ error: "User not found" });
    }
});


// Start the API server
const port = 1337;
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});


// ==================== Login ROUTES ====================

// Login route: Authenticate user
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Reload users to get the latest data
    users = loadUsers();

    // Find user with matching username and password
    const foundUser = users.find(user => user.username === username && user.password === password);

    if (foundUser) {
        res.json({ success: true, authToken: "your_secure_token_here", user: foundUser });
    } else {
        res.status(401).json({ success: false, message: "Invalid username or password" });
    }
}); 