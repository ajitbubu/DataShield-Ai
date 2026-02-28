import { Metadata } from "next";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Login",
  description: "Login placeholder for DataPrivacy Shield"
};

export default function LoginPage() {
  return (
    <section className="py-14 lg:py-20">
      <Container className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-text">Login</h1>
        <p className="mt-4 text-muted">Authentication portal placeholder.</p>
      </Container>
    </section>
  );
}
