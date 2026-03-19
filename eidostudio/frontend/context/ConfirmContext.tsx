import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ConfirmFunction = (message: string) => Promise<boolean>;
type PromptFunction = (
  message: string,
  options?: { placeholder?: string; confirmLabel?: string; cancelLabel?: string }
) => Promise<string | null>;

interface ConfirmContextData {
  confirm: ConfirmFunction;
  prompt: PromptFunction;
}

type Mode = 'confirm' | 'prompt';

const ConfirmContext = createContext<ConfirmContextData | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('confirm');
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [confirmLabel, setConfirmLabel] = useState('Confirmar');
  const [cancelLabel, setCancelLabel] = useState('Cancelar');

  const [resolveBoolean, setResolveBoolean] = useState<(value: boolean) => void>(() => () => {});
  const [resolvePrompt, setResolvePrompt] = useState<(value: string | null) => void>(
    () => () => {}
  );

  const confirm = useCallback((msg: string) => {
    setMode('confirm');
    setMessage(msg);
    setConfirmLabel('Confirmar');
    setCancelLabel('Cancelar');
    setIsOpen(true);
    return new Promise<boolean>(resolve => {
      setResolveBoolean(() => resolve);
    });
  }, []);

  const prompt = useCallback<PromptFunction>((msg, options) => {
    setMode('prompt');
    setMessage(msg);
    setInputValue('');
    setPlaceholder(options?.placeholder || 'Digite aqui');
    setConfirmLabel(options?.confirmLabel || 'Confirmar');
    setCancelLabel(options?.cancelLabel || 'Cancelar');
    setIsOpen(true);

    return new Promise<string | null>(resolve => {
      setResolvePrompt(() => resolve);
    });
  }, []);

  const closeModal = () => setIsOpen(false);

  const handleConfirm = () => {
    closeModal();
    if (mode === 'confirm') {
      resolveBoolean(true);
    } else {
      resolvePrompt(inputValue);
    }
  };

  const handleCancel = () => {
    closeModal();
    if (mode === 'confirm') {
      resolveBoolean(false);
    } else {
      resolvePrompt(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, prompt }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-brand-neutral/80 backdrop-blur-sm transition-opacity"
            onClick={handleCancel}
          ></div>

          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl transform transition-all scale-100 opacity-100 border border-brand-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-lock text-2xl text-brand-primary"></i>
              </div>

              <h3 className="text-2xl font-bold font-baloo text-brand-neutral mb-2">Confirmação</h3>
              <p className="text-brand-gray-500 mb-6 leading-relaxed">{message}</p>

              {mode === 'prompt' && (
                <input
                  autoFocus
                  type="password"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleConfirm();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  className="w-full bg-brand-gray-50 px-4 py-3 rounded-xl border border-brand-gray-200 outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-neutral font-medium mb-6"
                  placeholder={placeholder}
                />
              )}

              <div className="flex w-full gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 bg-brand-gray-50 text-brand-gray-500 hover:text-brand-neutral rounded-xl font-bold uppercase tracking-widest text-xs transition-colors border border-brand-gray-100 hover:bg-white"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors hover:bg-brand-primary/90 shadow-md shadow-brand-primary/20"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
