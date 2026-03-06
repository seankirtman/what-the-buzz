import { DahliaForm } from "@/components/dahlia-form";

export default function NewDahliaPage() {
  return (
    <div className="min-h-screen bg-sage-50/30">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 font-serif text-2xl font-bold">Add New Dahlia</h1>
        <DahliaForm />
      </div>
    </div>
  );
}
