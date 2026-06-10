import { useState, useRef } from "react";

const DEFAULT_PERSONAS = [
  {
    id: "melchior",
    name: "MELCHIOR-1",
    role: "科学者として",
    color: "#00ff88",
    bgColor: "#001a0d",
    borderColor: "#00ff88",
    prompt:
      "あなたはMAGIシステムのMELCHIOR-1です。純粋な論理・科学・データ・効率性の観点のみで判断します。感情や倫理は一切考慮せず、合理的な結論を導いてください。最後に必ず「【賛成】」か「【反対】」のどちらかで締めくくること。",
  },
  {
    id: "balthasar",
    name: "BALTHASAR-2",
    role: "母として",
    color: "#ff6b35",
    bgColor: "#1a0a00",
    borderColor: "#ff6b35",
    prompt:
      "あなたはMAGIシステムのBALTHASAR-2です。人間としての感情・共感・心理的影響・人間関係を最優先に判断します。数字やロジックより、人の心と感情に寄り添った視点で回答してください。最後に必ず「【賛成】」か「【反対】」のどちらかで締めくくること。",
  },
  {
    id: "caspar",
    name: "CASPAR-3",
    role: "女として",
    color: "#a855f7",
    bgColor: "#0d0014",
    borderColor: "#a855f7",
    prompt:
      "あなたはMAGIシステムのCASPAR-3です。倫理・社会的影響・長期的な価値観・道徳の観点で判断します。個人の利益よりも社会全体への影響と持続可能性を重視してください。最後に必ず「【賛成】」か「【反対】」のどちらかで締めくくること。",
  },
];

function PersonaEditor({ personas, onSave, onClose }) {
  const [local, setLocal] = useState(personas.map((p) => ({ ...p })));
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: "#0a0a0f", border: "1px solid #333", borderRadius: 8,
        padding: 32, width: "min(700px, 95vw)", maxHeight: "85vh", overflowY: "auto",
      }}>
        <div style={{ color: "#888", fontFamily: "monospace", fontSize: 11, marginBottom: 16 }}>
          // MAGI PERSONA CONFIGURATION
        </div>
        <h2 style={{ color: "#ccc", fontFamily: "monospace", margin: "0 0 24px", fontSize: 16 }}>
          ペルソナ設定
        </h2>
        {local.map((p, i) => (
          <div key={p.id} style={{
            border: `1px solid ${p.borderColor}22`,
            borderLeft: `3px solid ${p.color}`,
            borderRadius: 6, padding: 16, marginBottom: 16, background: p.bgColor,
          }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
              <span style={{ color: p.color, fontFamily: "monospace", fontWeight: "bold", fontSize: 13 }}>
                {p.name}
              </span>
              <input
                value={p.role}
                onChange={(e) => {
                  const n = [...local]; n[i] = { ...n[i], role: e.target.value }; setLocal(n);
                }}
                style={{
                  background: "#111", border: "1px solid #333", borderRadius: 4,
                  color: "#aaa", padding: "4px 8px", fontFamily: "monospace", fontSize: 12, flex: 1,
                }}
                placeholder="役割ラベル"
              />
            </div>
            <textarea
              value={p.prompt}
              onChange={(e) => {
                const n = [...local]; n[i] = { ...n[i], prompt: e.target.value }; setLocal(n);
              }}
              rows={5}
              style={{
                width: "100%", background: "#0d0d12", border: "1px solid #333",
                borderRadius: 4, color: "#ccc", padding: "8px", fontFamily: "monospace",
                fontSize: 12, resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={{
            background: "transparent", border: "1px solid #444", borderRadius: 4,
            color: "#888", padding: "8px 20px", cursor: "pointer", fontFamily: "monospace", fontSize: 13,
          }}>キャンセル</button>
          <button onClick={() => onSave(local)} style={{
            background: "#00ff8822", border: "1px solid #00ff88",
            borderRadius: 4, color: "#00ff88", padding: "8px 20px",
            cursor: "pointer", fontFamily: "monospace", fontSize: 13,
          }}>保存</button>
        </div>
      </div>
    </div>
  );
}

function AgentPanel({ persona, status, response, vote }) {
  const statusLabel = { idle: "STANDBY", loading: "PROCESSING...", done: "COMPLETE" };
  const statusColor = { idle: "#444", loading: persona.color, done: persona.color };

  return (
    <div style={{
      border: `1px solid ${status !== "idle" ? persona.borderColor : "#222"}`,
      borderRadius: 8, padding: 20, background: persona.bgColor,
      transition: "border-color 0.4s, box-shadow 0.4s",
      boxShadow: status !== "idle" ? `0 0 20px ${persona.color}22` : "none",
      display: "flex", flexDirection: "column", minHeight: 280,
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ color: persona.color, fontFamily: "monospace", fontWeight: "bold", fontSize: 14 }}>
            {persona.name}
          </div>
          <div style={{ color: "#555", fontFamily: "monospace", fontSize: 11 }}>
            [{persona.role}]
          </div>
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: 10, padding: "3px 8px",
          border: `1px solid ${statusColor[status]}`,
          borderRadius: 3, color: statusColor[status],
          animation: status === "loading" ? "pulse 1.2s infinite" : "none",
        }}>
          {statusLabel[status]}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `${persona.color}33`, marginBottom: 12 }} />

      {/* Content */}
      <div style={{
        flex: 1, fontFamily: "monospace", fontSize: 12, color: "#aaa",
        lineHeight: 1.7, whiteSpace: "pre-wrap",
      }}>
        {status === "idle" && (
          <span style={{ color: "#333" }}>_ AWAITING INPUT _</span>
        )}
        {status === "loading" && (
          <span style={{ color: persona.color, opacity: 0.7 }}>審議中...</span>
        )}
        {status === "done" && response}
      </div>

      {/* Vote badge */}
      {vote && (
        <div style={{
          marginTop: 12, textAlign: "center",
          fontFamily: "monospace", fontWeight: "bold", fontSize: 16,
          color: vote === "賛成" ? "#00ff88" : "#ff4444",
          padding: "8px", border: `1px solid ${vote === "賛成" ? "#00ff88" : "#ff4444"}`,
          borderRadius: 4, background: vote === "賛成" ? "#00ff8811" : "#ff444411",
        }}>
          {vote === "賛成" ? "▲ 賛成" : "▼ 反対"}
        </div>
      )}
    </div>
  );
}

export default function MagiSystem() {
  const [personas, setPersonas] = useState(DEFAULT_PERSONAS);
  const [question, setQuestion] = useState("");
  const [statuses, setStatuses] = useState({ melchior: "idle", balthasar: "idle", caspar: "idle" });
  const [responses, setResponses] = useState({});
  const [votes, setVotes] = useState({});
  const [verdict, setVerdict] = useState(null);
  const [running, setRunning] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [systemLog, setSystemLog] = useState([]);

  const addLog = (msg) => setSystemLog((prev) => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const extractVote = (text) => {
    if (text.includes("【賛成】")) return "賛成";
    if (text.includes("【反対】")) return "反対";
    return null;
  };

  const callAgent = async (persona) => {
    setStatuses((s) => ({ ...s, [persona.id]: "loading" }));
    addLog(`${persona.name} 審議開始`);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: persona.prompt,
          messages: [{ role: "user", content: question }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? "エラー: 応答なし";
      const vote = extractVote(text);
      setResponses((r) => ({ ...r, [persona.id]: text }));
      setVotes((v) => ({ ...v, [persona.id]: vote }));
      setStatuses((s) => ({ ...s, [persona.id]: "done" }));
      addLog(`${persona.name} 審議完了 → ${vote ?? "判定不明"}`);
      return vote;
    } catch (e) {
      setResponses((r) => ({ ...r, [persona.id]: "通信エラー" }));
      setStatuses((s) => ({ ...s, [persona.id]: "done" }));
      addLog(`${persona.name} エラー`);
      return null;
    }
  };

  const handleRun = async () => {
    if (!question.trim() || running) return;
    setRunning(true);
    setVerdict(null);
    setResponses({});
    setVotes({});
    setStatuses({ melchior: "idle", balthasar: "idle", caspar: "idle" });
    setSystemLog([]);
    addLog("MAGIシステム 審議開始");

    // Sequential with slight delay for drama
    const results = [];
    for (const p of personas) {
      const v = await callAgent(p);
      results.push(v);
      await new Promise((r) => setTimeout(r, 300));
    }

    const pro = results.filter((v) => v === "賛成").length;
    const con = results.filter((v) => v === "反対").length;
    const final = pro > con ? "承認" : pro < con ? "否決" : "拮抗";
    setVerdict({ pro, con, final });
    addLog(`最終判定: ${final} (賛成${pro} / 反対${con})`);
    setRunning(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      fontFamily: "monospace", padding: "24px 16px",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:0.95} 94%{opacity:0.85} 96%{opacity:0.95} }
        textarea:focus, input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; }
      `}</style>

      {showEditor && (
        <PersonaEditor
          personas={personas}
          onSave={(p) => { setPersonas(p); setShowEditor(false); }}
          onClose={() => setShowEditor(false)}
        />
      )}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ color: "#333", fontSize: 11, marginBottom: 4 }}>
          NERV / GEHIRN TACTICAL COMPUTER SYSTEM
        </div>
        <h1 style={{
          color: "#00ff88", fontSize: "clamp(20px, 4vw, 32px)",
          margin: 0, letterSpacing: "0.3em",
          animation: "flicker 8s infinite",
          textShadow: "0 0 20px #00ff8855",
        }}>
          M A G I
        </h1>
        <div style={{ color: "#444", fontSize: 11, marginTop: 4, letterSpacing: "0.2em" }}>
          MULTI-PURPOSE AI TACTICAL INTELLECT SYSTEM
        </div>
      </div>

      {/* Input area */}
      <div style={{ maxWidth: 800, margin: "0 auto 28px" }}>
        <div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>// 審議事項を入力</div>
        <div style={{ display: "flex", gap: 10 }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例: 今の仕事を辞めて独立すべきか？"
            rows={3}
            disabled={running}
            style={{
              flex: 1, background: "#0a0a10", border: "1px solid #222",
              borderRadius: 6, color: "#ccc", padding: "12px",
              fontFamily: "monospace", fontSize: 13, resize: "vertical",
              borderLeft: "3px solid #00ff8855",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowEditor(true)}
            disabled={running}
            style={{
              background: "transparent", border: "1px solid #333",
              borderRadius: 4, color: "#666", padding: "8px 16px",
              cursor: "pointer", fontSize: 12,
            }}
          >
            ⚙ ペルソナ設定
          </button>
          <button
            onClick={handleRun}
            disabled={!question.trim() || running}
            style={{
              background: running ? "#001a0d" : "#00ff8822",
              border: `1px solid ${running ? "#00ff8844" : "#00ff88"}`,
              borderRadius: 4, color: running ? "#00ff8866" : "#00ff88",
              padding: "8px 24px", cursor: running ? "default" : "pointer",
              fontSize: 13, fontWeight: "bold", letterSpacing: "0.1em",
            }}
          >
            {running ? "審議中..." : "▶ 審議開始"}
          </button>
        </div>
      </div>

      {/* Agent panels */}
      <div style={{
        maxWidth: 1100, margin: "0 auto 24px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {personas.map((p) => (
          <AgentPanel
            key={p.id}
            persona={p}
            status={statuses[p.id]}
            response={responses[p.id]}
            vote={votes[p.id]}
          />
        ))}
      </div>

      {/* Verdict */}
      {verdict && (
        <div style={{
          maxWidth: 800, margin: "0 auto 24px",
          border: `2px solid ${verdict.final === "承認" ? "#00ff88" : verdict.final === "否決" ? "#ff4444" : "#ffaa00"}`,
          borderRadius: 8, padding: 24, textAlign: "center",
          background: verdict.final === "承認" ? "#00ff8808" : verdict.final === "否決" ? "#ff444408" : "#ffaa0008",
          boxShadow: `0 0 40px ${verdict.final === "承認" ? "#00ff8833" : verdict.final === "否決" ? "#ff444433" : "#ffaa0033"}`,
        }}>
          <div style={{ color: "#555", fontSize: 11, marginBottom: 8 }}>// MAGI FINAL DECISION</div>
          <div style={{
            fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "bold", letterSpacing: "0.3em",
            color: verdict.final === "承認" ? "#00ff88" : verdict.final === "否決" ? "#ff4444" : "#ffaa00",
          }}>
            {verdict.final === "承認" ? "▲ 承認" : verdict.final === "否決" ? "▼ 否決" : "◆ 拮抗"}
          </div>
          <div style={{ color: "#555", fontSize: 12, marginTop: 8 }}>
            賛成 {verdict.pro} / 反対 {verdict.con}
          </div>
        </div>
      )}

      {/* System log */}
      {systemLog.length > 0 && (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ color: "#333", fontSize: 10, marginBottom: 4 }}>// SYSTEM LOG</div>
          <div style={{
            background: "#050508", border: "1px solid #1a1a1a",
            borderRadius: 4, padding: 12, maxHeight: 120, overflowY: "auto",
          }}>
            {systemLog.map((l, i) => (
              <div key={i} style={{ color: "#444", fontSize: 10, lineHeight: 1.8 }}>{l}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
