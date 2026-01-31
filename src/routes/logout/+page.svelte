<script>
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let formElement;

    onMount(() => {
        // Auto-submit the form when the page loads
        if (formElement) {
            formElement.submit();
        }
    });
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Logging out...</h1>
        <form method="POST" use:enhance bind:this={formElement}>
            <noscript>
                <button type="submit">Click here if not redirected</button>
            </noscript>
        </form>
    </div>
</div>
