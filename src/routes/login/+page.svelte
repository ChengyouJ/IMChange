<script>
    export let form;
</script>

<div style="max-width: 400px; margin: 0 auto;">
    <h1>Log In</h1>

    <form method="POST">
        <label>
            Email
            <input name="email" type="email" required />
        </label>

        <label>
            Password
            <input name="password" type="password" required />
        </label>

        {#if form?.missing}
            <p class="error">Please fill in all fields.</p>
        {/if}
        {#if form?.invalid}
            <p class="error">Invalid email or password.</p>
        {/if}

        <button type="submit" style="width: 100%">Log In</button>
    </form>

    <p style="text-align: center; margin-top: 1rem;">
        New here? <a href="/register">Register your Food Bank</a>
    </p>
</div>

<style>
    .error {
        color: var(--danger);
        background: #fee2e2;
        padding: 0.5rem;
        border-radius: 0.25rem;
    }
</style>
