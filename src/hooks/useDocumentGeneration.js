// useDocumentGeneration.js
// Custom React hook — wire this up to any document tile's onClick.
//
// Usage in your existing component:
//
//   const { generate, loading, error } = useDocumentGeneration();
//
//   <DocumentTile
//     name="Consent Form"
//     onClick={() => generate("Consent Form", clientData, appointmentDate)}
//     loading={loading["Consent Form"]}
//   />

import { useState } from "react";

export function useDocumentGeneration() {
  const [loading, setLoading] = useState({});   // { [templateName]: boolean }
  const [error,   setError  ] = useState(null);

  /**
   * @param {string} templateName   — must match a key in TEMPLATE_MAP in the Netlify function
   * @param {object} client         — the full client object from Cosmos DB
   * @param {string} [appointmentDate] — ISO date string for the next appointment (optional)
   */
  const generate = async (templateName, client, appointmentDate = null) => {
    setLoading((l) => ({ ...l, [templateName]: true }));
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/generate-document", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateName, client, appointmentDate }),
      });

      const data = await res.json();
      if (!res.ok || !data.openUrl) throw new Error(data.error || "Generation failed");

      // Open the populated document in a new tab (it's already saved in OneDrive)
      window.open(data.openUrl, "_blank");

    } catch (err) {
      setError(err.message);
      console.error("Document generation error:", err);
    } finally {
      setLoading((l) => ({ ...l, [templateName]: false }));
    }
  };

  return { generate, loading, error };
}

// ── Example: how to update your existing DocumentTile component ───────────────
//
// BEFORE (static link):
//   <div className="doc-tile" onClick={() => window.open(doc.link)}>
//     {doc.name}
//   </div>
//
// AFTER (auto-populated):
//   import { useDocumentGeneration } from "./useDocumentGeneration";
//
//   const { generate, loading } = useDocumentGeneration();
//
//   <div
//     className={`doc-tile ${loading[doc.name] ? "loading" : ""}`}
//     onClick={() => generate(doc.name, currentClient, currentStageAppointmentDate)}
//   >
//     {loading[doc.name] ? "Generating..." : doc.name}
//   </div>
