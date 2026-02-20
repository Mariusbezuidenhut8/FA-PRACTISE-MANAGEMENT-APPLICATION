import React, { useState, useEffect } from 'react';
import { useFirestore } from './useFirestore';
import { db } from './firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const DOCS = {
  lead: ["Client Referral Form", "Mailing List Consent Form"],
  initial: ["Initial Engagement Agenda", "Client Discovery Questionnaire", "Disclosure Document", "Letter of Consent", "Personal Client Profile", "Client Preparation Pack"],
  goal: ["Goal Setting Agenda", "Visual Aids / Presentation", "Policy Schedule", "Budget Document", "Life Goals Document", "Documentation Received Checklist"],
  development: ["Development Strategies Agenda", "Wealth Integrator Scenarios", "Quotes (Risk, Investment, Withdrawals)", "Risk Health Declaration", "Fund Factsheets (optional)", "Strategy Discussion Documents"],
  implementation: ["Signed Application Forms", "Implementation Checklist", "Fee Agreement", "Annual Review Schedule"],
};

function App() {
  const { docs: clients } = useFirestore('clients');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [completedDocs, setCompletedDocs] = useState({});
  const [activeStage, setActiveStage] = useState('initial');

  // Listen for checklist updates for the specific client
  useEffect(() => {
    if (!selectedClientId) return;

    const checklistRef = doc(db, 'checklists', selectedClientId);
    const unsubscribe = onSnapshot(checklistRef, (doc) => {
      if (doc.exists()) {
        setCompletedDocs(doc.data());
      } else {
        setCompletedDocs({});
      }
    });

    return () => unsubscribe();
  }, [selectedClientId]);

  const toggleDoc = async (docName) => {
    if (!selectedClientId) return alert("Please select a client first!");

    const checklistRef = doc(db, 'checklists', selectedClientId);
    const newValue = !completedDocs[docName];
    
    await setDoc(checklistRef, {
      ...completedDocs,
      [docName]: newValue
    }, { merge: true });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>ADVISE Practice Manager</h1>
      
      {/* Client Selector */}
      <select 
        onChange={(e) => setSelectedClientId(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      >
        <option value="">-- Select a Client --</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      {/* Stage Tabs */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {Object.keys(DOCS).map(stage => (
          <button 
            key={stage} 
            onClick={() => setActiveStage(stage)}
            style={{
              padding: '8px 15px',
              backgroundColor: activeStage === stage ? '#0078d4' : '#f4f4f4',
              color: activeStage === stage ? 'white' : 'black',
              border: 'none', borderRadius: '4px', cursor: 'pointer', textTransform: 'capitalize'
            }}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Checklist display */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3>{activeStage.toUpperCase()} Checklist</h3>
        {DOCS[activeStage].map(docName => (
          <div key={docName} style={{ marginBottom: '10px', fontSize: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={!!completedDocs[docName]} 
                onChange={() => toggleDoc(docName)}
                style={{ width: '20px', height: '20px', marginRight: '12px' }}
              />
              <span style={{ textDecoration: completedDocs[docName] ? 'line-through' : 'none', color: completedDocs[docName] ? '#888' : '#000' }}>
                {docName}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
