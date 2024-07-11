import React from "react";

interface BrandingProps {
    className?: string;
}

const Branding: React.FC<BrandingProps> = ({className}) => {
    return (
        <div className={'text-start ' + className}>
            <h4 className='mb-0'>
                Inspector
            </h4>
            <figcaption className="text-muted small mt-0 fw-light">by <a
                className='fw-semibold text-decoration-none text-muted' href='https://www.vieticket.io.vn/'
                target='_blank' rel="noreferrer">VieTicket</a></figcaption>
        </div>
    )
};

export default Branding;