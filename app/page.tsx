
"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>(["Jarvis OS v3.1 Initialized."]);

  const syncMarket = async (): Promise<void> => {
    setLogs(prev => [...prev, "> Synchronizing with live market feed..."]);
    try {
      const res = await fetch("http://localhost:5000/api/market-live");
      if (!res.ok) throw new Error("Backend unreachable");
      const data = await res.json();
      setMarketData(data.assets || []);
      setLogs(prev => [...prev, "> Market data updated successfully."]);
    } catch (err) {
      setLogs(prev => [...prev, "> Error: Local backend offline. Ensure server.py is running."]);
    }
  };

  useEffect(() => {
    syncMarket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-black text-green-500 font-mono p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- IDENTITY SECTION --- */}
        <header className="border-l-4 border-green-600 pl-6 space-y-2">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Darshan Salian</h1>
          <p className="text-green-800 font-bold tracking-widest text-xs">SOFTWARE_ENGINEER // CYBERSECURITY_RESEARCH</p>
          <div className="flex gap-4 pt-4 text-[10px]">
             <span className="opacity-50 text-white">STATUS: ACTIVE</span>
             <span className="opacity-50 text-white">LOC: BENGALURU_ECITY</span>
             <span className="opacity-50 text-white">EXP: SIEMENS_FACTORY_AUTO</span>
          </div>
        </header>

        {/* --- LIVE MARKET FEED --- */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-white tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              LIVE_DATA_STREAM
            </h2>
            <button 
              onClick={() => syncMarket()} 
              className="text-[10px] border border-green-700 px-4 py-1 hover:bg-green-500 hover:text-black transition-all"
            >
              FORCE_SYNC
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {marketData.length > 0 ? marketData.map((s, i) => (
                <div key={`stock-${i}`} className="border border-green-900 bg-green-950/5 p-4 hover:border-green-400 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-bold">{s.symbol}</span>
                    <span className={`text-[10px] ${s.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {s.change >= 0 ? "+" : ""}{s.change}%
                    </span>
                  </div>
                  <div className="text-2xl text-white mt-4 font-bold">${s.price}</div>
                  <div className="text-[9px] opacity-40 uppercase truncate mt-1">{s.name}</div>
                </div>
              )) : (
                <div className="col-span-3 border border-dashed border-green-900 p-12 text-center text-xs opacity-50 italic">
                  Connecting to local Jarvis Engine...
                </div>
              )}
            </div>

            <div className="border border-green-900 p-4 h-64 lg:h-auto bg-black rounded shadow-inner">
               <p className="text-[10px] text-green-900 font-bold mb-4 uppercase tracking-widest border-b border-green-900 pb-2">Terminal_Output</p>
               <div className="overflow-y-auto h-[90%] text-[9px] space-y-1 opacity-70">
                  {logs.map((l, i) => <p key={`log-${i}`} className="leading-tight">{l}</p>)}
               </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}