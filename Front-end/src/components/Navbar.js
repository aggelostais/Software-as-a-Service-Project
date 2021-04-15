import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'

import { Button } from './Button';

function Navbar() {
    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to='/' className='navbar-logo'>
                        <img 
                            src='logo192.png' 
                            className='navbar-logo-img'
                            alt='logo'
                        />
                        Title 
                    </Link>

                    <ul className='nav-menu'>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links'>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/page2' className='nav-links'>
                                Page 2
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/page3' className='nav-links'>
                                Page 3
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/sign-up' className='nav-links-mobile'>
                                Sign Up
                            </Link>
                        </li>
                    </ul>
                    <div className='nav-btn'>
                        <Button buttonStyle='btn--primary' path='/sign-in'>
                            SIGN IN
                        </Button>
                    </div>
                    <div className='nav-btn'>
                        <Button buttonStyle='btn--outline' path='/sign-up'>
                            SIGN UP
                        </Button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
