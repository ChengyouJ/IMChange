<script>
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        Button,
        Input,
    } from "$lib/components/ui";
    export let form;
</script>

<div class="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 bg-stone-50">
    <Card class="w-full max-w-md shadow-lg border-stone-200">
        <CardHeader class="space-y-3 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle class="text-3xl font-bold text-center text-green-600">Log In</CardTitle>
            <p class="text-center text-stone-600 text-sm">
                Enter your credentials to access your food bank dashboard
            </p>
        </CardHeader>
        <CardContent class="pt-6">
            <form method="POST" class="space-y-4">
                <div class="space-y-2">
                    <label
                        for="email"
                        class="text-sm font-medium leading-none text-stone-700"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@foodbank.org"
                        required
                        class="border-stone-200 focus:border-green-400 focus:ring-green-200"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="password"
                        class="text-sm font-medium leading-none text-stone-700"
                    >
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        class="border-stone-200 focus:border-green-400 focus:ring-green-200"
                    />
                </div>

                {#if form?.missing}
                    <div
                        class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center"
                    >
                        Please fill in all fields.
                    </div>
                {/if}
                {#if form?.invalid}
                    <div
                        class="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center"
                    >
                        Invalid email or password.
                    </div>
                {/if}

                <Button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white">Log In</Button>
            </form>

            <div class="mt-6 text-center text-sm">
                <span class="text-stone-600">New here?</span>
                <a
                    href="/register"
                    class="font-medium text-green-600 hover:text-green-500 hover:underline ml-1"
                >
                    Register your Food Bank
                </a>
            </div>
        </CardContent>
    </Card>
</div>
