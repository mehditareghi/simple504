import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default async function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/courses");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium text-foreground"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-foreground"
                  htmlFor="password"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <SubmitButton
                formAction={signIn}
                pendingText="Signing In..."
                className="w-full"
              >
                Sign In
              </SubmitButton>
              <SubmitButton
                formAction={signUp}
                variant="outline"
                pendingText="Signing Up..."
                className="w-full"
              >
                Sign Up
              </SubmitButton>
            </div>
          </form>
        </CardContent>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </Card>
    </div>
  );
}
