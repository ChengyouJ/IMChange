<script>
    import { notifications } from '$lib/stores/notifications';
    import { goto } from '$app/navigation';
    import { CheckCircle, Info, AlertTriangle, XCircle, X, ArrowRight } from 'lucide-svelte';
    import { fly, fade } from 'svelte/transition';

    function getIcon(type) {
        switch (type) {
            case 'success': return CheckCircle;
            case 'info': return Info;
            case 'warning': return AlertTriangle;
            case 'error': return XCircle;
            default: return Info;
        }
    }

    function getColors(type) {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 shadow-lg shadow-green-200/50';
            case 'info':
                return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 text-blue-800 shadow-lg shadow-blue-200/50';
            case 'warning':
                return 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-orange-300 text-orange-800 shadow-lg shadow-orange-200/50';
            case 'error':
                return 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-800 shadow-lg shadow-red-200/50';
            default:
                return 'bg-gradient-to-r from-stone-50 to-gray-50 border-2 border-stone-300 text-stone-800 shadow-lg shadow-stone-200/50';
        }
    }

    function handleClick(notification) {
        if (notification.link) {
            goto(notification.link);
            notifications.remove(notification.id);
        }
    }

    function handleClose(id) {
        notifications.remove(id);
    }
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-4 max-w-md">
    {#each $notifications as notification (notification.id)}
        <div
            transition:fly={{ y: 50, duration: 300 }}
            class="rounded-2xl overflow-hidden backdrop-blur-sm {getColors(notification.type)} {notification.link ? 'cursor-pointer hover:scale-105 hover:shadow-2xl transition-all' : 'transition-shadow'}"
            on:click={() => handleClick(notification)}
            on:keydown={(e) => e.key === 'Enter' && handleClick(notification)}
            role={notification.link ? 'button' : 'status'}
            tabindex={notification.link ? 0 : -1}
        >
            <div class="flex items-start gap-4 p-5">
                <svelte:component
                    this={getIcon(notification.type)}
                    class="w-6 h-6 flex-shrink-0 mt-0.5"
                />

                <div class="flex-1 min-w-0">
                    <p class="text-base font-semibold leading-snug">
                        {notification.message}
                    </p>

                    {#if notification.link && notification.linkText}
                        <div class="flex items-center gap-2 mt-3 text-sm font-bold opacity-90 hover:opacity-100 transition-opacity">
                            <span>{notification.linkText}</span>
                            <ArrowRight class="w-4 h-4" />
                        </div>
                    {/if}
                </div>

                <button
                    on:click|stopPropagation={() => handleClose(notification.id)}
                    class="flex-shrink-0 opacity-50 hover:opacity-100 hover:scale-110 transition-all p-1 hover:bg-white/40 rounded-lg"
                    aria-label="Close notification"
                >
                    <X class="w-5 h-5" />
                </button>
            </div>
        </div>
    {/each}
</div>
