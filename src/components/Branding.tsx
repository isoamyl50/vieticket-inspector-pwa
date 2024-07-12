import React from 'react';

interface BrandingProps {
    className?: string;
    big?: boolean;
}

const BigBranding: React.FC<BrandingProps> = ({className}) => {
    return (
        <div className={`text-start ${className}`}>
            <h2 className="mb-0 display-3 fw-semibold">Inspector</h2>
            <figcaption className="text-muted mt-0 fw-light">
                by <a className="fw-semibold text-decoration-none text-muted" href="https://www.vieticket.io.vn/"
                      target="_blank" rel="noopener noreferrer">VieTicket</a>
            </figcaption>
        </div>
    );
};

const Branding: React.FC<BrandingProps> = ({className, big: isBig}) => {
    if (isBig) {
        return <BigBranding className={className}/>;
    }

    return (
        <div className={`text-start ${className}`}>
            <h4 className='mb-0'>
                Inspector
            </h4>
            <figcaption className='text-muted small mt-0 fw-light'>by <a
                className='fw-semibold text-decoration-none text-muted' href='https://www.vieticket.io.vn/'
                target='_blank' rel='noreferrer'>VieTicket</a></figcaption>
        </div>
    );
};

export default Branding;