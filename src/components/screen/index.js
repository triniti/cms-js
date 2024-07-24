import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, NavItem } from 'reactstrap';
import kebabCase from 'lodash-es/kebabCase.js';
import { useDispatch } from 'react-redux';
import { Icon, Nav, RouterLink } from '@triniti/cms/components/index.js';
import AlertBar from '@triniti/cms/components/screen/AlertBar.js';
import PrimaryActions from '@triniti/cms/components/screen/PrimaryActions.js';
import changeNavbar from '@triniti/cms/actions/changeNavbar.js';

let screenBody = null;
export const scrollToTop = (behavior = 'smooth', top = 0) => {
  if (!screenBody) {
    return;
  }

  setTimeout(() => {
    screenBody.scrollTo({ top, behavior });
  }, 5);
};

export const getScrollTop = () => {
  if (!screenBody) {
    return 0;
  }

  return screenBody.scrollTop;
};

export default function Screen(props) {
  const {
    activeNav = '',
    activeSubNav = '',
    activeTab = '',
    badge = null,
    breadcrumbs = [],
    footer = null,
    header = null,
    contentWidth = '1008px',
    primaryActions = null,
    secondaryActions = null,
    sidebar = null,
    sidenav = null,
    sidenavHeader = null,
    tabs = [],
    title = null,
  } = props;

  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(true);
  const screenBodyRef = useRef(null);

  const sidenavClasses = `screen-sidenav ${isSidenavOpen ? '' : 'offcanvas-left'}`;
  const sidebarClasses = `screen-sidebar ${isSidebarOpen ? 'screen-sidebar-is-open' : ''}`;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidenav = () => setIsSidenavOpen(!isSidenavOpen);
  useEffect(() => {
    screenBody = screenBodyRef.current;
    scrollToTop('auto');
    return () => {
      screenBody = null;
    };
  }, []);

  useEffect(() => {
    const t = title || header;
    document.title = t || 'Triniti';
    dispatch(changeNavbar(activeNav || t, activeSubNav || t));
  }, [title, header]);

  return (
    <div className="screen">
      {sidenav && (
        <div className={sidenavClasses} id="sidenav">
          {sidenavHeader !== null && (
            <div className="screen-sidenav-header">
              {sidenavHeader && (
                <h3 className="screen-sidenav-header-title">
                  {sidenavHeader}
                </h3>
              )}
              <Button outline color="hover" className="screen-sidenav-toggler" onClick={toggleSidenav}>
                <Icon imgSrc="arrow-left" alt="close" className="screen-sidenav-toggler-img" />
              </Button>
            </div>
          )}
          <div className="screen-sidenav-body">
            {sidenav}
          </div>
        </div>
      )}

      <div className="screen-main">
        {(header || primaryActions || (breadcrumbs && breadcrumbs.length > 0)) && (
          <div className="screen-header-container">
            {badge && (
              <Icon imgSrc={badge} size="lg" className="m-0 me-3 text-body" />
            )}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <h1 className="screen-header-title">
                <Breadcrumb>
                  {breadcrumbs.map(breadcrumb => (
                    <BreadcrumbItem key={breadcrumb.text}>
                      {breadcrumb.to && (
                        <RouterLink to={breadcrumb.to}>
                          {breadcrumb.text}
                        </RouterLink>
                      )}
                      {!breadcrumb.to && breadcrumb.text}
                    </BreadcrumbItem>
                  ))}
                </Breadcrumb>
              </h1>
            )}
            {breadcrumbs.length === 0 && header && (
              <h1 className="screen-header-title">
                {header}
              </h1>
            )}
            {primaryActions && (
              <PrimaryActions>
                {primaryActions}
              </PrimaryActions>
            )}
          </div>
        )}

        <AlertBar />

        {tabs.length > 0 && (
          <Nav underline className="screen-navtabs">
            {tabs.map((tab) => {
              if (!tab) {
                return null;
              }
              const isActive = kebabCase(tab.text) === activeTab;
              return (
                <NavItem key={tab.to} onClick={() => scrollToTop('auto')} active={isActive}>
                  <RouterLink navTab to={tab.to} active={isActive}>
                    {tab.text}
                  </RouterLink>
                </NavItem>
              );
            })}
          </Nav>
        )}

        <div className="screen-body-container">
          <div ref={screenBodyRef} className="screen-body">
            <div className="screen-body-content" style={{ maxWidth: contentWidth }}>
              {props.children}
            </div>
          </div>
          {sidebar && (
            <div className={sidebarClasses} id="screen-sidebar">
              <Button color="info" className="screen-sidebar-toggler rounded-circle" onClick={toggleSidebar}>
                <Icon imgSrc="arrow-left-thick" alt="arrow" />
              </Button>
              <div className="screen-sidebar-body">
                {sidebar}
              </div>
            </div>
          )}
        </div>
      </div>

      {(footer || secondaryActions) && (
        <div className="screen-footer-container">
          {footer && (
            <div className="screen-footer">
              {footer}
            </div>
          )}
          {secondaryActions && (
            <div className="screen-secondary-actions">
              {secondaryActions}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
