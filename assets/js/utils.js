/**
 * Utility functions for HMS
 */

const Utils = {
  // Storage Wrapper
  Storage: {
    get: (key) => JSON.parse(localStorage.getItem(key)),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
    // Initialize collection if not exists
    init: (key, defaultValue) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    }
  },

  // ID Generator
  generateId: (prefix = 'ID') => {
    return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  },

  // Date Formatter
  formatDate: (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  },

  // Simple Element Creator
  createElement: (tag, className = '', text = '') => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  },

  // Toast Notification
  showToast: (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Minimal toast styles inline to ensure it works globally
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '12px 24px',
      background: type === 'success' ? '#28a745' : can = 'error' ? '#dc3545' : '#17a2b8',
      color: '#fff',
      borderRadius: '4px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: '9999',
      opacity: '0',
      transition: 'opacity 0.3s'
    });

    if (type === 'error') toast.style.backgroundColor = '#dc3545';
    if (type === 'success') toast.style.backgroundColor = '#28a745';

    document.body.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    toast.style.opacity = '1';

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Modal Helper
  createModal: (title, contentHtml, onSave) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="close-modal">&times;</button>
        </div>
        <div class="modal-body">
          ${contentHtml}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline close-modal-btn">Cancel</button>
          <button class="btn btn-primary" id="modal-save-btn">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // CSS for Modal (injected dynamically if not present in CSS, but ideally in dashboard.css)
    // We assume dashboard.css handles .modal-overlay, .modal etc.

    const close = () => modalOverlay.remove();
    
    modalOverlay.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
      btn.onclick = close;
    });

    modalOverlay.querySelector('#modal-save-btn').onclick = () => {
        if(onSave) onSave(modalOverlay);
        close();
    };

    return modalOverlay;
  }
};
