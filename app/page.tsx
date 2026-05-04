
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState(["System Online. Commands: fetch, add [symbol] [qty] [price]"]);
  const [holdings, setHoldings] = useState([]);

  const refreshData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/holdings");
      const data = await res.json();
      setHoldings(data.assets || []);
    } catch (e) { setLogs(p => [...p, "> Local Engine Offline"]); }
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    const parts = input.split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "fetch") {
      await refreshData();
      setLogs(p => [...p, "> Data Refreshed."]);
    } else if (cmd === "add" && parts.length === 4) {
      const payload = { symbol: parts[1].toUpperCase(), quantity: parseFloat(parts[2]), price: parseFloat(parts[3]) };
      await fetch("http://localhost:5000/api/holdings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setLogs(p => [...p, `> Added ${parts[1]}`]);
      await refreshData();
    }
    setInput("");
  };

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="max-w-4xl mx-auto border border-green-900 p-6 shadow-2xl">
        <h1 className="text-xl mb-4 border-b border-green-900 pb-2 uppercase tracking-widest text-white">Jarvis Command Interface</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Investment Table */}
          <div className="border border-green-800 p-4 h-64 overflow-y-auto bg-green-950/5">
             <h2 className="text-[10px] text-green-800 mb-2 uppercase tracking-widest">[Live_Holdings]</h2>
             <table className="w-full text-xs">
               <thead><tr className="text-left border-b border-green-900"><th>ASSET</th><th>QTY</th><th>VAL</th></tr></thead>
               <tbody>{holdings.map((h,i)=>(<tr key={i} className="hover:bg-green-500/10"><td className="py-1">{h.symbol}</td><td>{h.quantity}</td><td>${h.price}</td></tr>))}</tbody>
             </table>
          </div>
          {/* System Logs */}
          <div className="border border-green-800 p-4 h-64 overflow-y-auto bg-black text-[10px]">
             <h2 className="text-[10px] text-green-800 mb-2 uppercase tracking-widest">[System_Logs]</h2>
             {logs.map((l,i)=>(<p key={i} className="mb-1 text-white opacity-70">{l}</p>))}
          </div>
        </div>

        {/* Interaction Bar */}
        <form onSubmit={handleCommand} className="flex gap-2 bg-green-950/20 p-2 border border-green-900">
          <span className="text-white font-bold">$</span>
          <input className="bg-transparent outline-none w-full text-green-400" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type add SYMBOL QTY PRICE..."/>
        </form>
      </div>
    </main>
  );
}