import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

export default function AlertDestructive({errorMessage}: {errorMessage: string | null}) {
    if(!errorMessage) return;
    return (
        <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
            {errorMessage}
        </AlertDescription>
        </Alert>
    )
}