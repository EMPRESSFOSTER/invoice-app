import React, { useState, useEffect } from 'react';
import { useInvoiceContext } from '../context/InvoiceContext';
import { Invoice, InvoiceItem, InvoiceStatus } from '../types';
import { Trash } from 'lucide-react';
import './InvoiceForm.css';

interface InvoiceFormProps {
  invoiceId?: string | null;
  onClose: () => void;
}

const generateId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l1 = letters[Math.floor(Math.random() * 26)];
  const l2 = letters[Math.floor(Math.random() * 26)];
  const n1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${l1}${l2}${n1}`;
};

const generateItemId = () => Math.random().toString(36).substr(2, 9);

export function InvoiceForm({ invoiceId, onClose }: InvoiceFormProps) {
  const { invoices, addInvoice, updateInvoice } = useInvoiceContext();
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    date: new Date().toISOString().split('T')[0],
    paymentTerms: 30,
    description: '',
    items: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoiceId) {
      const inv = invoices.find(i => i.id === invoiceId);
      if (inv) setFormData(inv);
    }
  }, [invoiceId, invoices]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'price') {
      newItems[index].total = Number(newItems[index].quantity || 0) * Number(newItems[index].price || 0);
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
    if (errors['items']) setErrors(prev => ({ ...prev, items: '' }));
  };

  const addNewItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), { id: generateItemId(), name: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id)
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.clientName) newErrors.clientName = 'can\'t be empty';
    if (!formData.clientEmail) newErrors.clientEmail = 'can\'t be empty';
    else if (!/^\S+@\S+\.\S+$/.test(formData.clientEmail)) newErrors.clientEmail = 'invalid email format';
    
    if (!formData.clientAddress) newErrors.clientAddress = 'can\'t be empty';
    if (!formData.description) newErrors.description = 'can\'t be empty';
    
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'An item must be added';
    } else {
      formData.items.forEach(item => {
        if (!item.name) newErrors.items = 'All items must have a name';
        if (Number(item.quantity) <= 0) newErrors.items = 'Quantity must be positive';
        if (Number(item.price) <= 0) newErrors.items = 'Price must be positive';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status: InvoiceStatus) => {
    if (status !== 'draft' && !validate()) return;

    const total = formData.items?.reduce((acc, item) => acc + item.total, 0) || 0;

    if (invoiceId) {
      // Editing existing
      const invToUpdate = formData as Invoice;
      updateInvoice({
        ...invToUpdate,
        status: status === 'draft' ? 'pending' : status, // keep existing status unless saving as draft but wait, usually editing doesn't change it to pending if it was paid, but let's say "save changes" just keeps status if not draft.
        total
      });
    } else {
      // Creating new
      const newInvoice: Invoice = {
        ...(formData as Omit<Invoice, 'id' | 'status' | 'total'>),
        id: generateId(),
        status,
        total
      };
      addInvoice(newInvoice);
    }
    onClose();
  };

  return (
    <div className="form-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="form-container" role="dialog" aria-modal="true" aria-label="Invoice Form">
        <h2>{invoiceId ? `Edit #${invoiceId}` : 'New Invoice'}</h2>
        
        <div className="form-scroll-area">
          <section className="form-section">
            <h4>Bill To</h4>
            <div className="input-group">
              <div className="label-wrapper">
                <label className={errors.clientName ? 'label-error' : ''}>Client's Name</label>
                {errors.clientName && <span className="error-text">{errors.clientName}</span>}
              </div>
              <input 
                type="text" 
                name="clientName" 
                value={formData.clientName || ''} 
                onChange={handleChange}
                className={errors.clientName ? 'input-error' : ''}
              />
            </div>

            <div className="input-group">
              <div className="label-wrapper">
                <label className={errors.clientEmail ? 'label-error' : ''}>Client's Email</label>
                {errors.clientEmail && <span className="error-text">{errors.clientEmail}</span>}
              </div>
              <input 
                type="email" 
                name="clientEmail" 
                placeholder="e.g. email@example.com"
                value={formData.clientEmail || ''} 
                onChange={handleChange}
                className={errors.clientEmail ? 'input-error' : ''}
              />
            </div>

            <div className="input-group">
              <div className="label-wrapper">
                <label className={errors.clientAddress ? 'label-error' : ''}>Street Address</label>
                {errors.clientAddress && <span className="error-text">{errors.clientAddress}</span>}
              </div>
              <input 
                type="text" 
                name="clientAddress" 
                value={formData.clientAddress || ''} 
                onChange={handleChange}
                className={errors.clientAddress ? 'input-error' : ''}
              />
            </div>
          </section>

          <section className="form-section">
            <div className="form-row">
              <div className="input-group">
                <label>Invoice Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date || ''} 
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>Payment Terms</label>
                <select 
                  name="paymentTerms" 
                  value={formData.paymentTerms || 30} 
                  onChange={handleChange}
                >
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <div className="label-wrapper">
                <label className={errors.description ? 'label-error' : ''}>Project Description</label>
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>
              <input 
                type="text" 
                name="description" 
                placeholder="e.g. Graphic Design Service"
                value={formData.description || ''} 
                onChange={handleChange}
                className={errors.description ? 'input-error' : ''}
              />
            </div>
          </section>

          <section className="form-section">
            <h3>Item List</h3>
            {formData.items?.map((item, index) => (
              <div key={item.id} className="item-row">
                <div className="input-group item-name">
                  <label>Item Name</label>
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={e => handleItemChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="input-group item-qty">
                  <label>Qty.</label>
                  <input 
                    type="number" 
                    min="1"
                    value={item.quantity} 
                    onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group item-price">
                  <label>Price</label>
                  <input 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={item.price} 
                    onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))}
                  />
                </div>
                <div className="input-group item-total-col">
                  <label>Total</label>
                  <div className="item-total-value">
                    {(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
                <button 
                  className="delete-item-btn" 
                  onClick={() => removeItem(item.id)}
                  aria-label="Delete item"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
            
            {errors.items && <p className="error-text item-error">{errors.items}</p>}

            <button className="btn-secondary add-new-item" onClick={addNewItem}>
              + Add New Item
            </button>
          </section>
        </div>

        <div className="form-actions">
          <button className="btn-secondary discard-btn" onClick={onClose}>Discard</button>
          <div className="save-actions">
            {!invoiceId && (
              <button className="btn-dark" onClick={() => handleSubmit('draft')}>Save as Draft</button>
            )}
            <button className="btn-primary" onClick={() => handleSubmit(invoiceId ? (formData.status as InvoiceStatus) : 'pending')}>
              Save & Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
