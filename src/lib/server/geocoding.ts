/**
 * Geocoding utility using OpenStreetMap Nominatim API
 * For UK address validation and coordinate lookup
 */

export interface AddressResult {
    display_name: string;
    address_line_1: string;
    lat: string;
    lon: string;
    postcode?: string;
}

/**
 * Validate UK postcode format
 * UK postcode regex from gov.uk specification
 */
export function isValidUKPostcode(postcode: string): boolean {
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim().replace(/\s+/g, ' '));
}

/**
 * Search for UK addresses by postcode using Nominatim API
 * Uses a two-step approach: get postcode coords, then find nearby roads
 * @param postcode - UK postcode to search for
 * @returns Array of matching addresses with coordinates
 */
export async function searchUKAddress(postcode: string): Promise<AddressResult[]> {
    try {
        // Clean and format postcode
        const cleanPostcode = postcode.trim().replace(/\s+/g, ' ').toUpperCase();

        // Validate postcode format
        if (!isValidUKPostcode(cleanPostcode)) {
            throw new Error('Invalid UK postcode format');
        }

        // Step 1: Get the postcode location
        const postcodeUrl = new URL('https://nominatim.openstreetmap.org/search');
        postcodeUrl.searchParams.append('q', cleanPostcode);
        postcodeUrl.searchParams.append('format', 'json');
        postcodeUrl.searchParams.append('countrycodes', 'gb');
        postcodeUrl.searchParams.append('addressdetails', '1');
        postcodeUrl.searchParams.append('limit', '1');

        const postcodeResponse = await fetch(postcodeUrl.toString(), {
            headers: {
                'User-Agent': 'IMChange-FoodBank-App/1.0'
            }
        });

        if (!postcodeResponse.ok) {
            throw new Error(`Nominatim API error: ${postcodeResponse.status}`);
        }

        const postcodeData = await postcodeResponse.json();

        if (postcodeData.length === 0) {
            return [];
        }

        const postcodeLoc = postcodeData[0];
        const lat = postcodeLoc.lat;
        const lon = postcodeLoc.lon;

        // Step 2: Search for nearby streets/roads using reverse geocoding
        const reverseUrl = new URL('https://nominatim.openstreetmap.org/reverse');
        reverseUrl.searchParams.append('lat', lat);
        reverseUrl.searchParams.append('lon', lon);
        reverseUrl.searchParams.append('format', 'json');
        reverseUrl.searchParams.append('addressdetails', '1');
        reverseUrl.searchParams.append('zoom', '18'); // Street level detail

        const reverseResponse = await fetch(reverseUrl.toString(), {
            headers: {
                'User-Agent': 'IMChange-FoodBank-App/1.0'
            }
        });

        if (!reverseResponse.ok) {
            throw new Error(`Nominatim reverse API error: ${reverseResponse.status}`);
        }

        const reverseData = await reverseResponse.json();
        const addresses: AddressResult[] = [];

        // Build address from reverse lookup
        if (reverseData && reverseData.address) {
            const addr = reverseData.address;
            const addressParts = [
                addr.house_number,
                addr.road || addr.pedestrian,
                addr.suburb || addr.neighbourhood
            ].filter(Boolean);

            if (addressParts.length > 0) {
                addresses.push({
                    display_name: reverseData.display_name,
                    address_line_1: addressParts.join(', '),
                    lat: reverseData.lat,
                    lon: reverseData.lon,
                    postcode: addr.postcode || cleanPostcode
                });
            }
        }

        // Step 3: Search for roads near the postcode
        const nearbyUrl = new URL('https://nominatim.openstreetmap.org/search');
        nearbyUrl.searchParams.append('q', `street near ${cleanPostcode} UK`);
        nearbyUrl.searchParams.append('format', 'json');
        nearbyUrl.searchParams.append('countrycodes', 'gb');
        nearbyUrl.searchParams.append('addressdetails', '1');
        nearbyUrl.searchParams.append('limit', '20');

        const nearbyResponse = await fetch(nearbyUrl.toString(), {
            headers: {
                'User-Agent': 'IMChange-FoodBank-App/1.0'
            }
        });

        if (nearbyResponse.ok) {
            const nearbyData = await nearbyResponse.json();

            for (const result of nearbyData) {
                const addr = result.address || {};
                if (addr.road || addr.pedestrian) {
                    const addressParts = [
                        addr.house_number,
                        addr.road || addr.pedestrian,
                        addr.suburb || addr.neighbourhood
                    ].filter(Boolean);

                    addresses.push({
                        display_name: result.display_name,
                        address_line_1: addressParts.join(', '),
                        lat: result.lat,
                        lon: result.lon,
                        postcode: addr.postcode || cleanPostcode
                    });
                }
            }
        }

        // Remove duplicates based on address_line_1
        const seen = new Set<string>();
        const uniqueAddresses = addresses.filter(addr => {
            const key = addr.address_line_1.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        return uniqueAddresses.slice(0, 10);

    } catch (error) {
        console.error('Geocoding error:', error);
        if (error instanceof Error && error.message === 'Invalid UK postcode format') {
            throw error;
        }
        throw new Error('Failed to search address. Please try again.');
    }
}

/**
 * Validate and geocode a full UK address string
 * @param address - Full address string to validate
 * @returns Address with coordinates or null if not found
 */
export async function validateAddress(address: string): Promise<AddressResult | null> {
    try {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.append('q', address);
        url.searchParams.append('format', 'json');
        url.searchParams.append('countrycodes', 'gb');
        url.searchParams.append('addressdetails', '1');
        url.searchParams.append('limit', '1');

        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'IMChange-FoodBank-App/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Nominatim API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const result = data[0];
        const address_details = result.address || {};
        const addressParts = [
            address_details.house_number,
            address_details.road,
            address_details.suburb || address_details.neighbourhood,
            address_details.city || address_details.town || address_details.village
        ].filter(Boolean);

        return {
            display_name: result.display_name,
            address_line_1: addressParts.join(', ') || result.display_name,
            lat: result.lat,
            lon: result.lon,
            postcode: address_details.postcode
        };
    } catch (error) {
        console.error('Address validation error:', error);
        return null;
    }
}
