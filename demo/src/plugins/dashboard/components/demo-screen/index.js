import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonDropdown,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  CardImg,
  CardImgOverlay,
  CardLink,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  PopoverBody,
  PopoverHeader,
  Progress,
  Row,
  Spinner,
  TabContent,
  Table,
  TabPane,
  Toast,
  ToastBody,
  ToastHeader,
  UncontrolledAlert,
  UncontrolledButtonDropdown,
  UncontrolledCarousel,
  UncontrolledCollapse,
  UncontrolledDropdown,
  UncontrolledPopover,
  UncontrolledTooltip
} from 'reactstrap';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import Swal from 'sweetalert2';
import {
  ActionButton,
  CheckboxField,
  Icon,
  Loading,
  Screen,
  SwitchField,
  withForm,
  withPbj
} from '@triniti/cms/components/index.js';
import ModalExample from './Modals.js';
import './styles.scss';
import toast from '@triniti/cms/utils/toast.js';

function sweetAlert1(e) {
  e.preventDefault();
  Swal.fire('Hello world!');
}

function sweetAlert2(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Error!',
    text: 'Do you want to continue',
    type: 'error',
    confirmButtonText: 'Cool',
  });
}

function sweetAlert3(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Most Basic',
    text: 'Here are the two standard button styles',
    type: 'success',
    showCancelButton: true,
    confirmButtonText: 'Confirm Button',
    cancelButtonText: 'Cancel Button',
  });
}

function sweetAlert4(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this imaginary file!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Deleted!',
        'Your imaginary file has been deleted.',
        'success',
      );
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Your imaginary file is safe :)',
        'error',
      );
    }
  });
}

function sweetAlert5(e) {
  e.preventDefault();
  Swal.fire({
    title: 'Ajax Request',
    text: 'Enter Email Address',
    input: 'email',
    inputClass: 'form-control',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    showLoaderOnConfirm: true,
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
    preConfirm: email => new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'taken@example.com') {
          Swal.showValidationError('This email is already taken.');
        }
        resolve();
      }, 2000);
    }),
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        type: 'success',
        title: 'Ajax request finished!',
        html: `Submitted email: ${result.value}`,
      });
    }
  });
}

function sweetAlert6(e) {
  e.preventDefault();
  Swal.fire({
    customClass: 'swal-spinner',
    didOpen: () => {
      Swal.showLoading();
    },
    showConfirmButton: false,
    target: '.screen-main',
    title: 'loading and stuff',
  });
}

function sweetAlert7(e) {
  e.preventDefault();
  Swal.fire({
    html: '<h5>Dismissable Horizontal Alert Ellipsis</h5><p>Some alert that needs your attention. Must click here to close.</p> ',
    allowOutsideClick: false,
    customClass: 'swal2-horizontal',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    confirmButtonClass: 'btn btn-sm btn-link-bg text-body',
    cancelButtonClass: 'btn btn-sm btn-link-bg text-body',
    position: 'top-right',
  });
}

function showMultipleToasts() {
  toast({ title: 'First one' });
  setTimeout(() => {
    toast({ title: 'Second one' });
  }, 3000);
  setTimeout(() => {
    toast({ title: 'Third one' });
  }, 6000);
}

function DemoScreen() {
  const [activeTab, setActiveTab] = useState('1');
  const [activeTabNext, setActiveTabNext] = useState('3');

  const [startDate, setStartDate] = useState(new Date());
  const [clearableDate, setClearableDate] = useState(new Date());

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleNext = tab => {
    if (activeTabNext !== tab) setActiveTabNext(tab);
  };

  const [activeButton, setActiveButton] = useState('button1');

  const handleClick = (button) => {
    setActiveButton(button);
  };

  const items = [ // Carousel Content
    {
      src: 'http://www.telepixdev.com/triniti/carousel/1.jpg',
      altText: 'Slide 1',
      caption: 'Slide 1',
      header: 'Slide 1 Header',
      key: '1'
    },
    {
      src: 'http://www.telepixdev.com/triniti/carousel/2.jpg',
      altText: 'Slide 2',
      caption: 'Slide 2',
      header: 'Slide 2 Header',
      key: '2'
    },
    {
      src: 'http://www.telepixdev.com/triniti/carousel/3.jpg',
      altText: 'Slide 3',
      caption: 'Slide 3',
      header: 'Slide 3 Header',
      key: '3'
    }
  ];

  const options = [ // React Select Content
    { value: 'Armond Sarkisian', label: 'Armond Sarkisian' },
    { value: 'Brian Hsiao', label: 'Brian Hsiao' },
    { value: 'Chris Clifton', label: 'Chris Clifton' },
    { value: 'Daniel Shneyder', label: 'Daniel Shneyder' },
    { value: 'Eric Jacobson', label: 'Eric Jacobson' },
    { value: 'Greg Brown', label: 'Greg Brown' },
    { value: 'Jim Murphy', label: 'Jim Murphy' },
    { value: 'Joel Capillo', label: 'Joel Capillo' },
    { value: 'Mariam Gevorkyan', label: 'Mariam Gevorkyan' },
    { value: 'Richard Sumilang', label: 'Richard Sumilang' },
    { value: 'Vagram Kayfejian', label: 'Vagram Kayfejian' },
  ];

  return (
    <Screen
      title='Style Guide'
      header='Style Guide'
      primaryActions={
        <>
          <ActionButton outline color="light" text="Action Button" />
        </>
      }
      sidebar={
        <Card>
          <CardHeader>Components</CardHeader>
          <CardBody className="p-0">
            <ListGroup className="list-group-nav pt-3 pb-4">
              <ListGroupItem action tag="a" href="#alerts" active={activeButton === 'button1'} onClick={() => handleClick('button1')}>
                Alerts
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#badges" active={activeButton === 'button2'} onClick={() => handleClick('button2')}>
                Badges
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#breadcrumbs" active={activeButton === 'button3'} onClick={() => handleClick('button3')}>
                Breadcrumbs
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#button-groups" active={activeButton === 'button4'} onClick={() => handleClick('button4')}>
                Button Groups
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#buttons" active={activeButton === 'button5'} onClick={() => handleClick('button5')}>
                Buttons
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#cards" active={activeButton === 'button6'} onClick={() => handleClick('button6')}>
                Cards
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#carousel" active={activeButton === 'button7'} onClick={() => handleClick('button7')}>
                Carousel
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#checkbox-field" active={activeButton === 'button8'} onClick={() => handleClick('button8')}>
                Checkbox Field
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#dropdown" active={activeButton === 'button9'} onClick={() => handleClick('button9')}>
                Dropdown
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#forms" active={activeButton === 'button10'} onClick={() => handleClick('button10')}>
                Forms
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#headers" active={activeButton === 'button11'} onClick={() => handleClick('button11')}>
                Headers
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#icons" active={activeButton === 'button12'} onClick={() => handleClick('button12')}>
                Icons
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#input-group" active={activeButton === 'button13'} onClick={() => handleClick('button13')}>
                Input Group
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#layout" active={activeButton === 'button14'} onClick={() => handleClick('button14')}>
                Layout
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#list-group" active={activeButton === 'button15'} onClick={() => handleClick('button15')}>
                List Group
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#media" active={activeButton === 'button16'} onClick={() => handleClick('button16')}>
                Media
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#modals" active={activeButton === 'button17'} onClick={() => handleClick('button17')}>
                Modals
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#navbar" active={activeButton === 'button18`'} onClick={() => handleClick('button18')}>
                Navbar
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#navs" active={activeButton === 'button19'} onClick={() => handleClick('button19')}>
                Navs
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#pagination" active={activeButton === 'button20'} onClick={() => handleClick('button20')}>
                Pagination
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#popover" active={activeButton === 'button21'} onClick={() => handleClick('button21')}>
                Popovers
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#progress" active={activeButton === 'button22'} onClick={() => handleClick('button22')}>
                Progress
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#radio-field" active={activeButton === 'button23'} onClick={() => handleClick('button23')}>
                Radio Field
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#range-field" active={activeButton === 'button24'} onClick={() => handleClick('button24')}>
                Range Field
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#reactdatepicker" active={activeButton === 'button25'} onClick={() => handleClick('button25')}>
                React DatePicker
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#react-select" active={activeButton === 'button26'} onClick={() => handleClick('button26')}>
                React Select
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#sortable-list" active={activeButton === 'button27'} onClick={() => handleClick('button27')}>
                Sortable List
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#spinner" active={activeButton === 'button28'} onClick={() => handleClick('button28')}>
                Spinner
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#sweet-alert" active={activeButton === 'button29'} onClick={() => handleClick('button29')}>
                Sweet Alert
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#switch-field" active={activeButton === 'button30'} onClick={() => handleClick('button30')}>
                Switch Field
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#table" active={activeButton === 'button31'} onClick={() => handleClick('button31')}>
                Table
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#tabs" active={activeButton === 'button32'} onClick={() => handleClick('button32')}>
                Tabs
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#toasts" active={activeButton === 'button33'} onClick={() => handleClick('button33')}>
                Toasts
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#tooltips" active={activeButton === 'button34'} onClick={() => handleClick('button34')}>
                Tooltips
              </ListGroupItem>
            </ListGroup>
          </CardBody>
        </Card>
      }
    >
      <Alert color="warning" className="alert-inverse" id="alerts">
        <span>
          <Icon imgSrc="warning-outline" /> Example of <strong>Alert-Inverse</strong> Warning</span>
      </Alert>
      <Card>
        <CardHeader>Alerts</CardHeader>
        <Alert color="success" className="mb-0">
          <span>
            <Icon imgSrc="warning-outline" /> <strong>Full Width!</strong> Alerts fill the container's width. If used inside a card, rounded corners are added.</span>
        </Alert>
        <CardBody>
          <Alert color="info">
            <strong>Info!</strong> This alert needs your attention, but it's not super important.
          </Alert>
          <Alert color="warning">
            <strong>Warning!</strong> Better check yourself, you're not looking too good.
          </Alert>
          <Alert color="danger">
            <strong>Danger!</strong> Change a few things up and try submitting again.
          </Alert>
          <UncontrolledAlert color="success">
            I am an alert and I can be dismissed! Success! <a href="#" className="alert-link">Example Link</a>
          </UncontrolledAlert>
          <CardTitle className="mt-5">className="alert-inverse"</CardTitle>
          <Alert color="success" className="alert-inverse">
            Example of <strong>Alert-Inverse</strong> Success
          </Alert>
          <Alert color="info" className="alert-inverse">
            Example of <strong>Alert-Inverse</strong> Info
          </Alert>
          <Alert color="warning" className="alert-inverse">
            Example of <strong>Alert-Inverse</strong> Warning
          </Alert>
          <Alert color="danger" className="alert-inverse">
            Example of <a href="#" className="alert-link">Alert-Inverse</a> Danger
          </Alert>
        </CardBody>
      </Card>

      <Card id="badges">
        <CardHeader>Badges</CardHeader>
        <CardBody>
          <h1>H1 Heading .h1 <Badge color="success">New</Badge> <Badge color="success">
            <Icon imgSrc="warning-outline" className="me-2" size="sd" />New</Badge>
          </h1>
          <h2>H2 Heading .h2 <Badge color="info">New</Badge> <Badge color="info">
            <Icon imgSrc="warning-outline" className="me-1" />New</Badge>
          </h2>
          <h3>H3 Heading .h3 <Badge color="warning" pill>New</Badge> <Badge color="warning" pill>
            <Icon
              imgSrc="warning-outline" className="me-1" />New</Badge>
          </h3>
          <h4>H4 Heading .h4 <Badge color="danger">New</Badge> <Badge color="danger">
            <Icon imgSrc="warning-outline" className="me-1" size="sm" />New</Badge>
          </h4>
          <h5>H5 Heading .h5 <Badge color="dark">New</Badge> <Badge color="dark">
            <Icon imgSrc="warning-outline" className="me-1" size="xs" />New</Badge>
          </h5>
          <h6>h6 Heading .h6 <Badge color="light" pill>New</Badge> <Badge color="light" pill>
            <Icon imgSrc="warning-outline" className="me-1" size="xxs" />New</Badge>
          </h6>

          <CardTitle className="mt-5">Variations</CardTitle>
          <Badge color="success">success</Badge>{' '}
          <Badge color="info">info</Badge>{' '}
          <Badge color="warning">warning</Badge>{' '}
          <Badge color="danger">danger</Badge>{' '}
          <Badge color="dark">dark</Badge>{' '}
          <Badge color="light">light</Badge>{' '}
          <Badge color="danger"><Icon imgSrc="warning-outline" size="xxs" className="me-1" />Danger</Badge>{' '}

          <CardTitle className="mt-5">Pills</CardTitle>
          <Badge color="success" pill>success</Badge>{' '}
          <Badge color="info" pill>info</Badge>{' '}
          <Badge color="warning" pill>warning</Badge>{' '}
          <Badge color="danger" pill>danger</Badge>{' '}
          <Badge color="dark" pill>dark</Badge>{' '}
          <Badge color="light" pill>light</Badge>{' '}
          <Badge color="danger" pill><Icon imgSrc="warning-outline" size="xxs" className="me-1" />Danger</Badge>{' '}

          <CardTitle className="mt-5">Status</CardTitle>
          <Badge color="dark" className="status-archived" pill>ARCHIVED</Badge>{' '}
          <Badge color="dark" className="status-draft" pill>DRAFT</Badge>{' '}
          <Badge color="dark" className="status-deleted" pill>DELETED</Badge>{' '}
          <Badge color="dark" className="status-expired" pill>EXPIRED</Badge>{' '}
          <Badge color="dark" className="status-pending" pill>PENDING</Badge>{' '}
          <Badge color="dark" className="status-scheduled" pill>SCHEDULED</Badge>{' '}
          <Badge color="dark" className="status-published" pill>PUBLISHED</Badge>{' '}

          <CardTitle className="mt-5">Badge Alert</CardTitle>
          <Button outline color="light" className="me-3 rounded-pill">outline <Badge color="primary"
                                                                                     className="badge-alert">3</Badge></Button>
          <Button outline color="primary" className="me-3">default <Badge color="warning"
                                                                          className="badge-alert">0</Badge></Button>
          <Button color="light" outline className="me-3 rounded-pill">inline pill <Badge pill color="warning"
                                                                                         className="ms-1">24</Badge></Button>
          <Button color="light" className="border-0 rounded-pill me-3">link <Badge color="danger"
                                                                                   className="badge-alert">24</Badge></Button>
          <Button color="light" className="rounded-circle border-0 me-3" size="md">
            <Icon imgSrc="user" /><Badge
            color="danger" className="badge-alert">
            <Icon imgSrc="warning-outline" size="xxs" /></Badge></Button>

          <CardTitle className="mt-5">Badge Animated</CardTitle>
          <Badge color="light" pill><span className="badge-animated">Refreshing</span></Badge>
        </CardBody>
      </Card>


      <Card id="breadcrumbs">
        <CardHeader>
          <Breadcrumb tag="nav" listTag="div">
            <BreadcrumbItem tag="a" href="#">Breadcrumbs</BreadcrumbItem>
            <BreadcrumbItem tag="a" href="#">Link</BreadcrumbItem>
            <BreadcrumbItem active>No Link</BreadcrumbItem>
          </Breadcrumb>
        </CardHeader>
        <CardBody>
          <Breadcrumb>
            <BreadcrumbItem tag="a" href="#">Breadcrumbs</BreadcrumbItem>
            <BreadcrumbItem tag="a" href="#">Link</BreadcrumbItem>
            <BreadcrumbItem active>No Link</BreadcrumbItem>
          </Breadcrumb>
        </CardBody>
      </Card>


      <Card id="button-groups">
        <CardHeader>Button Groups</CardHeader>
        <CardBody>
          <ButtonGroup>
            <Button outline>1</Button>
            <Button outline>2</Button>
            <Button outline>3</Button>
            <Button outline>4</Button>
          </ButtonGroup>

          <CardTitle className="mt-5">Active State</CardTitle>
          <ButtonGroup size="sm">
            <Button color="light" active>
              <Icon imgSrc="grid-two-up" /></Button>
            <Button color="light">
              <Icon imgSrc="list" /></Button>
          </ButtonGroup>

          <CardTitle className="mt-5">Vertical</CardTitle>
          <ButtonGroup vertical>
            <Button color="primary">5</Button>
            <Button color="primary">6</Button>
            <Button color="primary">7</Button>
          </ButtonGroup>
        </CardBody>
      </Card>

      <Card id="buttons">
        <CardHeader>Button: color="value" <Button color="light">Create Notification</Button>
        </CardHeader>
        <CardBody>
          <Button color="light">light</Button>
          <Button color="primary">primary</Button>
          <Button color="secondary">secondary</Button>
          <Button color="warning">warning</Button>
          <Button color="danger">danger</Button>
          <Button color="dark">dark</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: outline color="value"
        </CardHeader>
        <CardBody>
          <Button outline color="light">light</Button>
          <Button outline color="primary">primary</Button>
          <Button outline color="secondary">secondary</Button>
          <Button outline color="warning">warning</Button>
          <Button outline color="danger">danger</Button>
          <Button outline color="dark">dark</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: color="hover"
        </CardHeader>
        <CardBody>
          <p>Set's initial opacity of button to 65%. Can use in conjunction with button colors or just set icon and
            text
            color using text-*color.</p>
          <Button color="hover" className="rounded-circle me-1 mb-0">
            <Icon imgSrc="pencil" /></Button>
          <Button color="hover" className="rounded-circle me-1 mb-0">
            <Icon imgSrc="eye" /></Button>
          <Button color="hover" className="rounded-circle me-1 mb-0">
            <Icon imgSrc="external" /></Button>
          <Button color="hover" className="rounded-circle me-1 mb-0">
            <Icon imgSrc="play-outline" size="lg" /></Button>
          <Button color="hover" className="rounded-circle me-1 mb-0">
            <Icon imgSrc="alarm" /></Button>
          <Button color="hover" className="rounded-circle me-1 mb-0">
            <Icon imgSrc="delete" /></Button>
          <Button color="hover" className="mb-0">hover</Button>
          <Button color="hover" className="rounded-circle text-success mb-0">
            <Icon imgSrc="check-solid"
                  size="lg" /></Button>
          <Button color="primary" className="rounded-circle mb-0" size="sm">
            <Icon imgSrc="plus"
                  size="md" /></Button>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          Button: color="hover-bg"
        </CardHeader>
        <CardBody>
          <p>Set's initial opacity of button to 65% and adds a light grey background on hover.</p>
          <Button color="hover-bg" className="rounded-circle">
            <Icon imgSrc="trash" /></Button>
          <Button color="hover-bg" className="rounded-circle">
            <Icon imgSrc="sort" /></Button>
          <Button color="hover-bg">hover-bg</Button>
          <Button color="hover-bg" className="text-danger rounded-circle">
            <Icon imgSrc="trash" /></Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: screen-primary-actions *desktop only
        </CardHeader>
        <CardBody>
          <div className="screen-primary-actions d-none d-md-block">
            <Button color="primary">
              <Icon imgSrc="save" className="me-1" />Primary</Button>
            <Button color="primary" className="disabled">
              <Icon imgSrc="save" className="me-1" />Disabled</Button>
            <Button outline color="light">
              <Icon imgSrc="save" className="me-1" />Light</Button>
            <Button outline color="secondary">
              <Icon imgSrc="save" className="me-1" />Secondary</Button>
            <ButtonDropdown>
              <Button id="caret" color="primary">
                <Icon imgSrc="save" className="me-1" /> Save</Button>
              <DropdownToggle caret color="primary" />
            </ButtonDropdown>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: className="rounded-pill"
        </CardHeader>
        <CardBody>
          <Button color="dark" className="rounded-pill">rounded-pill</Button>
          <Button color="light" outline className="rounded-pill" size="sm">View Raw Data</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: className="rounded-0"
        </CardHeader>
        <CardBody>
          <Button color="dark" className="rounded-0">rounded-0</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: className="rounded-circle"
        </CardHeader>
        <CardBody>
          <Button color="dark" className="rounded-circle">
            <Icon imgSrc="check-line-thick" /></Button>
          <Button className="rounded-circle">
            <Icon imgSrc="arrow-right-thick" /></Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: className="border-none"
        </CardHeader>
        <CardBody>
          <Button color="light" className="rounded-circle border-0">
            <Icon imgSrc="pencil" /></Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          Button: Sizes
          <Button color="light" size="sm">
            <Icon imgSrc="refresh" /></Button>
        </CardHeader>
        <CardBody>
          <div>
            <Button outline color="light" size="xxs" className="rounded-circle"><small>xxs</small></Button>
          </div>
          <div>
            <Button outline color="light" size="xs" className="rounded-circle">xs</Button>
          </div>
          <div>
            <Button color="primary" size="sm">Size sm</Button>
            <Button outline color="light" size="sm">Size sm</Button>
            <Button outline color="light" size="sm" className="rounded-circle">sm</Button>
          </div>
          <div>
            <Button color="primary">Default</Button>
            <Button outline color="light">Default</Button>
            <Button outline color="light" className="rounded-circle">sd</Button>
          </div>
          <div>
            <Button color="primary" size="lg">Size lg</Button>
            <Button outline color="light" size="lg">Size lg</Button>
            <Button outline color="light" size="lg" className="rounded-circle">lg</Button>
          </div>
          <div>
            <Button color="primary" size="xl">Size xl</Button>
            <Button outline color="light" size="xl">Size xl</Button>
            <Button outline color="light" size="xl" className="rounded-circle">xl</Button>
            <p><small>* Most often used in modals</small></p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Button: Block Level</CardHeader>
        <CardBody>
          <Button color="primary" size="lg" block>Block level button</Button>
          <Button size="lg" block outline color="light">Block level button</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Button: Active State</CardHeader>
        <CardBody>
          <Button active color="light">Default</Button>
          <Button active outline color="light">Outline</Button>
          <Button active color="primary">Primary</Button>
          <Button active outline color="primary">Outline</Button>
          <Button active color="secondary">Secondary</Button>
          <Button active outline color="secondary">Outline</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Button: Disabled State</CardHeader>
        <CardBody>
          <Button disabled color="light">Default</Button>
          <Button disabled outline color="light">Outline</Button>
          <Button disabled color="primary">Primary</Button>
          <Button disabled outline color="primary">Outline</Button>
          <Button disabled color="secondary">Secondary</Button>
          <Button disabled outline color="secondary">Outline</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Button: Blocksmith Style</CardHeader>
        <CardBody>
          <Button color="blocksmith" className="bg-white me-3 mb-2">
            <div className="icon-group icon-group-left mt-2 mb-1">
              <Icon imgSrc="pencil" alert size="xxl" radius="rounded" border />
              <Icon imgSrc="facebook" size="xs" alert />
            </div>
            <span>facebook post</span>
          </Button>
          <Button color="blocksmith" className="bg-white me-3 mb-2">
            <div className="mt-2 mb-1">
              <Icon imgSrc="instagram" alert size="xxl" radius="rounded" border />
            </div>
            <span>instagram media</span>
          </Button>
        </CardBody>
      </Card>

      {/* Cards */}

      <Row className="gx-2" id="cards">
        <Col xs="12" sm="6" md="4">
          <Card>
            <CardImg
              top
              width="100%"
              src="//placehold.co/318x180"
              alt="Card image cap"
            />
            <CardBody>
              <CardTitle>Gutter Small</CardTitle>
              <CardSubtitle>Tighter Sub Grids</CardSubtitle>
              <CardText>
                Some quick example text to build on the card title and make up the bulk of the card's content.
              </CardText>
              <Button>Button</Button>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card>
            <CardBody>
              <CardTitle>Card title</CardTitle>
              <CardSubtitle>Card subtitle</CardSubtitle>
            </CardBody>
            <img
              width="100%"
              src="//placehold.co/318x180"
              alt="Card image cap"
            />
            <CardBody>
              <CardText>Some quick example text to build on the card title and make up the bulk of the card's
                content.
              </CardText>
              <hr />
              <CardLink href="#">Card Link</CardLink>
              <CardLink href="#">Another Link</CardLink>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card body className="text-center">
            <CardTitle>Special Title Treatment</CardTitle>
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            <Button>Go somewhere</Button>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card>
            <CardHeader tag="h3">Featured</CardHeader>
            <CardBody>
              <CardTitle>Special Title Treatment</CardTitle>
              <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
              <Button>Go somewhere</Button>
            </CardBody>
            <CardFooter className="text-muted">Footer</CardFooter>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card>
            <CardImg
              top
              width="100%"
              src="//placehold.co/318x180"
              alt="Card image cap"
            />
            <CardBody>
              <CardTitle>Card Title</CardTitle>
              <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.
                This content is a little bit longer.
              </CardText>
              <hr className="mb-0" />
              <CardText>
                <small className="text-muted">Last updated 3 mins ago</small>
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card>
            <CardBody>
              <CardTitle>Card Title</CardTitle>
              <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.
                This content is a little bit longer.
              </CardText>
              <CardText>
                <small className="text-muted">Last updated 3 mins ago</small>
              </CardText>
            </CardBody>
            <CardImg
              bottom
              width="100%"
              src="//placehold.co/318x180"
              alt="Card image cap"
            />
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card inverse>
            <CardImg
              width="100%"
              src="//placehold.co/318x300"
              alt="Card image cap"
            />
            <CardImgOverlay className="p-4">
              <CardTitle>Card Title</CardTitle>
              <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.
                This content is a little bit longer.
              </CardText>
              <CardText>
                <small className="text-muted">Last updated 3 mins ago</small>
              </CardText>
            </CardImgOverlay>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card body inverse color="dark">
            <CardTitle>Special Title Treatment</CardTitle>
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            <hr />
            <Button>Button</Button>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="4">
          <Card body outline color="primary">
            <CardTitle>Special Title Treatment</CardTitle>
            <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
            <Button color="second">Button</Button>
          </Card>
        </Col>
      </Row>

      {/* Card Group */}

      <CardTitle tag="h4" className="mt-5" style={{ maxWidth: "none" }}>Card Group</CardTitle>

      <CardGroup className="mb-5">
        <Card>
          <CardImg
            top
            width="100%"
            src="//placehold.co/256x180"
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.
              This content is a little bit longer.
            </CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
        <Card>
          <CardImg
            top
            width="100%"
            src="//placehold.co/256x180"
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
        <Card>
          <CardImg
            top
            width="100%"
            src="//placehold.co/256x180"
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>This is a wider card with supporting text below as a natural lead-in to additional content.
              This card has even longer content than the first to show that equal height action.
            </CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
      </CardGroup>

      {/* Carousel */}

      <Card id="carousel">
        <CardHeader>
          Carousel
        </CardHeader>
        <CardBody>
          <UncontrolledCarousel items={items} />
        </CardBody>
      </Card>

      {/* Checkbox Field */}

      <Card id="checkbox-field">
        <CardHeader>
          Checkbox Field
        </CardHeader>
        <CardBody>
          <div className="form-group">
            <div className="form-check mb-4">
              <input className="form-check-input" id="is_email" name="is_email" type="checkbox" />
              <Label className="form-check-label form-label" htmlFor="is_email">Default Bootstrap Checkbox</Label>
            </div>
            <small>Default bootstrap checkbox style using form-check, form-check-input, form-check-label
              styles</small>
          </div>

          <CardTitle className="card-section-title mt-5">Inline</CardTitle>
          <CheckboxField name="is_staff" label="Is Staff" check inline />
          <CheckboxField name="has_beard" label="Has Beard" check inline />
          <CheckboxField name="wears_hoodies" label="Wears Hoodies" check inline />

          <CardTitle className="card-section-title mt-5">Size</CardTitle>
          <CheckboxField name="is_default" label="Default" check />
          <CheckboxField name="is_small" label="size='sm'" size="sm" check />
          <CheckboxField name="is_large" label="size='lg'" size="lg" check />


        </CardBody>
      </Card>

      {/* Dropdown */}

      <Card id="dropdown">
        <CardHeader>
          Dropdown
        </CardHeader>
        <CardBody>
          <UncontrolledDropdown className="mb-4">
            <DropdownToggle caret outline color="secondary">
              Uncontrolled Dropdown
            </DropdownToggle>
            <DropdownMenu end className="dropdown-menu-arrow-right">
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown className="mb-4">
            <DropdownToggle caret outline color="light">
              Dropdown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledButtonDropdown className="mb-4">
            <DropdownToggle caret outline color="primary">
              Button Dropdown
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <p>
            dropmenu: right, left, .dropdown-menu-arrow-left, .dropdown-menu-arrow-right, show
          </p>
          <p>
            droptoggle: caret, .btn-icon, .btn-"size", btn-outline-text-"color", rounded-circle, rounded-pill
          </p>

        </CardBody>
      </Card>

      {/* Forms */}

      <Card id="forms">
        <CardHeader>
          Forms
        </CardHeader>
        <CardBody>
          <div className="form-group">
            <Label>Row with gutter 1 (4px): className="gx-1"</Label>

            <Row className="gx-1">
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>
            <Row className="gx-1">
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>

            <Button outline color="light" className="mb-4">
              <Icon imgSrc="plus-outline" size="sm" className="me-2" /> Add
            </Button>
          </div>

          <div className="form-group">
            <Label>Row with gutter 2 (8px): className="gx-2"</Label>

            <Row className="gx-2">
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>
            <Row className="gx-2">
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>

            <Button outline color="light">
              <Icon imgSrc="plus-outline" size="sm" className="me-2" /> Add
            </Button>
          </div>

          <div className="form-group">
            <Label>Row with gutter 3 (16px): className="gx-3"</Label>

            <Row className="gx-3">
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>
            <Row className="gx-3">
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>

            <Button outline color="light">
              <Icon imgSrc="plus-outline" size="sm" className="me-2" /> Add
            </Button>
          </div>

          <div className="form-group">
            <Label>Default Gutter width of 24px (gx-4=24px, gx-5=32px)</Label>

            <Row>
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs="5" sm="4">
                <div className="form-group">
                  <input
                    name="tags[0].key"
                    placeholder="Key"
                    className="form-control"
                  />
                </div>
              </Col>
              <Col xs="5" sm="4">
                <div className="form-group d-flex">
                  <input
                    name="tags[0].value"
                    placeholder="Value"
                    className="form-control flex-sm-shrink-0"
                  />
                </div>
              </Col>
              <Col xs="auto">
                <Button color="hover" className="rounded-circle">
                  <Icon imgSrc="delete" alt="delete" />
                </Button>
              </Col>
            </Row>

            <Button outline color="light">
              <Icon imgSrc="plus-outline" size="sm" className="me-2" /> Add
            </Button>
          </div>

          <hr />

          <div className="form-group">
            <Label for="exampleEmail1">Email</Label>
            <Input type="email" name="email" id="exampleEmail1" placeholder="with a placeholder" />
            <FormText color="danger">Recommendation: keep title less than 60 characters to avoid title extending too
              long in search results. (70/60)</FormText>
          </div>

          <div className="form-group">
            <Label for="exampleSelect1">Select</Label>
            <Input type="select" name="select1" id="exampleSelect1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Input>
          </div>
          <div className="form-group">
            <Label for="exampleSelectMulti1">Select Multiple</Label>
            <Input type="select" name="selectMulti1" id="exampleSelectMulti1" multiple>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </Input>
          </div>
          <div className="form-group">
            <Label for="exampleText1">Text Area</Label>
            <Input type="textarea" name="text" id="exampleText1" />
          </div>
          <div className="form-group">
            <Label for="exampleFile1">File</Label>
            <Input type="file" name="file" id="exampleFile1" />
            <FormText color="muted">
              This is some placeholder block-level help text for the above input.
              It is a bit lighter and easily wraps to a new line.
            </FormText>
          </div>
          <Button size="lg" color="primary" className="mt-3">Submit</Button>

        </CardBody>
      </Card>

      {/* Headers */}

      <Card id="headers">
        <CardHeader>
          Headers
        </CardHeader>
        <CardBody>
          <h1>H1 Headine .h1</h1>
          <h2>H2 Headine .h2</h2>
          <h3>H3 Headine .h3</h3>
          <h4>H4 Headine .h4</h4>
          <h5>H5 Headine .h5</h5>
          <h6>h6 Headine .h6</h6>
          <hr />
          <p>Standard paragraph with hr above and below</p>
          <hr />
          <CardTitle className="card-section-title">Card Title Section</CardTitle>
          <CardTitle tag="h1">Card Title h1</CardTitle>
          <CardTitle tag="h2">Card Title h2</CardTitle>
          <CardTitle tag="h3">Card Title h3</CardTitle>
          <CardTitle tag="h4">Card Title h4 <span className="card-title-sm">extra top margin on h4 to separate content areas</span></CardTitle>
          <CardTitle tag="h5">Card Title h5</CardTitle>
          <CardTitle tag="h6">Card Title h6</CardTitle>

          <p className="lead">Lead paragraph tag</p>
          <p>Standard paragraph tag</p>

          <legend>Legend Default</legend>
          <legend className="label">Legend className="label"</legend>


          <Label>Label Default</Label>
          <Label className="form-check-label">Label className="form-check-label"</Label>
          <Label className="text-label">Label className="text-label"</Label>


        </CardBody>
      </Card>

      {/* Icons */}

      <Card id="icons">
        <CardHeader>
          Icons
        </CardHeader>
        <CardBody>
          <Row className="gx-2 mt-5" xs="3" sm="6">
            <Col className="text-center">
              <Icon size="lg" imgSrc="activity" />
              <h6 className="text-light mt-3 mb-5">activity</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="add-item" />
              <h6 className="text-light mt-3 mb-5">add-item</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="age" />
              <h6 className="text-light mt-3 mb-5">age</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="alarm" />
              <h6 className="text-light mt-3 mb-5">alarm</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="apps" />
              <h6 className="text-light mt-3 mb-5">apps</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="archive" />
              <h6 className="text-light mt-3 mb-5">archive</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-double-left" />
              <h6 className="text-light mt-3 mb-5">arrow-double-left</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-double-right" />
              <h6 className="text-light mt-3 mb-5">arrow-double-right</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-left" />
              <h6 className="text-light mt-3 mb-5">arrow-left</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-right" />
              <h6 className="text-light mt-3 mb-5">arrow-right</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-left-thick" />
              <h6 className="text-light mt-3 mb-5">arrow-left-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-right-thick" />
              <h6 className="text-light mt-3 mb-5">arrow-right-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-up-thick" />
              <h6 className="text-light mt-3 mb-5">arrow-up-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-down-thick" />
              <h6 className="text-light mt-3 mb-5">arrow-down-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-back" />
              <h6 className="text-light mt-3 mb-5">arrow-back</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-down" />
              <h6 className="text-light mt-3 mb-5">arrow-down</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-forward" />
              <h6 className="text-light mt-3 mb-5">arrow-forward</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="arrow-up" />
              <h6 className="text-light mt-3 mb-5">arrow-up</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="audio" />
              <h6 className="text-light mt-3 mb-5">audio</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="back" />
              <h6 className="text-light mt-3 mb-5">back</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="backspace" />
              <h6 className="text-light mt-3 mb-5">backspace</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="bold" />
              <h6 className="text-light mt-3 mb-5">bold</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="bolt-outline" />
              <h6 className="text-light mt-3 mb-5">bolt-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="bolt-solid" />
              <h6 className="text-light mt-3 mb-5">bolt-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="book-open" />
              <h6 className="text-light mt-3 mb-5">book-open</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="bookmark" />
              <h6 className="text-light mt-3 mb-5">bookmark</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="bookmark-outline" />
              <h6 className="text-light mt-3 mb-5">bookmark-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="box" />
              <h6 className="text-light mt-3 mb-5">box</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="calendar" />
              <h6 className="text-light mt-3 mb-5">calendar</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="calendar-age" />
              <h6 className="text-light mt-3 mb-5">calendar-age</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="calendar-date" />
              <h6 className="text-light mt-3 mb-5">calendar-date</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="camera" />
              <h6 className="text-light mt-3 mb-5">camera</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="caret-down" />
              <h6 className="text-light mt-3 mb-5">caret-down</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="caret-up" />
              <h6 className="text-light mt-3 mb-5">caret-up</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="check-line" />
              <h6 className="text-light mt-3 mb-5">check-line</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="check-line-thick" />
              <h6 className="text-light mt-3 mb-5">check-line-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="check-outline" />
              <h6 className="text-light mt-3 mb-5">check-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="check-outline-square" />
              <h6 className="text-light mt-3 mb-5">check-outline-square</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="check-solid" />
              <h6 className="text-light mt-3 mb-5">check-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="check-solid-square" />
              <h6 className="text-light mt-3 mb-5">check-solid-square</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="circle" />
              <h6 className="text-light mt-3 mb-5">circle</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="circle-outline" />
              <h6 className="text-light mt-3 mb-5">circle-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="clipboard" />
              <h6 className="text-light mt-3 mb-5">clipboard</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="clock-outline" />
              <h6 className="text-light mt-3 mb-5">clock-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="clock-solid" />
              <h6 className="text-light mt-3 mb-5">clock-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="close" />
              <h6 className="text-light mt-3 mb-5">close</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="close-sm" />
              <h6 className="text-light mt-3 mb-5">close-sm</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="cloud-download" />
              <h6 className="text-light mt-3 mb-5">cloud-download</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="cloud-upload" />
              <h6 className="text-light mt-3 mb-5">cloud-upload</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="code" />
              <h6 className="text-light mt-3 mb-5">code</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="cog" />
              <h6 className="text-light mt-3 mb-5">cog</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="cog-outline" />
              <h6 className="text-light mt-3 mb-5">cog-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="collection" />
              <h6 className="text-light mt-3 mb-5">collection</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="comment" />
              <h6 className="text-light mt-3 mb-5">comment</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="comment-oval" />
              <h6 className="text-light mt-3 mb-5">comment-oval</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="compress" />
              <h6 className="text-light mt-3 mb-5">compress</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="data-download" />
              <h6 className="text-light mt-3 mb-5">data-download</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="data-upload" />
              <h6 className="text-light mt-3 mb-5">data-upload</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="data-transfer-download" />
              <h6 className="text-light mt-3 mb-5">data-transfer-download</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="data-transfer-upload" />
              <h6 className="text-light mt-3 mb-5">data-transfer-upload</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="delete" />
              <h6 className="text-light mt-3 mb-5">delete</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="delete-key" />
              <h6 className="text-light mt-3 mb-5">delete-key</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="delete-line" />
              <h6 className="text-light mt-3 mb-5">delete-line</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="delete-line-thick" />
              <h6 className="text-light mt-3 mb-5">delete-line-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="delete-outline" />
              <h6 className="text-light mt-3 mb-5">delete-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="delete-solid" />
              <h6 className="text-light mt-3 mb-5">delete-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="desktop" />
              <h6 className="text-light mt-3 mb-5">desktop</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="directory" />
              <h6 className="text-light mt-3 mb-5">directory</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="document" />
              <h6 className="text-light mt-3 mb-5">document</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="documents" />
              <h6 className="text-light mt-3 mb-5">documents</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="download" />
              <h6 className="text-light mt-3 mb-5">download</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="drag" />
              <h6 className="text-light mt-3 mb-5">drag</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="dropdown" />
              <h6 className="text-light mt-3 mb-5">dropdown</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="edit" />
              <h6 className="text-light mt-3 mb-5">edit</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="expand" />
              <h6 className="text-light mt-3 mb-5">expand</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="external" />
              <h6 className="text-light mt-3 mb-5">external</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="eye" />
              <h6 className="text-light mt-3 mb-5">eye</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="filter" />
              <h6 className="text-light mt-3 mb-5">filter</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="folder" />
              <h6 className="text-light mt-3 mb-5">folder</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="full-screen" />
              <h6 className="text-light mt-3 mb-5">full-screen</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="gallery" />
              <h6 className="text-light mt-3 mb-5">gallery</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="gender" />
              <h6 className="text-light mt-3 mb-5">gender</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="globe" />
              <h6 className="text-light mt-3 mb-5">globe</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="google-maps" />
              <h6 className="text-light mt-3 mb-5">google maps</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="grid-four-up" />
              <h6 className="text-light mt-3 mb-5">grid-four-up</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="grid-three-up" />
              <h6 className="text-light mt-3 mb-5">grid-three-up</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="grid-two-up" />
              <h6 className="text-light mt-3 mb-5">grid-two-up</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="header" />
              <h6 className="text-light mt-3 mb-5">header</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="headphones" />
              <h6 className="text-light mt-3 mb-5">headphones</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="heart" />
              <h6 className="text-light mt-3 mb-5">heart</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="height" />
              <h6 className="text-light mt-3 mb-5">height</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="highlight" />
              <h6 className="text-light mt-3 mb-5">highlight</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="home-outline" />
              <h6 className="text-light mt-3 mb-5">home-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="home-solid" />
              <h6 className="text-light mt-3 mb-5">home-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="iframe" />
              <h6 className="text-light mt-3 mb-5">iframe</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="info-outline" />
              <h6 className="text-light mt-3 mb-5">info-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="info-solid" />
              <h6 className="text-light mt-3 mb-5">info-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="insert" />
              <h6 className="text-light mt-3 mb-5">insert</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="italic" />
              <h6 className="text-light mt-3 mb-5">italic</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="legal" />
              <h6 className="text-light mt-3 mb-5">legal</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="link" />
              <h6 className="text-light mt-3 mb-5">link</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="list" />
              <h6 className="text-light mt-3 mb-5">list</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="list-cards" />
              <h6 className="text-light mt-3 mb-5">list-cards</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="location-outline" />
              <h6 className="text-light mt-3 mb-5">location-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="location-solid" />
              <h6 className="text-light mt-3 mb-5">location-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="locked" />
              <h6 className="text-light mt-3 mb-5">locked</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="locked-solid" />
              <h6 className="text-light mt-3 mb-5">locked-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="login" />
              <h6 className="text-light mt-3 mb-5">login</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="logout" />
              <h6 className="text-light mt-3 mb-5">logout</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="long-text" />
              <h6 className="text-light mt-3 mb-5">long-text</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="mail" />
              <h6 className="text-light mt-3 mb-5">mail</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="menu" />
              <h6 className="text-light mt-3 mb-5">menu</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="microphone" />
              <h6 className="text-light mt-3 mb-5">microphone</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="minus" />
              <h6 className="text-light mt-3 mb-5">minus</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="minus-line" />
              <h6 className="text-light mt-3 mb-5">minus-line</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="minus-line-thick" />
              <h6 className="text-light mt-3 mb-5">minus-line-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="minus-outline" />
              <h6 className="text-light mt-3 mb-5">minus-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="minus-outline-square" />
              <h6 className="text-light mt-3 mb-5">minus-outline-square</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="minus-solid" />
              <h6 className="text-light mt-3 mb-5">minus-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="more-horizontal" />
              <h6 className="text-light mt-3 mb-5">more-horizontal</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="more-vertical" />
              <h6 className="text-light mt-3 mb-5">more-vertical</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="move" />
              <h6 className="text-light mt-3 mb-5">move</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="new-outline" />
              <h6 className="text-light mt-3 mb-5">new-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="notification" />
              <h6 className="text-light mt-3 mb-5">notification</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="notification-outline" />
              <h6 className="text-light mt-3 mb-5">notification-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="number-sign" />
              <h6 className="text-light mt-3 mb-5">number-sign</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="ordered-list" />
              <h6 className="text-light mt-3 mb-5">ordered-list</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="page-break" />
              <h6 className="text-light mt-3 mb-5">page-break</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="paperclip" />
              <h6 className="text-light mt-3 mb-5">paperclip</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="paragraph" />
              <h6 className="text-light mt-3 mb-5">paragraph</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pause" />
              <h6 className="text-light mt-3 mb-5">pause</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pause-outline" />
              <h6 className="text-light mt-3 mb-5">pause-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pen" />
              <h6 className="text-light mt-3 mb-5">pen</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pencil" />
              <h6 className="text-light mt-3 mb-5">pencil</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="phone-mobile" />
              <h6 className="text-light mt-3 mb-5">phone-mobile</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="phone-outline" />
              <h6 className="text-light mt-3 mb-5">phone-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="phone-solid" />
              <h6 className="text-light mt-3 mb-5">phone-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="photo" />
              <h6 className="text-light mt-3 mb-5">photo</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pin" />
              <h6 className="text-light mt-3 mb-5">pin</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pin-outline-slanted" />
              <h6 className="text-light mt-3 mb-5">pin-outline-slanted</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pin-slanted" />
              <h6 className="text-light mt-3 mb-5">pin-slanted</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="play" />
              <h6 className="text-light mt-3 mb-5">play</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="play-outline" />
              <h6 className="text-light mt-3 mb-5">play-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="play-stroke" />
              <h6 className="text-light mt-3 mb-5">play-stroke</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="playlist" />
              <h6 className="text-light mt-3 mb-5">playlist</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="plus" />
              <h6 className="text-light mt-3 mb-5">plus</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="plus-line" />
              <h6 className="text-light mt-3 mb-5">plus-line</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="plus-line-thick" />
              <h6 className="text-light mt-3 mb-5">plus-line-thick</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="plus-outline" />
              <h6 className="text-light mt-3 mb-5">plus-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="plus-outline-square" />
              <h6 className="text-light mt-3 mb-5">plus-outline-square</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="plus-solid" />
              <h6 className="text-light mt-3 mb-5">plus-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="poll" />
              <h6 className="text-light mt-3 mb-5">poll</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="poll-grid" />
              <h6 className="text-light mt-3 mb-5">poll-grid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="print" />
              <h6 className="text-light mt-3 mb-5">print</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="question" />
              <h6 className="text-light mt-3 mb-5">question</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="question-outline" />
              <h6 className="text-light mt-3 mb-5">question-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="question-solid" />
              <h6 className="text-light mt-3 mb-5">question-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="quote" />
              <h6 className="text-light mt-3 mb-5">quote</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="refresh" />
              <h6 className="text-light mt-3 mb-5">refresh</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="reports" />
              <h6 className="text-light mt-3 mb-5">reports</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="revert" />
              <h6 className="text-light mt-3 mb-5">revert</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="save" />
              <h6 className="text-light mt-3 mb-5">save</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="save-disk" />
              <h6 className="text-light mt-3 mb-5">save-disk</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="save-diskette" />
              <h6 className="text-light mt-3 mb-5">save-diskette</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="search" />
              <h6 className="text-light mt-3 mb-5">search</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="services" />
              <h6 className="text-light mt-3 mb-5">services</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="settings" />
              <h6 className="text-light mt-3 mb-5">settings</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="short-text" />
              <h6 className="text-light mt-3 mb-5">short-text</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="social" />
              <h6 className="text-light mt-3 mb-5">social</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="sort" />
              <h6 className="text-light mt-3 mb-5">sort</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="sort-horizontal" />
              <h6 className="text-light mt-3 mb-5">sort-horizontal</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="sort-vertical" />
              <h6 className="text-light mt-3 mb-5">sort-vertical</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="sound-histogram" />
              <h6 className="text-light mt-3 mb-5">sound-histogram</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="sound-wave" />
              <h6 className="text-light mt-3 mb-5">sound-wave</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="star" />
              <h6 className="text-light mt-3 mb-5">star</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="star-outline" />
              <h6 className="text-light mt-3 mb-5">star-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="status" />
              <h6 className="text-light mt-3 mb-5">status</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="strikethrough" />
              <h6 className="text-light mt-3 mb-5">strikethrough</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tablet" />
              <h6 className="text-light mt-3 mb-5">tablet</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tag-outline" />
              <h6 className="text-light mt-3 mb-5">tag-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tag-outline-slanted" />
              <h6 className="text-light mt-3 mb-5">tag-outline-slanted</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tag-slanted" />
              <h6 className="text-light mt-3 mb-5">tag-slanted</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tag-solid" />
              <h6 className="text-light mt-3 mb-5">tag-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="timeline" />
              <h6 className="text-light mt-3 mb-5">timeline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="trash" />
              <h6 className="text-light mt-3 mb-5">trash</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tumblr" />
              <h6 className="text-light mt-3 mb-5">tumblr</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tweet" />
              <h6 className="text-light mt-3 mb-5">tweet</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="underline" />
              <h6 className="text-light mt-3 mb-5">underline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="unknown" />
              <h6 className="text-light mt-3 mb-5">unknown</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="unlink" />
              <h6 className="text-light mt-3 mb-5">unlink</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="unlocked" />
              <h6 className="text-light mt-3 mb-5">unlocked</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="unlocked-solid" />
              <h6 className="text-light mt-3 mb-5">unlocked-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="upload" />
              <h6 className="text-light mt-3 mb-5">upload</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="user" />
              <h6 className="text-light mt-3 mb-5">user</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="users" />
              <h6 className="text-light mt-3 mb-5">users</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="user-solid" />
              <h6 className="text-light mt-3 mb-5">user-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="video" />
              <h6 className="text-light mt-3 mb-5">video</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="video-camera" />
              <h6 className="text-light mt-3 mb-5">video-camera</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning" />
              <h6 className="text-light mt-3 mb-5">warning</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning-outline" />
              <h6 className="text-light mt-3 mb-5">warning-outline</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning-outline-alt" />
              <h6 className="text-light mt-3 mb-5">warning-outline-alt</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning-outline-triangle" />
              <h6 className="text-light mt-3 mb-5">warning-outline-triangle</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning-solid" />
              <h6 className="text-light mt-3 mb-5">warning-solid</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning-solid-alt" />
              <h6 className="text-light mt-3 mb-5">warning-solid-alt</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="warning-solid-triangle" />
              <h6 className="text-light mt-3 mb-5">warning-solid-triangle</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="weight" />
              <h6 className="text-light mt-3 mb-5">weight</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="x" />
              <h6 className="text-light mt-3 mb-5">x</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="zip" />
              <h6 className="text-light mt-3 mb-5">zip</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="zoom-in" />
              <h6 className="text-light mt-3 mb-5">zoom-in</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="zoom-out" />
              <h6 className="text-light mt-3 mb-5">zoom-out</h6>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Icons Social */}

      <Card>
        <CardHeader>
          Icons: Social
        </CardHeader>
        <CardBody>
          <Row className="gx-2 mt-5" xs="3" sm="6">
            <Col className="text-center">
              <Icon size="lg" imgSrc="facebook" />
              <h6 className="text-light mt-3 mb-5">facebook</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="facebook-circle" />
              <h6 className="text-light mt-3 mb-5">facebook-circle</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="google" />
              <h6 className="text-light mt-3 mb-5">google</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="imgur" />
              <h6 className="text-light mt-3 mb-5">imgur</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="instagram" />
              <h6 className="text-light mt-3 mb-5">instagram</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="linkedin" />
              <h6 className="text-light mt-3 mb-5">linkedin</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="pinterest" />
              <h6 className="text-light mt-3 mb-5">pinterest</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="skype" />
              <h6 className="text-light mt-3 mb-5">skype</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="snapchat" />
              <h6 className="text-light mt-3 mb-5">snapchat</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="soundcloud" />
              <h6 className="text-light mt-3 mb-5">soundcloud</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="tiktok" />
              <h6 className="text-light mt-3 mb-5">tiktok</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="twitter" />
              <h6 className="text-light mt-3 mb-5">twitter</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="vevo" />
              <h6 className="text-light mt-3 mb-5">vevo</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="vimeo" />
              <h6 className="text-light mt-3 mb-5">vimeo</h6>
            </Col>
            <Col className="text-center">
              <Icon size="lg" imgSrc="youtube" />
              <h6 className="text-light mt-3 mb-5">youtube</h6>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Icon Buttons*/}

      <Card id="icon-buttons">
        <CardHeader>
          Icon Parameters
        </CardHeader>
        <CardBody>
          <legend>Sizes</legend>
          <Label className="text-label">size="xxs-xxl"</Label>
          <Icon imgSrc="plus-outline" size="xxs" className="me-2" />
          <Icon imgSrc="plus-outline" size="xs" className="me-2" />
          <Icon imgSrc="plus-outline" size="sm" className="me-2" />
          <Icon imgSrc="plus-outline" size="default" className="me-2" />
          <Icon imgSrc="plus-outline" size="sd" className="me-2" />
          <Icon imgSrc="plus-outline" size="md" className="me-2" />
          <Icon imgSrc="plus-outline" size="lg" className="me-2" />
          <Icon imgSrc="plus-outline" size="xl" className="me-2" />
          <Icon imgSrc="plus-outline" size="xxl" className="me-2" />

          <hr />

          <legend>Colors</legend>
          <Icon imgSrc="check-outline" size="xxs" className="me-2" color="success" />
          <Icon imgSrc="check-outline" size="xs" className="me-2" color="info" />
          <Icon imgSrc="check-outline" size="sm" className="me-2" color="warning" />
          <Icon imgSrc="check-outline" size="default" className="me-2" color="danger" />
          <Icon imgSrc="check-outline" size="sd" className="me-2" color="dark" />
          <Icon imgSrc="check-outline" size="md" className="me-2" color="success" />
          <Icon imgSrc="check-solid" size="lg" className="me-2" color="info" />
          <Icon imgSrc="check-solid" size="xl" className="me-2" color="warning" />
          <Icon imgSrc="check-solid" size="xxl" className="me-2" color="danger" />

          <hr />

          <legend>Buttons Rounded</legend>
          <Label className="text-label">size="xxs-xl" <br />className="rounded-circle"</Label>
          <Button className="rounded-circle" color="success" size="xxs">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" size="xxs" />
          </Button>
          <Button className="rounded-circle" color="info" size="xs">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" size="xs" />
          </Button>
          <Button className="rounded-circle" color="warning" size="sm">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" size="sm" />
          </Button>
          <Button className="rounded-circle" color="danger">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" />
          </Button>
          <Button className="rounded-circle" color="dark" size="md">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" size="md" />
          </Button>
          <Button className="rounded-circle" outline color="light" size="lg">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" size="lg" />
          </Button>
          <Button className="rounded-circle" color="hover-bg" size="xl">
            <Icon imgSrc="check-line-thick" alt="check-line-thick" size="xl" />
          </Button>

          <hr />

          <legend>Icon Groups</legend>
          <span className="icon-group icon-group-left m-3" >
            <Icon imgSrc="pencil" alert size="xxl" radius="rounded" border />
            <Icon imgSrc="facebook" size="xs" alert />
          </span>
          <span className="icon-group icon-group-left m-3" >
            <Icon imgSrc="video" alert size="xxl" radius="rounded" border />
            <Icon imgSrc="facebook" size="xs" alert />
          </span>

        </CardBody>
      </Card>

      {/* Input Group */}

      <Card id="input-group">
        <CardHeader>
          Input Group
        </CardHeader>
        <CardBody>
          <InputGroup>
            <Dropdown>
              <Button color="light" className="border-end-0">Split Button</Button>
              <UncontrolledDropdown>
                <DropdownToggle split color="light" className="rounded-0" />
                <DropdownMenu>
                  <DropdownItem header>Header</DropdownItem>
                  <DropdownItem disabled>Action</DropdownItem>
                  <DropdownItem>Another Action</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Another Action</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Dropdown>
            <input placeholder="and..." className="form-control" />
            <InputGroupText>Text</InputGroupText>
            <Button color="secondary">I'm a button</Button>
          </InputGroup>
        </CardBody>

        <CardBody className="bg-light">
          <Label className="label">Utility class bg-color</Label>
          <Row>
            <Col xs="6">
              <InputGroup size="sm">
                <Button color="secondary">I'm a button</Button>
                <input className="form-control bg-white" />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Layout */}

      <Card id="layout">
        <CardHeader>
          Layout
        </CardHeader>
        <CardBody className="ui-cols">
          <legend>Set Col width using parameter xs-xl="1-12"</legend>
        </CardBody>
        <Container fluid className="ui-cols">
          <Row>
            <Col>.col</Col>
          </Row>
          <Row>
            <Col xs="3">.col-3</Col>
            <Col xs="auto">.col-auto - variable width content</Col>
            <Col xs="3">.col-3</Col>
          </Row>
          <Row>
            <Col xs="6">.col-6</Col>
            <Col xs="6">.col-6</Col>
          </Row>
          <Row>
            <Col xs="6" sm="4">.col-6 col-sm-4</Col>
            <Col xs="6" sm="4">.col-6 col-sm-4</Col>
            <Col sm="4">.col-sm-4</Col>
          </Row>
          <Row>
            <Col sm={{ size: 6, order: 2, offset: 1 }}>.col-sm-6 order-sm-2 offset-sm-1</Col>
          </Row>
          <Row>
            <Col xs="12" md={{ size: 8, offset: 2 }}>.col-12 col-md-8 offset-md-2</Col>
          </Row>
          <Row>
            <Col xs="3" sm={{ size: 'auto', offset: 1 }}>.col-3 col-sm-auto offset-sm-1</Col>
            <Col xs="3" sm={{ size: 'auto', offset: 1 }}>.col-3 col-sm-auto offset-sm-1</Col>
          </Row>
        </Container>

        <hr />

        <CardBody className="ui-cols">
          <legend>Set Col width using ROW parameter xs-xl="1-12"</legend>
          <Container>
            <Row xs="2">
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
            </Row>
            <Row xs="3">
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
            </Row>
            <Row xs="4">
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
            </Row>
            <Row xs="4">
              <Col>Column</Col>
              <Col>Column</Col>
              <Col xs="6">Column</Col>
              <Col>Column</Col>
            </Row>
            <Row xs="1" sm="2" md="4">
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
              <Col>Column</Col>
            </Row>
          </Container>
        </CardBody>

        <CardBody className="ui-cols">
          <legend>Set Col gutters (className="gx-2") with div className="mb-*" (1.5rem is default for FormGroup)</legend>
          <Row className="gx-2" xs="1" sm="2" md="4">
            <Col>
              <div className="mb-2">FormGroup</div>
            </Col>
            <Col>
              <div className="mb-2">FormGroup</div>
            </Col>
            <Col>
              <div className="mb-2">FormGroup</div>
            </Col>
            <Col xs="auto">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
          <Row className="gx-2" xs="1" sm="2" md="4">
            <Col>
              <div className="mb-2">FormGroup</div>
            </Col>
            <Col>
              <div className="mb-2">FormGroup</div>
            </Col>
            <Col>
              <div className="mb-2">FormGroup</div>
            </Col>
            <Col xs="auto">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
        </CardBody>

        <CardBody className="ui-cols">
          <legend>Set Col side margins using gx-(1-5) utility classes</legend>
          <Row xs="1" sm="2" md="4" className="gx-1">
            <Col>
              <div className="form-group">gx-1</div>
            </Col>
            <Col>
              <div className="form-group">6px gap</div>
            </Col>
            <Col>
              <div className="form-group">FormGroup</div>
            </Col>
            <Col xs="auto ps-1">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
          <Row xs="1" sm="2" md="4" className="gx-2">
            <Col>
              <div className="form-group">gx-2</div>
            </Col>
            <Col>
              <div className="form-group">10px gap</div>
            </Col>
            <Col>
              <div className="form-group">FormGroup</div>
            </Col>
            <Col xs="auto ps-1">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
          <Row xs="1" sm="2" md="4" className="gx-3">
            <Col>
              <div className="form-group">gx-3</div>
            </Col>
            <Col>
              <div className="form-group">16px gap</div>
            </Col>
            <Col>
              <div className="form-group">FormGroup</div>
            </Col>
            <Col xs="auto ps-1">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
          <Row xs="1" sm="2" md="4" className="gx-4">
            <Col>
              <div className="form-group">gx-4</div>
            </Col>
            <Col>
              <div className="form-group">24px gap (default)</div>
            </Col>
            <Col>
              <div className="form-group">FormGroup</div>
            </Col>
            <Col xs="auto p-0">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
          <Row xs="1" sm="2" md="4" className="gx-5">
            <Col>
              <div className="form-group">gx-5</div>
            </Col>
            <Col>
              <div className="form-group">32px gap</div>
            </Col>
            <Col>
              <div className="form-group">FormGroup</div>
            </Col>
            <Col xs="auto p-0">
              <Button color="hover" className="rounded-circle">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
        </CardBody>

        <CardBody className="ui-cols">
          <legend>Remove margins using gx-0 class and mb-0 on FormGroups and Buttons</legend>
          <Row xs="1" sm="2" md="4" className="gx-0">
            <Col>
              <div className="form-group mb-0">FormGroup</div>
            </Col>
            <Col>
              <div className="form-group mb-0">FormGroup</div>
            </Col>
            <Col>
              <div className="form-group mb-0">FormGroup</div>
            </Col>
            <Col xs="auto">
              <Button color="hover" className="rounded-circle mb-0">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
          <Row xs="1" sm="2" md="4" className="gx-0">
            <Col>
              <div className="form-group mb-0">FormGroup</div>
            </Col>
            <Col>
              <div className="form-group mb-0">FormGroup</div>
            </Col>
            <Col>
              <div className="form-group mb-0">FormGroup</div>
            </Col>
            <Col xs="auto">
              <Button color="hover" className="rounded-circle mb-0">
                <Icon imgSrc="delete" alt="delete" />
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* List Group */}

      <Card id="list-group">
        <CardHeader>List Group: Numbered Items</CardHeader>
        <CardBody>
          <ListGroup numbered>
            <ListGroupItem action>List Group Item action</ListGroupItem>
            <ListGroupItem active>List Group Item active</ListGroupItem>
            <ListGroupItem disabled>List Group Item disabled</ListGroupItem>
            <ListGroupItem >List item with Badge <Badge pill color="dark" className="float-end">4</Badge></ListGroupItem>
            <ListGroupItem>List item with Badge alert<Badge pill className="badge-alert">9</Badge></ListGroupItem>
          </ListGroup>
        </CardBody>

        <CardHeader>List Group: Buttons</CardHeader>
        <CardBody>
          <ListGroup>
            <ListGroupItem tag="a" href="#" action>Link</ListGroupItem>
            <ListGroupItem active tag="button" action>active Button</ListGroupItem>
            <ListGroupItem tag="button" action>Button</ListGroupItem>
            <ListGroupItem disabled tag="button" action>Disabled Button</ListGroupItem>
          </ListGroup>
        </CardBody>

        <CardHeader>List Group: Flush Buttons</CardHeader>
        <CardBody>
          <ListGroup className="list-group-flush">
            <ListGroupItem tag="a" href="#" action>Link</ListGroupItem>
            <ListGroupItem active tag="button" action>active Button</ListGroupItem>
            <ListGroupItem tag="button" action>Button</ListGroupItem>
            <ListGroupItem disabled tag="button" action>Disabled Button</ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Borderless Buttons</CardHeader>
        <CardBody>
          <ListGroup className="list-group-borderless">
            <ListGroupItem tag="a" href="#" action>Link</ListGroupItem>
            <ListGroupItem active tag="button" action>active Button</ListGroupItem>
            <ListGroupItem tag="button" action>Button</ListGroupItem>
            <ListGroupItem disabled tag="button" action>Disabled Button</ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Color</CardHeader>
        <CardBody>
          <ListGroup>
            <ListGroupItem color="success">Cras justo odio</ListGroupItem>
            <ListGroupItem color="info">Dapibus ac facilisis in</ListGroupItem>
            <ListGroupItem color="warning">Morbi leo risus</ListGroupItem>
            <ListGroupItem color="danger">Porta ac consectetur ac</ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Heading and Item Text</CardHeader>
        <CardBody>
          <ListGroup>
            <ListGroupItem active>
              <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
              <ListGroupItemText className="mb-0">
                Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
              <ListGroupItemText className="mb-0">
                Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
              <ListGroupItemText className="mb-0">
                Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
              </ListGroupItemText>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Nav</CardHeader>
        <CardBody>
          <ListGroup className="list-group-nav">
            <ListGroupItem active>
              <a href="">
                <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                <ListGroupItemText className="mb-0">
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </a>
            </ListGroupItem>
            <ListGroupItem>
              <a href="">
                <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                <ListGroupItemText className="mb-0">
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </a>
            </ListGroupItem>
            <ListGroupItem>
              <a href="">
                <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                <ListGroupItemText className="mb-0">
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </a>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Nav, Borderless</CardHeader>
        <CardBody>
          <ListGroup className="list-group-nav list-group-borderless">
            <ListGroupItem active>
              <a href="">
                <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                <ListGroupItemText className="mb-0">
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </a>
            </ListGroupItem>
            <ListGroupItem>
              <a href="">
                <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                <ListGroupItemText className="mb-0">
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </a>
            </ListGroupItem>
            <ListGroupItem>
              <a href="">
                <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                <ListGroupItemText className="mb-0">
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </a>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Horizontal</CardHeader>
        <CardBody>
          <ListGroup horizontal className="mb-4">
            <ListGroupItem tag="a" href="#" action>#list-group</ListGroupItem>
            <ListGroupItem tag="a" href="#" action active>#Washington</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#HasPhoto</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#Submission</ListGroupItem>
          </ListGroup>

          <ListGroup horizontal className="mb-4">
            <ListGroupItem tag="a" href="#">#list-group</ListGroupItem>
            <ListGroupItem tag="a" href="#" active>#Washington</ListGroupItem>
            <ListGroupItem tag="a" href="#">#HasPhoto</ListGroupItem>
            <ListGroupItem tag="a" href="#">#Submission</ListGroupItem>
          </ListGroup>

          <h5 className="mb-3">List Group: Collection theme</h5>
          <ListGroup horizontal className="list-group-collection mb-4">
            <ListGroupItem tag="a" href="#" action>#list-group</ListGroupItem>
            <ListGroupItem tag="a" href="#" action active>#Washington</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#HasPhoto</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#Submission</ListGroupItem>
          </ListGroup>

          <ListGroup className="list-group-collection mb-4">
            <ListGroupItem tag="a" href="#" action>#list-group</ListGroupItem>
            <ListGroupItem tag="a" href="#" action active>#Washington</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#HasPhoto</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#Submission</ListGroupItem>
          </ListGroup>

        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: Item Roles</CardHeader>
        <ListGroup>
          <ListGroupItem className="list-group-item-roles">
            <ListGroupItemText>
              create-form-event
            </ListGroupItemText>
            <span>
              <Button color="hover-bg" className="rounded-circle mb-0">
                <Icon imgSrc="eye" alt="details" />
              </Button>
              <Button color="hover-bg" className="rounded-circle mb-0">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </span>
          </ListGroupItem>
          <ListGroupItem className="list-group-item-roles">
            <ListGroupItemText>
              role-create-node
            </ListGroupItemText>
            <span>
              <Button color="hover-bg" className="rounded-circle mb-0">
                <Icon imgSrc="eye" alt="details" />
              </Button>
              <Button color="hover-bg" className="rounded-circle mb-0">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </span>
          </ListGroupItem>
          <ListGroupItem className="list-group-item-roles">
            <ListGroupItemText>
              custom-delegate
            </ListGroupItemText>
            <span>
              <Button color="hover-bg" className="rounded-circle mb-0">
                <Icon imgSrc="eye" alt="details" />
              </Button>
              <Button color="hover-bg" className="rounded-circle mb-0">
                <Icon imgSrc="pencil" alt="edit" />
              </Button>
            </span>
          </ListGroupItem>
        </ListGroup>
      </Card>

      <Card>
        <CardHeader>List Group: Chat</CardHeader>
        <CardBody>
          <ListGroup className="list-group-chat">
            <ListGroupItem className="list-group-chat-item-me">
              <ListGroupItemHeading>Me <small>3 minutes ago</small></ListGroupItemHeading>
              <ListGroupItemText>
                My phone got wet and I lost all of my numbers. Please text me.
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>Albert Gutierrez<small>2 minutes ago</small></ListGroupItemHeading>
              <ListGroupItemText>
                1 2 3 4 5 6 7 8 9 0 That should be all of them.
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>Albert Gutierrez<small>a few seconds ago</small></ListGroupItemHeading>
              <ListGroupItemText>
                Feel free to rearrange.
              </ListGroupItemText>
            </ListGroupItem>
          </ListGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>List Group: History</CardHeader>
        <CardBody className="card-body-indent">
          <ListGroup className="list-group-history">

            <ListGroupItem className="mb-0">
              <ListGroupItemText>
                <span className="me-2 text-muted"><i>#1</i></span>
                <span className="me-2"><strong>Article Marked As Draft</strong></span>
                by
                <span className="ms-2"><strong><a href="">Joel Capillo</a></strong></span>
                <span className="float-right"><i>an hour ago</i></span>
              </ListGroupItemText>
              <ListGroup className="list-group-borderless">
                <ListGroupItem className="mb-0">
                  <CardTitle tag="h5">
                    <a className="card-title-sm text-info pe-2 ps-2">
                      View Event Details
                    </a>
                  </CardTitle>
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

            <ListGroupItem className="mb-0">
              <ListGroupItemText>
                <span className="me-2 text-muted"><i>#2</i></span>
                <span className="me-2"><strong>Article Marked As Deleted</strong></span>
                by
                <span className="ms-2"><strong><a href="">Joel Capillo</a></strong></span>
                <span className="float-right"><i>2 hours ago</i></span>
              </ListGroupItemText>
              <ListGroup className="list-group-borderless">
                <ListGroupItem className="mb-0">
                  <CardTitle tag="h5">
                    <a className="card-title-sm text-info pe-2 ps-2">
                      View Event Details
                    </a>
                  </CardTitle>
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

            <ListGroupItem className="mb-0">
              <ListGroupItemText>
                <span className="me-2 text-muted"><i>#3</i></span>
                <span className="me-2"><strong>Article Marked As Draft</strong></span>
                by
                <span className="ms-2"><strong><a href="">Joel Capillo</a></strong></span>
                <span className="float-right"><i>15 hours ago</i></span>
              </ListGroupItemText>
              <ListGroup className="list-group-borderless">
                <ListGroupItem className="mb-0">
                  <CardTitle tag="h5">
                    <a className="card-title-sm text-info pe-2 ps-2">
                      View Event Details
                    </a>
                  </CardTitle>
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

            <ListGroupItem className="mb-0">
              <ListGroupItemText>
                <span className="me-2 text-muted"><i>#4</i></span>
                <span className="me-2"><strong>Article Marked As Deleted</strong></span>
                by
                <span className="ms-2"><strong><a href="">Joel Capillo</a></strong></span>
                <span className="float-right"><i>17 hours ago</i></span>
              </ListGroupItemText>
              <ListGroup className="list-group-borderless">
                <ListGroupItem className="mb-0">
                  <CardTitle tag="h5">
                    <a className="card-title-sm text-info pe-2 ps-2">
                      View Event Details
                    </a>
                  </CardTitle>
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

            <ListGroupItem className="mb-0">
              <ListGroupItemText>
                <span className="me-2 text-muted"><i>#5</i></span>
                <span className="me-2"><strong>Article Marked As Updated</strong></span>
                by
                <span className="ms-2"><strong><a href="">Joel Capillo</a></strong></span>
                <span className="float-right"><i>5 days ago</i></span>
              </ListGroupItemText>
              <ListGroup className="list-group-borderless">
                <ListGroupItem className="mb-0">
                  <CardTitle tag="h5">
                    <a className="card-title-sm text-info pe-2 ps-2">
                      View Event Details
                    </a>
                  </CardTitle>
                </ListGroupItem>
              </ListGroup>
            </ListGroupItem>

          </ListGroup>
        </CardBody>
      </Card>

      {/* Media */}

      <Card id="media">
        <CardHeader>Media: Hover classes</CardHeader>
        <CardBody>
          <Row>
            <Col>
              <legend>className="media-hover-shadow"</legend>
              <a href="#" className="media-hover-shadow media-left">
                <img src="//placehold.co/150x150" alt="Generic placeholder image" />
              </a>
              <a href="#" className="media-hover-shadow media-left">
                <img src="//placehold.co/150x150" alt="Generic placeholder image" />
              </a>
              <a href="#" className="media-hover-shadow media-left">
                <img src="//placehold.co/150x150" alt="Generic placeholder image" />
              </a>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <legend>className="media-hover-shadow", className="img-thumbnail" on object</legend>
              <a href="#" className="media-hover-shadow media-left">
                <img src="//placehold.co/150x150" alt="Generic placeholder image"
                     className="img-thumbnail" />
              </a>
              <a href="#" className="media-hover-shadow media-left">
                <img src="//placehold.co/150x150" alt="Generic placeholder image"
                     className="img-thumbnail" />
              </a>
              <a href="#" className="media-hover-shadow media-left">
                <img src="//placehold.co/150x150" alt="Generic placeholder image"
                     className="img-thumbnail" />
              </a>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <legend>className="media-hover-outline"</legend>
              <a href="#" className="media-left media-hover-outline">
                <img className="rounded" src="//placehold.co/150x150"
                     alt="Generic placeholder image" />
              </a>
              <a href="#" className="media-left media-hover-outline">
                <img className="rounded" src="//placehold.co/150x150"
                     alt="Generic placeholder image" />
              </a>
              <a href="#" className="media-left media-hover-outline">
                <img className="rounded" src="//placehold.co/150x150"
                     alt="Generic placeholder image" />
              </a>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <legend>className="media-hover-opacity"</legend>
              <a href="#" className="media-left media-hover-opacity">
                <img className="rounded" src="//placehold.co/150x150"
                     alt="Generic placeholder image" />
              </a>
              <a href="#" className="media-left media-hover-opacity">
                <img className="rounded" src="//placehold.co/150x150"
                     alt="Generic placeholder image" />
              </a>
              <a href="#" className="media-left media-hover-opacity">
                <img className="rounded" src="//placehold.co/150x150"
                     alt="Generic placeholder image" />
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card id="modals">
        <CardHeader>Modals</CardHeader>
        <ModalExample />
      </Card>

      {/* Navbar */}

      <Card id="navbar">
        <CardHeader>Navbar</CardHeader>
        <CardBody>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/" className="ms-0">reactstrap</NavbarBrand>
            <NavbarToggler id="navbar-toggler" />
            <UncontrolledCollapse navbar toggler="#navbar-toggler">
              <Nav className="ms-auto" navbar>
                <NavItem>
                  <NavLink href="/components/">Components</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Options
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem>
                      Option 1
                    </DropdownItem>
                    <DropdownItem>
                      Option 2
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      Reset
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </UncontrolledCollapse>
          </Navbar>
        </CardBody>
        <CardBody>
          <h4>Full Width Inverse Toggleable</h4>
          <Navbar dark>
            <NavbarBrand href="/" className="ms-0">reactstrap</NavbarBrand>
            <NavbarToggler id="navbar-toggler-inverse" className="px-0" />
            <UncontrolledCollapse toggler="#navbar-toggler-inverse" navbar>
              <Nav navbar>
                <NavItem>
                  <NavLink href="/components/">Components</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
                </NavItem>
              </Nav>
            </UncontrolledCollapse>
          </Navbar>
        </CardBody>
      </Card>

      {/* Nav */}

      <Card id="navs">
        <CardHeader>Navs</CardHeader>
        <CardBody>
          <legend>NavItem Based</legend>
          <Nav>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">Disabled Link</NavLink>
            </NavItem>
          </Nav>
        </CardBody>
        <CardBody>
          <h5>NavLink Based</h5>
          <Nav>
            <NavLink href="#">Link</NavLink> <NavLink href="#">Link</NavLink>
            <NavLink href="#">Another Link</NavLink>
            <NavLink disabled href="#">Disabled Link</NavLink>
          </Nav>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Nav: Vertical</CardHeader>
        <CardBody>
          <h5>NavItem Based</h5>
          <Nav vertical>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">Disabled Link</NavLink>
            </NavItem>
          </Nav>
        </CardBody>
        <CardBody>
          <h5>NavLink Based</h5>
          <Nav vertical>
            <NavLink href="#">Link</NavLink> <NavLink href="#">Link</NavLink>
            <NavLink href="#">Another Link</NavLink>
            <NavLink disabled href="#">Disabled Link</NavLink>
          </Nav>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Nav: Tabs</CardHeader>
        <CardBody className="pb-7">
          <Nav tabs>
            <NavItem>
              <NavLink href="#" active>Link</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Header</DropdownItem>
                <DropdownItem disabled>Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Another Action</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">Disabled Link</NavLink>
            </NavItem>
          </Nav>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Nav: Underline</CardHeader>
        <CardBody className="pb-7">
          <Nav className="nav-underline">
            <NavItem>
              <NavLink href="#" active>Link</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Overflow on Mobile</DropdownItem>
                <DropdownItem disabled>Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Another Action</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">Disabled Link</NavLink>
            </NavItem>
          </Nav>
        </CardBody>
        <CardBody className="pb-7">
          <h5>Nav: Underline SM</h5>
          <Nav className="nav-underline nav-sm">
            <NavItem>
              <NavLink href="#" active>Link</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Overflow on Mobile</DropdownItem>
                <DropdownItem disabled>Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Another Action</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">Disabled Link</NavLink>
            </NavItem>
          </Nav>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Nav: Pills</CardHeader>
        <CardBody className="pb-7">
          <Nav pills>
            <NavItem>
              <NavLink href="#" active>Active</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Dropdown
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>Header</DropdownItem>
                <DropdownItem disabled>Action</DropdownItem>
                <DropdownItem>Another Action</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Another Action</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="#">Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">Another Link</NavLink>
            </NavItem>
            <NavItem>
              <NavLink disabled href="#">Disabled Link</NavLink>
            </NavItem>
          </Nav>
        </CardBody>

        <CardBody className="pb-7">
          <h5>Nav: Pills SM</h5>
          <Row>
            <Col>
              <Nav pills className="nav-pills-sm">
                <NavItem>
                  <NavLink href="#" active>Active</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Dropdown
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem disabled>Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Another Action</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink href="#">Link</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#">Another Link</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink disabled href="#">Disabled Link</NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </CardBody>

        <CardBody className="pb-7">
          <h5>Nav: Pills XS</h5>
          <Row>
            <Col>
              <Nav pills className="nav-pills-xs">
                <NavItem>
                  <NavLink href="#" active>Active</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Dropdown
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem disabled>Action</DropdownItem>
                    <DropdownItem>Another Action</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>Another Action</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <NavLink href="#">Link</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#">Another Link</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink disabled href="#">Disabled Link</NavLink>
                </NavItem>
              </Nav>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Pagination */}

      <Card id="pagination">
        <CardHeader>Pagination</CardHeader>
        <CardBody>
          <Pagination>
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem disabled>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem active>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                4
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                5
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
          </Pagination>

          <CardTitle tag="h4">Large</CardTitle>
          <Pagination size="lg">
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
          </Pagination>

          <CardTitle tag="h4">Small</CardTitle>
          <Pagination size="sm">
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
          </Pagination>
        </CardBody>
      </Card>

      {/* Popovers */}

      <Card id="popover">
        <CardHeader>Popovers</CardHeader>
        <CardBody>
          <Button id="UncontrolledPopover" outline color="light">
            Launch Popover - Top (Focus)
          </Button>
          <UncontrolledPopover placement="top" trigger="focus" target="UncontrolledPopover">
            <PopoverHeader>PopoverHeader: Title</PopoverHeader>
            <PopoverBody>PopoverBody: Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare
              sem lacinia quam venenatis vestibulum.</PopoverBody>
          </UncontrolledPopover>
        </CardBody>
      </Card>

      {/* Progress */}

      <Card id="progress">
        <CardHeader>Progress</CardHeader>
        <CardBody>
          <Progress multi>
            <Progress bar value="15" />
            <Progress bar color="success" value="20" />
            <Progress bar color="info" value="25" />
            <Progress bar color="warning" value="20" />
            <Progress bar color="danger" value="15" />
          </Progress>
        </CardBody>
        <CardBody>
          <Progress multi>
            <Progress bar value="15">Meh</Progress>
            <Progress bar color="success" value="35">Wow!</Progress>
            <Progress bar color="warning" value="25">25%</Progress>
            <Progress bar color="danger" value="25">LOOK OUT!!</Progress>
          </Progress>
        </CardBody>
        <CardBody>
          <Progress multi>
            <Progress bar striped value="15">Stripes</Progress>
            <Progress bar animated color="success" value="30">Animated Stripes</Progress>
            <Progress bar color="info" value="25">Plain</Progress>
          </Progress>
        </CardBody>
      </Card>

      {/* Radio Field */}

      <Card id="radio-field">
        <CardHeader>
          Radio Field
        </CardHeader>
        <CardBody>
          <legend className="label">Radio Buttons</legend>

          <div className="form-group">
            <div className="form-check mb-4">
              <input className="form-check-input" type="radio" id="is_title" name="is_title"  />
              <Label className="form-check-label" htmlFor="is_title">Default Bootstrap Radio</Label>
            </div>
            <small>Default bootstrap checkbox style using form-check, form-check-input, form-check-label
              styles</small>
          </div>

        </CardBody>
      </Card>

      {/* Range */}

      <Card id="range-field">
        <CardHeader>
          Range Field
        </CardHeader>
        <CardBody>

          <Label htmlFor="customRange1">Example range</Label>
          <input type="range" className="custom-range mb-4" id="customRange1" />

        </CardBody>
      </Card>

      {/* ReactDatePicker */}

      <Card id="reactdatepicker">
        <CardHeader>
          React DatePicker
        </CardHeader>
        <CardBody>

          <div className="form-group">
            <Label className="d-block" htmlFor="customRange1">Default Form Control</Label>
            <DatePicker.default className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
          </div>

          <div className="form-group">
            <Label htmlFor="customRange1"></Label>
            <InputGroup size="sm">
              <InputGroupText>
                <Icon imgSrc="calendar" size="sd" className="mx-1" />
              </InputGroupText>
              <DatePicker.default className="form-control" selected={clearableDate} onChange={(date) => setClearableDate(date)} isClearable />
            </InputGroup>
          </div>

          <p>This component relies on the <a href="https://reactdatepicker.com/" target="_blank"><strong>React
            DatePicker</strong></a> component.</p>

        </CardBody>
      </Card>

      {/* React Select */}

      <Card id="react-select">
        <CardHeader>
          React Select
        </CardHeader>
        <CardBody>
          <Select
            options={options}
            placeholder="Select your option(s)"
            className='select mb-4 select--size-lg'
            classNamePrefix='select'
            defaultValue={options[7]}
            isClearable
            isDisabled
          />
          <Select
            options={options}
            className="select basic-multi-select bg-white mb-4"
            classNamePrefix="select"
            defaultValue={[options[2], options[3]]}
            closeMenuOnSelect={false}
            name="select-multi"
            isMulti
          />
          <Row>
            <Col sm="4">
              <InputGroup size="sm">
                <Button color="secondary"><Icon imgSrc="search" size="sm" className="mx-1" /></Button>
                <Select
                  options={options}
                  className="select"
                  classNamePrefix="select"
                  name="input-group-select"
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Sortable List */}

      <Card id="sortable-list">
        <CardHeader>
          Sortable List
        </CardHeader>
        <CardBody>
          <ul className="sortable-list">
            <li className="sortable-item d-flex flex-nowrap align-items-center">
              <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
                <Button color="hover" className="sortable-drag-handle btn-hover-bg mb-0"><Icon imgSrc="drag" /></Button>
              </div>
              <div className="d-flex px-2">
                <p className="card-text">
                  <Badge color="light" pill className="me-2">html-head</Badge>
                  <a href="#">ad :: desktop :: gridler15</a>
                  <Badge color="primary" pill className="ms-2">lazy</Badge>
                </p>
              </div>
              <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
                <Button color="hover" className="me-0 mb-0 rounded-circle"><Icon imgSrc="pencil" /></Button>
                <Button color="hover" className="me-0 mb-0 rounded-circle"><Icon imgSrc="trash" /></Button>
              </div>
            </li>
            <li className="sortable-item d-flex flex-nowrap align-items-center">
              <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
                <Button color="hover" className="sortable-drag-handle btn-hover-bg mb-0"><Icon imgSrc="drag" /></Button>
              </div>
              <div className="d-flex px-2">
                <p className="card-text">
                  <Badge color="light" pill className="me-2">html-head</Badge>
                  <a href="#">code :: desktop :: main :: wibbitz</a>
                  <Badge color="danger" pill className="ms-2">server</Badge>
                </p>
              </div>
              <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
                <Button color="hover" className="me-0 mb-0 rounded-circle"><Icon imgSrc="pencil" /></Button>
                <Button color="hover" className="me-0 mb-0 rounded-circle"><Icon imgSrc="trash" /></Button>
              </div>
            </li>
            <li className="sortable-item d-flex flex-nowrap align-items-center">
              <div className="d-inline-flex flex-shrink-0 align-self-stretch my-1 px-2 border-end">
                <Button color="hover" className="sortable-drag-handle btn-hover-bg mb-0"><Icon imgSrc="drag" /></Button>
              </div>
              <div className="d-flex px-2">
                <p className="card-text">
                  <Badge color="light" pill className="me-2">footer</Badge>
                  <a href="#">code :: desktop :: jumbotron-top</a>
                  <Badge color="secondary" pill className="ms-2">client</Badge>
                </p>
              </div>
              <div className="flex-grow-0 flex-shrink-0 ms-auto me-sm-2">
                <Button color="hover" className="me-0 mb-0 rounded-circle"><Icon imgSrc="pencil" /></Button>
                <Button color="hover" className="me-0 mb-0 rounded-circle"><Icon imgSrc="trash" /></Button>
              </div>
            </li>
          </ul>
          <Button color="light" className="btn-action"><Icon imgSrc="plus-outline" /> Add Slot</Button>
        </CardBody>
      </Card>


      {/* Spinner */}

      <Card id="spinner">
        <CardHeader>
          Spinner
        </CardHeader>
        <CardBody>
          <Label>Spinner</Label>
          <Spinner />
          <Label className="mt-5">Spinner size="lg"</Label>
          <Spinner size="lg" />
          <Label className="mt-5">Spinner size="sm"</Label>
          <Spinner size="sm" className="me-2" />
          <Spinner color="primary" size="sm" className="me-2" />
          <Spinner color="secondary" size="sm" className="me-2" />
          <Spinner color="warning" size="sm" className="me-2" />
          <Spinner color="danger" size="sm" className="me-2" />
          <Spinner color="dark" size="sm" className="me-2" />
          <Spinner color="light" size="sm" className="me-2" />
          <Label className="mt-5">Spinner color="white" size="sm"</Label>
          <Button size="sm"><Spinner color="white" size="sm" className="me-2" />Spinner in a Button</Button>
        </CardBody>
        <CardBody className="bg-light">
          <Loading>Loading Component</Loading>
        </CardBody>
      </Card>

      {/* Sweet Alert */}

      <Card id="sweet-alert">
        <CardHeader>
          Sweet Alert
        </CardHeader>
        <CardBody>
          <Button outline onClick={sweetAlert1}>
            Alert 1 - Basic
          </Button>
          <Button outline onClick={sweetAlert2}>
            Alert 2 - Error
          </Button>
          <Button outline onClick={sweetAlert3}>
            Alert 3 - Standard Buttons
          </Button>
          <Button outline onClick={sweetAlert4}>
            Alert 4 - EME Buttons
          </Button>
          <Button outline onClick={sweetAlert5}>
            Alert 5 - Form Field
          </Button>
          <Button outline onClick={sweetAlert6}>
            Alert 6 - Loading
          </Button>
          <Button outline onClick={sweetAlert7}>
            Alert 7 - Horizontal
          </Button>
          <Button outline onClick={showMultipleToasts}>
            Show multiple progress toasts
          </Button>
        </CardBody>
      </Card>

      {/* Switch */}

      <Card id="switch-field">
        <CardHeader>
          Switch Field
        </CardHeader>
        <CardBody>

          <div className="form-check form-switch">
            <input type="checkbox" className="form-check-input" id="customSwitch1" />
            <Label className="form-check-label" htmlFor="customSwitch1">Toggle this switch element</Label>
          </div>


          <Label htmlFor="first_name">Inline Label</Label>
          <SwitchField size="md" name="first_name" label="No Inner Labels size=md" labelOff="" labelOn="" />

          <SwitchField name="title" title="title" label="User Name" labelOff="hide" labelOn="show" />

        </CardBody>
      </Card>

      {/* Table */}

      <Card id="table">
        <CardHeader>Table: Status Colors</CardHeader>
        <CardBody>
          <Row className="mb-3">
            <Col>
              <span className="status-copy status-archived">Archived</span>
              <span className="status-copy status-deleted">Deleted</span>
              <span className="status-copy status-draft">Draft</span>
              <span className="status-copy status-expired">Expired</span>
              <span className="status-copy status-pending">Pending</span>
              <span className="status-copy status-published">Published</span>
              <span className="status-copy status-scheduled">Scheduled</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <small className="status-copy status-archived">Archived</small>
              <small className="status-copy status-deleted">Deleted</small>
              <small className="status-copy status-draft">Draft</small>
              <small className="status-copy status-expired">Expired</small>
              <small className="status-copy status-pending">Pending</small>
              <small className="status-copy status-published">Published</small>
              <small className="status-copy status-scheduled">Scheduled</small>
            </Col>
          </Row>
        </CardBody>
        <CardBody>
          <Table className="sticky-thead table-hover">
            <thead>
            <tr>
              <th>Status</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
            </thead>
            <tbody>
            <tr className="status-archived">
              <th scope="row">Archived</th>
              <td>Jason</td>
              <td>Gregg</td>
              <td>@archived</td>
            </tr>
            <tr className="status-deleted">
              <th scope="row">Deleted</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@deleted</td>
            </tr>
            <tr className="status-draft">
              <th scope="row">Draft</th>
              <td>Albert</td>
              <td>Wei</td>
              <td>@draft</td>
            </tr>
            <tr className="status-expired">
              <th scope="row">Expired</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@expired</td>
            </tr>
            <tr className="status-pending">
              <th scope="row">Pending</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@pending</td>
            </tr>
            <tr className="status-published">
              <th scope="row">Published</th>
              <td>Miriam</td>
              <td>HQ</td>
              <td>@published</td>
            </tr>
            <tr className="status-scheduled">
              <th scope="row">Scheduled</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@scheduled</td>
            </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <h2 className="h4 mt-5 pb-1">Scrollable tbody className="sticky-tbody"</h2>

      <Card>
        <Table size="sm" className="sticky-tbody">
          <thead>
          <tr>
            <th className="ps-4">#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <Table size="sm" className="sticky-top table-fixed">
          <thead>
          <tr>
            <th className="ps-4">#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
        </Table>
        <Table size="sm" borderless className="table-hover table-fixed">
          <tbody>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <Table className="table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Striped Table + Sticky</CardHeader>
        <Table striped className="sticky-thead table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Dark Table</CardHeader>
        <Table dark className="mb-0">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Striped Table</CardHeader>
        <Table striped className="mb-0">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Bordered Table</CardHeader>
        <Table bordered className="mb-0">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Borderless Table</CardHeader>
        <Table borderless className="table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Hoverable Rows Table</CardHeader>
        <Table className="table-hover">
          <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Small</CardHeader>
        <Table size="sm">
          <thead>
          <tr>
            <th className="table-col-sm ps-4">#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row" className="ps-4">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row" className="ps-4">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Responsive Table</CardHeader>
        <Table responsive>
          <thead>
          <tr>
            <th>#</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
            <th>Table heading</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
            <td>Table cell</td>
          </tr>
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader>Table Properties</CardHeader>
        <CardBody>
          <Table responsive className="table-hover">
            <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <th scope="row">bordered</th>
              <td>bool</td>
              <td/>
              <td>td have borders on all sides</td>
            </tr>
            <tr>
              <th scope="row">dark</th>
              <td>bool</td>
              <td/>
              <td/>
            </tr>
            <tr>
              <th scope="row">fixed</th>
              <td>className</td>
              <td>table-fixed</td>
              <td>equal width columns</td>
            </tr>
            <tr>
              <th scope="row">hover</th>
              <td>className</td>
              <td>table-hover</td>
              <td>background-color of cell darkens on hover</td>
            </tr>
            <tr>
              <th scope="row">responsive</th>
              <td>bool</td>
              <td/>
              <td/>
            </tr>
            <tr>
              <th scope="row">size</th>
              <td>string</td>
              <td/>
              <td/>
            </tr>
            <tr>
              <th scope="row">sticky head</th>
              <td>className</td>
              <td>sticky-thead</td>
              <td/>
            </tr>
            <tr>
              <th scope="row">sticky body</th>
              <td>className</td>
              <td>sticky-tbody</td>
              <td/>
            </tr>
            <tr>
              <th scope="row">striped</th>
              <td>bool</td>
              <td/>
              <td/>
            </tr>
            <tr>
              <th scope="row">tag</th>
              <td>oneOfType</td>
              <td/>
              <td>([PropTypes.func, PropTypes.string])</td>
            </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Tabs */}

      <Card id="tabs">
        <CardHeader>
          Tabs: Underline Style
        </CardHeader>
        <CardBody>
          <Nav className="nav-underline">
            <NavItem>
              <NavLink
                className={classnames('tabindex', { active: activeTab === '1' })}
                onClick={() => {
                  toggle('1');
                }}
              >
                Underline Style
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => {
                  toggle('2');
                }}
              >
                Tab 2
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className='disabled'
              >
                Disabled
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="1" className="pt-4">
              <Container fluid className="pt-2">
                <Row>
                  <Col sm="6">
                    <Card>
                      <CardTitle>CardTitle 1a</CardTitle>
                      <CardText>Add .nav-underline className to Nav component. This is also the default tabs style for
                        screens.</CardText>
                      <Button color="light" outline>Button 1a</Button>
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card>
                      <CardTitle>CardTitle 1b</CardTitle>
                      <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.</CardText>
                      <Button color="light" outline>Button 1b</Button>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </TabPane>
            <TabPane tabId="2" className="pt-4">
              <Container fluid className="pt-2">
                <Row>
                  <Col sm="6">
                    <Card>
                      <CardTitle>CardTitle 2a</CardTitle>
                      <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.</CardText>
                      <Button>Button 2a</Button>
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card>
                      <CardTitle>CardTitle 2b</CardTitle>
                      <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.</CardText>
                      <Button>Button 2b</Button>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <CardTitle tag="h3" className="mb-1">Greg Brown</CardTitle>
          <p className="text-dark">
            <span><strong>Age:</strong> 27</span><br />
            <span><strong>Height:</strong> 6'2"</span><br />
            <span><Icon imgSrc="location-solid" size="sm" /> San Diego, California US</span><br />
            <span><Icon imgSrc="mail" size="sm" />  <a
              href="mailto:gregory.john.adrian@gmail.com">gregory.john.adrian@gmail.com</a></span><br />
            <span><strong>ID:</strong> 7kmZFBcEC</span>
          </p>
          <Nav className="nav-underline nav-sm">
            <NavItem>
              <NavLink
                className={classnames('tabindex', { active: activeTabNext === '3' })}
                onClick={() => {
                  toggleNext('3');
                }}
              >
                Underline Style
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTabNext === '4' })}
                onClick={() => {
                  toggleNext('4');
                }}
              >
                Fields
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className='disabled'
              >
                Disabled
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTabNext}>
            <TabPane tabId="3" className="pt-4">
              <div className="mb-3">
                <div className="float-start me-3">
                  <Button color="zoom" className="rounded">
                    <img src="//placehold.co/160x160" alt="Generic placeholder image" />
                  </Button>
                </div>
                <div>
                  <h4>
                    Top aligned media - align-self-start
                  </h4>
                  <p>Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin
                    commodo.
                    Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi
                    vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
                  <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                    deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                    provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum
                    fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                    nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
                    omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis
                    debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non
                    recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus
                    maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
                </div>
              </div>

              <ListGroup horizontal className="list-group-collection">
                <ListGroupItem tag="a" href="#" action>#list-group</ListGroupItem>
                <ListGroupItem tag="a" href="#" action active>#Washington</ListGroupItem>
                <ListGroupItem tag="a" href="#" action>#HasPhoto</ListGroupItem>
                <ListGroupItem tag="a" href="#" action>#Submission</ListGroupItem>
              </ListGroup>

            </TabPane>
            <TabPane tabId="4" className="pt-4">
              <Table bordered size="sm" className="mb-0">
                <thead>
                <tr className="bg-light py-2">
                  <th colSpan="2">Fields</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th scope="row">First Name</th>
                  <td>Larry</td>
                </tr>
                <tr>
                  <th scope="row">Last Name</th>
                  <td>David</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td><Icon imgSrc="mail" className="me-1" /><a
                    href="mailto:larry-david@gmail.gov">larry-david@gmail.gov</a></td>
                </tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>54321 Olive Ave. Suite 100, Burbank, IL 46279</td>
                </tr>
                <tr>
                  <th scope="row">User Agent</th>
                  <td>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
                    Chrome/85.0.4183.83 Safari/537.36
                  </td>
                </tr>
                </tbody>
              </Table>
            </TabPane>
          </TabContent>
        </CardBody>
        <CardFooter className="bg-light">
          <strong>Received:</strong> Tuesday September 01, 2020 @ 11:40am PDT
        </CardFooter>
      </Card>

      <Card className="card--list">
        <Button color="hover" className="radius-circle m-0 p-2"><Icon imgSrc="drag" size="sm" /></Button>
        <div className="py-2 media-left" style={{ width: "100px" }}>
          <Button color="zoom" className="rounded mb-0 w-100">
            <div className="aspect-ratio aspect-ratio-1by1">
              <img src="//placehold.co/100x100" alt="Generic placeholder image" />
            </div>
          </Button>
        </div>
        <CardBody>
          <CardTitle tag="h3" className="mb-1">Greg Brown</CardTitle>
          <p className="mb-2"><strong>Received:</strong> Tuesday September 01, 2020 @ 11:40am PDT</p>
          <ListGroup horizontal className="list-group-collection">
            <ListGroupItem tag="a" href="#" action>#list-group</ListGroupItem>
            <ListGroupItem tag="a" href="#" action active>#Washington</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#HasPhoto</ListGroupItem>
            <ListGroupItem tag="a" href="#" action>#Submission</ListGroupItem>
          </ListGroup>
        </CardBody>
        <ButtonGroup className="btn-group--icons">
          <Button color="hover"><Icon imgSrc="eye" /></Button>
          <Button color="hover"><Icon imgSrc="pencil" /></Button>
          <UncontrolledDropdown>
            <DropdownToggle color="hover" style={{ maxHeight: "40px" }}>
              <Icon imgSrc="more-vertical" />
            </DropdownToggle>
            <DropdownMenu end className="dropdown-menu-arrow-right">
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>
      </Card>

      <Card>
        <CardHeader>Tabs: Default Style</CardHeader>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className='tabindex active'
              >
                Default Style
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                Tab 2
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className='disabled'
              >
                Disabled
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent>
            <TabPane tabId="3" className="pt-4 active">
              <Container fluid className="pt-2">
                <Row>
                  <Col sm="6">
                    <Card>
                      <CardTitle>CardTitle 3a</CardTitle>
                      <CardText>This tab group is nonfunctioning, just to show the default tab style.</CardText>
                      <Button color="light" outline>Button 3a</Button>
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card>
                      <CardTitle>CardTitle 3b</CardTitle>
                      <CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua.</CardText>
                      <Button color="light" outline>Button 3b</Button>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>


      {/* Toasts */}

      <Card id="toasts">
        <CardHeader>
          Toasts
        </CardHeader>
        <CardBody>
          <Toast>
            <ToastHeader tagClassName="me-0 pe-2 d-flex flex-row w-100 align-items-center" tag="div" >
              <img className="rounded me-2" src="//placehold.co/50x50"
                   alt="Generic placeholder image" />
              <strong className="me-auto">Bootstrap</strong>
              <small className="text-light">11 mins ago</small>
            </ToastHeader>
            <ToastBody>
              Hello, world! This is a toast message.
            </ToastBody>
          </Toast>
          <Toast>
            <ToastHeader icon={<Spinner size="sm">Loading...</Spinner>} toggle={function noRefCheck(){}}>
              Reactstrap
            </ToastHeader>
            <ToastBody>
              This is a toast on a white background — check it out!
            </ToastBody>
          </Toast>
          <Toast>
            <ToastHeader icon="success" toggle={function noRefCheck(){}}>
              File Saved!
            </ToastHeader>
          </Toast>
          <Toast className="toast--info">
            <ToastHeader toggle={function noRefCheck(){}}>
              Info Theme
            </ToastHeader>
            <ToastBody>
              This is a toast on a white background — check it out!
            </ToastBody>
          </Toast>
          <Toast className="toast--success">
            <ToastHeader toggle={function noRefCheck(){}}>
              Success Theme
            </ToastHeader>
          </Toast>
          <Toast className="toast--warning">
            <ToastHeader toggle={function noRefCheck(){}}>
              Warning Theme
            </ToastHeader>
          </Toast>
          <Toast className="toast--danger">
            <ToastHeader toggle={function noRefCheck(){}}>
              Danger Theme
            </ToastHeader>
          </Toast>
        </CardBody>
      </Card>

      {/* Tooltips */}

      <Card id="tooltips">
        <CardHeader>
          Tooltips
        </CardHeader>
        <CardBody>
          <p>Somewhere in here is a <a href="#" id="UncontrolledTooltipExample">tooltip</a>.</p>
          <UncontrolledTooltip placement="top" target="UncontrolledTooltipExample">
            Hello world!
          </UncontrolledTooltip>
        </CardBody>
        <CardBody>
          <Button id="ScheduleUpdateTooltip">Click me</Button>
          <UncontrolledTooltip placement="right" target="ScheduleUpdateTooltip">
            placement="right"
          </UncontrolledTooltip>
        </CardBody>
      </Card>

    </Screen>
  );
}

/*function createScreen() {
  const ScreenWithForm = withForm(DemoScreen, {
    name: 'demo',
    keepDirtyOnReinitialize: false,
    restorable: false,
  });


  return function ScreenWithPbj(props) {
    const pbj = {};
    return <ScreenWithForm pbj={pbj} {...props} />;
  };
}*/

export default withPbj(withForm(DemoScreen),'*:ovp:node:video:v1');
