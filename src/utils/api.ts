import {TicketDetails} from "../App";

const prefixes = ["the", "that", "this", "my", "his", "her", "its", "their", "our", "your"];

const adjectives = [
    "happy", "sad", "big", "small", "good", "bad", "new", "old", "red", "blue",
    "green", "yellow", "fast", "slow", "tall", "short", "long", "short", "hot", "cold",
    "funny", "serious", "nice", "mean", "friendly", "shy", "quiet", "loud", "strong", "weak",
    "smart", "stupid", "beautiful", "ugly", "happy", "sad", "angry", "calm", "excited", "bored",
    "hungry", "thirsty", "tired", "awake", "busy", "free", "open", "closed", "full", "empty",
    "clean", "dirty", "wet", "dry", "soft", "hard", "light", "heavy", "young", "old",
    "different", "same", "easy", "difficult", "possible", "impossible", "real", "fake",
    "true", "false", "certain", "uncertain", "perfect", "imperfect", "important", "unimportant",
    "successful", "unsuccessful", "happy", "sad", "angry", "calm", "excited", "bored"
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
    "problem", "solution", "idea", "plan", "project", "success", "failure", "chance", "risk", "reward"
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
    const seed = qrCode
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Function to select from array based on seed, with non-linearity
    const selectFromArray = (array: string[], seed: number) => {
        const index = (Math.pow(seed, 2) % array.length + array.length) % array.length; // Non-linear index calculation
        return array[index];
    };

    // Generate leadVisitor with more complex seed usage
    const primeOffset = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 57, 59][seed % 6];
    const leadVisitor = `${selectFromArray(names, seed + primeOffset)} ${selectFromArray(names, seed * 3 + 1 + primeOffset)} ${selectFromArray(names, seed * 5 - 1 + primeOffset)}`;

    // Generate event with prime number based seed offset
    const event = `${selectFromArray(prefixes, seed * 2 + primeOffset)} ${selectFromArray(adjectives, seed + primeOffset)} ${selectFromArray(nouns, seed * 2 - primeOffset)}`;

    // Generate seat with more complex seed manipulation
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
