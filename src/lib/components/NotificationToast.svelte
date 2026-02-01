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
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
            case 'info':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
            case 'warning':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
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

<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
    {#each $notifications as notification (notification.id)}
        <div
            transition:fly={{ y: 50, duration: 300 }}
            class="border rounded-lg shadow-lg overflow-hidden {getColors(notification.type)} {notification.link ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}"
            on:click={() => handleClick(notification)}
            on:keydown={(e) => e.key === 'Enter' && handleClick(notification)}
            role={notification.link ? 'button' : 'status'}
            tabindex={notification.link ? 0 : -1}
        >
            <div class="flex items-start gap-3 p-4">
                <svelte:component
                    this={getIcon(notification.type)}
                    class="w-5 h-5 flex-shrink-0 mt-0.5"
                />

                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium leading-tight">
                        {notification.message}
                    </p>

                    {#if notification.link && notification.linkText}
                        <div class="flex items-center gap-1 mt-2 text-xs font-semibold opacity-90">
                            <span>{notification.linkText}</span>
                            <ArrowRight class="w-3 h-3" />
                        </div>
                    {/if}
                </div>

                <button
                    on:click|stopPropagation={() => handleClose(notification.id)}
                    class="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                    aria-label="Close notification"
                >
                    <X class="w-4 h-4" />
                </button>
            </div>
        </div>
    {/each}
</div>
