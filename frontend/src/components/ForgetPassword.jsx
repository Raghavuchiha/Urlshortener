import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "./api";

function Field({ icon: Icon, error, ...props }) {
  return (
    <div>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          {...props}
          className={`w-full pl-9 pr-3 py-2.5 rounded-md border text-sm bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:bg-white focus:border-neutral-900 ${
            error ? "border-red-400" : "border-neutral-200"
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>

          <h2 className="text-xl font-semibold text-neutral-900">
            Forgot your password?
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Enter your email and we'll send you a reset link.
          </p>

          {sent ? (
            <div className="mt-6 flex items-start gap-2 p-4 rounded-md bg-neutral-50 border border-neutral-200">
              <CheckCircle2 size={18} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-neutral-600">
                If an account exists for <span className="font-medium">{email}</span>,
                a reset link is on its way. Check your inbox (and spam).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Field
                icon={Mail}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Sending..." : (
                  <>
                    Send reset link
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}