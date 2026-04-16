/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu, AlertTriangle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-silkscreen crt-flicker selection:bg-magenta-500 selection:text-white">
      {/* Glitch Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      
      {/* Header / System Status */}
      <header className="border-b-4 border-cyan-400 p-4 bg-black sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-magenta-500 flex items-center justify-center bg-magenta-500/10 animate-pulse">
              <Terminal className="w-8 h-8 text-magenta-500" />
            </div>
            <div>
              <h1 className="text-2xl font-pixel tracking-tighter uppercase glitch-text" data-text="SYSTEM_VOID_v.0.4.2">
                SYSTEM_VOID_v.0.4.2
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-magenta-500 font-mono">
                <Activity className="w-3 h-3" />
                <span>CORE_TEMP: 42.1°C // UPTIME: 0x4A2F</span>
              </div>
            </div>
          </div>

          <div className="flex gap-8 text-xs uppercase font-bold">
            <span className="text-magenta-500 cursor-wait">[ ACCESS_GRANTED ]</span>
            <span className="opacity-50 hover:opacity-100 cursor-crosshair transition-opacity">[ PROTOCOL_X ]</span>
            <span className="opacity-50 hover:opacity-100 cursor-crosshair transition-opacity">[ DATA_STREAM ]</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left: System Logs */}
        <aside className="lg:col-span-3 space-y-6 border-l-2 border-magenta-500 pl-6">
          <div className="space-y-2">
            <h2 className="text-xs font-pixel text-magenta-500 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> LOG_STREAM
            </h2>
            <div className="bg-magenta-500/5 p-4 border border-magenta-500/20 font-mono text-[10px] space-y-2 h-[400px] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
              {[
                "INITIALIZING_NEURAL_LINK...",
                "SYNCING_TEMPORAL_GRID...",
                "WARNING: HEURISTIC_DRIFT_DETECTED",
                "STABILIZING_VOID_CHAMBER...",
                "DATA_PACKET_0x882_RECEIVED",
                "ENCRYPTING_BIO_SIGNALS...",
                "STATUS: NOMINAL",
                "EXECUTING_SNAKE_PROTOCOL...",
                "AUDIO_SYNTHESIS_ACTIVE",
                "SCANNING_FOR_INTRUDERS...",
                "MEMORY_LEAK_CONTAINED",
                "RECALIBRATING_SENSORS...",
                "VOID_BREACH_PREVENTED",
                "SYSTEM_VOID_READY",
              ].map((log, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:text-white transition-colors"
                >
                  {`> ${log}`}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="p-4 border-2 border-cyan-400 bg-cyan-400/5">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-pixel">CAUTION</span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-70">
              DO NOT DISCONNECT DURING DATA TRANSFER. NEURAL FEEDBACK MAY CAUSE TEMPORAL DISPLACEMENT.
            </p>
          </div>
        </aside>

        {/* Center: The Game */}
        <section className="lg:col-span-6 flex flex-col items-center border-x-2 border-white/10 px-8">
          <div className="w-full mb-8 flex justify-between items-end">
            <div className="font-pixel text-[10px] text-magenta-500 animate-pulse">
              LIVE_FEED_01
            </div>
            <div className="text-[8px] opacity-30 font-mono">
              COORD: 34.22.89.1
            </div>
          </div>
          <SnakeGame />
        </section>

        {/* Right: Audio Matrix */}
        <aside className="lg:col-span-3 space-y-8 border-r-2 border-magenta-500 pr-6 text-right">
          <div className="space-y-4">
            <h2 className="text-xs font-pixel text-magenta-500 flex items-center justify-end gap-2">
              AUDIO_MATRIX <Activity className="w-4 h-4" />
            </h2>
            <MusicPlayer />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-pixel text-white/40">SIGNAL_QUEUE</h3>
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="group cursor-wait p-2 border border-white/5 hover:border-cyan-400/50 transition-all">
                  <div className="text-[10px] font-mono text-cyan-400/60 group-hover:text-cyan-400">
                    {`SIG_0x${(i + 4).toString(16).toUpperCase()}F2`}
                  </div>
                  <div className="text-[8px] text-white/20 uppercase">Frequency: 44.1kHz</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Terminal Info */}
      <footer className="border-t-4 border-magenta-500 mt-12 p-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-mono opacity-40">
            [ TERMINAL_ID: 0x882-VOID ] [ KERNEL: 6.2.0-ARCADE ]
          </div>
          <div className="flex gap-8 text-[10px] font-pixel text-magenta-500">
            <span className="animate-pulse">CONNECTED</span>
            <span className="opacity-20">ENCRYPTED</span>
            <span className="opacity-20">ANONYMOUS</span>
          </div>
          <div className="text-[10px] font-mono opacity-40">
            © 2026 MACHINE_MIND_INDUSTRIES
          </div>
        </div>
      </footer>
    </div>
  );
}
