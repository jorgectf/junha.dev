import React, { Component } from 'react';
import {
  Dropdown
  , Nav
  , Navbar
  , Button
} from 'react-bootstrap';
import {
  MdHome
} from 'react-icons/md';

interface Props {
  changeComponent: (newComponent: string) => void;
  currentVersion: string;
}

export default class Footer extends Component<Props, {}> {
  render () {
    return (
      <div>
        <Navbar
          className='footer-custom transparent-dark'
          fixed='bottom'
          bg='dark'
          variant='dark'
        >
          <Nav className='justify-content-left'>
            <Nav.Item>
              <Button
                variant='dark'
                className='footer-button transparent-dark'
                onClick={() => this.props.changeComponent('LandingPage')}
              >
                <MdHome className='footer-mdicon' />
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Dropdown
                drop='up'
              >
                <Dropdown.Toggle
                  id='navbar-main'
                  variant='dark'
                  title='Main'
                  className='footer-button transparent-dark'
                >
                  Portfolio
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className='footer-dropdown'
                >
                  <Dropdown.Item
                    className='footer-item'
                    onClick={() => this.props.changeComponent('AboutMe')}
                  >
                    About Me
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='footer-item'
                    onClick={() => this.props.changeComponent('Contact')}
                  >
                    Contact
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='footer-item'
                    href='https://github.com/park-junha'
                    target='_blank'
                  >
                    GitHub
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='footer-item'
                    href='https://www.linkedin.com/in/park-junha/'
                    target='_blank'
                  >
                    LinkedIn
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className='footer-item'
                    onClick={() => this.props.changeComponent('Resume')}
                  >
                    Resume
                  </Dropdown.Item>
                  <Dropdown.Item
                    className='footer-item'
                    onClick={() => this.props.changeComponent('Projects')}
                  >
                    Projects
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav.Item>
          </Nav>
          <Navbar.Collapse className='justify-content-end'>
            <Navbar.Text
              className='footer-version'
              onClick={() => this.props.changeComponent('VersionLog')}
            >
              {this.props.currentVersion}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  };
}
