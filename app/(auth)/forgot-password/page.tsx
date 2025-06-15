"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent. Check your inbox.");
      router.push("/sign-in");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="card-border lg:min-w-[566px] mx-auto">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">NexusAgent</h2>
        </div>

        <h3 className="text-center">Reset your password</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <Button className="btn" type="submit">
              Send reset email
            </Button>
          </form>
        </Form>

        <p className="text-center">
          <Link
            href="/sign-in"
            className="font-medium text-primary-500 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
