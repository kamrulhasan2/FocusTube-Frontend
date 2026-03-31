import { AvatarUpload } from "@/features/profile/components/AvatarUpload";
import { PasswordSettings } from "@/features/profile/components/PasswordSettings";
import { ProfileSettings } from "@/features/profile/components/ProfileSettings";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="text-sm text-slate-400">
          Manage your public details, security, and profile media.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <ProfileSettings />
          <PasswordSettings />
        </div>
        <div className="space-y-6">
          <AvatarUpload />
        </div>
      </div>
    </div>
  );
}
