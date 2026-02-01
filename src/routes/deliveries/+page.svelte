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

<div class="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-green-50/30">
    <div class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🚚 Manage Deliveries
        </h1>
        <p class="text-stone-600 text-lg">Track your incoming and outgoing food exchanges</p>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-3 mb-8 border-b-2 border-green-100 bg-white/60 backdrop-blur-sm rounded-t-2xl p-2">
        <button
            class="px-8 py-4 font-semibold transition-all rounded-xl {activeTab === 'receiver'
                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                : 'text-stone-600 hover:text-green-600 hover:bg-green-50'}"
            on:click={() => activeTab = 'receiver'}
        >
            📥 As Receiver ({ongoingReceiver.length})
        </button>
        <button
            class="px-8 py-4 font-semibold transition-all rounded-xl {activeTab === 'sender'
                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                : 'text-stone-600 hover:text-green-600 hover:bg-green-50'}"
            on:click={() => activeTab = 'sender'}
        >
            📤 As Sender ({ongoingSender.length})
        </button>
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'receiver'}
        <!-- Receiver View -->
        <div class="space-y-8">
            <!-- Ongoing Deliveries -->
            {#if ongoingReceiver.length > 0}
                <div>
                    <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-700">
                        <Truck class="w-7 h-7" />
                        Ongoing Deliveries
                    </h2>
                    <div class="space-y-5">
                        {#each ongoingReceiver as delivery}
                            <Card class="border-l-[6px] border-l-orange-400 shadow-lg rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-orange-100">
                                <CardContent class="p-7">
                                    <div class="flex justify-between items-start mb-5">
                                        <div class="flex-1">
                                            <h3 class="text-2xl font-bold text-green-700 mb-2">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-base text-stone-700 font-semibold">
                                                📦 From: <span class="text-green-600">{delivery.sender_name}</span>
                                            </p>
                                            {#if delivery.sender_address}
                                                <p class="text-sm text-stone-600 mt-1">
                                                    📍 {delivery.sender_address}
                                                </p>
                                            {/if}
                                        </div>
                                        <Badge variant={getDeliveryStatusVariant(delivery.delivery_status)} class="text-sm font-bold px-4 py-2">
                                            {getDeliveryStatusLabel(delivery.delivery_status)}
                                        </Badge>
                                    </div>

                                    {#if delivery.delivery_status === 'sent'}
                                        <div class="mb-5 text-sm text-stone-600 bg-orange-50 px-4 py-3 rounded-lg border border-orange-200">
                                            <Clock class="inline w-5 h-5 mr-2 text-orange-600" />
                                            <span class="font-semibold">Sent {formatTimeAgo(delivery.sent_at)}</span>
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
                                            <Button type="submit" class="w-full bg-green-600 hover:bg-green-600 text-white py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                                                <CheckCircle class="w-5 h-5 mr-2" />
                                                Mark as Received
                                            </Button>
                                        </form>
                                    {:else if delivery.delivery_status === 'accepted'}
                                        <p class="text-base text-stone-600 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200 font-medium">
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
                    <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-green-600">
                        <CheckCircle class="w-7 h-7" />
                        Completed Deliveries
                    </h2>
                    <div class="space-y-5">
                        {#each completedReceiver as delivery}
                            <Card class="border-l-[6px] border-l-green-500 shadow-md rounded-2xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity bg-white/70 backdrop-blur-sm border border-green-100">
                                <CardContent class="p-7">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="text-xl font-bold text-green-700">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-base text-stone-700 mt-2 font-semibold">
                                                📦 From: <span class="text-green-600">{delivery.sender_name}</span>
                                            </p>
                                            <p class="text-sm text-stone-600 mt-2 bg-green-50 px-3 py-2 rounded-lg inline-block border border-green-200">
                                                Received {formatTimeAgo(delivery.received_at)}
                                            </p>
                                        </div>
                                        <Badge variant="success" class="font-bold px-4 py-2">
                                            🎉 Delivered
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if ongoingReceiver.length === 0 && completedReceiver.length === 0}
                <div class="text-center py-20 text-stone-500 bg-white/60 rounded-2xl border-2 border-dashed border-green-200">
                    <Package class="w-20 h-20 mx-auto mb-5 text-green-300" />
                    <p class="text-xl font-semibold">No deliveries as receiver yet</p>
                    <p class="text-sm mt-2">Accepted requests will appear here</p>
                </div>
            {/if}
        </div>
    {:else}
        <!-- Sender View -->
        <div class="space-y-8">
            <!-- Ongoing Deliveries -->
            {#if ongoingSender.length > 0}
                <div>
                    <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-orange-700">
                        <Truck class="w-7 h-7" />
                        Ongoing Deliveries
                    </h2>
                    <div class="space-y-5">
                        {#each ongoingSender as delivery}
                            <Card class="border-l-[6px] border-l-orange-400 shadow-lg rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-orange-100">
                                <CardContent class="p-7">
                                    <div class="flex justify-between items-start mb-5">
                                        <div class="flex-1">
                                            <h3 class="text-2xl font-bold text-green-700 mb-2">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-base text-stone-700 font-semibold">
                                                📫 To: <span class="text-green-600">{delivery.receiver_name}</span>
                                            </p>
                                            {#if delivery.receiver_address}
                                                <p class="text-sm text-stone-600 mt-1">
                                                    📍 {delivery.receiver_address}
                                                </p>
                                            {/if}
                                            {#if delivery.receiver_phone}
                                                <p class="text-sm text-stone-600 mt-1">
                                                    📞 {delivery.receiver_phone}
                                                </p>
                                            {/if}
                                        </div>
                                        <Badge variant={getDeliveryStatusVariant(delivery.delivery_status)} class="text-sm font-bold px-4 py-2">
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
                                            <Button type="submit" class="w-full bg-green-600 hover:bg-green-600 text-white py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                                                <Truck class="w-5 h-5 mr-2" />
                                                🚚 Mark as Sent
                                            </Button>
                                        </form>
                                    {:else if delivery.delivery_status === 'sent'}
                                        <div class="text-base text-stone-600 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200 font-medium">
                                            <Clock class="inline w-5 h-5 mr-2 text-blue-600" />
                                            Sent {formatTimeAgo(delivery.sent_at)} • Waiting for receiver to confirm
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
                    <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-green-600">
                        <CheckCircle class="w-7 h-7" />
                        Completed Deliveries
                    </h2>
                    <div class="space-y-5">
                        {#each completedSender as delivery}
                            <Card class="border-l-[6px] border-l-green-500 shadow-md rounded-2xl overflow-hidden opacity-80 hover:opacity-100 transition-opacity bg-white/70 backdrop-blur-sm border border-green-100">
                                <CardContent class="p-7">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <h3 class="text-xl font-bold text-green-700">
                                                {delivery.quantity} {delivery.unit} of {delivery.item_name}
                                            </h3>
                                            <p class="text-base text-stone-700 mt-2 font-semibold">
                                                📫 To: <span class="text-green-600">{delivery.receiver_name}</span>
                                            </p>
                                            <p class="text-sm text-stone-600 mt-2 bg-green-50 px-3 py-2 rounded-lg inline-block border border-green-200">
                                                Delivered {formatTimeAgo(delivery.received_at)}
                                            </p>
                                        </div>
                                        <Badge variant="success" class="font-bold px-4 py-2">
                                            🎉 Delivered
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if ongoingSender.length === 0 && completedSender.length === 0}
                <div class="text-center py-20 text-stone-500 bg-white/60 rounded-2xl border-2 border-dashed border-green-200">
                    <Package class="w-20 h-20 mx-auto mb-5 text-green-300" />
                    <p class="text-xl font-semibold">No deliveries as sender yet</p>
                    <p class="text-sm mt-2">Accept requests to start deliveries</p>
                </div>
            {/if}
        </div>
    {/if}
</div>
