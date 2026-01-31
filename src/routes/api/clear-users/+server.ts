import { json } from '@sveltejs/kit';
import db from '$lib/server/db';
import type { RequestHandler } from './$types';

/**
 * DELETE /api/clear-users
 * Clears all users from the database
 */
export const DELETE: RequestHandler = async () => {
    try {
        const count = await db('users').del();
        return json({
            success: true,
            message: `Deleted ${count} users`,
            count
        });
    } catch (error) {
        console.error('Error clearing users:', error);
        return json(
            { success: false, error: 'Failed to clear users' },
            { status: 500 }
        );
    }
};
