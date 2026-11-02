"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubirMedio } from "./subir-medio";

export function BotonSubir() {
  const [abierto, setAbierto] = useState(false);
  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>
          <Upload aria-hidden />
          Subir archivo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subir archivo</DialogTitle>
          <DialogDescription>
            Quedará disponible para noticias, puestos y contenido del sitio.
          </DialogDescription>
        </DialogHeader>
        <SubirMedio onSubido={() => setAbierto(false)} />
      </DialogContent>
    </Dialog>
  );
}
