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

  const contentLinks = [
    { label: 'Articles', to: '/news/articles', policy: 'cms-view-articles' },
    { label: 'Galleries', to: '/curator/galleries', policy: 'cms-view-galleries' },
    { label: 'Pages', to: '/canvas/pages', policy: 'cms-view-pages' },
    { label: 'Polls', to: '/apollo/polls', policy: 'cms-view-polls' },
    { label: 'Videos', to: '/ovp/videos', policy: 'cms-view-videos' },
  ];
  const firstGrantedContentLink = contentLinks.find(link => policy.isGranted(link.policy));

  const taxonomyLinks = [
    { label: 'Categories', to: '/taxonomy/categories', policy: 'cms-view-categories' },
    { label: 'Channels', to: '/taxonomy/channels', policy: 'cms-view-channels' },
    { label: 'People', to: '/people/people', policy: 'cms-view-people' },
  ];
  const firstGrantedTaxonomyLink = taxonomyLinks.find(link => policy.isGranted(link.policy));

  const structureLinks = [
    { label: 'Promotions', to: '/curator/promotions', policy: 'cms-view-promotions' },
    { label: 'Teasers', to: '/curator/teasers', policy: 'cms-view-teasers' },
    { label: 'Timelines', to: '/curator/timelines', policy: 'cms-view-timelines' },
    { label: 'Sponsors', to: '/boost/sponsors', policy: 'cms-view-sponsors' },
    { label: 'Widgets', to: '/curator/widgets', policy: 'cms-view-widgets' },
  ];
  const firstGrantedStructureLink = structureLinks.find(link => policy.isGranted(link.policy));

  const adminLinks = [
    { label: 'Users', to: '/iam/users', policy: 'cms-view-users' },
    { label: 'Roles', to: '/iam/roles', policy: 'cms-view-roles' },
    { label: 'Apps', to: '/iam/apps', policy: 'cms-view-apps' },
    { label: 'Flagsets', to: '/sys/flagsets', policy: 'cms-view-flagsets' },
    { label: 'Picklists', to: '/sys/picklists', policy: 'cms-view-picklists' },
    { label: 'Redirects', to: '/sys/redirects', policy: 'cms-view-redirects' },
  ];
  const firstGrantedAdminLink = adminLinks.find(link => policy.isGranted(link.policy));

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
                {contentLinks.map(link => (
                  policy.isGranted(link.policy) && (
                    <RouterLink key={link.to} to={link.to} className="dropdown-item" onClick={() => toggle('content')}>
                      {link.label}
                    </RouterLink>
                  )
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-taxonomy') && (
            <UncontrolledDropdown inNavbar nav className={isGroupActive('taxonomy') ? 'is-current' : ''}>
              <DropdownToggle tag={Link} to={firstGrantedTaxonomyLink ? firstGrantedTaxonomyLink.to : '/taxonomy/categories'} onClick={() => toggle('taxonomy')} nav>Taxonomy</DropdownToggle>
              <DropdownMenu className="nav-dropdown-menu">
                {taxonomyLinks.map(link => (
                  policy.isGranted(link.policy) && (
                    <RouterLink key={link.to} to={link.to} className="dropdown-item" onClick={() => toggle('taxonomy')}>
                      {link.label}
                    </RouterLink>
                  )
                ))}
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
                {structureLinks.map(link => (
                  policy.isGranted(link.policy) && (
                    <RouterLink key={link.to} to={link.to} className="dropdown-item" onClick={() => toggle('structure')}>
                      {link.label}
                    </RouterLink>
                  )
                ))}
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
                {adminLinks.map(link => (
                  policy.isGranted(link.policy) && (
                    <RouterLink key={link.to} to={link.to} className="dropdown-item" onClick={() => toggle('admin')}>
                      {link.label}
                    </RouterLink>
                  )
                ))}
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
