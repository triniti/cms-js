import React, { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar as NavbarRS,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import { Backdrop, RouterLink } from '@triniti/cms/components/index.js';
import UserNav from '@triniti/cms/components/navbar/UserNav.js';
import getNavbar from '@triniti/cms/selectors/getNavbar.js';

export default function Navbar() {
  const policy = usePolicy();
  const [isActive, setActive] = useState(false);
  const activeNavbar = useSelector(getNavbar);

  const toggleNav = () => {
    setActive(!isActive);
  };

  const contentLinks =  [
    policy.isGranted('cms-view-articles') && { label: 'Articles', to: '/news/articles' },
    policy.isGranted('cms-view-galleries') && { label: 'Galleries', to: '/curator/galleries' },
    policy.isGranted('cms-view-pages') && { label: 'Pages', to: '/canvas/pages' },
    policy.isGranted('cms-view-polls') && { label: 'Polls', to: '/apollo/polls' },
    policy.isGranted('cms-view-videos') && { label: 'Videos', to: '/ovp/videos' },
    policy.isGranted('cms-view-livestreams') && { label: 'LiveStreams', to: '/ovp/livestreams' },
  ].filter(Boolean);

  const taxonomyLinks =  [
    policy.isGranted('cms-view-categories') && { label: 'Categories', to: '/taxonomy/categories' },
    policy.isGranted('cms-view-channels') && { label: 'Channels', to: '/taxonomy/channels' },
    policy.isGranted('cms-view-people') && { label: 'People', to: '/people/people' },
  ].filter(Boolean);

  const structureLinks =  [
    policy.isGranted('cms-view-promotions') && { label: 'Promotions', to: '/curator/promotions' },
    policy.isGranted('cms-view-teasers') && { label: 'Teasers', to: '/curator/teasers' },
    policy.isGranted('cms-view-timelines') && { label: 'Timelines', to: '/curator/timelines'},
    policy.isGranted('cms-view-sponsors') && { label: 'Sponsors', to: '/boost/sponsors' },
    policy.isGranted('cms-view-widgets') &&  { label: 'Widgets', to: '/curator/widgets' },
  ].filter(Boolean);

  const adminLinks =  [
    policy.isGranted('cms-view-users') && { label: 'Users', to: '/iam/users' },
    policy.isGranted('cms-view-roles') && { label: 'Roles', to: '/iam/roles' },
    policy.isGranted('cms-view-apps') && { label: 'Apps', to: '/iam/apps' },
    policy.isGranted('cms-view-flagsets') && { label: 'Flagsets', to: '/sys/flagsets' },
    policy.isGranted('cms-view-picklists') &&  { label: 'Picklists', to: '/sys/picklists' },
    policy.isGranted('cms-view-redirects') &&  { label: 'Redirects', to: '/sys/redirects' },
  ].filter(Boolean);

  return (
    <NavbarRS className="navbar-main" dark>
      <NavbarToggler onClick={toggleNav} className={isActive ? 'is-open' : ''}>
        <span className="navbar-toggler-bar navbar-toggler-bar--top" />
        <span className="navbar-toggler-bar navbar-toggler-bar--middle" />
        <span className="navbar-toggler-bar navbar-toggler-bar--bottom" />
      </NavbarToggler>
      <NavbarBrand tag="div">
        <RouterLink to="/" tabIndex={-1} />
      </NavbarBrand>
      <div className={`navbar-toggleable-md main-nav ${isActive ? 'is-open' : ''}`}>
        <Nav navbar>
          <NavItem className={activeNavbar.primary === 'Dashboard' ? 'is-current' : ''}>
            <RouterLink role="menuitem" to="/" navTab>Dashboard</RouterLink>
          </NavItem>
          {policy.isGranted('cms-view-content') && (
            <UncontrolledDropdown inNavbar nav className={activeNavbar.primary === 'Content' ? 'is-current' : ''}>
              <DropdownToggle nav>
                Content
              </DropdownToggle>
              <Link tabIndex={-1} className="nav-link--desktop" to={contentLinks?.[0]?.to ?? '/news/articles'}></Link>
              <DropdownMenu className="nav-dropdown-menu">
                {contentLinks.map(link => (
                  <RouterLink role="menuitem" key={link.to} to={link.to} className="dropdown-item" active={activeNavbar.secondary === link.label}>
                    {link.label}
                  </RouterLink>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-taxonomy') && (
            <UncontrolledDropdown inNavbar nav className={activeNavbar.primary === 'Taxonomy' ? 'is-current' : ''}>
              <DropdownToggle nav>
                Taxonomy
              </DropdownToggle>
              <Link tabIndex={-1} className="nav-link--desktop" to={taxonomyLinks?.[0]?.to ?? '/taxonomy/categories'}></Link>
              <DropdownMenu className="nav-dropdown-menu">
                {taxonomyLinks.map(link => (
                  <RouterLink role="menuitem" key={link.to} to={link.to} className="dropdown-item" active={activeNavbar.secondary === link.label}>
                    {link.label}
                  </RouterLink>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-assets') && (
            <NavItem className={activeNavbar.primary === 'Assets' ? 'is-current' : ''}>
              <RouterLink role="menuitem" to="/dam/assets" navTab>Assets</RouterLink>
            </NavItem>
          )}
          {policy.isGranted('cms-view-structure') && (
            <UncontrolledDropdown inNavbar nav className={activeNavbar.primary === 'Structure' ? 'is-current' : ''}>
              <DropdownToggle nav>
                Structure
              </DropdownToggle>
              <Link tabIndex={-1} className="nav-link--desktop" to={structureLinks?.[0]?.to ?? '/curator/promotions'}></Link>
              <DropdownMenu className="nav-dropdown-menu">
                {structureLinks.map(link => (
                  <RouterLink role="menuitem" key={link.to} to={link.to} className="dropdown-item" active={activeNavbar.secondary === link.label}>
                    {link.label}
                  </RouterLink>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
          {policy.isGranted('cms-view-notify') && (
            <NavItem className={activeNavbar.primary === 'Notifications' ? 'is-current' : ''}>
              <RouterLink role="menuitem" to="/notify/notifications" navTab>Notifications</RouterLink>
            </NavItem>
          )}
          {policy.isGranted('cms-view-admin') && (
            <UncontrolledDropdown inNavbar nav className={activeNavbar.primary === 'Admin' ? 'is-current' : ''}>
              <DropdownToggle nav>
                Admin
              </DropdownToggle>
              <Link tabIndex={-1} className="nav-link--desktop" to={adminLinks?.[0]?.to ?? '/iam/users'}></Link>
              <DropdownMenu className="nav-dropdown-menu">
                {adminLinks.map(link => (
                  <RouterLink role="menuitem" key={link.to} to={link.to} className="dropdown-item" active={activeNavbar.secondary === link.label}>
                    {link.label}
                  </RouterLink>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </Nav>
      </div>
      <Backdrop onClick={toggleNav} />
      <UserNav />
    </NavbarRS>
  );
}
