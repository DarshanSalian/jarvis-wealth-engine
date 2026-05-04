
"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [lastSync, setLastSync] = useState<string>("");

  const syncMarket = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/market-live");
      const data = await res.json();
      setMarketData(data.assets || []);
      setLastSync(new Date().toLocaleTimeString());
    } catch (e) { console.error("Sync Failed"); }
  };

  // AUTOMATIC REFRESH ENGINE (Every 30 Seconds)
  useEffect(() => {
    syncMarket();
    const interval = setInterval(syncMarket, 30000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-green-500 font-mono p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* --- 1. PORTFOLIO DETAILS (Restored) --- */}
        <section className="border-l-2 border-green-900 pl-8 space-y-6">
          <header>
            <h1 className="text-5xl font-black text-white italic tracking-tighter">DARSHAN SALIAN</h1>
            <p className="text-lg text-green-700 font-bold uppercase tracking-widest mt-2">Systems Developer // Cybersecurity Specialist</p>
          </header>
          <div className="grid md:grid-cols-2 gap-10 text-sm opacity-80 leading-relaxed">
            <div className="space-y-4">
               <p><span className="text-white font-bold underline">EXPERIENCE:</span> Currently Software Developer at <span className="text-white">Siemens</span> (Factory Automation). Previously Cybersecurity Intern focused on Pentesting and Vulnerability Assessment.</p>
               <p><span className="text-white font-bold underline">EDUCATION:</span> ISE Graduate (2025), NITTE Alumni.</p>
            </div>
            <div className="space-y-4 border-l border-green-900/30 pl-6">
               <div className="flex gap-4">
                  <a href="https://github.com/DarshanSalian" target="_blank" className="hover:text-white underline">GITHUB</a>
                  <a href="https://linkedin.com/in/darshansalian" target="_blank" className="hover:text-white underline">LINKEDIN</a>
               </div>
               <p className="text-[10px] text-green-900 font-bold uppercase">Skills: Python, Next.js, Kali Linux, Network Security, German (A1).</p>
            </div>
          </div>
        </section>

        {/* --- 2. LIVE DYNAMIC MARKET ENGINE --- */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-green-900/40 pb-4">
            <div>
              <h2 className="text-xs font-bold text-white tracking-[0.4em] uppercase">Jarvis_Wealth_Live</h2>
              <p className="text-[9px] opacity-40 mt-1">AUTO_SYNC_ACTIVE // LAST_UPDATE: {lastSync}</p>
            </div>
            <button onClick={syncMarket} className="text-[10px] border border-green-700 px-4 py-1 hover:bg-green-500 hover:text-black transition-all">MANUAL_REFRESH</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {marketData.map((s, i) => (
              <div key={i} onClick={() => setSelectedStock(s)} className="border border-green-900/50 bg-green-950/5 p-4 rounded hover:border-white cursor-pointer transition-all group">
                <div className="flex justify-between items-start">
                  <span className="text-white font-bold group-hover:text-green-400">{s.symbol}</span>
                  <span className={`text-[10px] font-bold ${s.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {s.change >= 0 ? "▲" : "▼"}{Math.abs(s.change)}%
                  </span>
                </div>
                <div className="text-2xl text-white mt-4 font-mono">${s.price}</div>
                <div className="w-full bg-green-900/20 h-[2px] mt-4 overflow-hidden">
                   <div className="bg-green-500 h-full animate-pulse" style={{width: "100%"}}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. LIVE ANALYSIS (Graph) --- */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-green-500 w-full max-w-6xl h-[85vh] rounded shadow-2xl flex flex-col">
              <div className="p-4 border-b border-green-900 flex justify-between bg-green-950/20">
                <span className="text-white font-bold italic">ANALYSIS_TERMINAL: {selectedStock.symbol}</span>
                <button onClick={() => setSelectedStock(null)} className="text-green-500 hover:text-white">CLOSE [X]</button>
              </div>
              <div className="flex-1 bg-black">
                <iframe 
                  className="w-full h-full"
                  src={`https://s.tradingview.com/widgetembed/?symbol=${selectedStock.market === "NSE" ? "NSE:" : selectedStock.market === "CRYPTO" ? "BINANCE:" : "NASDAQ:"}${selectedStock.symbol}${selectedStock.market === "CRYPTO" ? "USDT" : ""}&interval=D&theme=dark&style=1`}
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}