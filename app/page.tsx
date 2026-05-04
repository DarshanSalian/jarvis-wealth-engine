
"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>(["Jarvis OS v3.0 // Ready..."]);

  const syncMarket = async () => {
    setLogs(p => [...p, "> Interrogating global stock exchanges..."]);
    try {
      const res = await fetch("http://localhost:5000/api/market-live");
      const data = await res.json();
      setMarketData(data.assets || []);
      setLogs(p => [...p, "> Market Feed: Active & Synchronized."]);
    } catch (e) {
      setLogs(p => [...p, "> Connection Error: Local Engine Offline."]);
    }
  };

  useEffect(() => { syncMarket(); }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-green-500 font-mono p-4 md:p-12 selection:bg-green-500 selection:text-black">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- PROFESSIONAL PORTFOLIO HEADER --- */}
        <section className="border-b border-green-900/30 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2">
              <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Darshan Salian</h1>
              <p className="text-green-700 font-bold tracking-[0.2em]">SYSTEMS_DEVELOPER // CYBER_SECURITY</p>
            </div>
            <div className="flex gap-3">
              <a href="https://github.com/DarshanSalian" target="_blank" className="border border-green-800 px-4 py-2 text-[10px] hover:bg-green-500 hover:text-black transition-all">GITHUB.EXE</a>
              <a href="#" className="border border-green-800 px-4 py-2 text-[10px] hover:bg-green-500 hover:text-black transition-all">RESUME.PDF</a>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-10 text-sm opacity-80 leading-relaxed">
            <p>
              Professional background in factory automation at <span className="text-white">Siemens</span>. 
              Currently pivoting into advanced <span className="text-white">Cybersecurity & AI</span> systems. 
              NITTE Alumni ISE class of 2025.
            </p>
            <p className="text-green-800">
              [SKILLS]: Python (Flask/FastAPI), React, Next.js, Kali Linux, Vulnerability Assessment, Network Forensics.
            </p>
          </div>
        </section>

        {/* --- LIVE MARKET ENGINE --- */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Live_Market_Intelligence
            </h2>
            <button onClick={syncMarket} className="text-[10px] bg-green-900/20 border border-green-700 px-4 py-1 hover:bg-green-500 hover:text-black transition-all">RESCAN_MARKETS</button>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            {/* Live Data Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {marketData.map((s, i) => (
                <div key={i} className="border border-green-900/40 bg-green-950/5 p-4 rounded-md hover:border-green-500 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-black text-xl">{s.symbol}</span>
                    <span className={`text-[10px] px-2 py-0.5 border ${s.change >= 0 ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}`}>
                      {s.change >= 0 ? "+" : ""}{s.change}%
                    </span>
                  </div>
                  <p className="text-[10px] opacity-40 mt-1 uppercase truncate">{s.name}</p>
                  <div className="mt-4 flex justify-between items-end">
                    <span className="text-[9px] text-green-900 font-bold">{s.market}</span>
                    <span className="text-2xl text-white font-mono">${s.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Terminal Log */}
            <div className="border border-green-900 bg-black p-4 flex flex-col h-[400px] lg:h-auto rounded-md">
              <p className="text-[10px] text-green-900 mb-4 font-bold border-b border-green-900/30 pb-2">SYSTEM_LOGS</p>
              <div className="flex-1 overflow-y-auto text-[9px] space-y-1 font-mono opacity-60">
                {logs.map((l, i) => <p key={i}>{l}</p>)}
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}