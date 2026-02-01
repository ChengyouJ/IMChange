<script>
    import "../app.css";
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui";
    import { Menu, X } from "lucide-svelte";
    import NotificationToast from "$lib/components/NotificationToast.svelte";

    let mobileMenuOpen = false;
</script>

<nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <a
                href="/"
                class="flex items-center gap-3 font-bold text-xl text-green-700 hover:text-green-600 transition-colors"
            >
                <div
                    class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md flex items-center justify-center text-white text-sm"
                >
                    🌱
                </div>
                <span class="hidden sm:inline bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">FoodBank Exchange</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-8">
                <a
                    href="/"
                    class="text-sm font-medium text-stone-600 hover:text-green-600 transition-colors"
                >
                    Home
                </a>
                {#if $page.data.user}
                    <a
                        href="/search"
                        class="text-sm font-medium text-stone-600 hover:text-green-600 transition-colors"
                    >
                        🔍 Find Food
                    </a>
                    <a
                        href="/dashboard"
                        class="text-sm font-medium text-stone-600 hover:text-green-600 transition-colors"
                    >
                        📦 My Inventory
                    </a>
                    <a
                        href="/deliveries"
                        class="text-sm font-medium text-stone-600 hover:text-green-600 transition-colors"
                    >
                        🚚 Deliveries
                    </a>
                    <div
                        class="flex items-center gap-3 ml-4 pl-4 border-l border-green-200"
                    >
                        <span class="text-sm text-stone-600">
                            👋 <span class="font-semibold text-green-700"
                                >{$page.data.user.name}</span
                            >
                        </span>
                        <form action="/logout" method="POST">
                            <Button type="submit" variant="outline" size="sm" class="border-green-200 hover:bg-green-50 hover:text-green-700">
                                Logout
                            </Button>
                        </form>
                    </div>
                {:else}
                    <Button href="/login" variant="ghost" size="sm" class="hover:text-green-600 hover:bg-green-50">
                        Login
                    </Button>
                    <Button href="/register" size="sm" class="bg-green-600 hover:bg-green-700 text-white">Join Us</Button>
                {/if}
            </div>

            <!-- Mobile menu button -->
            <button
                class="md:hidden p-2"
                on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
            >
                {#if mobileMenuOpen}
                    <X class="w-6 h-6" />
                {:else}
                    <Menu class="w-6 h-6" />
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
        <div class="md:hidden border-t border-green-100 bg-gradient-to-b from-white to-green-50/30">
            <div class="px-4 py-4 space-y-3">
                <a
                    href="/"
                    class="block py-2 text-sm font-medium text-stone-600 hover:text-green-600"
                >
                    Home
                </a>
                {#if $page.data.user}
                    <a
                        href="/search"
                        class="block py-2 text-sm font-medium text-stone-600 hover:text-green-600"
                    >
                        🔍 Find Food
                    </a>
                    <a
                        href="/dashboard"
                        class="block py-2 text-sm font-medium text-stone-600 hover:text-green-600"
                    >
                        📦 My Inventory
                    </a>
                    <a
                        href="/deliveries"
                        class="block py-2 text-sm font-medium text-stone-600 hover:text-green-600"
                    >
                        🚚 Deliveries
                    </a>
                    <div class="pt-3 border-t border-green-200">
                        <p class="text-sm text-stone-600 mb-3">
                            👋 <span class="font-semibold text-green-700"
                                >{$page.data.user.name}</span
                            >
                        </p>
                        <form action="/logout" method="POST">
                            <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                class="w-full border-green-200 hover:bg-green-50 hover:text-green-700"
                            >
                                Logout
                            </Button>
                        </form>
                    </div>
                {:else}
                    <Button
                        href="/login"
                        variant="ghost"
                        size="sm"
                        class="w-full hover:text-green-600 hover:bg-green-50"
                    >
                        Login
                    </Button>
                    <Button href="/register" size="sm" class="w-full bg-green-600 hover:bg-green-700 text-white">
                        Join Us
                    </Button>
                {/if}
            </div>
        </div>
    {/if}
</nav>

<main>
    <slot />
</main>

<NotificationToast />
