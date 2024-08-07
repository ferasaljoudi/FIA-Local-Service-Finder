import React, { useEffect, useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './SignedInHeader.css';
import FiaLogo from '../Assets/FiaLogo.svg';
import { AuthContext } from '../AuthContext';

const backendUrl = process.env.REACT_APP_BACKEND_PORT;

function SignedInHeader() {
  const { logout } = useContext(AuthContext); // Destructure logout from AuthContext
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/users/userinfo`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          const initials = `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase();
          setInitials(initials);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
  
    const handleScroll = () => {
      setShowModal(false); // Close modal on scroll
    };
  
    if (showModal) {
      document.addEventListener('mousedown', handleOutsideClick);
      window.addEventListener('scroll', handleScroll);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    }
  
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showModal]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="header">
      <div className="header-left">
        <NavLink to="/profile"><img src={FiaLogo} alt="FiaLogo" className="logo" /></NavLink>
      </div>
      <div className="header-middle">
        <NavLink to="/explore-services" className={({ isActive }) => (isActive ? 'active-link' : '')}>Explore Services</NavLink>
        <NavLink to="/post-services" className={({ isActive }) => (isActive ? 'active-link' : '')}>Post Services</NavLink>
      </div>
      <div className="header-right">
        <div className="initials-circle" onClick={toggleModal}>
          {initials}
        </div>
        <div className={`modalCustom ${showModal ? 'slide-in' : ''}`} ref={modalRef}>
          <div className="modal-content">
            <NavLink to="/profile" onClick={toggleModal} className={({ isActive }) => (isActive ? 'active-link-modal' : '')}>Profile</NavLink>
            <NavLink to="/account-settings" onClick={toggleModal} className={({ isActive }) => (isActive ? 'active-link-modal' : '')}>Account Settings</NavLink>
            <NavLink to="/" onClick={() => { logout(); toggleModal(); }} className={({ isActive }) => (isActive ? 'active-link-modal' : '')}>Logout</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SignedInHeader;
