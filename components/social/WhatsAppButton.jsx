// components/WhatsAppButton.js

import React from 'react';

const WhatsAppButton = () => {
    return (
        <a
            href="https://api.whatsapp.com/send/?phone=971509660888&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success position-fixed shadow-lg d-flex justify-content-center align-items-center"
            style={{
                zIndex: 1000,
                bottom: '27px',
                right: '100px', // Move the button 100px from the right
                borderRadius: '30px', // Makes the button oval shaped
                height: '50px',
                width: '50px'
            }}
        >
            <i className="fab fa-whatsapp fa-lg"></i>
        </a>
    );
};

export default WhatsAppButton;
