<script>
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        Button,
        Input,
        Textarea,
    } from "$lib/components/ui";
    export let form;
</script>

<div
    class="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-8"
>
    <Card class="w-full max-w-lg shadow-lg">
        <CardHeader class="space-y-1">
            <CardTitle class="text-3xl font-bold text-center"
                >Join the Network</CardTitle
            >
            <p class="text-center text-muted-foreground text-sm">
                Register your food bank to start exchanging surplus items
            </p>
        </CardHeader>
        <CardContent>
            <form method="POST" class="space-y-4">
                <div class="space-y-2">
                    <label for="name" class="text-sm font-medium leading-none">
                        Organization Name
                    </label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Food Bank North"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label for="email" class="text-sm font-medium leading-none">
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="contact@example.org"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="password"
                        class="text-sm font-medium leading-none"
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

                <div class="space-y-2">
                    <label
                        for="address"
                        class="text-sm font-medium leading-none"
                    >
                        Address
                    </label>
                    <Textarea
                        id="address"
                        name="address"
                        placeholder="123 High St, London..."
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label
                        for="contact_info"
                        class="text-sm font-medium leading-none"
                    >
                        Contact Info (Phone/Link)
                    </label>
                    <Input
                        id="contact_info"
                        name="contact_info"
                        type="text"
                        placeholder="+44 7700 900000"
                    />
                </div>

                {#if form?.missing}
                    <div
                        class="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm text-center"
                    >
                        Please fill in all fields.
                    </div>
                {/if}
                {#if form?.emailExists}
                    <div
                        class="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm text-center"
                    >
                        Email already registered.
                    </div>
                {/if}

                <Button type="submit" class="w-full">Create Account</Button>
            </form>

            <div class="mt-6 text-center text-sm">
                <span class="text-muted-foreground"
                    >Already have an account?</span
                >
                <a
                    href="/login"
                    class="font-medium text-primary hover:underline ml-1"
                >
                    Log in
                </a>
            </div>
        </CardContent>
    </Card>
</div>
