import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getServices,
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
  getPayments,
  createPayment,
  deletePayment,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getCompany,
  updateCompany,
  getPricing,
  updatePricing,
  getProtocols,
  getChecklists,
  getPOPs,
  getSLAs,
  getMessageTemplates,
  getReferrals,
  createReferral,
  updateReferral,
  deleteReferral,
  getFollowups,
  createFollowup,
  updateFollowup,
  deleteFollowup,
} from "@/api";

// Customers
export function useCustomers() {
  return useQuery({ queryKey: ["customers"], queryFn: () => getCustomers() });
}

export function useCustomer(id?: string) {
  return useQuery({ queryKey: ["customer", id], queryFn: () => getCustomer({ queryKey: ["customer", id] }), enabled: !!id });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createCustomer({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateCustomer({ data }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); qc.invalidateQueries({ queryKey: ["customer"] }); },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

// Services
export function useServices() {
  return useQuery({ queryKey: ["services"], queryFn: () => getServices() });
}

// Quotes
export function useQuotes() {
  return useQuery({ queryKey: ["quotes"], queryFn: () => getQuotes() });
}

export function useQuote(id?: string) {
  return useQuery({ queryKey: ["quote", id], queryFn: () => getQuote({ queryKey: ["quote", id] }), enabled: !!id });
}

export function useCreateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createQuote({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quotes"] }),
  });
}

export function useUpdateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateQuote({ data }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["quotes"] }); qc.invalidateQueries({ queryKey: ["quote"] }); },
  });
}

// Work Orders
export function useWorkOrders() {
  return useQuery({ queryKey: ["workOrders"], queryFn: () => getWorkOrders() });
}

export function useWorkOrder(id?: string) {
  return useQuery({ queryKey: ["workOrder", id], queryFn: () => getWorkOrder({ queryKey: ["workOrder", id] }), enabled: !!id });
}

export function useCreateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createWorkOrder({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workOrders"] }),
  });
}

export function useUpdateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateWorkOrder({ data }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["workOrders"] }); qc.invalidateQueries({ queryKey: ["workOrder"] }); },
  });
}

// Payments
export function usePayments() {
  return useQuery({ queryKey: ["payments"], queryFn: () => getPayments() });
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createPayment({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

// Expenses
export function useExpenses() {
  return useQuery({ queryKey: ["expenses"], queryFn: () => getExpenses() });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createExpense({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateExpense({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExpense({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

// Company
export function useCompany() {
  return useQuery({ queryKey: ["company"], queryFn: () => getCompany() });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateCompany({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company"] }),
  });
}

// Pricing
export function usePricing() {
  return useQuery({ queryKey: ["pricing"], queryFn: () => getPricing() });
}

export function useUpdatePricing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updatePricing({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pricing"] }),
  });
}

// Library
export function useProtocols() {
  return useQuery({ queryKey: ["protocols"], queryFn: () => getProtocols() });
}

export function useChecklists() {
  return useQuery({ queryKey: ["checklists"], queryFn: () => getChecklists() });
}

export function usePOPs() {
  return useQuery({ queryKey: ["pops"], queryFn: () => getPOPs() });
}

export function useSLAs() {
  return useQuery({ queryKey: ["slas"], queryFn: () => getSLAs() });
}

export function useMessageTemplates() {
  return useQuery({ queryKey: ["messageTemplates"], queryFn: () => getMessageTemplates() });
}

// Referrals
export function useReferrals() {
  return useQuery({ queryKey: ["referrals"], queryFn: () => getReferrals() });
}

export function useCreateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createReferral({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["referrals"] }),
  });
}

export function useUpdateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateReferral({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["referrals"] }),
  });
}

// Followups
export function useFollowups() {
  return useQuery({ queryKey: ["followups"], queryFn: () => getFollowups() });
}

export function useCreateFollowup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createFollowup({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["followups"] }),
  });
}

export function useUpdateFollowup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateFollowup({ data }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["followups"] }),
  });
}
