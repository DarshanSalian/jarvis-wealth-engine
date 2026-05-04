
"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["Jarvis OS v4.0 Status: Online"]);

  const syncMarket = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/market-live");
      const data = await res.json();
      setMarketData(data.assets || []);
      setLogs(p => [...p, `> Feed Updated: ${new Date().toLocaleTimeString()}`]);
    } catch (e) {
      setLogs(p => [...p, "> Error: Local Engine Offline."]);
    }
  };

  useEffect(() => { syncMarket(); }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-green-500 font-mono p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* --- PROFESSIONAL PORTFOLIO SECTION --- */}
        <header className="border-b border-green-900/40 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-5xl font-black text-white italic tracking-tighter">DARSHAN SALIAN</h1>
              <p className="text-green-800 font-bold mt-1 tracking-widest text-xs uppercase">Systems Developer // Siemens Alumni // Cybersecurity</p>
            </div>
            <div className="flex gap-2">
              <a href="https://github.com/DarshanSalian" target="_blank" className="border border-green-800 px-4 py-2 text-[10px] hover:bg-green-500 hover:text-black">GITHUB</a>
              <a href="https://linkedin.com/in/darshansalian" target="_blank" className="border border-green-800 px-4 py-2 text-[10px] hover:bg-green-500 hover:text-black">LINKEDIN</a>
            </div>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-8 text-sm opacity-70">
            <p>Specialized in <span className="text-white">Industrial Automation</span> and <span className="text-white">Cybersecurity</span>. NITTE ISE 2025. Experience in Python, Next.js, and Vulnerability Assessment.</p>
            <p className="border-l border-green-900 pl-4 italic uppercase text-[10px]">Current Project: Jarvis Wealth Engine - A full-stack market intelligence suite.</p>
          </div>
        </header>

        {/* --- LIVE MARKET GRID --- */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-white tracking-widest">[MARKET_INTELLIGENCE_GRID]</h2>
            <button onClick={syncMarket} className="text-[9px] text-green-400 underline uppercase">Force_Refresh</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {marketData.map((s, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedStock(s.symbol)}
                className="border border-green-900/50 bg-green-950/5 p-4 rounded cursor-pointer hover:border-white transition-all group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-white font-bold group-hover:text-green-400 tracking-tighter">{s.symbol}</span>
                  <span className={`text-[9px] ${s.change >= 0 ? "text-green-500" : "text-red-500"}`}>{s.change}%</span>
                </div>
                <div className="text-2xl text-white mt-4 font-mono">${s.price}</div>
                <p className="text-[8px] opacity-30 mt-2 uppercase">Click to view analysis</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- LIVE GRAPH MODAL (DETAIL VIEW) --- */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-green-500 w-full max-w-5xl rounded-lg overflow-hidden flex flex-col h-[80vh]">
              <div className="p-4 border-b border-green-900 flex justify-between items-center bg-green-950/20">
                <span className="text-white font-bold tracking-widest text-sm uppercase">Live_Analysis: {selectedStock}</span>
                <button onClick={() => setSelectedStock(null)} className="text-green-500 hover:text-white text-xl px-2">✕</button>
              </div>
              <div className="flex-1 bg-black p-2">
                {/* Embedded TradingView Widget for Professional Real-time Charts */}
                <iframe 
                  className="w-full h-full"
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_76d87&symbol=${selectedStock === "BTC-USD" ? "BINANCE:BTCUSDT" : selectedStock}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${selectedStock}`}
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        <footer className="text-[10px] opacity-30 text-center border-t border-green-900/20 pt-8">
          JARVIS_OS_CORE // BUILT_BY_DARSHAN_SALIAN // (C) 2026
        </footer>
      </div>
    </main>
  );
}