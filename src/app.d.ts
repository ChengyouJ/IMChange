// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user?: {
                id: number;
                email: string;
                name: string;
                address?: string;
                latitude?: number;
                longitude?: number;
            }
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export { };
