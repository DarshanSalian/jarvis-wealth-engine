
"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [logs, setLogs] = useState<string[]>(["System Online. Ready for commands."]);
  const [holdings, setHoldings] = useState<any[]>([]);

  async function refreshData(): Promise<void> {
    try {
      const res = await fetch("http://localhost:5000/api/holdings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data && data.assets) {
        setHoldings(data.assets);
      }
    } catch (e) {
      setLogs((prev) => [...prev, "> Local Engine Offline"]);
    }
  }

  async function handleCommand(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    
    const parts = val.split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "fetch") {
      await refreshData();
      setLogs((prev) => [...prev, "> Data Refreshed"]);
    } else if (cmd === "add" && parts.length === 4) {
      try {
        const response = await fetch("http://localhost:5000/api/holdings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: parts[1].toUpperCase(),
            quantity: Number(parts[2]),
            price: Number(parts[3])
          })
        });
        if (response.ok) {
          setLogs((prev) => [...prev, `> Added ${parts[1]}`]);
          await refreshData();
        }
      } catch (err) {
        setLogs((prev) => [...prev, "> Write Error"]);
      }
    } else {
      setLogs((prev) => [...prev, `> Unknown: ${cmd}`]);
    }
    setInput("");
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      <div className="max-w-4xl mx-auto border border-green-900 p-4 bg-black">
        <h1 className="text-white mb-4 border-b border-green-900 pb-2">JARVIS COMMAND INTERFACE</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="border border-green-800 p-2 h-64 overflow-auto">
            <p className="text-[10px] text-green-800 mb-2">[HOLDINGS]</p>
            <table className="w-full text-xs">
              <thead><tr className="text-left opacity-50"><th className="pb-1">SYM</th><th className="pb-1">QTY</th><th className="pb-1">PRICE</th></tr></thead>
              <tbody>
                {holdings.map((h, i) => (
                  <tr key={`asset-${i}`}><td className="py-1">{h.symbol}</td><td>{h.quantity}</td><td>${h.price}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border border-green-800 p-2 h-64 overflow-auto text-[10px] text-white">
            <p className="text-[10px] text-green-800 mb-2">[SYSTEM_LOGS]</p>
            {logs.map((l, i) => (
              <p key={`log-${i}`} className="opacity-70 mb-1">{l}</p>
            ))}
          </div>
        </div>
        <form onSubmit={handleCommand} className="flex gap-2 border border-green-900 p-2">
          <span className="text-white">$</span>
          <input 
            className="bg-transparent outline-none w-full text-green-400" 
            value={input} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}