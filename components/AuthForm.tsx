"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

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
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";
  return (
    <div className="auth-form-container backdrop-blur-lg bg-dark-100/40 border border-gray-800/50 rounded-2xl shadow-2xl lg:min-w-[500px] animate-form-appear hover:shadow-primary-200/10 transition-all duration-500">
      <div className="flex flex-col gap-7 p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-40 h-40 bg-primary-200/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>

        {/* Interactive particle elements */}
        <div className="absolute top-1/4 right-10 w-1.5 h-1.5 bg-primary-200/40 rounded-full animate-float"></div>
        <div
          className="absolute bottom-1/3 left-12 w-1 h-1 bg-blue-400/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-3/4 right-16 w-2 h-2 bg-primary-200/20 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Logo with enhanced effect */}
        <div
          className="flex items-center justify-center gap-3 mb-2 animate-slide-down"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-200/30 to-blue-500/30 blur-lg rounded-full group-hover:blur-xl transition-all duration-700"></div>
            <Image
              src="/logo.svg"
              alt="logo"
              height={36}
              width={42}
              className="relative z-10 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent animate-gradient-x">
            NexusAgent
          </h2>
        </div>

        <h3
          className="text-center text-white text-xl font-medium mb-2 animate-slide-down"
          style={{ animationDelay: "0.3s" }}
        >
          Practice job interviews with AI
        </h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 mt-2 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your full name"
                type="text"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            {isSignIn && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary-200 hover:text-primary-100 transition-colors hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            )}{" "}
            <Button
              className="auth-button w-full mt-4 py-6 rounded-xl"
              type="submit"
              variant="premium"
              size="xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSignIn ? (
                  <>
                    Sign In
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                    </svg>
                  </>
                ) : (
                  <>
                    Create an Account
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </>
                )}
              </span>
            </Button>
          </form>
        </Form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-700/50"></div>
          <span className="flex-shrink mx-3 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-700/50"></div>
        </div>

        <p className="text-center text-gray-300">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-primary-200 hover:text-primary-100 transition-colors ml-2 hover:underline"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
