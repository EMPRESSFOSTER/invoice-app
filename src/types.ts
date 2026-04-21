export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  date: string;
  paymentTerms: number;
  description: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  total: number;
}
