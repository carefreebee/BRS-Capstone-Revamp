import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Homepage';
import Login from './Components/UserSide/Login';
import ManageRequests from './Components/UserSide/ManageRequest';
import HeadApprovedRequests from './Components/HeadSide/HeadApprovedRequests';
import UserSide from './Components/UserSide/UserSide';
import Settings from './Components/UserSide/Settings';
import HeadSettings from './Components/HeadSide/HeadSettings';
import Reservation from './Components/UserSide/Reservation';
import HeadSide from './Components/HeadSide/HeadSide';
import OpcDashboard from './Components/OpcSide/OpcDashboard';
import OpcRequests from './Components/OpcSide/OpcRequests';
import VehicleManagement from './Components/OpcSide/VehicleManagement';
import DriverManagement from './Components/OpcSide/DriverManagement';
import OpcSettings from './Components/OpcSide/OpcSettings';
import Error404 from './Components/Error404';

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user-authentication" element={<Login />} />
        <Route path="/manage-requests" element={<ManageRequests />} />
        <Route path="/head-approved-requests" element={<HeadApprovedRequests />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/head-settings" element={<HeadSettings/>} />
        <Route path="/user-side" element={<UserSide/>} />
        <Route path="/head-side" element={<HeadSide/>} />
        <Route path="/user-side/reservation" element={<Reservation/>} />
        <Route path="/dashboard" element={<OpcDashboard/>} />
        <Route path="/opc-requests" element={<OpcRequests/>} />
        <Route path="/vehicle-management" element={<VehicleManagement/>} />
        <Route path="/driver-management" element={<DriverManagement/>} />
        <Route path="/opc-settings" element={<OpcSettings/>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
