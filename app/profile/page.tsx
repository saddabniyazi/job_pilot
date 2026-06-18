import { cookies, headers } from "next/headers";
import createInsforgeServer from "../../lib/insforge-server";
import dynamic from "next/dynamic";

const ProfileViewTracker = dynamic(() => import("./ProfileViewTracker"), { ssr: false });

export default async function ProfilePage() {
  const hdrs = headers();
  const cookieHeader = hdrs.get("cookie") ?? undefined;
  const insforge = createInsforgeServer({ cookies: cookieHeader });
  const { data } = await insforge.auth.getUser();
  const user = data?.user;

  if (!user) {
    return (
      <div className="mx-auto max-w-xl py-24">
        <p className="text-lg">No user found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl py-24">
      <ProfileViewTracker />
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="mt-6 space-y-3">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>
    </div>
  );
}
