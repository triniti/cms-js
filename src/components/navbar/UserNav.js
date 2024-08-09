import Swal from 'sweetalert2';
import React from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import getUser from '@triniti/cms/plugins/iam/selectors/getUser.js';
import changeTheme from '@triniti/cms/actions/changeTheme.js';
import getTheme from '@triniti/cms/selectors/getTheme.js';
import Icon from '@triniti/cms/components/icon/index.js';

const okToLogout = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, logout!',
    reverseButtons: true,
  });

  return result.value;
};

export default function UserNav(props) {
  const { ravenStatus = 'disconnected' } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const theme = useSelector(getTheme);

  if (!user) {
    return null;
  }

  const handleLogout = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (await okToLogout()) {
      navigate('/logout');
    }
  };

  const handleToggleDarkMode = (event) => {
    event.preventDefault();
    dispatch(changeTheme(theme !== 'dark' ? 'dark' : 'light'));
  };

  return (
    <UncontrolledDropdown className="dropdown-usernav">
      <DropdownToggle color="usernav" className="rounded-circle">
        <Icon imgSrc="user" />
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-arrow-right">
        <DropdownItem header>
          {user.get('title')}
        </DropdownItem>
        {/*
        <DropdownItem onClick={handleToggleDarkMode}>
          Toggle Dark Mode
        </DropdownItem>
        */}
        <DropdownItem text>
          {APP_ENV} ({APP_VERSION})
        </DropdownItem>
        <DropdownItem text>
          Raven: {ravenStatus}
        </DropdownItem>
        <DropdownItem onClick={handleLogout}>
          Logout
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
