
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
      if (data.assets) {
        setMarketData(data.assets);
        setLastSync(new Date().toLocaleTimeString());
      }
    } catch (e) { console.error("Sync Failure"); }
  };

  useEffect(() => {
    syncMarket();
    const interval = setInterval(syncMarket, 1000); 
    return () => clearInterval(interval);
  }, []);

  // MASTER RESOLVER: Ensures TradingView identifies the correct exchange
  const getFullSymbol = (s: any) => {
    if (s.market === "NSE") return `NSE:${s.symbol}`;
    if (s.market === "CRYPTO") {
      // Formats BTC-USD to BINANCE:BTCUSDT for the widget
      const cleanCrypto = s.symbol.replace("-USD", "").replace("-", "");
      return `BINANCE:${cleanCrypto}USDT`;
    }
    return `NASDAQ:${s.symbol}`;
  };

  return (
    <main className="min-h-screen bg-[#050505] text-green-500 font-mono p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* --- PORTFOLIO HEADER --- */}
        <section className="border-l-2 border-green-900 pl-8 space-y-6">
          <header>
            <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">DARSHAN SALIAN</h1>
            <p className="text-lg text-green-700 font-bold uppercase tracking-widest mt-2 text-xs md:text-sm italic">Systems Developer // Cybersecurity Specialist // Siemens Alumni</p>
          </header>
          <div className="grid md:grid-cols-2 gap-10 text-sm opacity-80 leading-relaxed">
            <div className="space-y-4">
               <p><span className="text-white font-bold underline text-[10px]">EXPERIENCE:</span> Currently Software Developer at <span className="text-white">Siemens</span>. Cybersecurity Intern (VA/PT).</p>
               <p><span className="text-white font-bold underline text-[10px]">EDUCATION:</span> ISE Graduate (2025), NITTE Alumni.</p>
            </div>
            <div className="space-y-4 border-l border-green-900/30 pl-6">
               <div className="flex gap-4">
                  <a href="https://github.com/DarshanSalian" target="_blank" className="hover:text-white underline">GITHUB</a>
                  <a href="https://linkedin.com/in/darshansalian" target="_blank" className="hover:text-white underline">LINKEDIN</a>
               </div>
               <p className="text-[10px] text-green-900 font-bold uppercase">Skills: Python, Next.js, Kali Linux, Network Security.</p>
            </div>
          </div>
        </section>

        {/* --- LIVE DASHBOARD --- */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-green-900/40 pb-4">
            <h2 className="text-xs font-bold text-white tracking-[0.4em] uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              JARVIS_TERMINAL_O1
            </h2>
            <p className="text-[9px] opacity-40 uppercase">Pulse_Rate: 1Hz // Sync_ID: {lastSync}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {marketData.map((s, i) => (
              <div key={i} onClick={() => setSelectedStock(s)} className="border border-green-900/50 bg-green-950/5 p-4 rounded hover:border-white cursor-pointer transition-all active:scale-95 group">
                <div className="flex justify-between items-start">
                  <span className="text-white font-bold group-hover:text-green-400">{s.symbol}</span>
                  <span className={`text-[10px] font-bold ${s.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {s.change >= 0 ? "▲" : "▼"}{Math.abs(s.change)}%
                  </span>
                </div>
                <div className="text-xl text-white mt-4 font-mono">${s.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </section>

        {/* --- FULLSCREEN CHART MODAL --- */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 md:p-6 backdrop-blur-md">
            <div className="bg-[#0a0a0a] border border-green-500 w-full max-w-6xl h-[90vh] rounded shadow-2xl flex flex-col">
              <div className="p-4 border-b border-green-900 flex justify-between bg-green-950/20">
                <span className="text-white font-bold italic uppercase text-[10px]">Security_Analysis: {getFullSymbol(selectedStock)}</span>
                <button onClick={() => setSelectedStock(null)} className="text-green-500 hover:text-white font-bold border border-green-900 px-2 text-xs">EXIT_STREAM [X]</button>
              </div>
              <div className="flex-1">
                <iframe 
                  key={selectedStock.symbol}
                  className="w-full h-full"
                  src={`https://s.tradingview.com/widgetembed/?symbol=${getFullSymbol(selectedStock)}&interval=D&theme=dark&style=1&timezone=Etc%2FUTC&locale=en&withdateranges=true`}
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