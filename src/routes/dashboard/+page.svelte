<script>
    import { enhance } from "$app/forms";
    export let data;
</script>

<h1>Dashboard</h1>

<div class="dashboard-grid">
    <div class="section inventory">
        <h2>My Surplus Inventory</h2>

        <form method="POST" action="?/addItem" use:enhance class="add-form">
            <h3>Add New Item</h3>
            <div class="form-row">
                <input
                    name="name"
                    placeholder="Item Name (e.g. Pasta)"
                    required
                />
                <input
                    name="quantity"
                    type="number"
                    placeholder="Qty"
                    required
                    style="width: 80px"
                />
                <input
                    name="unit"
                    placeholder="Unit (kg/boxes)"
                    required
                    style="width: 100px"
                />
            </div>
            <div class="form-row">
                <input name="expiry_date" type="date" placeholder="Expiry" />
                <button type="submit">Add Item</button>
            </div>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {#each data.items as item}
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.quantity} {item.unit}</td>
                        <td>
                            <span class="badge {item.status}"
                                >{item.status}</span
                            >
                        </td>
                        <td>
                            <form
                                method="POST"
                                action="?/deleteItem"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={item.id}
                                />
                                <button class="danger-btn">Delete</button>
                            </form>
                        </td>
                    </tr>
                {:else}
                    <tr><td colspan="4">No items listed.</td></tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="section requests">
        <h2>Incoming Requests</h2>
        {#if data.incomingRequests.length === 0}
            <p>No incoming requests.</p>
        {:else}
            <div class="card-list">
                {#each data.incomingRequests as req}
                    <div class="request-card">
                        <p>
                            <strong>{req.requester_name}</strong> requests
                            <strong>{req.item_name}</strong>
                        </p>
                        <p class="status">Status: {req.status}</p>
                        {#if req.status === "pending"}
                            <div class="actions">
                                <form
                                    method="POST"
                                    action="?/updateRequestStatus"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="request_id"
                                        value={req.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="accepted"
                                    />
                                    <button class="accept-btn">Accept</button>
                                </form>
                                <form
                                    method="POST"
                                    action="?/updateRequestStatus"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="request_id"
                                        value={req.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="rejected"
                                    />
                                    <button class="reject-btn">Reject</button>
                                </form>
                            </div>
                        {:else if req.status === "accepted"}
                            <p>Contact: {req.requester_email}</p>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}

        <h2>My Requests</h2>
        {#if data.outgoingRequests.length === 0}
            <p>You haven't requested anything.</p>
        {:else}
            <div class="card-list">
                {#each data.outgoingRequests as req}
                    <div class="request-card">
                        <p>
                            Requested <strong>{req.item_name}</strong> from {req.donor_name}
                        </p>
                        <span class="badge {req.status}">{req.status}</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .dashboard-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
    }
    .section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }
    .add-form {
        margin-bottom: 2rem;
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 0.5rem;
    }
    .form-row {
        display: flex;
        gap: 0.5rem;
    }
    .danger-btn {
        background: #fee2e2;
        color: #ef4444;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
    }
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 500;
        text-transform: uppercase;
    }
    .badge.available {
        background: #dcfce7;
        color: #166534;
    }
    .badge.reserved {
        background: #fff7ed;
        color: #9a3412;
    }
    .badge.pending {
        background: #fef9c3;
        color: #854d0e;
    }
    .badge.accepted {
        background: #fee2e2;
        color: #166534;
        background: #dcfce7;
    } /* Logic error in color, fixing */
    .badge.rejected {
        background: #fee2e2;
        color: #991b1b;
    }

    .request-card {
        border: 1px solid #e2e8f0;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
    }
    .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    .accept-btn {
        background: #22c55e;
    }
    .reject-btn {
        background: #ef4444;
    }

    @media (max-width: 768px) {
        .dashboard-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
