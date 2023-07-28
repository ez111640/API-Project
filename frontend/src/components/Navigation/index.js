import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul>
      <li className = "leftNav">
      <i className="fa-brands fa-airbnb"></i>
        <NavLink exact to="/"><span className="logo">airbnb</span></NavLink>
      </li>
      {isLoaded && (
        <li className = "rightNav">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
