<script>
    import "../app.css";
    import { page } from "$app/stores";
</script>

<nav>
    <a
        href="/"
        style="margin-right: auto; font-weight: bold; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;"
    >
        FoodBank Exchange
    </a>
    <a href="/">Home</a>
    {#if $page.data.user}
        <a href="/search">Find Food</a>
        <a href="/dashboard">My Inventory</a>
        <span class="user-welcome">Hello, {$page.data.user.name}</span>
        <form action="/logout" method="POST" style="display:inline;">
            <button type="submit" class="logout-btn">Logout</button>
        </form>
    {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
    {/if}
</nav>

<main>
    <slot />
</main>

<style>
    nav {
        background: var(--surface);
        padding: 1rem 2rem;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }
    a {
        text-decoration: none;
        color: var(--secondary);
        font-weight: 500;
        transition: color 0.2s;
    }
    a:hover {
        color: var(--primary);
    }
    main {
        max-width: 1000px;
        margin: 2rem auto;
        padding: 0 1rem;
    }
    .user-welcome {
        color: var(--text);
        font-size: 0.9rem;
        background: #e2e8f0;
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
    }
    .logout-btn {
        background: transparent;
        color: var(--secondary);
        padding: 0;
        font-weight: 500;
        border: none;
    }
    .logout-btn:hover {
        color: var(--danger);
        text-decoration: underline;
    }
</style>
