"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Briefcase, ArrowRight, X, ShieldCheck, CheckCircle2 } from "lucide-react";

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectorModal({ isOpen, onClose }: RoleSelectorModalProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"creator" | "client" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("synthos_user_role");
      if (saved === "creator" || saved === "client") {
        setSelectedRole(saved);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectRole = (role: "creator" | "client") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("synthos_user_role", role);
      window.dispatchEvent(new CustomEvent("synthos_role_change", { detail: { role } }));
    }
    setSelectedRole(role);
    onClose();

    if (role === "creator") {
      router.push("/onboarding/creator");
    } else {
      router.push("/intake");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(255, 255, 255, 0.9)",
          borderRadius: "32px",
          maxWidth: "720px",
          width: "100%",
          boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 1)",
          padding: "44px",
          position: "relative",
          color: "#0f172a",
          fontFamily: "var(--font-sans)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "rgba(15, 23, 42, 0.05)",
            border: "1px solid rgba(203, 213, 225, 0.8)",
            color: "#64748b",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          aria-label="Close role selector"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              padding: "5px 14px",
              borderRadius: 100,
              background: "rgba(79, 70, 229, 0.08)",
              color: "#4f46e5",
              border: "1px solid rgba(79, 70, 229, 0.2)",
              marginBottom: 16,
              fontFamily: "var(--font-mono)",
            }}
          >
            <Sparkles size={14} /> Welcome to Synthos
          </span>
          <h2
            id="role-modal-title"
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              margin: "6px 0 12px",
              letterSpacing: "-0.035em",
              color: "#0f172a",
            }}
          >
            Select Your Role & Experience
          </h2>
          <p style={{ color: "#475569", fontSize: "1.02rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.55 }}>
            Choose how you want to interact with the Synthos Creative Intelligence platform:
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {/* Creator Card */}
          <div
            onClick={() => handleSelectRole("creator")}
            style={{
              background: selectedRole === "creator" ? "rgba(79, 70, 229, 0.06)" : "rgba(248, 250, 252, 0.8)",
              border: selectedRole === "creator" ? "2px solid #4f46e5" : "1px solid rgba(203, 213, 225, 0.9)",
              borderRadius: "24px",
              padding: "32px 26px",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: selectedRole === "creator" ? "0 12px 32px rgba(79, 70, 229, 0.15)" : "0 4px 16px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "16px",
                  background: "#0f172a",
                  display: "grid",
                  placeItems: "center",
                  color: "#ffffff",
                  marginBottom: 20,
                  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.2)",
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", gap: 8 }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#4f46e5",
                    letterSpacing: "0.08em",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Creator / Agency Mode
                </span>
                {selectedRole === "creator" && (
                  <CheckCircle2 size={16} style={{ color: "#4f46e5", marginLeft: "auto" }} />
                )}
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "8px 0 10px", color: "#0f172a" }}>
                I am a Creator / Agency Lead
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                Register developer or creative capabilities, access Mission Control, review AI proposals, and manage project workflows.
              </p>
            </div>
            <div
              style={{
                marginTop: 32,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "#4f46e5",
              }}
            >
              Onboard as Creator <ArrowRight size={16} />
            </div>
          </div>

          {/* Client Card */}
          <div
            onClick={() => handleSelectRole("client")}
            style={{
              background: selectedRole === "client" ? "rgba(5, 150, 105, 0.06)" : "rgba(248, 250, 252, 0.8)",
              border: selectedRole === "client" ? "2px solid #059669" : "1px solid rgba(203, 213, 225, 0.9)",
              borderRadius: "24px",
              padding: "32px 26px",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: selectedRole === "client" ? "0 12px 32px rgba(5, 150, 105, 0.15)" : "0 4px 16px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "16px",
                  background: "rgba(5, 150, 105, 0.12)",
                  border: "1px solid rgba(5, 150, 105, 0.25)",
                  display: "grid",
                  placeItems: "center",
                  color: "#059669",
                  marginBottom: 20,
                }}
              >
                <Briefcase size={28} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "#059669",
                    letterSpacing: "0.08em",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Client Portal Mode
                </span>
                {selectedRole === "client" && (
                  <CheckCircle2 size={16} style={{ color: "#059669", marginLeft: "auto" }} />
                )}
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "8px 0 10px", color: "#0f172a" }}>
                I am a Client
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.6 }}>
                Submit project requirements, launch discovery calls, review AI contact reports, and approve proposals & quotes.
              </p>
            </div>
            <div
              style={{
                marginTop: 32,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.92rem",
                fontWeight: 700,
                color: "#059669",
              }}
            >
              Start a Project / Submit Brief <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
