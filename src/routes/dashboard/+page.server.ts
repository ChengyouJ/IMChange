import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';

export const load = async ({ locals, depends }) => {
    depends('app:dashboard');

    if (!locals.user) throw redirect(302, '/login');

    const items = await db('items').where({ user_id: locals.user.id });

    // Requests for MY items (incoming) - only show pending (accepted requests are on deliveries page)
    const incomingRequests = await db('requests')
        .join('items', 'requests.item_id', 'items.id')
        .join('users', 'requests.requester_id', 'users.id')
        .where('items.user_id', locals.user.id)
        .where('requests.status', 'pending')
        .select('requests.id', 'requests.status', 'items.name as item_name', 'users.name as requester_name', 'users.email as requester_email');

    // Requests I MADE (outgoing) - only show pending/rejected (accepted requests are on deliveries page)
    const outgoingRequests = await db('requests')
        .join('items', 'requests.item_id', 'items.id')
        .join('users', 'items.user_id', 'users.id')
        .where('requests.requester_id', locals.user.id)
        .whereIn('requests.status', ['pending', 'rejected'])
        .select('requests.id', 'requests.status', 'items.name as item_name', 'users.name as donor_name');

    return { items, incomingRequests, outgoingRequests };
};

export const actions = {
    addItem: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const name = data.get('name') as string;
        const quantity = data.get('quantity');
        const unit = data.get('unit') as string;

        await db('items').insert({
            user_id: locals.user.id,
            name,
            quantity,
            unit,
            status: 'available'
        });
    },
    deleteItem: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const id = data.get('id');
        await db('items').where({ id, user_id: locals.user.id }).delete();
    },
    updateRequestStatus: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const requestId = data.get('request_id');
        const newStatus = data.get('status') as string;

        // Verify this request belongs to an item owned by the user
        const req = await db('requests')
            .join('items', 'requests.item_id', 'items.id')
            .where('requests.id', requestId)
            .andWhere('items.user_id', locals.user.id)
            .first();

        if (req) {
            await db('requests').where({ id: requestId }).update({
                status: newStatus,
                delivery_status: newStatus // Also update delivery_status
            });

            // If accepted, mark item as reserved
            if (newStatus === 'accepted') {
                await db('items').where({ id: req.item_id }).update({ status: 'reserved' });
            }
        }
    }
};
