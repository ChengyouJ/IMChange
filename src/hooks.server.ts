import { type Handle } from '@sveltejs/kit';
import db from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    const session = event.cookies.get('session');

    if (session) {
        // Warning: For MVP, using plain user ID in cookie. In production, use signed cookies or session tokens.
        const user = await db('users').where({ id: session }).first();
        if (user) {
            // Strip sensitive info if needed, though here we just put the row in locals
            const { password_hash, ...safeUser } = user;
            event.locals.user = safeUser;
        }
    }

    return await resolve(event);
};
