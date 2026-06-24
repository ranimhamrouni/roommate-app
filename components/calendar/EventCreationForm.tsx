'use client'

import { useState } from 'react';

import { Controller, useForm }
from 'react-hook-form';

import * as z from 'zod';

import { zodResolver }
from '@hookform/resolvers/zod';

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from '@/components/ui/field';

import { Input }
from '@/components/ui/input';

import { Button }
from '@/components/ui/button';

import AlertDestructive
from '../ui/AlertDestructive';

import { createEvent }
from '@/actions/calendar';

const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  date: z.string().min(1),
  time: z.string().min(1),
});

const EventCreationForm = ({
    householdId,
    onSuccess,
    onEventAdded
}: {
    householdId: string;
    onSuccess: () => void;
    onEventAdded?: (event: any) => void;
}) => {

    const [serverError, setServerError] =
        useState<string | null>(null);

    const form =
        useForm<z.infer<typeof eventSchema>>({
            resolver:
                zodResolver(eventSchema),

            defaultValues: {
                title: '',
                description: '',
                date: '',
                time: ''
            },

            mode: 'onChange'
        });

    const onSubmit = async (
        data: z.infer<typeof eventSchema>
    ) => {

        const result =
            await createEvent(
                householdId,
                data.title,
                data.description ?? '',
                new Date(data.date),
                data.time
            );

        if (!result.success) {
            setServerError(result.error);
            return;
        }

        onEventAdded?.(result.event);

        onSuccess();
    };

    return (

        <div>

            <form
                onSubmit={
                    form.handleSubmit(onSubmit)
                }
                className='space-y-6'
            >

                <FieldGroup>

                    <Controller
                        name='title'
                        control={form.control}
                        render={({
                            field,
                            fieldState
                        }) => (

                            <Field
                                data-invalid={
                                    fieldState.invalid
                                }
                            >

                                <FieldLabel>
                                    Title
                                </FieldLabel>

                                <Input
                                    {...field}
                                    className='bg-[#F5F0E6]
                                    border-none rounded-2xl'
                                />

                                {fieldState.invalid &&
                                    <FieldError
                                        errors={[
                                            fieldState.error
                                        ]}
                                    />
                                }

                            </Field>

                        )}
                    />

                    <Controller
                        name='description'
                        control={form.control}
                        render={({ field }) => (

                            <Field>

                                <FieldLabel>
                                    Description
                                </FieldLabel>

                                <Input
                                    {...field}
                                    className='bg-[#F5F0E6]
                                    border-none rounded-2xl'
                                />

                            </Field>

                        )}
                    />

                    <Controller
                        name='date'
                        control={form.control}
                        render={({ field }) => (

                            <Field>

                                <FieldLabel>
                                    Date
                                </FieldLabel>

                                <Input
                                    {...field}
                                    type='date'
                                    className='bg-[#F5F0E6]
                                    border-none rounded-2xl'
                                />

                            </Field>

                        )}
                    />

                    <Controller
                        name='time'
                        control={form.control}
                        render={({ field }) => (

                            <Field>

                                <FieldLabel>
                                    Time
                                </FieldLabel>

                                <Input
                                    {...field}
                                    type='time'
                                    className='bg-[#F5F0E6]
                                    border-none rounded-2xl'
                                />

                            </Field>

                        )}
                    />

                </FieldGroup>

                <Button
                    className='w-full'
                    disabled={
                        !form.formState.isValid
                    }
                >
                    Add Event
                </Button>

            </form>

            {serverError &&
                <AlertDestructive
                    errorMessage={serverError}
                />
            }

        </div>
    );
};

export default EventCreationForm;