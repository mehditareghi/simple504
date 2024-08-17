import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, User, LogOut } from "lucide-react";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer w-8 h-8 bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
            <span className="text-white text-sm">
              {user.email.charAt(0).toUpperCase()}
            </span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {user.user_metadata.role && user.user_metadata.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin-dashboard" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <form action={signOut}>
              <button className="flex items-center gap-2 w-full text-left">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
