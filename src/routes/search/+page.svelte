<script>
    import { enhance } from "$app/forms";
    export let data;
    export let form;
</script>

<h1>Find Food Nearby</h1>

<form method="GET" class="search-bar">
    <input
        name="q"
        type="search"
        placeholder="Search for pasta, rice, etc..."
    />
    <button type="submit">Search</button>
</form>

<div class="results-grid">
    {#each data.items as item}
        <div class="item-card">
            <h3>{item.name}</h3>
            <p class="qty">{item.quantity} {item.unit}</p>
            <p class="source">
                {item.foodbank_name} <br />
                <small>{item.address}</small>
            </p>
            {#if item.expiry_date}
                <p class="expiry">
                    Expires: {new Date(item.expiry_date).toLocaleDateString()}
                </p>
            {/if}

            <form method="POST" action="?/requestItem" use:enhance>
                <input type="hidden" name="item_id" value={item.id} />
                <button type="submit">Request Item</button>
            </form>
        </div>
    {:else}
        <p>No food found matching your criteria.</p>
    {/each}
</div>

{#if form?.success}
    <div class="toast">Request Sent!</div>
{/if}

<style>
    .search-bar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 2rem;
        max-width: 600px;
    }
    .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }
    .item-card {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        border: 1px solid #e2e8f0;
    }
    .qty {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--primary);
    }
    .source {
        color: var(--secondary);
        font-size: 0.9rem;
        margin: 0.5rem 0;
    }
    .expiry {
        font-size: 0.8rem;
        color: var(--danger);
    }
    .toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #22c55e;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        animation: fadein 0.3s;
    }
    @keyframes fadein {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
