import { UserProfileSettings } from "@/components/auth/UserProfileSettings"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      <UserProfileSettings />
    </div>
  )
}

