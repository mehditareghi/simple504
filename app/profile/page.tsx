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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import {
  UserIcon,
  CalendarIcon,
  MailIcon,
  LogOutIcon,
  SettingsIcon,
  ShieldIcon,
  UserCheckIcon,
  UserPlusIcon,
} from "lucide-react";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: userInfo, error: userInfoError } = await supabase
    .from("users")
    .select("email, first_name, last_name, username, birthdate")
    .eq("id", user.id)
    .single();
  if (userInfoError) {
    console.error("Error fetching user info:", userInfoError);
    return;
  }

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  const updateUserInfo = async (formData) => {
    "use server";
    const supabase = createClient();
    const { first_name, last_name, username, birthdate } = formData;
    const { error } = await supabase
      .from("users")
      .update({ first_name, last_name, username, birthdate })
      .eq("id", user.id);
    if (error) {
      console.error("Error updating user info:", error);
      return;
    }
    redirect("/profile");
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <Card className="w-full max-w-4xl p-6">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="mb-4 w-24 h-24 bg-primary-9 flex items-center justify-center rounded-full shadow-lg">
            <span className="text-black text-3xl">
              {userInfo.first_name?.charAt(0).toUpperCase() ||
                userInfo.email.charAt(0).toUpperCase()}
            </span>
          </Avatar>
          <CardTitle className="text-4xl font-bold text-slate-800 dark:text-slate-100">
            Welcome back, {userInfo.first_name || userInfo.email}!
          </CardTitle>
          <CardDescription className="text-gray-500 mt-2">
            Here's your profile overview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-6">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
            Account Information
          </h2>
          <Separator className="my-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <MailIcon className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="font-medium">Email:</span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">
                {userInfo.email}
              </span>
            </div>
            <div className="flex items-center">
              <UserCheckIcon className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="font-medium">Username:</span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">
                {userInfo.username || (
                  <em className="text-slate-400">Not set</em>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <UserPlusIcon className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="font-medium">First Name:</span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">
                {userInfo.first_name || (
                  <em className="text-slate-400">Not set</em>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="font-medium">Last Name:</span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">
                {userInfo.last_name || (
                  <em className="text-slate-400">Not set</em>
                )}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-300" />
              <span className="font-medium">Birthdate:</span>
              <span className="ml-auto text-slate-800 dark:text-slate-200">
                {userInfo.birthdate || (
                  <em className="text-slate-400">Not set</em>
                )}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <EditProfileDialog userInfo={userInfo} onSave={updateUserInfo} />
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
              Settings
            </h2>
            <Separator className="my-3" />
            <div className="space-y-2">
              <Button variant="ghost" className="w-full flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                Manage Account
              </Button>
              <Button variant="ghost" className="w-full flex items-center">
                <ShieldIcon className="mr-2 h-5 w-5" />
                Privacy Settings
              </Button>
              <form action={signOut}>
                <Button variant="ghost" className="w-full flex items-center">
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
