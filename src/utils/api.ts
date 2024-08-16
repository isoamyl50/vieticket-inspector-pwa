import { TicketDetails } from "../App";

const sampleTicketDetails: TicketDetails = {
    leadVisitor: "John Doe",
    event: "Never Gonna Give You Up",
    seat: "R17A"
}
/**
 * Fetches ticket details from the fake API.
 * @param qrCode - The QR code of the ticket.
 * @returns A Promise that resolves to the ticket details.
 */
export const fetchTicketDetails = async (qrCode: string) => {
    // Add some delay to be realistic
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const randomDelay = Math.floor(Math.random() * 480);

    const storedQrCodes = JSON.parse(localStorage.getItem('scannedQrCodes') || '[]');

    let ticketDetailsWithStatus: TicketDetails;

    if (storedQrCodes.includes(qrCode)) {
        ticketDetailsWithStatus = {
            ...sampleTicketDetails,
            status: "CHECKED_IN",
            message: "Ticket already checked-in."
        };
    } else {
        storedQrCodes.push(qrCode);
        localStorage.setItem('scannedQrCodes', JSON.stringify(storedQrCodes));
        ticketDetailsWithStatus = {
            ...sampleTicketDetails,
            status: "PURCHASED",
            message: "Check-in successful"
        };
    }

    await delay(randomDelay);

    return ticketDetailsWithStatus;
};
