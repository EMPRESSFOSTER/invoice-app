import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { InvoiceList } from './pages/InvoiceList';
import { InvoiceDetail } from './pages/InvoiceDetail';
import { InvoiceForm } from './components/InvoiceForm';

export default function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const openNewForm = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<InvoiceList onNewInvoice={openNewForm} />} />
          <Route path="/invoice/:id" element={<InvoiceDetail onEdit={openEditForm} />} />
        </Routes>
      </main>

      {formOpen && <InvoiceForm invoiceId={editingId} onClose={closeForm} />}
    </div>
  );
}
