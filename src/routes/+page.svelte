<script>
    export let data;
</script>

<div class="hero">
    <h1>Share Surplus, Stop Hunger.</h1>
    <p>
        Connect with local food banks to exchange excess stock and ensure
        resources get where they're needed most.
    </p>

    <div class="cta">
        {#if data.user}
            <a href="/dashboard" class="btn-primary">Go to Dashboard</a>
        {:else}
            <a href="/register" class="btn-primary">Join the Network</a>
            <a href="/login" class="btn-secondary">Log In</a>
        {/if}
    </div>
</div>

<style>
    .hero {
        text-align: center;
        padding: 4rem 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--text);
        line-height: 1.1;
    }
    p {
        font-size: 1.25rem;
        color: var(--secondary);
        margin-bottom: 2rem;
    }
    .cta {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }
    .btn-primary {
        background: var(--primary);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: bold;
        text-decoration: none;
    }
    .btn-secondary {
        background: white;
        color: var(--text);
        border: 1px solid #cbd5e1;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: bold;
        text-decoration: none;
    }
    .btn-secondary:hover {
        background: #f1f5f9;
        color: var(--primary);
    }
</style>
