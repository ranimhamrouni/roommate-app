'use client'

import {Controller, useForm} from 'react-hook-form'
import { Input } from "../ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { createItem } from "@/actions/shopping";
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
  type: z.enum(['staple', 'shared expense']),
  quantity: z.string().min(1,"Quantity can't be empty")
}
)

const ItemCreationForm = ({ householdId, onSuccess, onItemAdded }: { householdId: string, onSuccess: () => void, onItemAdded?: (item: any) => void }) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof itemSchema>>({
        resolver: zodResolver(itemSchema),
        defaultValues: { name: '', type: 'staple', quantity: '' },
        mode: 'onChange'
    })

    const onSubmit = async (data: z.infer<typeof itemSchema>) => {
        const result = await createItem(householdId, data.name, data.type, data.quantity);
        if(!result.success) {
            setServerError(result.error);
            return;
        }

        onItemAdded?.(result.item);
        onSuccess();
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
                                placeholder="Hlib"
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
                        name="quantity"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-quantity">
                                Quantity
                            </FieldLabel>
                            <div className='relative'>
                                <Input
                                {...field}
                                id="form-quantity"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Bakou"
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
                        name="type"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-frequency">
                                Type
                            </FieldLabel>
                            <div className='relative'>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a frequency" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white">
                                        <SelectItem value='staple'>Staple</SelectItem>
                                        <SelectItem value='shared expense'>Shared Expense</SelectItem>
                                    </SelectContent>
                                </Select>
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