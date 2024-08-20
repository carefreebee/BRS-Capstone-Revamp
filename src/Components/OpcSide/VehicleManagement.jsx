import React, { useState, useEffect } from 'react';
import Header from '../../Components/UserSide/Header';
import logoImage1 from "../../Images/citbglogo.png";
import SideNavbar from './OpcNavbar';
import { FaBus } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FaSortAlphaDown } from "react-icons/fa";
import { MdAddCircle, MdOutlineBusAlert } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import '../../CSS/OpcCss/VehicleManagement.css';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]); // State to store vehicles
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const [vehicleType, setVehicleType] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [vehicleImage, setVehicleImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  useEffect(() => {
    // Fetch vehicles when the component mounts
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:8080/vehicle/vehicles');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await response.json();
        setVehicles(data); // Store fetched vehicles in state
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    // Additional logic for search click if needed
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortVehicle = (requests) => {
    switch (sortOption) {
      case "alphabetical":
        return requests.sort((a, b) => a.vehicleType.localeCompare(b.vehicleType));
      case "ascending":
        return requests.sort((a, b) => a.capacity - b.capacity);
      case "descending":
        return requests.sort((a, b) => b.capacity - a.capacity);
      default:
        return requests;
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setIsClosing(false);
  };

  const closeAddModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsAddModalOpen(false);
    }, 300); // Match the duration of the slideDown animation
  };

  const openDeleteModal = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedVehicleId(null);
  };

  const handleFileChange = (event) => {
    setVehicleImage(event.target.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setVehicleImage(event.dataTransfer.files[0]);
    }
  };

  const handleAddVehicle = async () => {
    try {
      const formData = new FormData();
      formData.append('vehicleType', vehicleType);
      formData.append('plateNumber', plateNumber);
      formData.append('capacity', capacity);
  
      const response = await fetch('http://localhost:8080/vehicle/post', { 
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to add vehicle: ' + errorText);
      }
  
      setSuccessMessage('Vehicle added successfully!');
      setVehicleType('');
      setPlateNumber('');
      setCapacity('');
      setVehicleImage(null);

      // Refresh the vehicle list after adding a new vehicle
      const updatedVehicles = await fetch('http://localhost:8080/vehicle/vehicles');
      const data = await updatedVehicles.json();
      setVehicles(data);

    } catch (error) {
      setErrorMessage('Error adding vehicle: ' + error.message);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      const response = await fetch(`http://localhost:8080/vehicle/delete/${selectedVehicleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }

      setSuccessMessage('Vehicle deleted successfully!');
      closeDeleteModal();

      // Refresh the vehicle list after deletion
      const updatedVehicles = await fetch('http://localhost:8080/vehicle/vehicles');
      const data = await updatedVehicles.json();
      setVehicles(data);

    } catch (error) {
      setErrorMessage('Error deleting vehicle: ' + error.message);
    }
  };

  return (
    <div className="vehiclemanage">
      <Header />
      <div className={`vehicle-manage-content1 ${isAddModalOpen ? 'dimmed' : ''}`}>
        <SideNavbar />
        <div className="vehicle1">
          <div className="header-container">
            <h1><FaBus style={{ marginRight: "15px", color: "#782324" }} />Vehicle Management</h1>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Vehicle"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
              />
              <button onClick={handleSearchClick} className="search-button"><IoSearch style={{ marginBottom: "-3px" }} /> Search</button>
              <FaSortAlphaDown style={{ color: "#782324" }} />
              <select onChange={handleSortChange} className="sort-dropdown">
                <option value="">Sort By</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="ascending">Capacity Ascending</option>
                <option value="descending">Capacity Descending</option>
              </select>
              <button className='add-vehicle-btn' onClick={openAddModal}><MdAddCircle style={{ marginRight: "10px", marginBottom: "-2px" }} />Add new Vehicle</button>
            </div>
          </div>
          <div className='vehicle-list-container'>
            <table className="vehicle-table">
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  <th>Plate Number</th>
                  <th>Maximum Capacity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-vehicles"><MdOutlineBusAlert style={{fontSize: "24px", marginBottom: "-2px"}}/> No Vehicle Registered</td>
                  </tr>
                ) : (
                  vehicles.map((vehicle, index) => (
                    <tr key={index}>
                      <td>{vehicle.vehicleType}</td>
                      <td>{vehicle.plateNumber}</td>
                      <td>{vehicle.capacity}</td>
                      <td>{vehicle.status}</td>
                      <td>
                        <button className="update-button">Update</button>
                        <button className="delete-button" onClick={() => openDeleteModal(vehicle.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <img src={logoImage1} alt="Logo" className="vehicle-logo-image" />
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className={`vehicle-modal-overlay ${isClosing ? 'vehicle-modal-closing' : ''}`}>
          <div className={`vehicle-modal ${isClosing ? 'vehicle-modal-closing' : ''}`}>
            <h2>Add New Vehicle <button className="close-vehicle-btn" onClick={closeAddModal}><IoIosCloseCircle style={{fontSize: "32px", marginBottom: "-8px"}}/></button></h2>
            <div className='add-vehicle-input'>
              <label htmlFor='vehicle-name'>Vehicle Name</label>
              <input
                type="text"
                placeholder="Ex. Coaster"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
              <label htmlFor='vehicle-plate-number'>Plate Number</label>
              <input
                type="text"
                placeholder="Ex. GAB1234"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
              />
              <label htmlFor='vehicle-capacity'>Maximum Capacity</label>
              <input
                type="number"
                placeholder="Ex. 30"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
              <label htmlFor='vehicle-image'>Upload Image</label>
              <div 
                className={`dropzone ${dragActive ? 'drag-active' : ''}`} 
                onDragOver={handleDragOver} 
                onDragLeave={handleDragLeave} 
                onDrop={handleDrop}
              >
                {vehicleImage ? (
                  <div className="file-info">
                    <p>{vehicleImage.name}</p>
                  </div>
                ) : (
                  <p>Drag & drop your image here or click to select</p>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="file-input"
                />
              </div>
            </div>
            <div className='add-vehicle-buttons'>
              <button onClick={handleAddVehicle} className='add-vehicle-submit-btn'>Add Vehicle</button>
            </div>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <h2>Are you sure you want to delete this vehicle?</h2>
            <div className="delete-modal-buttons">
              <button className="cancel-button" onClick={closeDeleteModal}>Cancel</button>
              <button className="delete-button-confirm" onClick={handleDeleteVehicle}>Delete Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;