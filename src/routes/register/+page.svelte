<script>
    export let form;
</script>

<div style="max-width: 400px; margin: 0 auto;">
    <h1>Join the Network</h1>

    <form method="POST">
        <label>
            Organization Name
            <input
                name="name"
                type="text"
                required
                placeholder="Food Bank North"
            />
        </label>

        <label>
            Email
            <input
                name="email"
                type="email"
                required
                placeholder="contact@example.org"
            />
        </label>

        <label>
            Password
            <input name="password" type="password" required />
        </label>

        <label>
            Address
            <textarea name="address" required placeholder="123 High St..."
            ></textarea>
        </label>

        <label>
            Contact Info (Phone/Link)
            <input
                name="contact_info"
                type="text"
                placeholder="+44 7700 900000"
            />
        </label>

        {#if form?.missing}
            <p class="error">Please fill in all fields.</p>
        {/if}
        {#if form?.emailExists}
            <p class="error">Email already registered.</p>
        {/if}

        <button type="submit" style="width: 100%">Create Account</button>
    </form>

    <p style="text-align: center; margin-top: 1rem;">
        Already have an account? <a href="/login">Log in</a>
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
