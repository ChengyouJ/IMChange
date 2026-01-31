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

<div class="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
    <Card class="w-full max-w-md shadow-lg">
        <CardHeader class="space-y-1">
            <CardTitle class="text-3xl font-bold text-center">Log In</CardTitle>
            <p class="text-center text-muted-foreground text-sm">
                Enter your credentials to access your food bank dashboard
            </p>
        </CardHeader>
        <CardContent>
            <form method="POST" class="space-y-4">
                <div class="space-y-2">
                    <label
                        for="email"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@foodbank.org"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="password"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                    />
                </div>

                {#if form?.missing}
                    <div
                        class="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm text-center"
                    >
                        Please fill in all fields.
                    </div>
                {/if}
                {#if form?.invalid}
                    <div
                        class="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm text-center"
                    >
                        Invalid email or password.
                    </div>
                {/if}

                <Button type="submit" class="w-full">Log In</Button>
            </form>

            <div class="mt-6 text-center text-sm">
                <span class="text-muted-foreground">New here?</span>
                <a
                    href="/register"
                    class="font-medium text-primary hover:underline ml-1"
                >
                    Register your Food Bank
                </a>
            </div>
        </CardContent>
    </Card>
</div>
