import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayments, useExpenses, useQuotes, useCustomers, useCreateExpense, useUpdateExpense, useDeleteExpense } from "@/hooks/useData";
import { brl, dateBR } from "@/lib/format";
import { Wallet, TrendingUp, TrendingDown, BadgeDollarSign, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro · CampoOS" }] }),
  component: Financeiro,
});

function Financeiro() {
  const { data: payments = [] } = usePayments();
  const { data: expenses = [] } = useExpenses();
  const { data: quotes = [] } = useQuotes();
  const { data: customers = [] } = useCustomers();
  const findCustomer = (id?: string) => customers.find((c) => c.id === id);

  const totalIn = payments.reduce((s, p) => s + p.amount, 0);
  const totalOut = expenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalIn - totalOut;
  const ticket = totalIn / Math.max(payments.length, 1);
  const approved = quotes.filter((q) => q.status === "Aprovado" || q.status === "Convertido em OS").length;
  const refused = quotes.filter((q) => q.status === "Recusado").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" icon={Wallet} description="Visão simples de entradas, saídas e lucro." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Faturamento" value={brl(totalIn)} icon={TrendingUp} tone="success" />
        <StatCard label="Despesas" value={brl(totalOut)} icon={TrendingDown} tone="destructive" />
        <StatCard label="Lucro" value={brl(profit)} icon={BadgeDollarSign} tone="info" />
        <StatCard label="Ticket médio" value={brl(ticket)} icon={Wallet} />
      </div>
      <Card className="p-4 text-sm">
        <p className="font-semibold">Orçamentos aprovados vs recusados</p>
        <p className="mt-1 text-muted-foreground">{approved} aprovados · {refused} recusados</p>
      </Card>
      <Tabs defaultValue="in">
        <TabsList className="grid grid-cols-2"><TabsTrigger value="in">Entradas</TabsTrigger><TabsTrigger value="out">Saídas</TabsTrigger></TabsList>
        <TabsContent value="in" className="space-y-2">
          {payments.map((p) => (
            <Card key={p.id} className="flex justify-between p-3 text-sm">
              <div><p className="font-medium">{findCustomer(p.customerId)?.name}</p><p className="text-xs text-muted-foreground">{p.method} · {dateBR(p.date)}</p></div>
              <span className="font-semibold text-success">+ {brl(p.amount)}</span>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="out" className="space-y-2">
          <div className="flex justify-end">
            <ExpenseDialog />
          </div>
          {expenses.map((e) => (
            <Card key={e.id} className="flex items-center justify-between p-3 text-sm">
              <div><p className="font-medium">{e.description}</p><p className="text-xs text-muted-foreground">{e.category} · {dateBR(e.date)}</p></div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-destructive">- {brl(e.amount)}</span>
                <ExpenseDialog expense={e} />
                <DeleteExpenseButton id={e.id} />
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExpenseDialog({ expense }: { expense?: import("@/types").Expense }) {
  const [open, setOpen] = useState(false);
  const create = useCreateExpense();
  const update = useUpdateExpense();
  const [category, setCategory] = useState(expense?.category ?? "Outros");
  const [description, setDescription] = useState(expense?.description ?? "");
  const [amount, setAmount] = useState(expense?.amount ?? 0);
  const [date, setDate] = useState(expense?.date ? expense.date.split("T")[0] : new Date().toISOString().split("T")[0]);

  const isEdit = !!expense;

  const handleSave = () => {
    if (!description || amount <= 0) {
      toast.error("Preencha descrição e valor");
      return;
    }
    const payload = { category, description, amount, date: new Date(date).toISOString() };
    if (isEdit && expense) {
      update.mutate({ ...payload, id: expense.id }, {
        onSuccess: () => { toast.success("Despesa atualizada"); setOpen(false); },
        onError: () => toast.error("Erro ao atualizar"),
      });
    } else {
      create.mutate(payload, {
        onSuccess: () => { toast.success("Despesa criada"); setOpen(false); setDescription(""); setAmount(0); },
        onError: () => toast.error("Erro ao criar"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={isEdit ? "ghost" : "default"} className={isEdit ? "h-8 w-8 p-0" : "gap-2"}>
          {isEdit ? <Pencil className="h-3.5 w-3.5" /> : <><Plus className="h-4 w-4" /> Nova despesa</>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{isEdit ? "Editar despesa" : "Nova despesa"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Combustível", "Peças", "Ferramentas", "Alimentação", "Impostos", "Outros"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Descrição</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5"><Label>Valor (R$)</Label><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div>
            <div className="space-y-1.5"><Label>Data</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={create.isPending || update.isPending}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteExpenseButton({ id }: { id: string }) {
  const del = useDeleteExpense();
  return (
    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => {
      if (confirm("Tem certeza?")) del.mutate(id, { onSuccess: () => toast.success("Despesa removida"), onError: () => toast.error("Erro ao remover") });
    }}>
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
