import Link from "next/link";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-1">Log in</h1>
      <p className="text-ink/60 mb-8 text-sm">
        No account?{" "}
        <Link href="/signup" className="text-moss underline underline-offset-2">
          Sign up
        </Link>
      </p>
      <AuthForm mode="login" />
    </div>
  );
}
