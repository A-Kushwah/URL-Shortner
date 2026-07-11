import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-1">Create your account</h1>
      <p className="text-ink/60 mb-8 text-sm">
        Already have one?{" "}
        <Link href="/login" className="text-moss underline underline-offset-2">
          Log in
        </Link>
      </p>
      <AuthForm mode="signup" />
    </div>
  );
}
