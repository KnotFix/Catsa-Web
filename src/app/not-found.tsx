import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NoEncontrada() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-7 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.16em] text-catsa-green uppercase">Error 404</p>
      <h1 className="mt-3 text-3xl text-catsa-ink">No encontramos esta página</h1>
      <p className="mt-3 text-catsa-body">Puede que se haya movido o que el enlace esté incompleto.</p>
      <Button asChild className="mt-8">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  );
}
