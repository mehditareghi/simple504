import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="mb-4 w-24 h-24 bg-blue-500 flex items-center justify-center">
            <span className="text-white text-3xl">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-gray-800">
            {user.email}
          </CardTitle>
          <CardDescription className="text-gray-500">
            Welcome back! Here's your profile.
          </CardDescription>
          <Button variant="outline" className="mt-4">
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Account Info
            </h2>
            <Separator className="my-3" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <Badge>{user.email}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <Badge>{user.id}</Badge>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Settings</h2>
            <Separator className="my-3" />
            <Button variant="ghost" className="w-full">
              Manage Account
            </Button>
            <Button variant="ghost" className="w-full mt-2">
              Privacy Settings
            </Button>
            <form action={signOut}>
              <Button variant="ghost" className="w-full mt-2">
                Sign Out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
