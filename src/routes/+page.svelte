<script>
    import { Button } from "$lib/components/ui";
    import { Sparkles, Users, TrendingUp } from "lucide-svelte";
    export let data;
</script>

<div class="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
    <!-- Hero Section -->
    <div
        class="relative w-full py-24 px-4 text-center bg-gradient-to-br from-green-50/30 via-white to-emerald-50/30"
    >
        <div class="max-w-4xl mx-auto space-y-8 animate-in">
            <div
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 rounded-full text-sm font-semibold text-green-600 mb-4 border border-green-200"
            >
                <Sparkles class="w-4 h-4" />
                <span>Connecting Food Banks Nationwide</span>
            </div>

            <h1
                class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-500 bg-clip-text text-transparent leading-tight pb-2"
            >
                Share Surplus,<br />Nourish Communities
            </h1>

            <p
                class="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed"
            >
                A professional network connecting food banks to exchange surplus inventory and maximize community impact.
            </p>

            <div class="flex flex-wrap gap-4 justify-center pt-6">
                {#if data.user}
                    <Button
                        href="/dashboard"
                        size="lg"
                        class="text-lg px-10 py-7 bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Go to Dashboard
                    </Button>
                {:else}
                    <Button
                        href="/register"
                        size="lg"
                        class="text-lg px-10 py-7 bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Join the Network
                    </Button>
                    <Button
                        href="/login"
                        variant="outline"
                        size="lg"
                        class="text-lg px-10 py-7 border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300"
                    >
                        Log In
                    </Button>
                {/if}
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="w-full py-20 px-4 bg-white">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-4 text-stone-800">How It Works</h2>
            <p class="text-center text-stone-600 mb-16 text-lg">Simple, efficient, and effective</p>

            <div class="grid md:grid-cols-3 gap-10">
                <div
                    class="text-center space-y-5 p-8 rounded-xl hover:shadow-lg transition-all border border-stone-100 bg-white"
                >
                    <div
                        class="w-20 h-20 mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center"
                    >
                        <Users class="w-10 h-10 text-green-500" />
                    </div>
                    <h3 class="text-2xl font-bold text-stone-800">Register</h3>
                    <p class="text-stone-600 leading-relaxed">
                        Create your account and join a professional network of food banks committed to reducing waste.
                    </p>
                </div>

                <div
                    class="text-center space-y-5 p-8 rounded-xl hover:shadow-lg transition-all border border-stone-100 bg-white"
                >
                    <div
                        class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl flex items-center justify-center"
                    >
                        <TrendingUp class="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 class="text-2xl font-bold text-stone-800">List Surplus</h3>
                    <p class="text-stone-600 leading-relaxed">
                        Easily add your excess inventory and make it available to other food banks in your area.
                    </p>
                </div>

                <div
                    class="text-center space-y-5 p-8 rounded-xl hover:shadow-lg transition-all border border-stone-100 bg-white"
                >
                    <div
                        class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center"
                    >
                        <Sparkles class="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 class="text-2xl font-bold text-stone-800">Connect & Exchange</h3>
                    <p class="text-stone-600 leading-relaxed">
                        Search for items nearby and coordinate transfers to maximize your community impact.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
