// src/utils/location-helper.ts

/**
 * Extract city/location from delivery address
 * This function tries to intelligently extract the city name from an address string
 * 
 * Examples:
 * "123 Street, Chennai, Tamil Nadu" -> "Chennai"
 * "4/6 lane, madurai 625001, Tamil Nadu" -> "Madurai"
 * "Mumbai, Maharashtra 400001" -> "Mumbai"
 */
export function extractLocationFromAddress(address: string): string {
    if (!address) return '';

    // Convert to lowercase for easier matching
    const lowerAddress = address.toLowerCase().trim();

    // Common Indian cities to check for
    const indianCities = [
        'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'ahmedabad',
        'chennai', 'kolkata', 'surat', 'pune', 'jaipur', 'lucknow',
        'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam',
        'pimpri', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra',
        'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai',
        'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar',
        'navi mumbai', 'allahabad', 'prayagraj', 'ranchi', 'howrah',
        'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur',
        'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati'
    ];

    // Check if any known city is in the address
    for (const city of indianCities) {
        if (lowerAddress.includes(city)) {
            // Capitalize first letter
            return city.charAt(0).toUpperCase() + city.slice(1);
        }
    }

    // Try to extract from comma-separated format
    // "Street, City, State Pin" -> get second part
    const parts = address.split(',').map(p => p.trim());
    if (parts.length >= 2) {
        // Get the second-to-last part (usually city)
        const potentialCity = parts[parts.length - 2];

        // Remove pin code if present
        const cityWithoutPin = potentialCity.replace(/\d{6}/, '').trim();

        if (cityWithoutPin.length > 2) {
            return capitalizeWords(cityWithoutPin);
        }
    }

    // If all else fails, return the first meaningful word after splitting by comma
    if (parts.length > 1) {
        return capitalizeWords(parts[1]);
    }

    return 'Unknown';
}

/**
 * Capitalize first letter of each word
 */
function capitalizeWords(str: string): string {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Normalize location for consistent comparison
 * Converts variations like "Bengaluru"/"Bangalore" to a standard form
 */
export function normalizeLocation(location: string): string {
    const normalized = location.toLowerCase().trim();

    // Handle common variations
    const variations: { [key: string]: string } = {
        'bengaluru': 'bangalore',
        'bombay': 'mumbai',
        'calcutta': 'kolkata',
        'madras': 'chennai',
        'prayagraj': 'allahabad',
    };

    return variations[normalized] || normalized;
}

/**
 * Check if two locations match (case-insensitive, handles variations)
 */
export function locationsMatch(location1: string, location2: string): boolean {
    const normalized1 = normalizeLocation(location1);
    const normalized2 = normalizeLocation(location2);

    return normalized1 === normalized2;
}