import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
    return (
        <div className='footer-container'>
            <ul className='footer-link-wrapper'>
                <li className='footer-link-item'>
                    <Link to='/'>About</Link>
                </li>
                <li className='footer-link-item'>
                    <Link to='/'>Contact us</Link>
                </li>
                <li className='footer-link-item'>
                    <Link to='/'>Project documentation</Link>
                </li>
                <li className='footer-link-item'>
                    <Link to='/'>Github</Link>
                </li>
                <li className='footer-link-item'>
                    <Link to='/'>Course materials</Link>
                </li>
            </ul>
        </div>
    )
}

export default Footer
