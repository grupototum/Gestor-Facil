import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus, Search, MapPin, Phone } from "lucide-react";
import { useCustomers, useCreateCustomer } from "@/hooks/useData";
import type { CustomerType } from "@/types";
import { useState } from "react";
import { brl } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/clientes/")({
  head: () => ({ meta: [{ title: "Clientes · CampoOS" }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const { data: customers = [] } = useCustomers();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"todos" | CustomerType>("todos");

  const filtered = customers.filter((c) => {
    const matchSearch = (c.name + c.neighborhood + c.phone).toLowerCase().includes(search.toLowerCase());
    const matchType = type === "todos" || c.type === type;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Sua base completa de contatos e histórico."
        icon={Users}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" /> Novo cliente
              </Button>
            </DialogTrigger>
            <NewCustomerDialog />
          </Dialog>
        }
      />

      <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou bairro"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="Residencial">Residencial</SelectItem>
            <SelectItem value="Empresa">Empresa</SelectItem>
            <SelectItem value="Imobiliária">Imobiliária</SelectItem>
            <SelectItem value="Condomínio">Condomínio</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((c) => (
          <Link key={c.id} to="/clientes/$id" params={{ id: c.id }}>
            <Card className="space-y-3 p-4 transition hover:border-primary/40">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.origin}</p>
                </div>
                <StatusBadge>{c.type}</StatusBadge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" />{c.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{c.neighborhood}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">{c.serviceCount} serviços</span>
                <span className="font-semibold text-foreground">{brl(c.totalSpent)} total</span>
              </div>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full p-8 text-center text-sm text-muted-foreground">Nenhum cliente encontrado.</Card>
        )}
      </div>
    </div>
  );
}

function NewCustomerDialog() {
  const create = useCreateCustomer();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [type, setType] = useState<CustomerType>("Residencial");

  const handleSave = () => {
    if (!name || !phone || !neighborhood) {
      toast.error("Preencha nome, telefone e bairro");
      return;
    }
    create.mutate({ name, phone, whatsapp: whatsapp || phone, neighborhood, type, origin: "Outro" }, {
      onSuccess: () => { toast.success("Cliente salvo"); setName(""); setPhone(""); setWhatsapp(""); setNeighborhood(""); },
      onError: () => toast.error("Erro ao salvar cliente"),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo cliente</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5"><Label>Nome</Label><Input placeholder="Nome do cliente" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5"><Label>WhatsApp</Label><Input placeholder="(11) 9..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Bairro</Label><Input placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} /></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5"><Label>Telefone</Label><Input placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as CustomerType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Residencial">Residencial</SelectItem>
                <SelectItem value="Empresa">Empresa</SelectItem>
                <SelectItem value="Imobiliária">Imobiliária</SelectItem>
                <SelectItem value="Condomínio">Condomínio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSave} disabled={create.isPending}>Salvar cliente</Button>
      </DialogFooter>
    </DialogContent>
  );
}
