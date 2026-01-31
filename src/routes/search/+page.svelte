<script>
    import { enhance } from "$app/forms";
    import {
        Card,
        CardContent,
        Button,
        Input,
        Badge,
    } from "$lib/components/ui";
    import { Search, MapPin, Calendar } from "lucide-svelte";
    export let data;
    export let form;
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
    <h1
        class="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent"
    >
        Find Food Nearby
    </h1>

    <!-- Search Bar -->
    <form method="GET" class="mb-4">
        <div class="flex gap-3 max-w-2xl">
            <div class="relative flex-1">
                <Search
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                />
                <Input
                    name="q"
                    type="search"
                    placeholder="Search for pasta, rice, etc..."
                    class="pl-10"
                />
            </div>
            <Button type="submit">Search</Button>
        </div>
    </form>

    <!-- Sorting Info -->
    {#if data.items.length > 0}
        <div class="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin class="w-4 h-4" />
            <span>Showing {data.items.length} items sorted by distance (closest first)</span>
        </div>
    {/if}

    <!-- Results Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each data.items as item}
            <Card class="hover:shadow-lg transition-shadow">
                <CardContent class="p-6 space-y-4">
                    <div>
                        <h3 class="text-xl font-semibold mb-2">{item.name}</h3>
                        <p class="text-2xl font-bold text-primary">
                            {item.quantity}
                            {item.unit}
                        </p>
                    </div>

                    <div class="space-y-2 text-sm">
                        <div
                            class="flex items-start gap-2 text-muted-foreground"
                        >
                            <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div class="flex-1">
                                <p class="font-medium text-foreground">
                                    {item.foodbank_name}
                                </p>
                                <p class="text-xs">{item.address}</p>
                                {#if item.distance !== undefined}
                                    <p class="text-xs font-semibold text-primary mt-1">
                                        {item.distance < 1
                                            ? `${Math.round(item.distance * 1000)} m away`
                                            : `${item.distance.toFixed(1)} km away`
                                        }
                                    </p>
                                {/if}
                            </div>
                        </div>

                        {#if item.expiry_date}
                            <div
                                class="flex items-center gap-2 text-destructive"
                            >
                                <Calendar class="w-4 h-4" />
                                <span class="text-xs">
                                    Expires: {new Date(
                                        item.expiry_date,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <form method="POST" action="?/requestItem" use:enhance>
                        <input type="hidden" name="item_id" value={item.id} />
                        <Button type="submit" class="w-full"
                            >Request Item</Button
                        >
                    </form>
                </CardContent>
            </Card>
        {:else}
            <div class="col-span-full text-center py-12">
                <p class="text-muted-foreground text-lg">
                    No food found matching your criteria.
                </p>
            </div>
        {/each}
    </div>
</div>

{#if form?.success}
    <div
        class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in"
    >
        Request Sent Successfully!
    </div>
{/if}
