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
import { Link } from 'react-router-dom';
import usePolicy from 'plugins/iam/components/usePolicy';
import { Backdrop, RouterLink } from 'components/index';
import UserNav from 'components/navbar/UserNav';
import noop from 'lodash/noop';

export default function () {
  const policy = usePolicy();
  const [isActive, setActive] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    const lastActive = localStorage.getItem('activeNavGroup');
    if (!lastActive) {
      return noop;
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

  const firstGrantedContentLink =  [
    (policy.isGranted('cms-view-articles') && { label: 'Articles', to: '/news/articles' }),
    (policy.isGranted('cms-view-galleries') && { label: 'Galleries', to: '/curator/galleries' }),
    (policy.isGranted('cms-view-pages') && { label: 'Pages', to: '/canvas/pages' }),
    (policy.isGranted('cms-view-polls') && { label: 'Polls', to: '/apollo/polls' }),
    (policy.isGranted('cms-view-videos') && { label: 'Videos', to: '/ovp/videos' }),
  ].filter(Boolean)[0];

  const firstGrantedTaxonomyLink =  [
    (policy.isGranted('cms-view-categories') && { label: 'Categories', to: '/taxonomy/categories' }),
    (policy.isGranted('cms-view-channels') && { label: 'Channels', to: '/taxonomy/channels' }),
    (policy.isGranted('cms-view-people') && { label: 'People', to: '/people/people' }),
  ].filter(Boolean)[0];

  const firstGrantedStructureLink =  [
    (policy.isGranted('cms-view-promotions') && { label: 'Promotions', to: '/curator/promotions' }),
    (policy.isGranted('cms-view-teasers') && { label: 'Teasers', to: '/curator/teasers' }),
    (policy.isGranted('cms-view-timelines') && { label: 'Timelines', to: '/curator/timelines'}),
    (policy.isGranted('cms-view-sponsors') && { label: 'Sponsors', to: '/boost/sponsors' }),
    (policy.isGranted('cms-view-widgets') &&  { label: 'Widgets', to: '/curator/widgets' }),
  ].filter(Boolean)[0];

  const firstGrantedAdminLink =  [
    (policy.isGranted('cms-view-users') && { label: 'Users', to: '/iam/users' }),
    (policy.isGranted('cms-view-roles') && { label: 'Roles', to: '/iam/roles' }),
    (policy.isGranted('cms-view-apps') && { label: 'Apps', to: '/iam/apps' }),
    (policy.isGranted('cms-view-flagsets') && { label: 'Flagsets', to: '/sys/flagsets' }),
    (policy.isGranted('cms-view-picklists') &&  { label: 'Picklists', to: '/sys/picklists' }),
    (policy.isGranted('cms-view-redirects') &&  { label: 'Redirects', to: '/sys/redirects' }),
  ].filter(Boolean)[0];

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
              <DropdownToggle tag={Link} to={firstGrantedContentLink ? firstGrantedContentLink.to : '/news/articles'}  onClick={() => toggle('content')} nav>Content</DropdownToggle>
              <DropdownMenu className="nav-dropdown-menu">
                {policy.isGranted('cms-view-articles') && (
                  <RouterLink to="/news/articles" className="dropdown-item" onClick={() => toggle('content')}>Articles</RouterLink>
                )}
                {policy.isGranted('cms-view-galleries') && (
                  <RouterLink to="/curator/galleries" className="dropdown-item" onClick={() => toggle('content')}>Galleries</RouterLink>
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
              <DropdownToggle tag={Link} to={firstGrantedTaxonomyLink ? firstGrantedTaxonomyLink.to : '/taxonomy/categories'} onClick={() => toggle('taxonomy')} nav>Taxonomy</DropdownToggle>
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
           {policy.isGranted('cms-view-asset') && (
                <NavItem className={isGroupActive('asset') ? 'is-current' : ''}>
                <RouterLink to="/dam/assets" navTab onClick={() => toggle('asset')}>Assets</RouterLink>
              </NavItem>
          )}
          {policy.isGranted('cms-view-structure') && (
            <UncontrolledDropdown inNavbar nav className={isGroupActive('structure') ? 'is-current' : ''}>
              <DropdownToggle tag={Link} to={firstGrantedStructureLink ? firstGrantedStructureLink.to : '/curator/promotions'} onClick={() => toggle('structure')} nav>Structure</DropdownToggle>
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
              <DropdownToggle tag={Link} to={firstGrantedAdminLink ? firstGrantedAdminLink.to : '/iam/users'} onClick={() => toggle('admin')} nav>Admin</DropdownToggle>
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
