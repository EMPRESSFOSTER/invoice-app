import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import avatarImg from '../assets/avatar.jpg';

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="26">
          <path fill="#FFF" fillRule="evenodd" d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.9z" />
        </svg>
      </div>
      <div className="sidebar-bottom">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="avatar">
          <img src={avatarImg} alt="User Avatar" />
        </div>
      </div>
    </aside>
  );
}
