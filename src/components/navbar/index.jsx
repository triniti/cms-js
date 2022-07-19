import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap';
import usePolicy from 'plugins/iam/components/usePolicy';
import { Backdrop, RouterLink } from 'components/index';
import UserNav from 'components/navbar/UserNav';

export default function () {
  const policy = usePolicy();
  const [isActive, setActive] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    const lastActive = localStorage.getItem('activeNavGroup');
    if (!lastActive) {
      return;
    }

    setActiveGroup(lastActive);
    isGroupActive(localStorage.getItem('activeNavGroup'));
  }, []);

  const isGroupActive = (group) => activeGroup === group;
  const toggle = (group) => {
    setActive(!isActive);
    setActiveGroup(group);
    localStorage.setItem('activeNavGroup', group);
  };

  return (
    <Navbar className="navbar-main">
      <NavbarToggler onClick={toggle} className={isActive ? 'is-open' : ''}>
        <span className="navbar-toggler-bar navbar-toggler-bar--top" />
        <span className="navbar-toggler-bar navbar-toggler-bar--middle" />
        <span className="navbar-toggler-bar navbar-toggler-bar--bottom" />
      </NavbarToggler>
      <NavbarBrand tag="div">
        <RouterLink to="/" />
      </NavbarBrand>
      <div className={`navbar-toggleable-md main-nav ${isActive ? 'is-open' : ''}`}>
        <Nav navbar>
          <NavItem className={isGroupActive('dashboard') ? 'is-current' : ''}>
            <RouterLink to="/" navTab onClick={() => toggle('dashboard')}>Dashboard</RouterLink>
          </NavItem>
          {policy.isGranted('cms-view-content') && (
            <UncontrolledDropdown inNavbar nav className={isGroupActive('content') ? 'is-current' : ''}>
              <DropdownToggle nav>Content</DropdownToggle>
              <DropdownMenu className="nav-dropdown-menu">
                {policy.isGranted('cms-view-articles') && (
                  <RouterLink to="/news/articles" className="dropdown-item" onClick={() => toggle('content')}>Articles</RouterLink>
                )}
                {policy.isGranted('cms-view-pages') && (
                  <RouterLink to="/canvas/pages" className="dropdown-item" onClick={() => toggle('content')}>Pages</RouterLink>
                )}
                {policy.isGranted('cms-view-polls') && (
                  <RouterLink to="/apollo/polls" className="dropdown-item" onClick={() => toggle('content')}>Polls</RouterLink>
                )}
                {policy.isGranted('cms-view-videos') && (
                  <RouterLink to="/ovp/videos" className="dropdown-item" onClick={() => toggle('content')}>Videos</RouterLink>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-taxonomy') && (
            <UncontrolledDropdown inNavbar nav className={isGroupActive('taxonomy') ? 'is-current' : ''}>
              <DropdownToggle nav>Taxonomy</DropdownToggle>
              <DropdownMenu className="nav-dropdown-menu">
                {policy.isGranted('cms-view-categories') && (
                  <RouterLink to="/taxonomy/categories" className="dropdown-item" onClick={() => toggle('taxonomy')}>Categories</RouterLink>
                )}
                {policy.isGranted('cms-view-channels') && (
                  <RouterLink to="/taxonomy/channels" className="dropdown-item" onClick={() => toggle('taxonomy')}>Channels</RouterLink>
                )}
                {policy.isGranted('cms-view-people') && (
                  <RouterLink to="/people/people" className="dropdown-item" onClick={() => toggle('taxonomy')}>People</RouterLink>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-structure') && (
            <UncontrolledDropdown inNavbar nav className={isGroupActive('structure') ? 'is-current' : ''}>
              <DropdownToggle nav>Structure</DropdownToggle>
              <DropdownMenu className="nav-dropdown-menu">
                {policy.isGranted('cms-view-promotions') && (
                  <RouterLink to="/curator/promotions" className="dropdown-item" onClick={() => toggle('structure')}>Promotions</RouterLink>
                )}
                {policy.isGranted('cms-view-teasers') && (
                  <RouterLink to="/curator/teasers" className="dropdown-item" onClick={() => toggle('structure')}>Teasers</RouterLink>
                )}
                {policy.isGranted('cms-view-timelines') && (
                  <RouterLink to="/curator/timelines" className="dropdown-item" onClick={() => toggle('structure')}>Timelines</RouterLink>
                )}
                {policy.isGranted('cms-view-sponsors') && (
                  <RouterLink to="/boost/sponsors" className="dropdown-item" onClick={() => toggle('structure')}>Sponsors</RouterLink>
                )}
                {policy.isGranted('cms-view-widgets') && (
                  <RouterLink to="/curator/widgets" className="dropdown-item" onClick={() => toggle('structure')}>Widgets</RouterLink>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-notify') && (
            <NavItem className={isGroupActive('notify') ? 'is-current' : ''}>
              <RouterLink to="/notify/notifications" navTab onClick={() => toggle('notify')}>Notifications</RouterLink>
            </NavItem>
          )}
          {policy.isGranted('cms-view-admin') && (
            <UncontrolledDropdown inNavbar nav className={isGroupActive('admin') ? 'is-current' : ''}>
              <DropdownToggle nav>Admin</DropdownToggle>
              <DropdownMenu className="nav-dropdown-menu">
                {policy.isGranted('cms-view-users') && (
                  <RouterLink to="/iam/users" className="dropdown-item" onClick={() => toggle('admin')}>Users</RouterLink>
                )}
                {policy.isGranted('cms-view-roles') && (
                  <RouterLink to="/iam/roles" className="dropdown-item" onClick={() => toggle('admin')}>Roles</RouterLink>
                )}
                {policy.isGranted('cms-view-apps') && (
                  <RouterLink to="/iam/apps" className="dropdown-item" onClick={() => toggle('admin')}>Apps</RouterLink>
                )}
                {policy.isGranted('cms-view-flagsets') && (
                  <RouterLink to="/sys/flagsets" className="dropdown-item" onClick={() => toggle('admin')}>Flagsets</RouterLink>
                )}
                {policy.isGranted('cms-view-picklists') && (
                  <RouterLink to="/sys/picklists" className="dropdown-item" onClick={() => toggle('admin')}>Picklists</RouterLink>
                )}
                {policy.isGranted('cms-view-redirects') && (
                  <RouterLink to="/sys/redirects" className="dropdown-item" onClick={() => toggle('admin')}>Redirects</RouterLink>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </Nav>
      </div>
      <Backdrop onClick={toggle} />
      <UserNav />
    </Navbar>
  );
}
