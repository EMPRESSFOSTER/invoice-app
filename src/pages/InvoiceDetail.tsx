import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInvoiceContext } from '../context/InvoiceContext';
import { StatusBadge } from '../components/StatusBadge';
import { ChevronLeft } from 'lucide-react';
import './InvoiceDetail.css';

interface InvoiceDetailProps {
  onEdit: (id: string) => void;
}

export function InvoiceDetail({ onEdit }: InvoiceDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, deleteInvoice, markAsPaid } = useInvoiceContext();
  const [showModal, setShowModal] = useState(false);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="container app-content">
        <Link to="/" className="back-link"><ChevronLeft size={16} /> Go back</Link>
        <h2>Invoice not found</h2>
      </div>
    );
  }

  const handleDelete = () => {
    if (id) {
      deleteInvoice(id);
      navigate('/');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <div className="container app-content detail-container">
      <Link to="/" className="back-link"><ChevronLeft size={16} /> Go back</Link>

      <div className="action-card">
        <div className="status-section">
          <span className="status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="action-buttons hide-mobile">
          <button className="btn-secondary" onClick={() => onEdit(invoice.id)}>Edit</button>
          <button className="btn-danger" onClick={() => setShowModal(true)}>Delete</button>
          {invoice.status === 'pending' && (
            <button className="btn-primary" onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
          )}
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div className="id-desc">
            <h3><span className="hash">#</span>{invoice.id}</h3>
            <p>{invoice.description}</p>
          </div>
          <div className="client-address text-right">
            <p>{invoice.clientAddress || 'No Address'}</p>
          </div>
        </div>

        <div className="detail-body">
          <div className="dates">
            <div className="date-block">
              <h4>Invoice Date</h4>
              <p className="strong">{formatDate(invoice.date)}</p>
            </div>
            <div className="date-block">
              <h4>Payment Due</h4>
              <p className="strong">
                {/* Simplified logic for due date display */}
                {formatDate(invoice.date)}
              </p>
            </div>
          </div>
          <div className="bill-to">
            <h4>Bill To</h4>
            <p className="strong">{invoice.clientName}</p>
            <p>{invoice.clientAddress || 'No Address'}</p>
          </div>
          <div className="sent-to">
            <h4>Sent to</h4>
            <p className="strong">{invoice.clientEmail}</p>
          </div>
        </div>

        <div className="items-table">
          <table className="hide-mobile">
            <thead>
              <tr>
                <th>Item Name</th>
                <th className="text-center">QTY.</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td className="strong">{item.name}</td>
                  <td className="text-center text-secondary">{item.quantity}</td>
                  <td className="text-right text-secondary">{formatCurrency(item.price)}</td>
                  <td className="text-right strong">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mobile-items hide-desktop">
            {invoice.items.map(item => (
              <div key={item.id} className="mobile-item">
                <div className="item-info">
                  <p className="strong">{item.name}</p>
                  <p className="text-secondary">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
                <div className="item-total strong">{formatCurrency(item.total)}</div>
              </div>
            ))}
          </div>

          <div className="grand-total">
            <p>Amount Due</p>
            <h2>{formatCurrency(invoice.total)}</h2>
          </div>
        </div>
      </div>

      <div className="action-buttons-mobile hide-desktop">
        <button className="btn-secondary" onClick={() => onEdit(invoice.id)}>Edit</button>
        <button className="btn-danger" onClick={() => setShowModal(true)}>Delete</button>
        {invoice.status === 'pending' && (
          <button className="btn-primary" onClick={() => markAsPaid(invoice.id)}>Mark as Paid</button>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete invoice #{invoice.id}? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
