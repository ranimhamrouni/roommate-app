"use client"
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import AlertDestructive from '../ui/AlertDestructive'
import { User } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {register} from '@/actions/auth';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2,"Name has to be at least 2 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(8,"Password needs to be at least 8 characters long")
})


const RegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const router = useRouter();
    async function onSubmit(data: z.infer<typeof registerSchema>){
        const result = await register(data);
        if(!result.success) {
            setServerError(result.error);
            return;
        }
        router.push('/home');
        router.refresh();
    }

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
        name: "",
        email: "",
        password: "",
        },
        mode: 'onChange'
    })

  return (
    <div>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-name">
                    Name
                  </FieldLabel>
                  <div className='relative'>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        {...field}
                        id="form-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Flen El Fouleni"
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
            <div className="flex flex-col items-center gap-6 mt-6 w-full">
                <Button size="lg" type="submit" disabled={!form.formState.isValid} className="w-full text-base">Sign in</Button>
                <Link 
                    href="/login" 
                    className="text-sm text-center text-muted-foreground hover:underline">
                    Already have an account? Login
                </Link>
            </div>
        </form>
        <div className="mt-4">
            {serverError && <AlertDestructive errorMessage={serverError}/>}
        </div>
    </div>
  )
}

export default RegisterForm
