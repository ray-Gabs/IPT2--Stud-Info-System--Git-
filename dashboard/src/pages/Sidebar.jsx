// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <nav>
        <div className="tab" onClick={() => navigate("/")}>
          <HomeIcon /> <span>Home</span>
        </div>
        <div className="tab" onClick={() => navigate("/manageStudent")}>
          <InfoIcon /> <span>Manage Student</span>
        </div>
        <div className="tab" onClick={() => navigate("/manageUsers")}>
          <AccountBoxIcon /> <span>Users</span>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;



