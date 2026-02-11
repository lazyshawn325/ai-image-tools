"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <Container className="py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground mb-6">
          {t("title")}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t("description")}
        </p>
        <Link href="/">
          <Button size="lg">
            <Home className="w-4 h-4 mr-2" />
            {t("back_home")}
          </Button>
        </Link>
      </div>
    </Container>
  );
}
