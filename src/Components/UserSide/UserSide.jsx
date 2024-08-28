import React, { useEffect, useState } from 'react';
import Header from './Header';
import SideNavbar from './SideNavbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import logoImage1 from '../../Images/citbglogo.png';
import vehicleImage from '../../Images/Vehicle1.jpg'; 
import vehicleImage2 from "../../Images/Vehicle2.jpg";
import vehiclesubImage1 from "../../Images/busimage.jpg";
import vehiclesubImage2 from "../../Images/busimage2.jpg";
import vehiclesubImage3 from "../../Images/busimage3.jpg";
import vehiclesubImage4 from "../../Images/coasterimage.jpg";
import vehiclesubImage5 from "../../Images/coasterimage2.jpg";
import vehiclesubImage6 from "../../Images/coasterimage3.jpg";
import defaultVehicleImage from "../../Images/defualtVehicle.png";
import { BiSolidDiamond } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { FaBus } from "react-icons/fa";
import '../../CSS/UserCss/UserSide.css';

const UserSide = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]); 
  const [currentSlide, setCurrentSlide] = useState(0); 

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVehicleDetails = async () =>{
      try {
        const response = await fetch("http://localhost:8080/vehicle/getAll", {
          headers: { "Authorization" : `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          console.error("Expected an array from API but got:", data);
          setVehicles([]);
        }
        
        setLoading(false); 
      } catch (error) {
        console.error("Failed to fetch vehicle details", error);
        setLoading(false);
      }
    };
    
    fetchVehicleDetails();
  }, [token]);

  const getVehicleImage = (vehicleType) => {
    switch (vehicleType) {
      case 'Bus':
        return vehicleImage;
      case 'Coaster':
        return vehicleImage2;
      default:
        return defaultVehicleImage; 
    }
  };

  const imageGrids = [
    [vehiclesubImage1, vehiclesubImage2, vehiclesubImage3],
    [vehiclesubImage4, vehiclesubImage5, vehiclesubImage6],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % imageGrids.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [imageGrids.length]);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <SideNavbar />
        <div className="content">
          {loading ? (
            <div>
              <Skeleton height={40} width={300} style={{ marginBottom: '20px' }} />
              <Skeleton height={20} width={400} style={{ marginBottom: '10px' }} />
              <Skeleton height={40} width={200} style={{ marginBottom: '40px' }} />
              <div className="container">
                <div className="vehicle-list">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="vehicle-item">
                      <Skeleton height={150} />
                      <div className="vehicle-info">
                        <Skeleton width={300} height={200} />
                        <div className="vehicle-text">
                          <Skeleton count={4} />
                        </div>
                        <Skeleton height={50} width={150} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="another-container">
                  <Skeleton height={300} width="100%" />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1><FaBook style={{marginBottom: "-3px,", marginRight: "5px", color: "#782324"}}/> Reservation</h1>
              <div className="instruction-and-button">
                <p>Please choose the right capacity of your vehicle</p>
                <button className="btn-beside-text">
                  <BiSolidDiamond style={{marginRight: "10px", marginBottom: "-3px"}}/>
                  Special Reservation
                </button>
              </div>
              <div className="container">
                <div className="vehicle-list">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-item">
                      <div className="vehicle-info">
                        <img src={getVehicleImage(vehicle.vehicleType)} alt={vehicle.vehicleType} className="vehicle-image" />
                        <div className="vehicle-text">
                          <h2 style={{marginBottom: "20px"}}>
                            <FaBus style={{marginBottom: "-2px", marginRight: "10px"}}/>
                            {vehicle.vehicleType}
                          </h2>
                          <p>Plate Number: <span style={{marginLeft: "5px", color: "#782324"}}>{vehicle.plateNumber}</span></p>
                          <p>👥 Capacity: <span style={{marginLeft: "5px", color: "#782324"}}>{vehicle.capacity}</span></p>
                          <p>{vehicle.status === 'Available' ? '🟢' : '🔴'} Status: <span style={{color: vehicle.status === 'Available' ? 'green' : 'red', marginLeft: "5px"}}>{vehicle.status}</span></p>
                        </div>
                        <button className="btn-right-corner">
                          <FaBus style={{marginBottom: "-2px", marginRight: "10px"}}/>
                          Select Vehicle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="another-container">
                  <div className="inner-container">
                    <label className="events-label">📣 Events and Updates</label>
                  </div>
                  <div className="events-list">
                    {events.length > 0 ? (
                      events.map((event, index) => (
                        <div key={index} className="event-item">
                          <p>{event.title}</p>
                        </div>
                      ))
                    ) : (
                      <p className="no-events-label">No Events</p>
                    )}
                  </div>
                </div>
              </div>
              <img src={logoImage1} alt="Logo" className="logo-image1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSide;
