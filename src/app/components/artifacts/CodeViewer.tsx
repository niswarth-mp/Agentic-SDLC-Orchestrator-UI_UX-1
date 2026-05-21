import { useState } from "react";
import {
  Check,
  GitCompare,
  Shield,
  Sparkles,
  X,
  AlertCircle,
  ChevronDown,
  MessageSquareDiff,
} from "lucide-react";

interface ChangeRequest {
  description: string;
  changeType: string;
  priority: string;
}

interface CodeViewerProps {
  fileName: string;
  section: string;
  onRequestChanges?: (data: ChangeRequest) => void;
}

const CHANGE_TYPES = [
  {
    value: "bug",
    label: "Bug Fix",
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-[#EF4444]/30",
  },
  {
    value: "enhancement",
    label: "Enhancement",
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10",
    border: "border-[#6366F1]/30",
  },
  {
    value: "security",
    label: "Security",
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "border-[#22C55E]/30",
  },
  {
    value: "refactor",
    label: "Refactor",
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    border: "border-[#F59E0B]/30",
  },
  {
    value: "docs",
    label: "Documentation",
    color: "text-[#06B6D4]",
    bg: "bg-[#06B6D4]/10",
    border: "border-[#06B6D4]/30",
  },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-gray-400", dot: "bg-gray-400" },
  {
    value: "medium",
    label: "Medium",
    color: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
  {
    value: "high",
    label: "High",
    color: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
  {
    value: "critical",
    label: "Critical",
    color: "text-[#EF4444] font-bold",
    dot: "bg-[#EF4444] animate-pulse",
  },
];

export function CodeViewer({
  fileName,
  section,
  onRequestChanges,
}: CodeViewerProps) {
  const [viewMode, setViewMode] = useState<"code" | "diff">("code");
  const [modalOpen, setModalOpen] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [description, setDescription] = useState("");
  const [changeType, setChangeType] = useState("enhancement");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(false);
      setDescription("");
      onRequestChanges?.({
        description: description.trim(),
        changeType,
        priority,
      });
    }, 800);
  };

  const handleClose = () => {
    if (submitting) return;
    setModalOpen(false);
    setDescription("");
    setChangeType("enhancement");
    setPriority("medium");
  };

  const selectedType = CHANGE_TYPES.find((t) => t.value === changeType)!;
  const selectedPriority = PRIORITIES.find((p) => p.value === priority)!;

  const codeContent = `package com.payment.service;

import org.springframework.stereotype.Service;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Backoff;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class PaymentService {

    private final PaymentRepository repository;
    private final NotificationService notificationService;

    public PaymentService(PaymentRepository repository,
                         NotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    /**
     * Process payment with retry mechanism and JWT validation
     * AI-Generated: Added retry logic with exponential backoff
     * Security: Enhanced JWT validation per OWASP guidelines
     */
    @Retryable(
        value = { PaymentProcessingException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public PaymentResult processPayment(PaymentRequest request) {
        // Validate JWT token
        if (!validateJwtToken(request.getToken())) {
            throw new SecurityException("Invalid JWT token");
        }

        // Process payment logic
        Payment payment = repository.save(request.toPayment());

        // Send notification
        notificationService.sendConfirmation(payment);

        return PaymentResult.success(payment);
    }

    private boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}`;

  const diffOldCode = `    public PaymentResult processPayment(PaymentRequest request) {
        // Process payment logic
        Payment payment = repository.save(request.toPayment());
        return PaymentResult.success(payment);
    }`;

  const diffNewCode = `    @Retryable(
        value = { PaymentProcessingException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public PaymentResult processPayment(PaymentRequest request) {
        // Validate JWT token
        if (!validateJwtToken(request.getToken())) {
            throw new SecurityException("Invalid JWT token");
        }

        // Process payment logic
        Payment payment = repository.save(request.toPayment());

        // Send notification
        notificationService.sendConfirmation(payment);

        return PaymentResult.success(payment);
    }`;

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-[#0A0F1E]">
        {/* Top Toolbar */}
        <div className="bg-[#111827] border-b border-white/10 px-6 py-5">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-bold text-white">{fileName}</h2>
                <span className="px-3 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-xs rounded-full font-semibold">
                  PENDING
                </span>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6366F1]" />
                  <span className="text-white font-medium">
                    development_agent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-[#22C55E] font-medium">
                    Security Pass
                  </span>
                </div>
                <span className="text-gray-500">Iteration 3</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("code")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  viewMode === "code"
                    ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/20"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setViewMode("diff")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                  viewMode === "diff"
                    ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-[#6366F1]/20"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2 bg-white/5 hover:bg-[#EF4444]/10 border border-white/10 hover:border-[#EF4444]/40 text-white hover:text-[#EF4444] text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <MessageSquareDiff className="w-4 h-4" />
                Request Changes
              </button>
              <button className="px-5 py-2 bg-gradient-to-r from-[#22C55E] to-[#06B6D4] hover:from-[#16A34A] hover:to-[#0891B2] text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#22C55E]/20">
                <Check className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>

        {/* AI Summary Banner */}
        {bannerOpen && (
          <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 border-b border-[#6366F1]/20 px-6 py-4">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-2">
                  AI Changes Summary
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Added retry mechanism with exponential backoff (3 attempts, 1s
                  delay). Enhanced JWT validation following OWASP best
                  practices. Integrated notification service for payment
                  confirmations.
                </p>
              </div>
              <button
                onClick={() => setBannerOpen(false)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                aria-label="Close banner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Code/Diff Content */}
        <div className="flex-1 overflow-hidden">
          {viewMode === "code" ? (
            <div className="h-full overflow-auto bg-[#0A0F1E] p-8 font-mono text-sm">
              <pre className="text-gray-300 leading-loose">
                {codeContent.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className="flex hover:bg-white/5 rounded px-2 py-0.5 -mx-2 transition-colors"
                  >
                    <span className="inline-block w-14 text-right pr-6 text-gray-600 select-none text-xs">
                      {index + 1}
                    </span>
                    <span className="flex-1">
                      {line.includes("AI-Generated") ? (
                        <span className="text-[#6366F1] font-medium">
                          {line}
                        </span>
                      ) : line.includes("Security:") ? (
                        <span className="text-[#22C55E] font-medium">
                          {line}
                        </span>
                      ) : line.includes("@Retryable") ||
                        line.includes("validateJwtToken") ||
                        line.includes("SecurityException") ? (
                        <span className="bg-[#22C55E]/10 text-[#22C55E] px-1 rounded">
                          {line}
                        </span>
                      ) : (
                        line
                      )}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          ) : (
            <div className="h-full overflow-auto bg-[#0A0F1E]">
              <div className="grid grid-cols-2 h-full divide-x divide-white/10">
                <div className="bg-[#EF4444]/5">
                  <div className="bg-[#EF4444]/10 border-b border-[#EF4444]/20 px-6 py-3">
                    <span className="text-xs font-semibold text-[#EF4444] uppercase tracking-wide">
                      Previous Version
                    </span>
                  </div>
                  <div className="p-8 font-mono text-sm">
                    <pre className="text-gray-400 leading-loose">
                      {diffOldCode.split("\n").map((line, index) => (
                        <div key={index} className="flex py-0.5">
                          <span className="inline-block w-14 text-right pr-6 text-gray-600 select-none text-xs">
                            {index + 1}
                          </span>
                          <span className="flex-1 line-through opacity-70">
                            {line}
                          </span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
                <div className="bg-[#22C55E]/5">
                  <div className="bg-[#22C55E]/10 border-b border-[#22C55E]/20 px-6 py-3">
                    <span className="text-xs font-semibold text-[#22C55E] uppercase tracking-wide">
                      Current Version
                    </span>
                  </div>
                  <div className="p-8 font-mono text-sm">
                    <pre className="text-gray-300 leading-loose">
                      {diffNewCode.split("\n").map((line, index) => (
                        <div key={index} className="flex py-0.5">
                          <span className="inline-block w-14 text-right pr-6 text-gray-600 select-none text-xs">
                            {index + 1}
                          </span>
                          <span className="flex-1 bg-[#22C55E]/10 px-2 rounded">
                            {line}
                          </span>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Changes Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                  <MessageSquareDiff className="w-4 h-4 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Request Changes
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">
                    {fileName}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Change Type */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 block">
                  Change Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {CHANGE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setChangeType(type.value)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        changeType === type.value
                          ? `${type.bg} ${type.color} ${type.border}`
                          : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 block">
                  Priority
                </label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPriority(p.value)}
                      className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex-1 justify-center ${
                        priority === p.value
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/8 hover:text-gray-200"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 block">
                  Describe the Required Changes
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Be specific about what needs to change and why. The AI agent will use this to generate a new iteration..."
                  rows={4}
                  className="w-full bg-[#0A0F1E] border border-white/10 hover:border-white/20 focus:border-[#6366F1]/50 focus:outline-none text-sm text-white placeholder-gray-600 rounded-xl px-4 py-3 resize-none transition-colors leading-relaxed"
                />
                <p className="text-xs text-gray-600 mt-1.5 text-right">
                  {description.length} chars
                </p>
              </div>

              {/* Info banner */}
              <div className="flex items-start gap-3 px-4 py-3 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-[#6366F1] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Submitting will trigger a new AI agent iteration. You can
                  track progress on the
                  <span className="text-[#6366F1] font-medium">
                    {" "}
                    Artifact Timeline
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#0D1321]">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!description.trim() || submitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#EF4444] to-[#F59E0B] hover:from-[#DC2626] hover:to-[#D97706] rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#EF4444]/20"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageSquareDiff className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
