'use client'

import {Controller, useForm} from 'react-hook-form'
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { createHousehold } from "@/actions/household";
import { House } from 'lucide-react';
import { Button } from "../ui/button";
import { useState } from 'react';
import AlertDestructive from '../ui/AlertDestructive';
import { MapPin } from 'lucide-react';
import { EMOJI_OPTIONS } from '@/lib/constants';

const householdSchema = z.object({
  name: z.string().min(2,"Name has to be at least 2 characters long"),
  address: z.string().min(5, 'Please enter a valid address'),
  emoji: z.string().min(1,"Please pick an emoji!")
}
)

const HouseholdCreationForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof householdSchema>>({
        resolver: zodResolver(householdSchema),
        defaultValues: { name: '', emoji: '🏠', address: '' },
        mode: 'onChange'
    })

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof householdSchema>) => {
        const result = await createHousehold(data.name, data.address, data.emoji);
        if(!result.success) {
            setServerError(result.error);
            return;
        }
        onSuccess();
        router.refresh();
    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup>
                    <Controller
                        name="emoji"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Pick an icon</FieldLabel>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJI_OPTIONS.map(({ emoji, background }) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => field.onChange(emoji)}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition
                                                ${field.value === emoji ? 'ring-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'}`}
                                            style={{ backgroundColor: background }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        )}
                    />
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-name">
                                Household name *
                            </FieldLabel>
                            <div className='relative'>
                                <House className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18}/>
                                <Input
                                {...field}
                                id="form-name"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Dar m9am"
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
                        name="address"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-address">
                                Address *
                            </FieldLabel>
                            <div className='relative'>
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18}/>
                                <Input
                                {...field}
                                id="form-address"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Zok 3abla"
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
                    <Button size="lg" type="submit" disabled={!form.formState.isValid} className="w-full text-base">+ Create Household</Button>
                </div>
            </form>
            {serverError && <AlertDestructive errorMessage={serverError}/>}
        </div>
    )
}

export default HouseholdCreationForm;