import React, { createContext, useContext, ReactNode } from 'react';
import { useInvoices } from '../hooks/useInvoices';
import { Invoice } from '../types';

type InvoiceContextType = ReturnType<typeof useInvoices>;

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const invoiceData = useInvoices();

  return (
    <InvoiceContext.Provider value={invoiceData}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoiceContext() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }
  return context;
}
