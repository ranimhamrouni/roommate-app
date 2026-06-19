'use client'

import { getHouseholdIdByInviteCode, joinHousehold } from "@/actions/household"
import { Card } from "../ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Field,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { SquareArrowRightEnter } from 'lucide-react';

const inviteCodeSchema = z.object({
  inviteCode: z
    .string()
    .length(6,'The invite code is 6 characters long')
})

const JoinHouseholdBanner =  () => {
    const [serverError, setServerError] = useState('');
    const form = useForm<z.infer<typeof inviteCodeSchema>>({
        resolver: zodResolver(inviteCodeSchema),
        defaultValues: { inviteCode: '' },
        mode: 'onChange'
    })
    const router = useRouter();
    async function onSubmit(data: z.infer<typeof inviteCodeSchema>) {
        const result = await joinHousehold(data.inviteCode);
        if(!result.success) {
            setServerError(result.error);
            return
        }
        const id = await getHouseholdIdByInviteCode(data.inviteCode)
        router.push(`/household/${id}`);
        router.refresh();

        
  }
  return (
    <Card className="col-span-2 w-full min-h-[140px] bg-[#C8E8FA] rounded-[28px] flex flex-col md:flex-row items-center justify-between p-8 gap-6 mt-10 relative group">
        <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 text-[#0A4870]">🔗 Got an invite code?</h3>
            <p className="text-sm text-[#0A4870]">Your roommate can share a code from their household dashboard.</p>
        </div>
        <div className="flex-1">
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row items-center gap-3 justify-end">
                <Controller
                    name="inviteCode"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="w-[180px]">
                            <Input
                                {...field}
                                id="form-invite-code"
                                aria-invalid={fieldState.invalid}
                                placeholder="ROOMIE-XXXXXX"
                                autoComplete="off"
                                className="w-full bg-white/60 text-[#0A4870] border-none rounded-2xl h-12 px-4 placeholder:text-[#0A4870]/60"
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
                <Button
                    size="lg"
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="bg-[#0A4870] text-white hover:bg-[#083b5a]"
                >
                    <SquareArrowRightEnter className="mr-2" />
                    Join
                </Button>
            </form>
            {serverError ? <div className="mt-3 text-sm text-destructive">{serverError}</div> : null}
        </div>
    </Card>
  )
}

export default JoinHouseholdBanner
