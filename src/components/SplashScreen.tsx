import { useEffect } from "react";
import { Container } from "react-bootstrap";

const SplashScreen: React.FC = () => {
    // Function to adjust the main element's height
    const adjustMainHeight = () => {
        const childContainer = document.querySelector("main");
        const parentContainer = document.querySelector(".container"); // Select the parent container

        if (childContainer && parentContainer) {
            // Get computed styles of the parent container
            const containerStyle = window.getComputedStyle(parentContainer);

            // Extract margins and paddings, remove 'px', and convert to numbers
            const containerPaddings = parseInt(containerStyle.paddingTop, 10) + parseInt(containerStyle.paddingBottom, 10);

            // Include the bottom margin and container paddings in the calculation
            childContainer.style.minHeight = `calc(99dvh - ${containerPaddings}px)`;
        }
    };

    // useEffect hook to run the adjustMainHeight function on component mount and window resize
    useEffect(() => {
        adjustMainHeight();
        window.addEventListener("resize", adjustMainHeight);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener("resize", adjustMainHeight);
    }, []);

    return (
        <main className='d-flex flex-column justify-content-center align-items-center splash-main m-0'>
            <div className='text-start'>
                <h2 className='mb-0 display-3 fw-semibold'>
                    Inspector
                </h2>
                <figcaption className="text-muted mt-0 fw-light">by <a className='fw-semibold text-decoration-none text-muted' href='https://www.vieticket.io.vn/' target='_blank'>VieTicket</a></figcaption>
            </div>
        </main>

    );
}

export default SplashScreen;