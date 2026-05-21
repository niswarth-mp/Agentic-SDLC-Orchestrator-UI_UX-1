import { useState } from "react";
import { X, Shield, Key, Link } from "lucide-react";
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected";
  requiredFields: {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "password";
  }[];
}

interface ServiceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Integration | null;
  onSave: (serviceId: string, data: Record<string, string>) => void;
}

export function ServiceConfigModal({
  isOpen,
  onClose,
  service,
  onSave,
}: ServiceConfigModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!isOpen || !service) return null;

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const isFormValid = service.requiredFields.every(
    (field) => !!formData[field.id]?.trim(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave(service.id, formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-fadeIn">
      <div className="bg-[#111827] border border-white/10 rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#6366F1]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="text-2xl w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
              {service.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Configure {service.name}
              </h3>
              <p className="text-xs text-gray-400">
                Required credentials & environments
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
          {service.requiredFields.map((field) => (
            <div key={field.id} className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                {field.label} <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                {field.type === "password" ? (
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                ) : (
                  <Link className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                )}
                <input
                  type={field.type}
                  required
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                />
              </div>
            </div>
          ))}

          <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex items-start gap-2.5 mt-2">
            <Shield className="w-4 h-4 text-[#6366F1] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400 leading-normal">
              Credentials are securely isolated and encrypted. Your local setup
              syncs directly with authorized deployment instances.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-5 py-2 bg-[#6366F1] hover:bg-[#5558E3] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
