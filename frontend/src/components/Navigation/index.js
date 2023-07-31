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
        <NavLink exact to="/">airbnb</NavLink>
      </li>
      {isLoaded && (
        <li className = "rightNav">
          <span className = "floatRight"><ProfileButton user={sessionUser} /></span>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
