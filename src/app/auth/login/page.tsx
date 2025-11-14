import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black p-4">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        <LoginForm />
      </div>
    </div>
  );
}
