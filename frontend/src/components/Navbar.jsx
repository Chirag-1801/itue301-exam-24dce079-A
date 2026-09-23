import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">MedCare Plus</Link>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
          Home
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Doctors
        </NavLink>
        <NavLink to="/booking" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Booking
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
