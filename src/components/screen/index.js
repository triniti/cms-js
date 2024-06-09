import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, BreadcrumbItem, Button, NavItem } from 'reactstrap';
import kebabCase from 'lodash-es/kebabCase.js';
import { Icon, Nav, RouterLink } from '@triniti/cms/components/index.js';
import AlertBar from '@triniti/cms/components/screen/AlertBar.js';
import PrimaryActions from '@triniti/cms/components/screen/PrimaryActions.js';

let screenBody = null;
export const scrollToTop = (behavior = 'smooth') => {
  if (!screenBody) {
    return;
  }

  screenBody.scrollTo({ top: 0, behavior });
};

export default function Screen(props) {
  const {
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    document.title = title || 'Triniti';
  }, [title]);

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
            {badge && <div>{badge}</div>}
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
