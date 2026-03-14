// NewCaseForm.jsx
// Drop-in replacement for your existing "+ New Case" form.
// Captures all fields needed to auto-populate every document template.
//
// Dependencies: none beyond React (uses your existing Tailwind/CSS classes)
// Cosmos DB write is handled via your backend API endpoint — adjust COSMOS_API_URL below.

import { useState } from "react";

const ADVISORS = ["MB", "Other"]; // extend as needed
const REFERRAL_SOURCES = ["Referral", "Cold Call", "Walk-in", "Social Media", "Existing Client"];

const EMPTY_FORM = {
  // ── already in your form ──────────────────────────────
  fullName: "",
  advisor: "",
  referralSource: "",
  referredBy: "",

  // ── new: personal details ─────────────────────────────
  email: "",
  mobile: "",
  idNumber: "",
  dateOfBirth: "",          // auto-derived from SA ID on blur, but editable
  personalCapacity: "yes",  // "yes" | "no"
  representing: "",         // only required when personalCapacity === "no"

  // ── new: first contact (for confirmation email) ───────
  dateOfInitialContact: new Date().toISOString().split("T")[0],
};

export default function NewCaseForm({ onSuccess, onCancel }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});

  // ── helpers ──────────────────────────────────────────
  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  /** Derive date of birth from a 13-digit SA ID number */
  const deriveDOBFromID = (id) => {
    if (id.length < 6) return "";
    const yy = id.substring(0, 2);
    const mm = id.substring(2, 4);
    const dd = id.substring(4, 6);
    const year = parseInt(yy) <= new Date().getFullYear() % 100
      ? "20" + yy
      : "19" + yy;
    return `${year}-${mm}-${dd}`;
  };

  const handleIDBlur = () => {
    if (form.idNumber.length === 13 && !form.dateOfBirth) {
      setForm((f) => ({ ...f, dateOfBirth: deriveDOBFromID(form.idNumber) }));
    }
  };

  // ── validation ───────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.fullName.trim())   e.fullName  = "Required";
    if (!form.advisor)           e.advisor   = "Required";
    if (!form.email.trim())      e.email     = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.mobile.trim())     e.mobile    = "Required";
    if (!form.idNumber.trim())   e.idNumber  = "Required";
    if (form.personalCapacity === "no" && !form.representing.trim())
      e.representing = "Required when not acting in personal capacity";
    return e;
  };

  // ── submit ───────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      // POST to your backend / Netlify function that writes to Cosmos DB
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stage: "Lead / Referral",
          createdAt: new Date().toISOString(),
          checklistProgress: 0,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const newCase = await res.json();
      onSuccess?.(newCase);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  // ── field component shortcuts ─────────────────────────
  const Field = ({ label, name, type = "text", placeholder, onBlur, required }) => (
    <div className="field-group">
      <label>{label}{required && <span className="required"> *</span>}</label>
      <input
        type={type}
        value={form[name]}
        onChange={set(name)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={errors[name] ? "input-error" : ""}
      />
      {errors[name] && <span className="error-msg">{errors[name]}</span>}
    </div>
  );

  // ── render ────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="new-case-form">

      {/* ── SECTION 1: Case basics (your existing fields) ── */}
      <section>
        <h3 className="section-title">Case Details</h3>
        <div className="form-row">
          <Field label="Client full name" name="fullName" placeholder="Client full name..." required />
          <div className="field-group">
            <label>Advisor <span className="required">*</span></label>
            <select value={form.advisor} onChange={set("advisor")}
              className={errors.advisor ? "input-error" : ""}>
              <option value="">Select advisor...</option>
              {ADVISORS.map((a) => <option key={a}>{a}</option>)}
            </select>
            {errors.advisor && <span className="error-msg">{errors.advisor}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="field-group">
            <label>Referral source</label>
            <select value={form.referralSource} onChange={set("referralSource")}>
              <option value="">Referral source...</option>
              {REFERRAL_SOURCES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <Field label="Referred by" name="referredBy" placeholder="Referred by (name)..." />
        </div>
      </section>

      {/* ── SECTION 2: Personal details (new) ── */}
      <section>
        <h3 className="section-title">Personal Details</h3>
        <div className="form-row">
          <Field label="Email address" name="email" type="email"
            placeholder="client@email.com" required />
          <Field label="Mobile / cell number" name="mobile"
            placeholder="+27 82 000 0000" required />
        </div>
        <div className="form-row">
          <Field label="SA ID number" name="idNumber"
            placeholder="13-digit ID number" onBlur={handleIDBlur} required />
          <Field label="Date of birth" name="dateOfBirth" type="date" />
        </div>

        {/* Personal capacity toggle */}
        <div className="field-group">
          <label>Acting in personal capacity? <span className="required">*</span></label>
          <div className="radio-group">
            <label className="radio-label">
              <input type="radio" name="personalCapacity" value="yes"
                checked={form.personalCapacity === "yes"}
                onChange={set("personalCapacity")} />
              Yes
            </label>
            <label className="radio-label">
              <input type="radio" name="personalCapacity" value="no"
                checked={form.personalCapacity === "no"}
                onChange={set("personalCapacity")} />
              No — representing
            </label>
          </div>
        </div>

        {form.personalCapacity === "no" && (
          <Field label="Representing (company / trust name)" name="representing"
            placeholder="Entity name..." required />
        )}
      </section>

      {/* ── SECTION 3: First contact date (new) ── */}
      <section>
        <h3 className="section-title">Engagement</h3>
        <div className="form-row half">
          <Field label="Date of initial contact" name="dateOfInitialContact" type="date" />
        </div>
      </section>

      {/* ── Errors & actions ── */}
      {errors.submit && (
        <div className="submit-error">Error saving case: {errors.submit}</div>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Add Case"}
        </button>
      </div>
    </form>
  );
}
