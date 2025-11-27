import { Hero } from "@/components/hero";

export default function HomePage() {
  return (
    <Hero
      title="Welcome to Syntory"
      subtitle="Sync Every Item, Simplify Every Supply"
      actions={[
        {
          label: "Login",
          href: "/auth/login",
          variant: "default",
        },
        {
          label: "Sign Up",
          href: "/auth/register",
          variant: "outline",
        },
      ]}
    />
  );
}
