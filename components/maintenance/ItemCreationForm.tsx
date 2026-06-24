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
import { createItem } from "@/actions/maintenance";
import { Button } from "../ui/button";
import { useState } from 'react';
import AlertDestructive from '../ui/AlertDestructive';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const itemSchema = z.object({
  name: z.string().min(2,"Name has to be at least 2 characters long"),
  description: z.string().min(2,"Description has to be at least 2 characters long"),
}
)

const ItemCreationForm = ({ householdId, onSuccess }: { householdId: string, onSuccess: () => void }) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema),
        defaultValues: { name: '', description: '' },
        mode: 'onChange'
    })

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof itemSchema>) => {
        const result = await createItem(householdId, data.name, data.description);
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
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-name">
                                Name
                            </FieldLabel>
                            <div className='relative'>
                                <Input
                                {...field}
                                id="form-name"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Salah sabelet l koujina"
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
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-description">
                                Description
                            </FieldLabel>
                            <div className='relative'>
                                <Input
                                {...field}
                                id="form-description"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Fiha fuite"
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
                    <Button size="lg" type="submit" disabled={!form.formState.isValid} className="w-full text-base">+ Add Item</Button>
                </div>
            </form>
            {serverError && <AlertDestructive errorMessage={serverError}/>}
        </div>
    )
}

export default ItemCreationForm;