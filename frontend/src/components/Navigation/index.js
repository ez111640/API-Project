import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
      <ul className="nav-bar">
        <li className="leftNav">
        <NavLink exact to="/">
          <i className="fa-solid fa-tree">
            Retreets</i></NavLink>
        </li>

        {isLoaded && (
          <div className="rightNav">
            <li>{sessionUser && <NavLink exact to="/spots/new">Create a New Spot</NavLink>}</li>
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
