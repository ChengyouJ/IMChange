<script>
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        Button,
        Input,
        Badge,
        Table,
        TableHeader,
        TableBody,
        TableRow,
        TableHead,
        TableCell,
    } from "$lib/components/ui";
    import { notifications } from "$lib/stores/notifications";
    export let data;

    // Polling interval
    let pollInterval;
    let previousIncomingRequests = [];
    let previousOutgoingRequests = [];
    let isInitialLoad = true;

    // Detect new incoming requests (someone requested your item)
    $: {
        if (!isInitialLoad) {
            // Check for new incoming requests
            const newRequests = data.incomingRequests.filter(req =>
                !previousIncomingRequests.some(prev => prev.id === req.id)
            );

            newRequests.forEach(req => {
                notifications.add({
                    message: `${req.requester_name} requested ${req.item_name}`,
                    type: 'info',
                    link: '/dashboard',
                    linkText: 'View Request',
                    duration: 6000
                });
            });

            // Check for status changes on outgoing requests (accepted/rejected)
            data.outgoingRequests.forEach(req => {
                const previous = previousOutgoingRequests.find(prev => prev.id === req.id);
                if (previous && previous.status !== req.status) {
                    if (req.status === 'accepted') {
                        notifications.add({
                            message: `Your request for ${req.item_name} was accepted!`,
                            type: 'success',
                            link: '/deliveries',
                            linkText: 'View Delivery',
                            duration: 6000
                        });
                    } else if (req.status === 'rejected') {
                        notifications.add({
                            message: `Your request for ${req.item_name} was rejected`,
                            type: 'warning',
                            duration: 5000
                        });
                    }
                }
            });
        }

        previousIncomingRequests = [...data.incomingRequests];
        previousOutgoingRequests = [...data.outgoingRequests];
    }

    onMount(() => {
        // Mark as not initial load after first render
        setTimeout(() => {
            isInitialLoad = false;
        }, 100);

        // Refresh data every 3 seconds
        pollInterval = setInterval(() => {
            invalidate('app:dashboard');
        }, 3000);
    });

    onDestroy(() => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
    });

    function getStatusVariant(status) {
        if (status === "available") return "success";
        if (status === "reserved") return "warning";
        return "default";
    }

    function getRequestStatusVariant(status) {
        if (status === "accepted") return "success";
        if (status === "pending") return "warning";
        if (status === "rejected") return "destructive";
        return "default";
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
    <h1
        class="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent"
    >
        Dashboard
    </h1>

    <div class="grid lg:grid-cols-3 gap-6">
        <!-- Inventory Section -->
        <div class="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Surplus Inventory</CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                    <!-- Add Item Form -->
                    <form
                        method="POST"
                        action="?/addItem"
                        use:enhance={() => {
                            return async ({ result, update, formElement }) => {
                                if (result.type === 'success') {
                                    const formData = new FormData(formElement);
                                    const name = formData.get('name');
                                    const quantity = formData.get('quantity');
                                    const unit = formData.get('unit');
                                    notifications.add({
                                        message: `Added ${quantity} ${unit} of ${name} to inventory`,
                                        type: 'success',
                                        duration: 3000
                                    });
                                }
                                await update();
                            };
                        }}
                        class="p-4 bg-muted/50 rounded-lg space-y-4"
                    >
                        <h3 class="font-semibold text-lg">Add New Item</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                                name="name"
                                placeholder="Item Name (e.g. Pasta)"
                                required
                            />
                            <Input
                                name="quantity"
                                type="number"
                                placeholder="Quantity"
                                required
                                class="md:col-span-1"
                            />
                            <Input
                                name="unit"
                                placeholder="Unit (kg/boxes)"
                                required
                            />
                        </div>
                        <div class="flex justify-end">
                            <Button type="submit">Add Item</Button>
                        </div>
                    </form>

                    <!-- Inventory Table -->
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {#each data.items as item}
                                <TableRow>
                                    <TableCell class="font-medium"
                                        >{item.name}</TableCell
                                    >
                                    <TableCell
                                        >{item.quantity} {item.unit}</TableCell
                                    >
                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(
                                                item.status,
                                            )}
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <form
                                            method="POST"
                                            action="?/deleteItem"
                                            use:enhance={() => {
                                                const itemName = item.name;
                                                return async ({ result, update }) => {
                                                    if (result.type === 'success') {
                                                        notifications.add({
                                                            message: `Deleted ${itemName} from inventory`,
                                                            type: 'info',
                                                            duration: 3000
                                                        });
                                                    }
                                                    await update();
                                                };
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={item.id}
                                            />
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Delete
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            {:else}
                                <TableRow>
                                    <TableCell
                                        colspan="4"
                                        class="text-center text-muted-foreground"
                                    >
                                        No items listed.
                                    </TableCell>
                                </TableRow>
                            {/each}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <!-- Requests Section -->
        <div class="space-y-6">
            <!-- Incoming Requests -->
            <Card>
                <CardHeader>
                    <CardTitle>Incoming Requests</CardTitle>
                    <p class="text-xs text-muted-foreground mt-1">
                        Accepted requests appear on your <a href="/deliveries" class="text-primary underline">Deliveries</a> page
                    </p>
                </CardHeader>
                <CardContent>
                    {#if data.incomingRequests.length === 0}
                        <p class="text-sm text-muted-foreground">
                            No pending requests.
                        </p>
                    {:else}
                        <div class="space-y-3">
                            {#each data.incomingRequests as req}
                                <div
                                    class="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors"
                                >
                                    <div>
                                        <p class="text-sm">
                                            <span class="font-semibold"
                                                >{req.requester_name}</span
                                            >
                                            requests
                                            <span
                                                class="font-semibold text-primary"
                                                >{req.item_name}</span
                                            >
                                        </p>
                                        <Badge
                                            variant={getRequestStatusVariant(
                                                req.status,
                                            )}
                                            class="mt-2"
                                        >
                                            {req.status}
                                        </Badge>
                                    </div>
                                    {#if req.status === "pending"}
                                        <div class="flex gap-2">
                                            <form
                                                method="POST"
                                                action="?/updateRequestStatus"
                                                use:enhance={() => {
                                                    return async ({ result, update }) => {
                                                        if (result.type === 'success') {
                                                            notifications.add({
                                                                message: `Request accepted for ${req.item_name}!`,
                                                                type: 'success',
                                                                link: '/deliveries',
                                                                linkText: 'View Deliveries'
                                                            });
                                                        }
                                                        await update();
                                                    };
                                                }}
                                                class="flex-1"
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
                                                <Button
                                                    type="submit"
                                                    variant="default"
                                                    size="sm"
                                                    class="w-full"
                                                >
                                                    Accept
                                                </Button>
                                            </form>
                                            <form
                                                method="POST"
                                                action="?/updateRequestStatus"
                                                use:enhance={() => {
                                                    return async ({ result, update }) => {
                                                        if (result.type === 'success') {
                                                            notifications.add({
                                                                message: `Request rejected for ${req.item_name}`,
                                                                type: 'info',
                                                                duration: 3000
                                                            });
                                                        }
                                                        await update();
                                                    };
                                                }}
                                                class="flex-1"
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
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    size="sm"
                                                    class="w-full"
                                                >
                                                    Reject
                                                </Button>
                                            </form>
                                        </div>
                                    {:else if req.status === "accepted"}
                                        <p
                                            class="text-sm text-muted-foreground"
                                        >
                                            Contact: <span class="font-medium"
                                                >{req.requester_email}</span
                                            >
                                        </p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    {/if}
                </CardContent>
            </Card>

            <!-- My Requests -->
            <Card>
                <CardHeader>
                    <CardTitle>My Requests</CardTitle>
                    <p class="text-xs text-muted-foreground mt-1">
                        Accepted requests appear on your <a href="/deliveries" class="text-primary underline">Deliveries</a> page
                    </p>
                </CardHeader>
                <CardContent>
                    {#if data.outgoingRequests.length === 0}
                        <p class="text-sm text-muted-foreground">
                            No pending or rejected requests.
                        </p>
                    {:else}
                        <div class="space-y-3">
                            {#each data.outgoingRequests as req}
                                <div
                                    class="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <p class="text-sm mb-2">
                                        Requested <span
                                            class="font-semibold text-primary"
                                            >{req.item_name}</span
                                        >
                                        from {req.donor_name}
                                    </p>
                                    <Badge
                                        variant={getRequestStatusVariant(
                                            req.status,
                                        )}
                                    >
                                        {req.status}
                                    </Badge>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </CardContent>
            </Card>
        </div>
    </div>
</div>
