
"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState(["Jarvis OS v2.0 Initialized..."]);
  const [holdings, setHoldings] = useState<any[]>([]);

  const refreshData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/holdings");
      const data = await res.json();
      setHoldings(data.assets || []);
      setLogs(p => [...p, "> Market Data Sync Complete."]);
    } catch (e) { setLogs(p => [...p, "> Connection Error: Is server.py running?"]); }
  };

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-12 space-y-16">
      
      {/* PORTFOLIO SECTION (The "Old" Website) */}
      <section className="max-w-4xl mx-auto border-l-2 border-green-900 pl-8 space-y-6">
        <header>
          <h1 className="text-5xl font-bold text-white tracking-tighter">DARSHAN SALIAN</h1>
          <p className="text-xl text-green-700 mt-2">Software Developer // Cybersecurity Aspirant</p>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-white border-b border-green-900 w-fit pr-4">EXPERIENCE</h2>
            <div className="text-sm">
              <p className="text-white font-bold">Siemens</p>
              <p className="opacity-70">Software Developer (Factory Automation)</p>
              <p className="text-[10px] opacity-40">2025 - PRESENT</p>
            </div>
            <div className="text-sm">
              <p className="text-white font-bold">Cybersecurity Intern</p>
              <p className="opacity-70">Vulnerability Assessment & Pentesting</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-white border-b border-green-900 w-fit pr-4">TECH_STACK</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Python, React/Next.js, Kali Linux, Network Security, C++, German (A1).
            </p>
          </div>
        </div>
      </section>

      {/* WEALTH ENGINE SECTION (The "New" Utility) */}
      <section className="max-w-5xl mx-auto space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-xs text-white uppercase tracking-[0.3em]">[Jarvis_Wealth_Engine]</h2>
          <button onClick={refreshData} className="text-[10px] border border-green-800 px-3 py-1 hover:bg-green-500 hover:text-black">RUN_SYNC</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-green-900 bg-green-950/5 p-4 overflow-x-auto min-h-[300px]">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-green-900 text-green-800">
                  <th className="pb-2">ASSET</th>
                  <th className="pb-2 text-right">QTY</th>
                  <th className="pb-2 text-right">LIVE_PRICE</th>
                  <th className="pb-2 text-right">NET_VALUE</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => (
                  <tr key={i} className="border-b border-green-950/20 hover:bg-green-500/5">
                    <td className="py-4 font-bold text-white">{h.symbol}</td>
                    <td className="text-right">{h.quantity}</td>
                    <td className="text-right text-white">${h.live_price || "0.00"}</td>
                    <td className="text-right text-green-400 font-bold">
                      ${(h.quantity * (h.live_price || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-green-900 bg-black p-4 flex flex-col h-full">
            <div className="flex-1 text-[10px] opacity-60 overflow-y-auto mb-4">
              {logs.map((l, i) => <p key={i} className="mb-1">{l}</p>)}
            </div>
            <div className="flex gap-2 border-t border-green-900 pt-2 text-xs">
              <span className="text-white opacity-50">$</span>
              <input 
                className="bg-transparent outline-none w-full" 
                placeholder="type commands..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && refreshData()}
              />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}