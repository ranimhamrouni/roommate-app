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
import { createChore } from "@/actions/chores";
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
import { PopulatedHouseholdMember } from '@/actions/householdMember';

const frequencies = ['Once','Daily','Weekly','Biweekly','Monthly'] as const;

const choreSchema = z.object({
  title: z.string().min(2,"Title has to be at least 2 characters long"),
  description: z.string(),
  frequency: z.enum(frequencies),
  assignedTo: z.string().min(1,"Name to be at least 2 characters long"),
}
)

const ChoreCreationForm = ({ householdId, members, onSuccess }: { householdId: string, members: PopulatedHouseholdMember[], onSuccess: () => void }) => {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof choreSchema>>({
        resolver: zodResolver(choreSchema),
        defaultValues: { title: '', description: '', frequency: 'Once', assignedTo: '' },
        mode: 'onChange'
    })

    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof choreSchema>) => {
        const result = await createChore(householdId, data.title, data.description, data.frequency, data.assignedTo);
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
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-title">
                                Chore Title
                            </FieldLabel>
                            <div className='relative'>
                                <Input
                                {...field}
                                id="form-title"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Habat l zebla"
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
                                Chore Description
                            </FieldLabel>
                            <div className='relative'>
                                <Input
                                {...field}
                                id="form-description"
                                type="text"
                                aria-invalid={fieldState.invalid}
                                placeholder="Habatha fesbeh"
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
                        name="frequency"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-frequency">
                                Chore Frequency
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
                                        {frequencies.map(frequency => <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="assignedTo"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-address">
                                Assigned To
                            </FieldLabel>
                            <div className='relative'>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a roommate"/>
                                        </SelectTrigger>

                                        <SelectContent className="bg-white">
                                            {members.map(member=><SelectItem key={member.userId._id} value={member.userId._id}>{member.userId.name}</SelectItem>)}
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
                    <Button size="lg" type="submit" disabled={!form.formState.isValid} className="w-full text-base">+ Add Chore</Button>
                </div>
            </form>
            {serverError && <AlertDestructive errorMessage={serverError}/>}
        </div>
    )
}

export default ChoreCreationForm;