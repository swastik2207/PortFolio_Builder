// src/app/sign-in/[[...sign-in]]/page.tsx
'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn
                signUpUrl="/sign-up"
                afterSignInUrl="/dashboard"
            />
        </div>
    )
}
