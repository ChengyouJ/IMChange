import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';

export const load = async ({ locals, depends }) => {
    depends('app:deliveries');

    if (!locals.user) throw redirect(302, '/login');

    // Deliveries where I'm the SENDER (I own the item)
    const senderDeliveries = await db('requests')
        .join('items', 'requests.item_id', 'items.id')
        .join('users as requester', 'requests.requester_id', 'requester.id')
        .where('items.user_id', locals.user.id)
        .whereIn('requests.delivery_status', ['accepted', 'sent', 'completed'])
        .select(
            'requests.id',
            'requests.delivery_status',
            'requests.sent_at',
            'requests.received_at',
            'requests.updated_at',
            'items.name as item_name',
            'items.quantity',
            'items.unit',
            'requester.name as receiver_name',
            'requester.email as receiver_email',
            'requester.phone as receiver_phone',
            'requester.address as receiver_address'
        )
        .orderByRaw(`
            CASE
                WHEN requests.delivery_status IN ('accepted', 'sent') THEN 0
                ELSE 1
            END,
            requests.updated_at DESC
        `);

    // Deliveries where I'm the RECEIVER (I requested the item)
    const receiverDeliveries = await db('requests')
        .join('items', 'requests.item_id', 'items.id')
        .join('users as donor', 'items.user_id', 'donor.id')
        .where('requests.requester_id', locals.user.id)
        .whereIn('requests.delivery_status', ['accepted', 'sent', 'completed'])
        .select(
            'requests.id',
            'requests.delivery_status',
            'requests.sent_at',
            'requests.received_at',
            'requests.updated_at',
            'items.name as item_name',
            'items.quantity',
            'items.unit',
            'donor.name as sender_name',
            'donor.email as sender_email',
            'donor.phone as sender_phone',
            'donor.address as sender_address'
        )
        .orderByRaw(`
            CASE
                WHEN requests.delivery_status IN ('accepted', 'sent') THEN 0
                ELSE 1
            END,
            requests.updated_at DESC
        `);

    return { senderDeliveries, receiverDeliveries };
};

export const actions = {
    markAsSent: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const requestId = data.get('request_id');

        // Verify user owns the item for this request
        const req = await db('requests')
            .join('items', 'requests.item_id', 'items.id')
            .where('requests.id', requestId)
            .andWhere('items.user_id', locals.user.id)
            .andWhere('requests.delivery_status', 'accepted')
            .first();

        if (!req) {
            return fail(403, { message: 'Unauthorized or invalid request' });
        }

        await db('requests')
            .where({ id: requestId })
            .update({
                delivery_status: 'sent',
                sent_at: db.fn.now()
            });

        return { success: true };
    },

    markAsReceived: async ({ request, locals }) => {
        if (!locals.user) return fail(401);
        const data = await request.formData();
        const requestId = data.get('request_id');

        // Verify user is the requester and delivery was sent
        const req = await db('requests')
            .where('requests.id', requestId)
            .andWhere('requests.requester_id', locals.user.id)
            .andWhere('requests.delivery_status', 'sent')
            .first();

        if (!req) {
            return fail(403, { message: 'Unauthorized or invalid request' });
        }

        // Mark as received and completed
        await db('requests')
            .where({ id: requestId })
            .update({
                delivery_status: 'completed',
                received_at: db.fn.now(),
                status: 'completed'
            });

        // Mark item as taken (remove from inventory)
        await db('items')
            .where({ id: req.item_id })
            .update({ status: 'taken' });

        return { success: true };
    }
};
