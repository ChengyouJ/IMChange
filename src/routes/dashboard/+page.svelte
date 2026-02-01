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

<div class="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-green-50/30">
    <div class="mb-8">
        <h1
            class="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent"
        >
            📦 Your Dashboard
        </h1>
        <p class="text-stone-600 text-lg">Manage your surplus and requests with care</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
        <!-- Inventory Section -->
        <div class="lg:col-span-2 space-y-6">
            <Card class="border-green-100 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader class="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 pb-5">
                    <CardTitle class="text-2xl font-bold text-green-800">🌾 My Surplus Inventory</CardTitle>
                    <p class="text-sm text-stone-600 mt-2">Share what you have to help others</p>
                </CardHeader>
                <CardContent class="space-y-6 p-6">
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
                        class="p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/50 rounded-xl space-y-4 border-2 border-green-100"
                    >
                        <h3 class="font-bold text-xl text-green-800">✨ Add New Item</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                name="name"
                                placeholder="Item Name (e.g. Pasta)"
                                required
                                class="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-lg"
                            />
                            <Input
                                name="quantity"
                                type="number"
                                placeholder="Quantity"
                                required
                                class="md:col-span-1 border-green-200 focus:border-green-400 focus:ring-green-200 rounded-lg"
                            />
                            <Input
                                name="unit"
                                placeholder="Unit (kg/boxes)"
                                required
                                class="border-green-200 focus:border-green-400 focus:ring-green-200 rounded-lg"
                            />
                        </div>
                        <div class="flex justify-end">
                            <Button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold">➕ Add Item</Button>
                        </div>
                    </form>

                    <!-- Inventory Table -->
                    <div class="overflow-hidden rounded-xl border border-green-100">
                        <Table>
                            <TableHeader>
                                <TableRow class="bg-green-50 hover:bg-green-50">
                                    <TableHead class="font-bold text-green-800">Item</TableHead>
                                    <TableHead class="font-bold text-green-800">Quantity</TableHead>
                                    <TableHead class="font-bold text-green-800">Status</TableHead>
                                    <TableHead class="font-bold text-green-800">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {#each data.items as item}
                                    <TableRow class="hover:bg-green-50/50 transition-colors">
                                        <TableCell class="font-semibold text-green-800"
                                            >{item.name}</TableCell
                                        >
                                        <TableCell class="text-stone-700 font-medium"
                                            >{item.quantity} {item.unit}</TableCell
                                        >
                                        <TableCell>
                                            <Badge
                                                variant={getStatusVariant(
                                                    item.status,
                                                )}
                                                class="font-semibold"
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
                                                class="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg"
                                            >
                                                🗑️ Delete
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            {:else}
                                <TableRow>
                                    <TableCell
                                        colspan="4"
                                        class="text-center text-stone-500 py-8"
                                    >
                                        <div class="space-y-2">
                                            <p class="text-lg">No items yet</p>
                                            <p class="text-sm">Add your first item above 👆</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            {/each}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Requests Section -->
        <div class="space-y-6">
            <!-- Incoming Requests -->
            <Card class="border-green-100 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader class="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <CardTitle class="text-xl font-bold text-blue-800">📬 Incoming Requests</CardTitle>
                    <p class="text-xs text-stone-600 mt-2">
                        Accepted requests appear on your <a href="/deliveries" class="text-green-600 underline hover:text-green-700 font-semibold">Deliveries</a> page
                    </p>
                </CardHeader>
                <CardContent class="p-6">
                    {#if data.incomingRequests.length === 0}
                        <div class="text-center py-8 text-stone-500">
                            <p class="text-lg">✨ No pending requests</p>
                            <p class="text-sm mt-1">Requests will appear here</p>
                        </div>
                    {:else}
                        <div class="space-y-4">
                            {#each data.incomingRequests as req}
                                <div
                                    class="p-5 border-2 border-green-100 rounded-xl space-y-4 hover:bg-green-50/50 hover:border-green-200 transition-all shadow-sm"
                                >
                                    <div>
                                        <p class="text-base text-stone-700 leading-relaxed">
                                            <span class="font-bold text-green-700"
                                                >{req.requester_name}</span
                                            >
                                            <span class="text-stone-600">requests</span>
                                            <span
                                                class="font-bold text-green-800"
                                                >{req.item_name}</span
                                            >
                                        </p>
                                        <Badge
                                            variant={getRequestStatusVariant(
                                                req.status,
                                            )}
                                            class="mt-3 font-semibold"
                                        >
                                            {req.status}
                                        </Badge>
                                    </div>
                                    {#if req.status === "pending"}
                                        <div class="flex gap-3">
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
                                                    class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                                                >
                                                    ✓ Accept
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
                                                    class="w-full border-2 border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold py-3 rounded-lg"
                                                >
                                                    ✗ Reject
                                                </Button>
                                            </form>
                                        </div>
                                    {:else if req.status === "accepted"}
                                        <p
                                            class="text-sm text-stone-600 bg-green-50 p-3 rounded-lg border border-green-200"
                                        >
                                            📧 Contact: <span class="font-semibold text-green-800"
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
            <Card class="border-green-100 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader class="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                    <CardTitle class="text-xl font-bold text-purple-800">📮 My Requests</CardTitle>
                    <p class="text-xs text-stone-600 mt-2">
                        Accepted requests appear on your <a href="/deliveries" class="text-green-600 underline hover:text-green-700 font-semibold">Deliveries</a> page
                    </p>
                </CardHeader>
                <CardContent class="p-6">
                    {#if data.outgoingRequests.length === 0}
                        <div class="text-center py-8 text-stone-500">
                            <p class="text-lg">✨ No pending requests</p>
                            <p class="text-sm mt-1">Start searching for items</p>
                        </div>
                    {:else}
                        <div class="space-y-4">
                            {#each data.outgoingRequests as req}
                                <div
                                    class="p-5 border-2 border-purple-100 rounded-xl hover:bg-purple-50/50 hover:border-purple-200 transition-all shadow-sm"
                                >
                                    <p class="text-base mb-3 text-stone-700 leading-relaxed">
                                        <span class="text-stone-600">Requested</span> <span
                                            class="font-bold text-purple-700"
                                            >{req.item_name}</span
                                        >
                                        <span class="text-stone-600">from</span> <span class="font-semibold text-green-700">{req.donor_name}</span>
                                    </p>
                                    <Badge
                                        variant={getRequestStatusVariant(
                                            req.status,
                                        )}
                                        class="font-semibold"
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
