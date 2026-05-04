
"use client";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [logs, setLogs] = useState<string[]>(["Jarvis OS v4.2 Status: Optimized"]);

  const syncMarket = async () => {
    setLogs(p => [...p, "> Parallel data fetch initiated..."]);
    try {
      const res = await fetch("http://localhost:5000/api/market-live");
      const data = await res.json();
      setMarketData(data.assets || []);
      setLogs(p => [...p, "> Sync Complete. Latency: < 3s"]);
    } catch (e) {
      setLogs(p => [...p, "> Error: Backend Engine Offline."]);
    }
  };

  useEffect(() => { syncMarket(); }, []);

  // Helper to format symbol for TradingView
  const getGraphSymbol = (stock: any) => {
    if (stock.market === "NSE") return `NSE:${stock.symbol}`;
    if (stock.market === "CRYPTO") return `BINANCE:${stock.symbol.replace("-", "")}`;
    return `NASDAQ:${stock.symbol}`;
  };

  return (
    <main className="min-h-screen bg-[#050505] text-green-500 font-mono p-4 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="border-b border-green-900/40 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-5xl font-black text-white italic tracking-tighter">DARSHAN SALIAN</h1>
              <p className="text-green-800 font-bold mt-1 tracking-widest text-xs">SYSTEMS // CYBERSECURITY // SIEMENS ALUMNI</p>
            </div>
            <div className="flex gap-2">
              <a href="https://github.com/DarshanSalian" target="_blank" className="border border-green-800 px-4 py-2 text-[10px] hover:bg-green-500 hover:text-black transition-all">GITHUB</a>
              <a href="https://linkedin.com/in/darshansalian" target="_blank" className="border border-green-800 px-4 py-2 text-[10px] hover:bg-green-500 hover:text-black transition-all">LINKEDIN</a>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-white tracking-widest">[LIVE_MARKET_STREAM]</h2>
            <button onClick={syncMarket} className="text-[10px] border border-green-700 px-3 py-1 hover:bg-green-500 hover:text-black">REFRESH_ALL</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {marketData.length > 0 ? marketData.map((s, i) => (
              <div key={i} onClick={() => setSelectedStock(s)} className="border border-green-900/50 bg-green-950/5 p-4 rounded cursor-pointer hover:border-green-400 transition-all group">
                <div className="flex justify-between">
                  <span className="text-white font-bold">{s.symbol}</span>
                  <span className={`text-[10px] ${s.change >= 0 ? "text-green-500" : "text-red-500"}`}>{s.change}%</span>
                </div>
                <div className="text-2xl text-white mt-4 font-mono">${s.price}</div>
              </div>
            )) : <p className="opacity-40 italic text-xs">Waking up Jarvis Engine...</p>}
          </div>
        </section>

        {selectedStock && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-green-500 w-full max-w-6xl h-[85vh] rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-green-900 flex justify-between bg-green-950/20">
                <span className="text-white font-bold tracking-tighter italic">ANALYSIS_TERMINAL: {selectedStock.symbol}</span>
                <button onClick={() => setSelectedStock(null)} className="text-green-500 hover:text-white">CLOSE_SESSION [X]</button>
              </div>
              <div className="flex-1">
                <iframe 
                  className="w-full h-full"
                  src={`https://s.tradingview.com/widgetembed/?symbol=${getGraphSymbol(selectedStock)}&interval=D&theme=dark&style=1&timezone=Etc%2FUTC&locale=en`}
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        <div className="border border-green-900 bg-black p-4 text-[10px] h-32 overflow-y-auto">
          <p className="text-green-900 mb-2 underline">SYSTEM_LOGS</p>
          {logs.map((l, i) => <p key={i} className="opacity-60">{l}</p>)}
        </div>
      </div>
    </main>
  );
}