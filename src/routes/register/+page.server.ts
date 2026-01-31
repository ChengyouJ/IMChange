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
        const address_line_1 = data.get('address_line_1') as string;
        const latitude = data.get('latitude') as string;
        const longitude = data.get('longitude') as string;
        const contact_info = data.get('contact_info') as string;

        // Validate required fields including address validation
        if (!email || !password || !name || !address_line_1 || !latitude || !longitude) {
            return fail(400, { missing: true });
        }

        const existing = await db('users').where({ email }).first();
        if (existing) {
            return fail(400, { emailExists: true });
        }

        const password_hash = await hashPassword(password);

        // Insert user with validated address and coordinates
        const [id] = await db('users').insert({
            email,
            password_hash,
            name,
            address, // Full display address
            address_line_1, // Validated address line
            contact_info,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        });

        cookies.set('session', id.toString(), {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // Set to true in production with HTTPS
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        throw redirect(303, '/dashboard');
    }
};
