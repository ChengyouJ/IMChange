<script>
    import { Button } from "$lib/components/ui";
    import { Sparkles, Users, TrendingUp } from "lucide-svelte";
    export let data;
</script>

<div class="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
    <!-- Hero Section -->
    <div
        class="relative w-full py-24 px-4 text-center bg-gradient-to-br from-amber-50/50 via-green-50/30 to-emerald-50/50"
    >
        <div class="max-w-4xl mx-auto space-y-8 animate-in">
            <div
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100/80 backdrop-blur-sm rounded-full text-sm font-semibold text-green-700 mb-4 shadow-sm border border-green-200/50"
            >
                <Sparkles class="w-4 h-4" />
                <span>Connecting Communities with Compassion</span>
            </div>

            <h1
                class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-green-600 bg-clip-text text-transparent leading-tight"
            >
                Share Surplus,<br />Nourish Communities 🌱
            </h1>

            <p
                class="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed font-medium"
            >
                A warm network connecting food banks to exchange surplus and ensure everyone has what they need.
            </p>

            <div class="flex flex-wrap gap-4 justify-center pt-6">
                {#if data.user}
                    <Button
                        href="/dashboard"
                        size="lg"
                        class="text-lg px-10 py-7 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all"
                    >
                        📦 Go to Dashboard
                    </Button>
                {:else}
                    <Button
                        href="/register"
                        size="lg"
                        class="text-lg px-10 py-7 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transition-all"
                    >
                        🌱 Join the Network
                    </Button>
                    <Button
                        href="/login"
                        variant="outline"
                        size="lg"
                        class="text-lg px-10 py-7 border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 shadow-md"
                    >
                        Log In
                    </Button>
                {/if}
            </div>
        </div>
    </div>

    <!-- Features Section -->
    <div class="w-full py-20 px-4 bg-gradient-to-b from-white to-green-50/30">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-4xl font-bold text-center mb-4 text-green-800">How It Works</h2>
            <p class="text-center text-stone-600 mb-16 text-lg">Simple, warm, and effective</p>

            <div class="grid md:grid-cols-3 gap-10">
                <div
                    class="text-center space-y-5 p-8 rounded-2xl hover:bg-white/80 hover:shadow-xl transition-all border border-green-100/50 bg-white/40 backdrop-blur-sm"
                >
                    <div
                        class="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md"
                    >
                        <Users class="w-10 h-10 text-green-600" />
                    </div>
                    <h3 class="text-2xl font-bold text-green-800">Welcome Home</h3>
                    <p class="text-stone-600 leading-relaxed">
                        Register your food bank and become part of a caring network dedicated to nourishing communities together.
                    </p>
                </div>

                <div
                    class="text-center space-y-5 p-8 rounded-2xl hover:bg-white/80 hover:shadow-xl transition-all border border-green-100/50 bg-white/40 backdrop-blur-sm"
                >
                    <div
                        class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center shadow-md"
                    >
                        <TrendingUp class="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 class="text-2xl font-bold text-green-800">Share Freely</h3>
                    <p class="text-stone-600 leading-relaxed">
                        List your surplus with ease and help neighbors find exactly what their communities need.
                    </p>
                </div>

                <div
                    class="text-center space-y-5 p-8 rounded-2xl hover:bg-white/80 hover:shadow-xl transition-all border border-green-100/50 bg-white/40 backdrop-blur-sm"
                >
                    <div
                        class="w-20 h-20 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center shadow-md"
                    >
                        <Sparkles class="w-10 h-10 text-amber-600" />
                    </div>
                    <h3 class="text-2xl font-bold text-green-800">Connect & Thrive</h3>
                    <p class="text-stone-600 leading-relaxed">
                        Discover nearby resources and build meaningful connections that strengthen our communities.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
