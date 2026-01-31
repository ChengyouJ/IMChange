import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies }) => {
        cookies.delete('session', {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });
        throw redirect(303, '/');
    }
};
