import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';

type DrumKey = 'KICK' | 'SNARE' | 'HIHAT' | 'OPENHAT' | 'CLAP';
type PatternMap = Record<DrumKey, boolean[]>;

type TempoResponse = {
  forecasted_tempo: number;
  model: string;
};

const STEPS = 16;
const DRUMS: DrumKey[] = ['KICK', 'SNARE', 'HIHAT', 'OPENHAT', 'CLAP'];

const emptyPatterns = (): PatternMap => ({
  KICK: Array(STEPS).fill(false),
  SNARE: Array(STEPS).fill(false),
  HIHAT: Array(STEPS).fill(false),
  OPENHAT: Array(STEPS).fill(false),
  CLAP: Array(STEPS).fill(false),
});

export default function RhythmMachine(): JSX.Element {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [patterns, setPatterns] = useState<PatternMap>(emptyPatterns());
  const [tempo, setTempo] = useState(128);
  const [isPlaying, setIsPlaying] = useState(false);
  const [forecastedTempo, setForecastedTempo] = useState<number | null>(null);
  const [modelTag, setModelTag] = useState<string>('—');

  const presets = useMemo(
    () => ['808 Cowbell', 'Glitch', 'Jazz Fusion', 'Afrobeat', 'Lo-Fi', 'Stadium Rock', 'Ambient'],
    [],
  );
  const genres = useMemo(() => ['TECHNO', 'HOUSE', 'TRAP', 'BREAKBEAT', 'MINIMAL'], []);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch('/api/forecast-tempo');
        const data = (await response.json()) as TempoResponse;
        const boundedTempo = Math.max(60, Math.min(200, Math.round(data.forecasted_tempo)));
        setForecastedTempo(boundedTempo);
        setTempo(boundedTempo);
        setModelTag(data.model);
      } catch (error) {
        console.error('Forecast fetch failed:', error);
      }
    };
    fetchForecast();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const randomness = Math.min(0.85, Math.max(0.35, tempo / 220));
    const next = DRUMS.reduce((acc, drum) => {
      acc[drum] = Array(STEPS)
        .fill(false)
        .map((_, i) => (i % 4 === 0 ? Math.random() > 0.2 : Math.random() < randomness * 0.55));
      return acc;
    }, {} as PatternMap);
    setPatterns(next);
    setIsGenerating(false);
  };

  const toggleCell = (drum: DrumKey, index: number) => {
    setPatterns((prev) => ({
      ...prev,
      [drum]: prev[drum].map((val, i) => (i === index ? !val : val)),
    }));
  };

  const handleClear = () => setPatterns(emptyPatterns());

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white">Rhythm Machine</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">AI-powered • Model 002</p>
        </div>
        <div className="text-right text-[10px] text-slate-400">
          <div>SARIMA Tempo: {forecastedTempo ?? '—'} BPM</div>
          <div>Model: {modelTag}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your beat (e.g., minimal techno)"
          className="flex-1 p-2 border border-slate-700 bg-slate-950 rounded text-xs"
        />
        <button
          disabled={isGenerating}
          onClick={handleGenerate}
          className="px-3 py-2 bg-emerald-600/90 text-white rounded text-xs font-bold"
        >
          {isGenerating ? 'Generating…' : 'Generate'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => setDescription(preset)}
            className="px-2 py-1 bg-slate-800 rounded text-[10px] hover:bg-slate-700"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setIsPlaying(true)} className="px-3 py-1.5 bg-blue-600 rounded text-xs font-bold">
          Play
        </button>
        <button onClick={() => setIsPlaying(false)} className="px-3 py-1.5 bg-rose-600 rounded text-xs font-bold">
          Stop
        </button>
        <button onClick={handleClear} className="px-3 py-1.5 bg-slate-700 rounded text-xs font-bold flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Clear
        </button>

        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-slate-400 uppercase">Tempo</span>
          <input
            type="range"
            min="60"
            max="200"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value, 10))}
          />
          <span className="font-bold tabular-nums">{tempo}</span>
          <span className="text-slate-500">BPM</span>
          <span className="text-violet-400 uppercase">{isPlaying ? 'LIVE' : 'IDLE'}</span>
        </div>
      </div>

      <div className="space-y-2">
        {DRUMS.map((drum) => (
          <div key={drum} className="flex items-center gap-2">
            <span className="w-16 text-[10px] text-slate-400 font-bold">{drum}</span>
            <div className="grid grid-cols-16 gap-1">
              {patterns[drum].map((active, i) => (
                <button
                  key={`${drum}-${i}`}
                  onClick={() => toggleCell(drum, i)}
                  className={`w-5 h-5 rounded ${active ? 'bg-blue-500' : 'bg-slate-700'}`}
                  aria-label={`${drum}-${i}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {genres.map((genre) => (
          <button key={genre} onClick={() => setDescription(genre.toLowerCase())} className="px-3 py-1 bg-black text-white rounded text-[10px]">
            {genre}
          </button>
        ))}
      </div>
    </section>
  );
}
