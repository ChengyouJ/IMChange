import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import { calculateDistance } from '$lib/server/distance';

export const load = async ({ locals, url }) => {
    if (!locals.user) throw redirect(302, '/login');

    const search = url.searchParams.get('q') || '';

    // Get current user's location
    const currentUser = await db('users')
        .where({ id: locals.user.id })
        .select('latitude', 'longitude')
        .first();

    let query = db('items')
        .join('users', 'items.user_id', 'users.id')
        .whereNot('items.user_id', locals.user.id)
        .andWhere('items.status', 'available')
        .select('items.*', 'users.name as foodbank_name', 'users.address', 'users.latitude', 'users.longitude');

    if (search) {
        query = query.where('items.name', 'like', `%${search}%`);
    }

    const items = await query;

    // Calculate distance for each item and add it to the item object
    const itemsWithDistance = items.map(item => {
        const distance = calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            item.latitude,
            item.longitude
        );

        return {
            ...item,
            distance // in kilometers
        };
    });

    // Sort by distance (closest first)
    itemsWithDistance.sort((a, b) => a.distance - b.distance);

    return { items: itemsWithDistance };
};

export const actions = {
    requestItem: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const item_id = data.get('item_id');

        // Prevent duplicate requests?
        const existing = await db('requests')
            .where({ requester_id: locals.user.id, item_id })
            .first();

        if (existing) {
            return fail(400, { duplicate: true });
        }

        await db('requests').insert({
            requester_id: locals.user.id,
            item_id,
            status: 'pending'
        });

        return { success: true };
    }
};
