import { TicketDetails } from "../App";

const prefixes = ["the", "that", "this", "my", "his", "her", "its", "their", "our", "your", "undefined"];

const adjectives = [
    "happy", "sad", "big", "small", "good", "bad", "new", "old", "red", "blue",
    "green", "yellow", "fast", "slow", "tall", "short", "long", "short", "hot", "cold",
    "funny", "serious", "nice", "mean", "friendly", "shy", "quiet", "loud", "strong", "weak",
    "smart", "stupid", "beautiful", "ugly", "happy", "sad", "angry", "calm", "excited", "bored",
    "hungry", "thirsty", "tired", "awake", "busy", "free", "open", "closed", "full", "empty",
    "clean", "dirty", "wet", "dry", "soft", "hard", "light", "heavy", "young", "old",
    "different", "same", "easy", "difficult", "possible", "impossible", "real", "fake",
    "true", "false", "certain", "uncertain", "perfect", "imperfect", "important", "unimportant",
    "successful", "unsuccessful", "happy", "sad", "angry", "calm", "excited", "bored",
    "undefined", "null"
];

const nouns = [
    "man", "woman", "child", "dog", "cat", "house", "car", "book", "phone", "computer",
    "table", "chair", "bed", "door", "window", "kitchen", "bathroom", "living room", "bedroom",
    "school", "work", "city", "country", "nature", "park", "river", "mountain", "forest", "beach",
    "food", "water", "air", "time", "money", "love", "life", "death", "hope", "fear",
    "dream", "reality", "friend", "enemy", "family", "team", "group", "party", "music", "movie",
    "game", "sport", "book", "magazine", "newspaper", "letter", "email", "message", "call", "text",
    "picture", "video", "song", "dance", "art", "music", "theater", "museum", "library", "store",
    "restaurant", "hotel", "hospital", "school", "university", "college", "job", "career", "business",
    "problem", "solution", "idea", "plan", "project", "success", "failure", "chance", "risk", "reward",
    "null"
];

const names = ["An", "Ái", "Anh", "Bảo", "Bình", "Bửu", "Cát", "Châu", "Cường", "Cương",
    "Cử", "Cừ", "Đại", "Diện", "Dũ", "Dương", "Duy", "Giang", "Hà", "Hải",
    "Hậu", "Hạnh", "Hồng", "Hoà", "Hoài", "Hiếu", "Hoàng", "Khánh", "Lâm", "Linh",
    "Mai", "Minh", "Nhân", "Nhật", "Phong", "Phương", "Quang", "Thoại", "Thảo", "Thu",
    "Thành", "Trung", "Ngọc", "Thiện", "Tường", "Quý", "Xuân", "Thạnh", "Kim", "Trường",
    "Khai", "Văn", "Hiến", "Nghĩa", "Tâm", "Một", "Hai", "Ba", "Bốn", "Năm",
    "Sáu", "Bảy", "Tám", "Chín", "Mười", "Ánh", "Bích", "Cúc", "My", "Dung",
    "Đào", "Trang", "Long", "Vũ", "Vỹ", "Trúc", "Tú", "Tâm", "Tuyết", "Thi",
    "Thúy", "Thủy", "Thơ", "Sơn", "Phú", "Phúc", "Ngân", "Ý", "Định", "Đông",
    "Đức", "Hưng", "Hùng", "Huy", "Huyền", "Hương", "Lan", "Lý", "Lợi", "Lộc"
];

export const generateTicketDetails = (qrCode: string): TicketDetails => {

    // Generate the seed using the DJB2 hash function as before
    const generateSeed = (input: string): number => {
        let hash = 5381;
        for (let i = 0; i < input.length; i++) {
            hash = (hash * 33) ^ input.charCodeAt(i); // XOR and multiply by 33
        }
        return hash >>> 0; // Convert to unsigned 32-bit integer
    };

    const seed = generateSeed(qrCode);

    // Function to select from array based on a more complex non-linear seed
    const selectFromArray = (array: string[], seed: number) => {
        const index = Math.abs(Math.sin(seed) * 10000) % array.length; // Ensure index is always within bounds
        return array[Math.floor(index)];
    };

    // Generate leadVisitor with more complex seed manipulation
    const primeOffset = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 57, 59];
    const leadVisitorSeed = (seed * primeOffset[seed % 18]) ^ (seed + primeOffset[(seed + 1) % 18]); // XOR operation for more randomness
    const leadVisitor = `${selectFromArray(names, leadVisitorSeed)} ${selectFromArray(names, leadVisitorSeed + primeOffset[2])} ${selectFromArray(names, leadVisitorSeed + primeOffset[3])}`;

    // Generate event with complex prime-based seed manipulation
    const eventSeed = (seed * primeOffset[(seed + 5) % 18]) ^ primeOffset[(seed + 2) % 18]; // Different seed for event
    const event = `${selectFromArray(prefixes, eventSeed)} ${selectFromArray(adjectives, eventSeed + primeOffset[3])} ${selectFromArray(nouns, eventSeed + primeOffset[4])}`;

    // Generate seat with modular arithmetic and bit shifts
    const seatNumber = (seed * seed) % 999 + 1;
    const seat = `${String.fromCharCode(65 + (seed % 26))}${seatNumber}${String.fromCharCode(65 + ((seed + seatNumber) % 26))}`;

    return {
        leadVisitor,
        event,
        seat,
    };
};

/**
 * Fetches ticket details from the fake API.
 * @param qrCode - The QR code of the ticket.
 * @returns A Promise that resolves to the ticket details.
 */
export const fetchTicketDetails = async (qrCode: string) => {
    // Add some delay to be realistic
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const randomDelay = Math.floor(Math.random() * 480);

    if (qrCode.includes("404")) {
        throw new Error("Ticket not found");
    }

    const storedQrCodes = JSON.parse(localStorage.getItem('scannedQrCodes') || '[]');

    let ticketDetailsWithStatus: TicketDetails;
    const sampleTicketDetails = generateTicketDetails(qrCode);

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
