<script>
    import { Button } from "$lib/components/ui";
    import { Sparkles, Users, TrendingUp } from "lucide-svelte";
    export let data;
</script>

<div class="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
    <!-- Hero Section -->
    <div
        class="relative w-full py-20 px-4 text-center bg-gradient-to-br from-blue-50 via-white to-emerald-50"
    >
        <div class="max-w-4xl mx-auto space-y-8 animate-in">
            <div
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-medium text-blue-700 mb-4"
            >
                <Sparkles class="w-4 h-4" />
                <span>Connecting Food Banks Nationwide</span>
            </div>

            <h1
                class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent leading-tight"
            >
                Share Surplus,<br />Stop Hunger.
            </h1>

            <p
                class="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
            >
                Connect with local food banks to exchange excess stock and
                ensure resources get where they're needed most.
            </p>

            <div class="flex flex-wrap gap-4 justify-center pt-4">
                {#if data.user}
                    <Button
                        href="/dashboard"
                        size="lg"
                        class="text-lg px-8 py-6"
                    >
                        Go to Dashboard
                    </Button>
                {:else}
                    <Button
                        href="/register"
                        size="lg"
                        class="text-lg px-8 py-6"
                    >
                        Join the Network
                    </Button>
                    <Button
                        href="/login"
                        variant="outline"
                        size="lg"
                        class="text-lg px-8 py-6"
                    >
                        Log In
                    </Button>
                {/if}
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="w-full py-16 px-4 bg-white">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">How It Works</h2>

            <div class="grid md:grid-cols-3 gap-8">
                <div
                    class="text-center space-y-4 p-6 rounded-lg hover:bg-accent transition-colors"
                >
                    <div
                        class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center"
                    >
                        <Users class="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 class="text-xl font-semibold">Create Your Account</h3>
                    <p class="text-muted-foreground">
                        Register your food bank and join our growing network of
                        partners committed to reducing food waste.
                    </p>
                </div>

                <div
                    class="text-center space-y-4 p-6 rounded-lg hover:bg-accent transition-colors"
                >
                    <div
                        class="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center"
                    >
                        <TrendingUp class="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 class="text-xl font-semibold">List Surplus Items</h3>
                    <p class="text-muted-foreground">
                        Easily add your excess inventory to help other food
                        banks find what they need.
                    </p>
                </div>

                <div
                    class="text-center space-y-4 p-6 rounded-lg hover:bg-accent transition-colors"
                >
                    <div
                        class="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center"
                    >
                        <Sparkles class="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 class="text-xl font-semibold">Connect & Exchange</h3>
                    <p class="text-muted-foreground">
                        Search for items nearby and coordinate transfers to
                        maximize community impact.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
