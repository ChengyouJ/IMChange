<script>
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        Input,
    } from "$lib/components/ui";
    export let form;

    let postcode = '';
    let addresses = [];
    let selectedAddress = null;
    let searchError = '';
    let isSearching = false;

    // UK postcode validation
    const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;

    $: isPostcodeValid = postcode && UK_POSTCODE_REGEX.test(postcode.trim());
    $: canSearch = !isSearching && isPostcodeValid;

    async function searchAddress(event) {
        event.preventDefault();
        console.log('=== SEARCH STARTED ===');
        console.log('Postcode:', postcode);
        console.log('Is valid:', isPostcodeValid);

        if (!isPostcodeValid) {
            searchError = 'Please enter a valid UK postcode (e.g., W2 1UF)';
            console.log('Invalid postcode format');
            return;
        }

        isSearching = true;
        searchError = '';
        addresses = [];
        selectedAddress = null;

        try {
            const url = `/api/address-lookup?postcode=${encodeURIComponent(postcode)}`;
            console.log('Fetching:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                searchError = data.error || 'Failed to search address';
                console.log('API error:', searchError);
                return;
            }

            if (data.addresses && data.addresses.length > 0) {
                addresses = data.addresses;
                console.log('Found', addresses.length, 'addresses');
            } else {
                searchError = 'No addresses found for this postcode';
                console.log('No addresses returned');
            }
        } catch (error) {
            console.error('Search error:', error);
            searchError = 'Failed to search. Please try again.';
        } finally {
            isSearching = false;
            console.log('=== SEARCH COMPLETE ===');
        }
    }

    function selectAddress(address) {
        selectedAddress = address;
        addresses = []; // Hide dropdown after selection
        console.log('Selected address:', address);
    }

    function clearSelection() {
        selectedAddress = null;
        addresses = [];
        searchError = '';
    }
</script>

<div class="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-8 bg-stone-50">
    <Card class="w-full max-w-lg shadow-lg border-stone-200">
        <CardHeader class="space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle class="text-3xl font-bold text-center text-green-600">Join the Network</CardTitle>
            <p class="text-center text-stone-600 text-sm">
                Register your food bank to start exchanging surplus items
            </p>
        </CardHeader>
        <CardContent class="pt-6">
            <form method="POST" class="space-y-4">
                <div class="space-y-2">
                    <label for="name" class="text-sm font-medium text-stone-700">Organization Name</label>
                    <Input id="name" name="name" type="text" placeholder="Food Bank North" required class="border-stone-200 focus:border-green-400 focus:ring-green-200" />
                </div>

                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium text-stone-700">Email</label>
                    <Input id="email" name="email" type="email" placeholder="contact@example.org" required class="border-stone-200 focus:border-green-400 focus:ring-green-200" />
                </div>

                <div class="space-y-2">
                    <label for="password" class="text-sm font-medium text-stone-700">Password</label>
                    <Input id="password" name="password" type="password" required class="border-stone-200 focus:border-green-400 focus:ring-green-200" />
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-stone-700">Address Lookup</label>
                    <p class="text-xs text-stone-600">Enter your UK postcode to find your address</p>

                    <div class="flex gap-2">
                        <input
                            bind:value={postcode}
                            type="text"
                            placeholder="e.g. W2 1UF"
                            class="flex h-10 w-full rounded-md border border-stone-200 focus:border-green-400 focus:ring-green-200 bg-white px-3 py-2 text-sm uppercase"
                            on:keydown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (canSearch) searchAddress(e);
                                }
                            }}
                        />
                        <button
                            type="button"
                            on:click={searchAddress}
                            disabled={!canSearch}
                            class="h-10 px-4 py-2 whitespace-nowrap bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:pointer-events-none font-medium"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {#if !isPostcodeValid && postcode && postcode.length > 3}
                        <div class="p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-md text-sm">
                            Please enter a valid UK postcode format (e.g. W2 1UF)
                        </div>
                    {/if}

                    {#if searchError}
                        <div class="p-2 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-md text-sm">
                            {searchError}
                        </div>
                    {/if}

                    {#if addresses.length > 0}
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Select your address:</label>
                            <div class="border rounded-md max-h-64 overflow-y-auto bg-background">
                                {#each addresses as address, index}
                                    <button
                                        type="button"
                                        on:click={() => selectAddress(address)}
                                        class="w-full text-left px-3 py-3 hover:bg-accent transition-colors border-b last:border-b-0 focus:bg-accent focus:outline-none"
                                    >
                                        <div class="text-sm font-medium">{address.address_line_1}</div>
                                        <div class="text-xs text-muted-foreground mt-1">{address.display_name}</div>
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if selectedAddress}
                        <div class="p-3 bg-green-50 border border-green-200 rounded-md">
                            <div class="flex justify-between items-start">
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-green-700">Selected Address:</p>
                                    <p class="text-sm mt-1 text-stone-800">{selectedAddress.address_line_1}</p>
                                    <p class="text-xs text-stone-600 mt-1">{selectedAddress.display_name}</p>
                                </div>
                                <button
                                    type="button"
                                    on:click={clearSelection}
                                    class="text-xs text-green-600 hover:text-green-500 hover:underline ml-2"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    {/if}

                    <!-- Hidden fields for form submission -->
                    <input type="hidden" name="address" value={selectedAddress?.display_name || ''} />
                    <input type="hidden" name="address_line_1" value={selectedAddress?.address_line_1 || ''} />
                    <input type="hidden" name="latitude" value={selectedAddress?.lat || ''} />
                    <input type="hidden" name="longitude" value={selectedAddress?.lon || ''} />
                </div>

                <div class="space-y-2">
                    <label for="contact_info" class="text-sm font-medium text-stone-700">Contact Info (Phone/Link)</label>
                    <Input id="contact_info" name="contact_info" type="text" placeholder="+44 7700 900000" class="border-stone-200 focus:border-green-400 focus:ring-green-200" />
                </div>

                {#if form?.missing}
                    <div class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        Please fill in all fields and select an address.
                    </div>
                {/if}
                {#if form?.emailExists}
                    <div class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        Email already registered.
                    </div>
                {/if}

                <button
                    type="submit"
                    disabled={!selectedAddress}
                    class="w-full h-10 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:pointer-events-none font-medium"
                >
                    Create Account
                </button>
            </form>

            <div class="mt-6 text-center text-sm">
                <span class="text-stone-600">Already have an account?</span>
                <a href="/login" class="font-medium text-green-600 hover:text-green-500 hover:underline ml-1">Log in</a>
            </div>
        </CardContent>
    </Card>
</div>
