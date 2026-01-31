<script>
    import "../app.css";
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui";
    import { Menu, X } from "lucide-svelte";

    let mobileMenuOpen = false;
</script>

<nav class="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <a
                href="/"
                class="flex items-center gap-2 font-bold text-xl text-primary"
            >
                <div
                    class="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg"
                ></div>
                <span class="hidden sm:inline">FoodBank Exchange</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-6">
                <a
                    href="/"
                    class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    Home
                </a>
                {#if $page.data.user}
                    <a
                        href="/search"
                        class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Find Food
                    </a>
                    <a
                        href="/dashboard"
                        class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        My Inventory
                    </a>
                    <a
                        href="/deliveries"
                        class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Deliveries
                    </a>
                    <div
                        class="flex items-center gap-3 ml-4 pl-4 border-l border-border"
                    >
                        <span class="text-sm text-muted-foreground">
                            Hello, <span class="font-medium text-foreground"
                                >{$page.data.user.name}</span
                            >
                        </span>
                        <form action="/logout" method="POST">
                            <Button type="submit" variant="outline" size="sm">
                                Logout
                            </Button>
                        </form>
                    </div>
                {:else}
                    <Button href="/login" variant="ghost" size="sm">
                        Login
                    </Button>
                    <Button href="/register" size="sm">Register</Button>
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
        <div class="md:hidden border-t border-border bg-background">
            <div class="px-4 py-4 space-y-3">
                <a
                    href="/"
                    class="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                >
                    Home
                </a>
                {#if $page.data.user}
                    <a
                        href="/search"
                        class="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Find Food
                    </a>
                    <a
                        href="/dashboard"
                        class="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        My Inventory
                    </a>
                    <a
                        href="/deliveries"
                        class="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Deliveries
                    </a>
                    <div class="pt-3 border-t border-border">
                        <p class="text-sm text-muted-foreground mb-3">
                            Hello, <span class="font-medium text-foreground"
                                >{$page.data.user.name}</span
                            >
                        </p>
                        <form action="/logout" method="POST">
                            <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                class="w-full"
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
                        class="w-full"
                    >
                        Login
                    </Button>
                    <Button href="/register" size="sm" class="w-full">
                        Register
                    </Button>
                {/if}
            </div>
        </div>
    {/if}
</nav>

<main>
    <slot />
</main>
