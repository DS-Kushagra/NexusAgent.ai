"use client";

import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, UserPlus } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, "Please enter at least 3 characters.")
        : z.string().optional(),
    email: z.string().email("Enter a valid email address."),
    // Firebase itself rejects anything under 6 characters, so validating at 3
    // only pushed the failure to the server and surfaced it as a raw error.
    password: z.string().min(6, "Password must be at least 6 characters."),
  });
};

// Firebase error codes are not something to show a person as-is.
const friendlyError = (error: unknown): string => {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/weak-password":
      return "Please choose a stronger password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network problem. Check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSignIn = type === "sign-in";
  // Deliberately not form.formState.isSubmitting: that clears as soon as
  // onSubmit returns, which happens while router.push is still navigating -
  // so the spinner would disappear exactly during the longest wait.
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsPending(true);

    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          setIsPending(false);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in failed. Please try again.");
          setIsPending(false);
          return;
        }

        await signIn({ email, idToken });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(friendlyError(error));
      setIsPending(false);
    }
    // On success the loader stays up: this component unmounts on navigation.
  };

  return (
    <div className="auth-form-container animate-form-appear lg:min-w-[460px]">
      {/* A single hairline highlight along the top edge, in place of the four
          pulsing blur orbs and particle dots that used to sit here. */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/40 to-transparent" />

      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="" height={32} width={38} />
            <span className="text-2xl font-bold tracking-tight text-white">
              NexusAgent
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-white">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-light-100/70">
              {isSignIn
                ? "Sign in to continue practising."
                : "Start practising interviews with AI."}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your full name"
                type="text"
                autoComplete="name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder={
                isSignIn ? "Enter your password" : "At least 6 characters"
              }
              type="password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
            />

            {isSignIn && (
              <div className="-mt-1 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-200 transition-colors hover:text-primary-100 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            <Button
              className="mt-1 w-full rounded-xl"
              type="submit"
              variant="premium"
              size="xl"
              disabled={isPending}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </>
                ) : isSignIn ? (
                  <>
                    Sign In
                    <ArrowRight className="size-4" />
                  </>
                ) : (
                  <>
                    Create an Account
                    <UserPlus className="size-4" />
                  </>
                )}
              </span>
            </Button>
          </form>
        </Form>

        <div className="h-px bg-light-800/60" />

        <p className="text-center text-sm text-light-100/70">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="ml-1.5 font-semibold text-primary-200 transition-colors hover:text-primary-100 hover:underline"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
