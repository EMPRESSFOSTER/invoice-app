import { useState, useEffect } from 'react';
import { Invoice } from '../types';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  };

  const updateInvoice = (updated: Invoice) => {
    setInvoices((prev) => 
      prev.map((inv) => (inv.id === updated.id ? updated : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const markAsPaid = (id: string) => {
    setInvoices((prev) => 
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
  };

  return { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid };
}
