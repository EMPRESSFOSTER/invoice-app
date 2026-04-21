import React, { useState } from 'react';
import { InvoiceStatus } from '../types';
import { ChevronDown } from 'lucide-react';
import './Filter.css';

interface FilterProps {
  onFilterChange: (status: InvoiceStatus | 'all') => void;
}

export function Filter({ onFilterChange }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<InvoiceStatus | 'all'>('all');

  const statuses: (InvoiceStatus | 'all')[] = ['all', 'draft', 'pending', 'paid'];

  const handleSelect = (status: InvoiceStatus | 'all') => {
    setCurrentFilter(status);
    onFilterChange(status);
    setIsOpen(false);
  };

  return (
    <div className="filter-container">
      <button 
        className="filter-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="filter-text">Filter <span className="hide-mobile">by status</span></span>
        <ChevronDown size={14} className={`filter-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown" role="listbox">
          {statuses.map(status => (
            <label key={status} className="filter-option" role="option" aria-selected={currentFilter === status}>
              <input 
                type="radio" 
                name="statusFilter" 
                checked={currentFilter === status}
                onChange={() => handleSelect(status)} 
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
