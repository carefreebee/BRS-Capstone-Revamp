import React, { useEffect, useState } from 'react';
import { FaSortAlphaDown, FaSwatchbook } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import '../../CSS/UserCss/ManageRequest.css';
import logoImage1 from "../../Images/citbglogo.png";
import Header from './Header';
import ResendRequestModal from './ResendRequestModal';
import SideNavbar from './SideNavbar';

const ManageRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const localPart = email.split('@')[0];
  const [firstName, lastName] = localPart.split('.');
  const [message, setMessage] = useState("");
  const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  const username = formatName(firstName) + " " + formatName(lastName);

  const fetchUsersRequests = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/reservations/${username}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch user's requests.", error);
    }
  };

  const updateRequest = async (updatedRequest) => {
    setRequests(prevRequests => 
        prevRequests.map(request => 
            request.id === updatedRequest.id ? updatedRequest : request
        )
    );  
  };

  useEffect(() => {
    fetchUsersRequests();
  }, [token, username]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortRequests = (requests) => {
    const sorted = [...requests];
    switch (sortOption) {
      case "status":
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case "schedule":
        return sorted.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
      case "typeOfTrip":
        return sorted.sort((a, b) => a.typeOfTrip.localeCompare(b.typeOfTrip));
      case "department":
        return sorted.sort((a, b) => a.department.localeCompare(b.department));
      default:
        return sorted;
    }
  };

  const sortedRequests = sortRequests(requests);
  const filteredRequests = sortedRequests.filter(request =>
    (request.reason || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getApprovalStatus = (request) => {
    const statuses = [];
    if (request.headIsApproved) {
      statuses.push(<span className="mr-status-approved">Approved (Head)</span>);
    } else if (!request.headIsApproved && request.status === 'Pending') {
      statuses.push(<span className="mr-status-pending">Pending (Head)</span>);
    } else if (request.rejected) {
      statuses.push(<span className="mr-status-rejected">Rejected (Head)</span>);
    }

    if (request.opcIsApproved) {
      statuses.push(<span className="mr-status-approved">Approved (OPC)</span>);
    } else if (!request.opcIsApproved && request.status === 'Pending') {
      statuses.push(<span className="mr-status-pending">Pending (OPC)</span>);
    } else if (request.rejected) {
      statuses.push(<span className="mr-status-rejected">Rejected (OPC)</span>);
    }
    return statuses;
  };

  const handleModalSubmit = async (updatedRequest) => {
    const formattedSchedule = new Date(updatedRequest.schedule).toISOString().split('T')[0];
    const formattedReturnSchedule = updatedRequest.returnSchedule 
        ? new Date(updatedRequest.returnSchedule).toISOString().split('T')[0] 
        : null;

    const updatedData = {
        id: updatedRequest.id,
        typeOfTrip: updatedRequest.typeOfTrip,
        destinationFrom: updatedRequest.destinationFrom,
        destinationTo: updatedRequest.destinationTo,
        capacity: updatedRequest.capacity,
        vehicleType: updatedRequest.vehicleType, 
        plateNumber: updatedRequest.plateNumber,
        schedule: formattedSchedule,  
        returnSchedule: formattedReturnSchedule,
        departureTime: updatedRequest.departureTime,
        pickUpTime: updatedRequest.pickUpTime,
        department: updatedRequest.department,
        reason: updatedRequest.reason,
        approvalProof: updatedRequest.approvalProof,
        reservedVehicles: updatedRequest.reservedVehicles.map(vehicle => ({
            id: vehicle.id,
            vehicleType: vehicle.vehicleType,
            plateNumber: vehicle.plateNumber,
            capacity: vehicle.capacity,
            status: vehicle.status,
            schedule: vehicle.schedule ? new Date(vehicle.schedule).toISOString().split('T')[0] : null,
            returnSchedule: vehicle.returnSchedule 
                ? new Date(vehicle.returnSchedule).toISOString().split('T')[0] 
                : null,
            pickUpTime: vehicle.pickUpTime,
            departureTime: vehicle.departureTime,
            driverId: vehicle.driverId,
            driverName: vehicle.driverName,
        })),
        transactionId: updatedRequest.transactionId,
        fileUrl: updatedRequest.fileUrl,
        status: 'Pending',  
        rejected: false, 
        feedback: updatedRequest.feedback,
        userName: updatedRequest.userName,
        rejectedBy: updatedRequest.rejectedBy,
        opcIsApproved: updatedRequest.opcIsApproved, 
        headIsApproved: updatedRequest.headIsApproved,
    };

    console.log('Updated Data:', updatedData);

    try {
        const response = await fetch(`http://localhost:8080/reservations/update/${updatedRequest.id}?isResending=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData), 
        });

        if (!response.ok) {
            const errorResponse = await response.text(); 
            console.error('Error updating request:', errorResponse);
            throw new Error('Network response was not ok');
        }
        const result = await response.json(); 
        setMessage('Reservation updated successfully!');

        await fetchUsersRequests(); 
        handleCloseModal();
    } catch (error) {
        console.error('Error resending request:', error);
        setMessage('Failed to resend request.');
    }
  };

  const handleRowClick = (request) => {
    if (request.rejected) {
      setSelectedRequest(request);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="app1">
      <Header />
      <div className="main-content1">
        <SideNavbar />
        <div className="content1">
          <div className="header-container">
            <h1><FaSwatchbook style={{ marginRight: "15px", color: "#782324" }} />Manage Requests</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Reason"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /></button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="status">Status</option>
                <option value="schedule">Schedule</option>
                <option value="typeOfTrip">Type of Trip</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
          <div className='container1'>
            <div className='table-container'>
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type of Trip</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Capacity</th>
                    <th>Vehicle</th>
                    <th>Added Vehicle</th>
                    <th>Schedule</th>
                    <th>Return Schedule</th>
                    <th>Departure Time</th>
                    <th>Pick Up Time</th>
                    <th>Department</th>
                    <th className="reason-column">Reason</th>
                    <th>Status</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="15" className="no-requests">No Requests Made</td>
                    </tr>
                  ) : (
                    filteredRequests.reverse().map(request => (
                      <tr 
                        key={request.id} 
                        className={request.rejected ? 'rejected' : ''} 
                        onClick={() => handleRowClick(request)}
                      >
                        <td>{request.transactionId}</td>
                        <td>{request.typeOfTrip}</td>
                        <td>{request.destinationFrom}</td>
                        <td>{request.destinationTo}</td>
                        <td>{request.capacity}</td>
                        <td><span style={{color: "#782324", fontWeight: "700"}}>{request.vehicleType} : </span><span style={{color: "green", fontWeight: "700"}}>{request.plateNumber}</span> </td>
                        <td>
                          {request.reservedVehicles.length > 0 ? (
                            request.reservedVehicles.map((vehicle, index) => (
                              <div key={index}>
                               <span style={{color: "#782324", fontWeight: "700"}}>{vehicle.vehicleType} : </span><span style={{color: "green", fontWeight: "700"}}>{vehicle.plateNumber}</span> 
                              </div>
                            ))
                          ) : (
                            <div>No Vehicles Added</div>
                          )}
                        </td>
                        <td>{request.schedule}</td>
                        <td>{request.returnSchedule ? request.returnSchedule : 'N/A'}</td>
                        <td>{request.departureTime}</td>
                        <td>{request.pickUpTime ? request.pickUpTime : 'N/A'}</td>
                        <td>{request.department}</td>
                        <td className="reason-column">{request.reason}</td>
                        <td>
                          {getApprovalStatus(request).map((status, index) => (
                            <div key={index}>{status}</div>
                          ))}
                        </td>
                        <td>{request.feedback ? request.feedback : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <ResendRequestModal request={selectedRequest} showModal={showModal} onClose={handleCloseModal} onResend={handleModalSubmit} onUpdateRequest={updateRequest} />
          </div>
        </div>
        <img src={logoImage1} alt="Logo" className="logo-image2" />
      </div>
    </div>
  );
};

export default ManageRequest;
