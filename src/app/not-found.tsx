import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground mb-6">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button size="lg">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </Container>
  );
}
