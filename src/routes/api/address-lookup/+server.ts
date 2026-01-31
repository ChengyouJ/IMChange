import { json } from '@sveltejs/kit';
import { searchUKAddress } from '$lib/server/geocoding';
import type { RequestHandler } from './$types';

/**
 * GET /api/address-lookup?postcode=XXX
 * Returns validated UK addresses for a given postcode
 */
export const GET: RequestHandler = async ({ url }) => {
    const postcode = url.searchParams.get('postcode');

    if (!postcode || postcode.trim().length === 0) {
        return json(
            { error: 'Postcode parameter is required' },
            { status: 400 }
        );
    }

    try {
        const addresses = await searchUKAddress(postcode);

        // Return empty array with success status if no addresses found
        // This lets the frontend handle the "no results" case
        return json({ addresses });
    } catch (error) {
        console.error('Address lookup error:', error);

        // Return specific error messages
        if (error instanceof Error) {
            if (error.message === 'Invalid UK postcode format') {
                return json(
                    { error: 'Invalid UK postcode format. Please use format like W2 1UF or SW1A 1AA' },
                    { status: 400 }
                );
            }
            return json(
                { error: error.message },
                { status: 500 }
            );
        }

        return json(
            { error: 'Failed to lookup address. Please try again.' },
            { status: 500 }
        );
    }
};
