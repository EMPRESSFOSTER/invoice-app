import React, { useState } from 'react';
import { useInvoiceContext } from '../context/InvoiceContext';
import { InvoiceStatus, Invoice } from '../types';
import { Filter } from '../components/Filter';
import { StatusBadge } from '../components/StatusBadge';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const illustrationImg = '/illustration.svg';

import './InvoiceList.css';

interface InvoiceListProps {
  onNewInvoice: () => void;
}

export function InvoiceList({ onNewInvoice }: InvoiceListProps) {
  const { invoices } = useInvoiceContext();
  const { theme } = useTheme();
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');

  const filteredInvoices = invoices.filter(inv => filter === 'all' || inv.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="container app-content">
      <header className="home-header">
        <div className="header-text">
          <h1>Invoices</h1>
          <p className="subtitle">
            {invoices.length === 0 
              ? 'No invoices' 
              : `There are ${invoices.length} total invoices`}
          </p>
        </div>
        <div className="header-actions">
          <Filter onFilterChange={setFilter} />
          <button className="btn-primary btn-new" onClick={onNewInvoice}>
            <span className="plus-icon"><Plus size={14} color="var(--color-primary)" /></span>
            <span>New <span className="hide-mobile">Invoice</span></span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <img 
            src={illustrationImg} 
            alt="No Invoices Illustration" 
            className="empty-state-img" 
          />
          <h2>There is nothing here</h2>
          <p>Create an invoice by clicking the <strong className="empty-bold">New Invoice</strong> button and get started</p>
        </div>
      ) : (
        <ul className="invoice-list">
          {filteredInvoices.map((invoice: Invoice) => (
            <li key={invoice.id} className="invoice-item-wrapper">
              <Link to={`/invoice/${invoice.id}`} className="invoice-item">
                <span className="id"><span className="hash">#</span>{invoice.id}</span>
                <span className="dueDate">Due {formatDate(invoice.date)}</span>
                <span className="clientName">{invoice.clientName || 'Unknown Client'}</span>
                <span className="total">{formatCurrency(invoice.total || 0)}</span>
                <div className="status-wrapper">
                  <StatusBadge status={invoice.status} />
                  <ChevronRight size={16} className="arrow-icon hide-mobile" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
