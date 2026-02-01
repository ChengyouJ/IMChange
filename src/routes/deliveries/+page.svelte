<script>
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import {
        Card,
        CardContent,
        Button,
        Badge,
    } from "$lib/components/ui";
    import { Package, Truck, CheckCircle, Clock } from "lucide-svelte";
    import { notifications } from "$lib/stores/notifications";

    export let data;

    let activeTab = 'receiver'; // Start with receiver view as they're likely checking deliveries

    // Polling interval
    let pollInterval;
    let previousSenderDeliveries = [];
    let previousReceiverDeliveries = [];
    let isInitialLoad = true;

    // Detect delivery status changes
    $: {
        if (!isInitialLoad) {
            // Check for new deliveries as receiver (request was accepted)
            const newReceiverDeliveries = data.receiverDeliveries.filter(delivery =>
                !previousReceiverDeliveries.some(prev => prev.id === delivery.id)
            );

            newReceiverDeliveries.forEach(delivery => {
                notifications.add({
                    message: `${delivery.sender_name} accepted your request for ${delivery.item_name}!`,
                    type: 'success',
                    link: '/deliveries',
                    linkText: 'View Delivery',
                    duration: 6000
                });
            });

            // Check for status changes on receiver deliveries (sent → received)
            data.receiverDeliveries.forEach(delivery => {
                const previous = previousReceiverDeliveries.find(prev => prev.id === delivery.id);
                if (previous && previous.delivery_status !== delivery.delivery_status) {
                    if (delivery.delivery_status === 'sent') {
                        notifications.add({
                            message: `${delivery.sender_name} shipped ${delivery.item_name}!`,
                            type: 'info',
                            link: '/deliveries',
                            linkText: 'Mark as Received',
                            duration: 6000
                        });
                    }
                }
            });

            // Check for status changes on sender deliveries (received confirmation)
            data.senderDeliveries.forEach(delivery => {
                const previous = previousSenderDeliveries.find(prev => prev.id === delivery.id);
                if (previous && previous.delivery_status !== delivery.delivery_status) {
                    if (delivery.delivery_status === 'completed') {
                        notifications.add({
                            message: `${delivery.receiver_name} confirmed receipt of ${delivery.item_name}`,
                            type: 'success',
                            duration: 5000
                        });
                    }
                }
            });
        }

        previousSenderDeliveries = [...data.senderDeliveries];
        previousReceiverDeliveries = [...data.receiverDeliveries];
    }

    onMount(() => {
        // Mark as not initial load after first render
        setTimeout(() => {
            isInitialLoad = false;
        }, 100);

        // Refresh data every 3 seconds
        pollInterval = setInterval(() => {
            invalidate('app:deliveries');
        }, 3000);
    });

    onDestroy(() => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
    });

    function getDeliveryStatusVariant(status) {
        if (status === 'completed') return 'success'; // Green
        if (status === 'sent' || status === 'accepted') return 'warning'; // Orange/Yellow
        return 'default';
    }

    function getDeliveryStatusLabel(status) {
        const labels = {
            'accepted': 'Awaiting Shipment',
            'sent': 'In Transit',
            'completed': 'Delivered'
        };
        return labels[status] || status;
    }

    function formatTimeAgo(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'yesterday';
        return `${diffDays} days ago`;
    }

    // Separate ongoing and completed deliveries
    $: ongoingSender = data.senderDeliveries.filter(d =>
        d.delivery_status !== 'completed'
    );
    $: completedSender = data.senderDeliveries.filter(d =>
        d.delivery_status === 'completed'
    );

    $: ongoingReceiver = data.receiverDeliveries.filter(d =>
        d.delivery_status !== 'completed'
    );
    $: completedReceiver = data.receiverDeliveries.filter(d =>
        d.delivery_status === 'completed'
    );
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
        Manage Deliveries
    </h1>

    <!-- Tab Navigation -->
    <div class="flex gap-2 mb-6 border-b border-border">
        <button
            class="px-6 py-3 font-medium transition-colors {activeTab === 'receiver'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'}"
            on:click={() => activeTab = 'receiver'}
        >
            As Receiver ({ongoingReceiver.length})
        </button>
        <button
            class="px-6 py-3 font-medium transition-colors {activeTab === 'sender'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'}"
            on:click={() => activeTab = 'sender'}
        >
            As Sender ({ongoingSender.length})
        </button>
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'receiver'}
        <!-- Receiver View -->
        <div class="space-y-8">
            <!-- Ongoing Deliveries -->
            {#if ongoingReceiver.length > 0}
                <div>
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Truck class="w-5 h-5 text-orange-500" />
                        Ongoing Deliveries
                    </h2>
                    <div class="space-y-4">
                        {#each ongoingReceiver as delivery}
                            <Card class="border-l-4 border-l-orange-500">
                                <CardContent class="p-6">
                                    <div class="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 class="text-lg font-semibold">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-sm text-muted-foreground">
                                                From: {delivery.sender_name}
                                            </p>
                                            {#if delivery.sender_address}
                                                <p class="text-sm text-muted-foreground">
                                                    {delivery.sender_address}
                                                </p>
                                            {/if}
                                        </div>
                                        <Badge variant={getDeliveryStatusVariant(delivery.delivery_status)}>
                                            {getDeliveryStatusLabel(delivery.delivery_status)}
                                        </Badge>
                                    </div>

                                    {#if delivery.delivery_status === 'sent'}
                                        <div class="mb-4 text-sm text-muted-foreground">
                                            <Clock class="inline w-4 h-4 mr-1" />
                                            Sent {formatTimeAgo(delivery.sent_at)}
                                        </div>

                                        <form method="POST" action="?/markAsReceived" use:enhance={() => {
                                            return async ({ result, update }) => {
                                                if (result.type === 'success') {
                                                    notifications.add({
                                                        message: `Delivery received: ${delivery.quantity} ${delivery.unit} of ${delivery.item_name}`,
                                                        type: 'success',
                                                        duration: 4000
                                                    });
                                                }
                                                await update();
                                            };
                                        }}>
                                            <input type="hidden" name="request_id" value={delivery.id} />
                                            <Button type="submit" class="w-full">
                                                <CheckCircle class="w-4 h-4 mr-2" />
                                                Mark as Received
                                            </Button>
                                        </form>
                                    {:else if delivery.delivery_status === 'accepted'}
                                        <p class="text-sm text-muted-foreground">
                                            Waiting for sender to ship this item
                                        </p>
                                    {/if}
                                </CardContent>
                            </Card>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Completed Deliveries -->
            {#if completedReceiver.length > 0}
                <div>
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle class="w-5 h-5 text-green-500" />
                        Completed Deliveries
                    </h2>
                    <div class="space-y-4">
                        {#each completedReceiver as delivery}
                            <Card class="border-l-4 border-l-green-500 opacity-75">
                                <CardContent class="p-6">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="text-lg font-semibold">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-sm text-muted-foreground">
                                                From: {delivery.sender_name}
                                            </p>
                                            <p class="text-sm text-muted-foreground mt-2">
                                                Received {formatTimeAgo(delivery.received_at)}
                                            </p>
                                        </div>
                                        <Badge variant="success">
                                            Delivered
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if ongoingReceiver.length === 0 && completedReceiver.length === 0}
                <div class="text-center py-12 text-muted-foreground">
                    <Package class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No deliveries as receiver yet</p>
                </div>
            {/if}
        </div>
    {:else}
        <!-- Sender View -->
        <div class="space-y-8">
            <!-- Ongoing Deliveries -->
            {#if ongoingSender.length > 0}
                <div>
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Truck class="w-5 h-5 text-orange-500" />
                        Ongoing Deliveries
                    </h2>
                    <div class="space-y-4">
                        {#each ongoingSender as delivery}
                            <Card class="border-l-4 border-l-orange-500">
                                <CardContent class="p-6">
                                    <div class="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 class="text-lg font-semibold">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-sm text-muted-foreground">
                                                To: {delivery.receiver_name}
                                            </p>
                                            {#if delivery.receiver_address}
                                                <p class="text-sm text-muted-foreground">
                                                    {delivery.receiver_address}
                                                </p>
                                            {/if}
                                            {#if delivery.receiver_phone}
                                                <p class="text-sm text-muted-foreground">
                                                    Phone: {delivery.receiver_phone}
                                                </p>
                                            {/if}
                                        </div>
                                        <Badge variant={getDeliveryStatusVariant(delivery.delivery_status)}>
                                            {getDeliveryStatusLabel(delivery.delivery_status)}
                                        </Badge>
                                    </div>

                                    {#if delivery.delivery_status === 'accepted'}
                                        <form method="POST" action="?/markAsSent" use:enhance={() => {
                                            return async ({ result, update }) => {
                                                if (result.type === 'success') {
                                                    notifications.add({
                                                        message: `Marked as sent: ${delivery.quantity} ${delivery.unit} of ${delivery.item_name}`,
                                                        type: 'success',
                                                        duration: 4000
                                                    });
                                                }
                                                await update();
                                            };
                                        }}>
                                            <input type="hidden" name="request_id" value={delivery.id} />
                                            <Button type="submit" class="w-full">
                                                <Truck class="w-4 h-4 mr-2" />
                                                Mark as Sent
                                            </Button>
                                        </form>
                                    {:else if delivery.delivery_status === 'sent'}
                                        <div class="text-sm text-muted-foreground">
                                            <Clock class="inline w-4 h-4 mr-1" />
                                            Sent {formatTimeAgo(delivery.sent_at)} - Waiting for receiver to confirm
                                        </div>
                                    {/if}
                                </CardContent>
                            </Card>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Completed Deliveries -->
            {#if completedSender.length > 0}
                <div>
                    <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle class="w-5 h-5 text-green-500" />
                        Completed Deliveries
                    </h2>
                    <div class="space-y-4">
                        {#each completedSender as delivery}
                            <Card class="border-l-4 border-l-green-500 opacity-75">
                                <CardContent class="p-6">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="text-lg font-semibold">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-sm text-muted-foreground">
                                                To: {delivery.receiver_name}
                                            </p>
                                            <p class="text-sm text-muted-foreground mt-2">
                                                Delivered {formatTimeAgo(delivery.received_at)}
                                            </p>
                                        </div>
                                        <Badge variant="success">
                                            Delivered
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if ongoingSender.length === 0 && completedSender.length === 0}
                <div class="text-center py-12 text-muted-foreground">
                    <Package class="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No deliveries as sender yet</p>
                </div>
            {/if}
        </div>
    {/if}
</div>
