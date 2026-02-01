<script>
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import {
        Card,
        CardContent,
        Button,
        Input,
        Badge,
    } from "$lib/components/ui";
    import { Search, MapPin } from "lucide-svelte";
    import FoodBankMap from "$lib/components/FoodBankMap.svelte";
    import { notifications } from "$lib/stores/notifications";
    export let data;
    export let form;

    // Track requested items
    let requestedItems = new Set(
        data.items.filter(item => item.requested).map(item => item.id)
    );

    // Polling interval
    let pollInterval;

    onMount(() => {
        // Refresh data every 3 seconds
        pollInterval = setInterval(() => {
            invalidate('app:search');
        }, 3000);
    });

    onDestroy(() => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
    });

    // Update requestedItems when data changes
    $: {
        const newRequestedItems = new Set(
            data.items.filter(item => item.requested).map(item => item.id)
        );
        // Merge with existing requests (preserve client-side state)
        requestedItems = new Set([...requestedItems, ...newRequestedItems]);
    }
</script>

<div class="max-w-full mx-auto px-6 py-8 bg-gradient-to-br from-amber-50/30 via-white to-green-50/30 min-h-screen">
    <div class="mb-8">
        <h1
            class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3"
        >
            🔍 Find Food Nearby
        </h1>
        <p class="text-stone-600 text-lg mb-6">Discover surplus from caring food banks in your community</p>

        <!-- Search Bar -->
        <form method="GET" class="mb-6">
            <div class="flex gap-3 max-w-2xl">
                <div class="relative flex-1">
                    <Search
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500"
                    />
                    <Input
                        name="q"
                        type="search"
                        placeholder="Search for pasta, rice, canned goods..."
                        class="pl-12 py-6 border-green-200 focus:border-green-400 focus:ring-green-200 rounded-xl shadow-sm"
                    />
                </div>
                <Button type="submit" class="px-8 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all">Search</Button>
            </div>
        </form>

        <!-- Item Count Info -->
        {#if data.items.length > 0}
            <div class="mb-4 flex items-center gap-2 text-sm text-stone-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100 w-fit">
                <MapPin class="w-4 h-4 text-green-600" />
                <span class="font-medium">{data.items.length} items found nearby • Sorted by distance</span>
            </div>
        {/if}
    </div>

    <!-- Split View: List on Left, Map on Right -->
    <div class="flex gap-6 h-[calc(100vh-280px)]">
        <!-- Left Side: Scrollable List -->
        <div class="w-1/2 overflow-y-auto pr-2 space-y-4">
            {#if data.items.length > 0}
                {#each data.items as item}
                    <Card class="hover:shadow-xl transition-all border-green-100 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <CardContent class="p-7 space-y-5">
                            <div>
                                <h3 class="text-2xl font-bold mb-3 text-green-800">{item.name}</h3>
                                <div class="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                                    <p class="text-2xl font-bold text-green-700">
                                        {item.quantity}
                                    </p>
                                    <p class="text-lg text-green-600 font-medium">{item.unit}</p>
                                </div>
                            </div>

                            <div class="space-y-3 text-sm">
                                <div
                                    class="flex items-start gap-3 text-stone-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100"
                                >
                                    <MapPin class="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                                    <div class="flex-1">
                                        <p class="font-bold text-green-800 text-base">
                                            {item.foodbank_name}
                                        </p>
                                        <p class="text-xs text-stone-500 mt-1">{item.address}</p>
                                        {#if item.distance !== undefined}
                                            <p class="text-sm font-bold text-green-600 mt-2 flex items-center gap-1">
                                                📍 {item.distance < 1
                                                    ? `${Math.round(item.distance * 1000)} m away`
                                                    : `${item.distance.toFixed(1)} km away`
                                                }
                                            </p>
                                        {/if}
                                    </div>
                                </div>

                                <!-- Contact Information -->
                                <div class="pt-2 border-t border-green-100 space-y-2 mt-3">
                                    {#if item.phone}
                                        <div class="flex items-center gap-2 text-xs text-stone-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <a href="tel:{item.phone}" class="hover:text-green-600 transition-colors font-medium">{item.phone}</a>
                                        </div>
                                    {/if}
                                    {#if item.email}
                                        <div class="flex items-center gap-2 text-xs text-stone-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <a href="mailto:{item.email}" class="hover:text-green-600 transition-colors truncate font-medium">{item.email}</a>
                                        </div>
                                    {/if}
                                </div>
                            </div>

                            <form
                                method="POST"
                                action="?/requestItem"
                                use:enhance={() => {
                                    return async ({ result, update }) => {
                                        if (result.type === 'success') {
                                            requestedItems.add(item.id);
                                            requestedItems = requestedItems;
                                            notifications.add({
                                                message: `Request sent for ${item.name}!`,
                                                type: 'success',
                                                link: '/dashboard',
                                                linkText: 'View in Dashboard'
                                            });
                                        }
                                        await update();
                                    };
                                }}
                            >
                                <input type="hidden" name="item_id" value={item.id} />
                                <Button
                                    type="submit"
                                    class="w-full py-6 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all {requestedItems.has(item.id) ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-green-600 hover:bg-green-700 text-white'}"
                                    disabled={requestedItems.has(item.id)}
                                >
                                    {requestedItems.has(item.id) ? '✓ Requested' : '🤝 Request Item'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                {/each}
            {:else}
                <div class="flex items-center justify-center h-full">
                    <div class="text-center space-y-3">
                        <p class="text-stone-600 text-xl font-medium">
                            No items found
                        </p>
                        <p class="text-stone-500 text-sm">Try adjusting your search</p>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Right Side: Map -->
        <div class="w-1/2">
            {#if data.items.length > 0}
                <div class="rounded-2xl overflow-hidden border-2 border-green-100 shadow-lg">
                    <FoodBankMap
                        items={data.items}
                        userLocation={data.userLocation}
                        bind:requestedItems
                    />
                </div>
            {:else}
                <div class="flex items-center justify-center h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
                    <div class="text-center space-y-3">
                        <p class="text-green-800 text-xl font-semibold">
                            🗺️ Map will appear here
                        </p>
                        <p class="text-stone-600 text-sm">Search to see nearby food banks</p>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
