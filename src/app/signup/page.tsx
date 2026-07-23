import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      <AuthForm mode="signup" />
    </div>
  );
}
