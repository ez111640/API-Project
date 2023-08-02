import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
    <ul className = "nav-bar">
      <li className = "leftNav">
      <i className="fa-brands fa-airbnb"></i>
        <NavLink exact to="/">airbnb</NavLink>
      </li>

      {isLoaded && (
        <div className = "rightNav">
          <li><NavLink exact to="/spots/new">Create a Spot</NavLink></li>
        <li >
          <ProfileButton user={sessionUser} />
        </li>
        </div>
      )}
    </ul>
    </>
  );
}

export default Navigation;
