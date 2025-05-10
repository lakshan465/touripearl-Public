import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const ConfirmationDialog = ({ 
  children,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm = () => {},
}) => {
    const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
            >
                {children}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

                    <div className="relative bg-light rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-secondary hover:text-primary"
                        >
                            <X size={20} className="text-accent" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-highlight" size={24} />
                            <h2 className="text-lg text-primary font-semibold">{title}</h2>
                        </div>

                        <p className="text-secondary mb-6">{description}</p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 rounded text-white bg-secondary hover:bg-secondary/70"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded bg-highlight text-white hover:bg-highlight/70"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmationDialog;