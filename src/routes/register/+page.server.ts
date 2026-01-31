import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/db';
import { hashPassword } from '$lib/server/auth';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const name = data.get('name') as string;
        const address = data.get('address') as string;
        const contact_info = data.get('contact_info') as string;

        if (!email || !password || !name) {
            return fail(400, { missing: true });
        }

        const existing = await db('users').where({ email }).first();
        if (existing) {
            return fail(400, { emailExists: true });
        }

        const password_hash = await hashPassword(password);

        // MVP: Latitude/Longitude defaults. Ideally use geocoding here.
        const [id] = await db('users').insert({
            email,
            password_hash,
            name,
            address,
            contact_info,
            latitude: 0,
            longitude: 0
        });

        cookies.set('session', id.toString(), { path: '/' });

        throw redirect(303, '/dashboard');
    }
};
