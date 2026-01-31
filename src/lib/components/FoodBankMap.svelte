<script>
    import { onMount, onDestroy } from 'svelte';
    import { enhance } from '$app/forms';

    /**
     * @typedef {Object} FoodItem
     * @property {number} id
     * @property {string} name
     * @property {number} quantity
     * @property {string} unit
     * @property {string} foodbank_name
     * @property {string} address
     * @property {number} latitude
     * @property {number} longitude
     * @property {number} distance
     */

    /** @type {FoodItem[]} */
    export let items = [];

    /** @type {{ latitude: number, longitude: number }} */
    export let userLocation = null;

    /** @type {Set<number>} */
    export let requestedItems = new Set();

    let mapContainer;
    let map;
    let markersLayer;
    let L; // Leaflet library
    let markerClusterGroup; // MarkerClusterGroup constructor

    // Selected item for popup/modal
    let selectedItem = null;

    onMount(async () => {
        // Dynamically import Leaflet to avoid SSR issues
        const leafletModule = await import('leaflet');
        L = leafletModule.default;

        // Import marker cluster
        const markerClusterModule = await import('leaflet.markercluster');

        // Import Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        const markerClusterCSS = document.createElement('link');
        markerClusterCSS.rel = 'stylesheet';
        markerClusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
        document.head.appendChild(markerClusterCSS);

        const markerClusterDefaultCSS = document.createElement('link');
        markerClusterDefaultCSS.rel = 'stylesheet';
        markerClusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
        document.head.appendChild(markerClusterDefaultCSS);

        // Initialize map centered on user location or UK
        const center = userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : [51.5074, -0.1278]; // Default to London

        map = L.map(mapContainer, {
            center: center,
            zoom: userLocation ? 12 : 6,
            zoomControl: true,
            scrollWheelZoom: true,
            tap: true
        });

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Create marker cluster group for better performance
        markersLayer = L.markerClusterGroup({
            maxClusterRadius: 60,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true
        });

        // Add user location marker if available
        if (userLocation) {
            const userIcon = L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [22, 22],
                iconAnchor: [11, 11]
            });

            L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
                .addTo(map)
                .bindPopup('<b>Your Location</b>');
        }

        // Add food bank markers
        addMarkers();

        map.addLayer(markersLayer);

        // Auto-fit bounds to show all markers
        if (items.length > 0) {
            const bounds = markersLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            }
        }
    });

    function addMarkers() {
        if (!L || !markersLayer) return;

        // Clear existing markers
        markersLayer.clearLayers();

        items.forEach((item) => {
            if (!item.latitude || !item.longitude) return;

            // Custom icon for food bank markers
            const icon = L.divIcon({
                className: 'food-bank-marker',
                html: `
                    <div style="
                        background-color: #10b981;
                        width: 32px;
                        height: 32px;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <span style="
                            transform: rotate(45deg);
                            color: white;
                            font-weight: bold;
                            font-size: 14px;
                        ">🍎</span>
                    </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            const marker = L.marker([item.latitude, item.longitude], { icon })
                .on('click', () => {
                    selectedItem = item;
                });

            markersLayer.addLayer(marker);
        });
    }

    // Update markers when items change
    $: if (map && items) {
        addMarkers();
    }

    function closePopup() {
        selectedItem = null;
    }

    onDestroy(() => {
        if (map) {
            map.remove();
        }
    });
</script>

<!-- Map Container -->
<div class="relative w-full h-full">
    <div bind:this={mapContainer} class="w-full h-full rounded-lg shadow-lg"></div>

    <!-- Custom Popup Modal -->
    {#if selectedItem}
        <div
            class="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto md:w-96 bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl z-[1000] animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-modal="true"
        >
            <div class="p-6 space-y-4">
                <!-- Close button -->
                <button
                    on:click={closePopup}
                    class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Item details -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {selectedItem.name}
                    </h3>
                    <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedItem.quantity} {selectedItem.unit}
                    </p>
                </div>

                <!-- Food bank info -->
                <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-start gap-2 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div class="flex-1">
                            <p class="font-semibold text-gray-900 dark:text-white">
                                {selectedItem.foodbank_name}
                            </p>
                            <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                {selectedItem.address}
                            </p>
                            <p class="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mt-2">
                                {selectedItem.distance < 1
                                    ? `${Math.round(selectedItem.distance * 1000)} m away`
                                    : `${selectedItem.distance.toFixed(1)} km away`
                                }
                            </p>
                        </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        {#if selectedItem.phone}
                            <div class="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:{selectedItem.phone}" class="text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                    {selectedItem.phone}
                                </a>
                            </div>
                        {/if}
                        {#if selectedItem.email}
                            <div class="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:{selectedItem.email}" class="text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                                    {selectedItem.email}
                                </a>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Request button -->
                <form
                    method="POST"
                    action="?/requestItem"
                    use:enhance={() => {
                        return async ({ result, update }) => {
                            if (result.type === 'success') {
                                requestedItems.add(selectedItem.id);
                                requestedItems = requestedItems;
                            }
                            await update();
                        };
                    }}
                    class="pt-2"
                >
                    <input type="hidden" name="item_id" value={selectedItem.id} />
                    <button
                        type="submit"
                        disabled={requestedItems.has(selectedItem.id)}
                        class="w-full font-semibold py-3 px-4 rounded-lg transition-colors shadow-md {requestedItems.has(selectedItem.id) ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'} text-white"
                    >
                        {requestedItems.has(selectedItem.id) ? 'Requested' : 'Request Item'}
                    </button>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(.leaflet-container) {
        font-family: inherit;
    }

    /* Cluster styling */
    :global(.marker-cluster-small),
    :global(.marker-cluster-medium),
    :global(.marker-cluster-large) {
        background-color: rgba(16, 185, 129, 0.6) !important;
    }

    :global(.marker-cluster-small div),
    :global(.marker-cluster-medium div),
    :global(.marker-cluster-large div) {
        background-color: rgba(16, 185, 129, 0.8) !important;
        color: white !important;
        font-weight: bold !important;
    }

    /* Remove Leaflet attribution on mobile for cleaner UI */
    @media (max-width: 640px) {
        :global(.leaflet-control-attribution) {
            font-size: 8px;
        }
    }
</style>
