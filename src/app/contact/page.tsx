import Link from "next/link";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ dahlia?: string }>;
}) {
  const params = await searchParams;
  const dahliaSlug = params.dahlia ?? undefined;

  let dahliaName: string | undefined;
  if (dahliaSlug) {
    const dahlia = await prisma.dahlia.findUnique({
      where: { slug: dahliaSlug },
      select: { name: true },
    });
    dahliaName = dahlia?.name;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-xl px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to dahlias
        </Link>

        <h1 className="font-serif text-3xl font-bold">Message Dorrie</h1>
        <p className="mt-2 text-muted-foreground">
          Send a message to request flowers. Include your preferred delivery method.
        </p>

        <ContactForm dahliaSlug={dahliaSlug} dahliaName={dahliaName} />
      </div>
    </div>
  );
}
