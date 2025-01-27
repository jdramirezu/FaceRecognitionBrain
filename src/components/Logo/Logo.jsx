import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className='br2 shadow-2' style={{height: '150px', width:'150px'}} tiltMaxAngleX={50} tiltMaxAngleY={50}>
                <div className='pa3'>
                    <img style={{paddingTop: '5px'}} src={brain} alt="Logo" />
                    {/*<a target="_blank" href="https://icons8.com/icon/118805/brain">Brain</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;