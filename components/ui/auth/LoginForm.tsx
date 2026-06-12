'use client'

import * as z from "zod"
import {Controller, useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {login} from '@/actions/auth'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useState} from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { Mail } from 'lucide-react'
import { Lock } from 'lucide-react'

const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

function AlertDestructive({errorMessage}: {errorMessage: string | null}) {
    return (
        <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Login failed</AlertTitle>
        <AlertDescription>
            {errorMessage}
        </AlertDescription>
        </Alert>
    )
}

const LoginForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
        mode: 'onChange'
    })

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        const result = await login(data);
        if(!result.success) {
            setServerError(result.error);
            return;
        }
        router.push('/home');
        router.refresh();
    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-email">
                                Email
                            </FieldLabel>
                            <div className='relative'>
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18}/>
                                <Input
                                {...field}
                                id="form-email"
                                type="email"
                                aria-invalid={fieldState.invalid}
                                placeholder="flenelFouleni@gmail.com"
                                autoComplete="off"
                                className="bg-[#F5F0E6] border-none rounded-2xl h-12 px-4 pl-10"
                                />
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-password">
                                Password
                            </FieldLabel>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18}/>
                                <Input
                                {...field}
                                id="form-password"
                                type="password"
                                aria-invalid={fieldState.invalid}
                                placeholder="foulen123"
                                autoComplete="off"
                                className="bg-[#F5F0E6] border-none rounded-2xl h-12 px-4 pl-10"
                                />
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex flex-col items-center gap-3 w-full">
                    <Button size="lg" type="submit" disabled={!form.formState.isValid} className="w-full text-base">Login</Button>
                    <Link 
                        href="/register" 
                        className="text-sm text-center text-muted-foreground hover:underline">
                        Don't have an account? Register
                    </Link>
                </div>
            </form>
            {serverError && <AlertDestructive errorMessage={serverError}/>}
        </div>
    )
}



export default LoginForm
