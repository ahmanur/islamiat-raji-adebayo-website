import React, { useEffect, useState } from 'react';

interface NetworkData {
  network_name: string;
  stats: { institutions: number; countries: number; expanding: boolean };
  previous_countries: string[];
  current_countries: string[];
  network_url: string;
}

const EMPTY: NetworkData = {
  network_name: '',
  stats: { institutions: 0, countries: 0, expanding: false },
  previous_countries: [],
  current_countries: [],
  network_url: '',
};

function parse(raw: string): NetworkData {
  if (!raw) return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function NetworkEditor({ label, value, onChange }: Props) {
  const [data, setData] = useState<NetworkData>(() => parse(value));
  const [enabled, setEnabled] = useState(() => !!value);

  useEffect(() => {
    setData(parse(value));
    setEnabled(!!value);
  }, []);

  const update = (next: NetworkData) => {
    setData(next);
    onChange(JSON.stringify({
      network_name: next.network_name,
      stats: next.stats,
      previous_countries: next.previous_countries,
      current_countries: next.current_countries,
      network_url: next.network_url,
    }));
  };

  const toggle = (on: boolean) => {
    setEnabled(on);
    if (!on) {
      onChange('');
    } else {
      update(data);
    }
  };

  const set = <K extends keyof NetworkData>(key: K, val: NetworkData[K]) =>
    update({ ...data, [key]: val });

  const setStat = (key: keyof NetworkData['stats'], val: number | boolean) =>
    update({ ...data, stats: { ...data.stats, [key]: val } });

  const parseList = (text: string) =>
    text.split('\n').map(s => s.trim()).filter(Boolean);

  const joinList = (arr: string[]) => arr.join('\n');

  return (
    <div className="border border-slate-600 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-xs text-slate-400">{enabled ? 'Enabled' : 'Disabled'}</span>
          <button
            type="button"
            onClick={() => toggle(!enabled)}
            className={`relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </label>
      </div>

      {enabled && (
        <div className="p-4 space-y-4 bg-slate-850">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Network Name</label>
            <input
              type="text"
              value={data.network_name}
              onChange={e => set('network_name', e.target.value)}
              placeholder="Campus Biodiversity Network"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">No. of Institutions</label>
              <input
                type="number"
                min={0}
                value={data.stats.institutions}
                onChange={e => setStat('institutions', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">No. of Countries</label>
              <input
                type="number"
                min={0}
                value={data.stats.countries}
                onChange={e => setStat('countries', Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col justify-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.stats.expanding}
                  onChange={e => setStat('expanding', e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-xs text-slate-400">Still expanding?</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Previous Phase Countries <span className="text-slate-500 font-normal">(one per line)</span>
            </label>
            <textarea
              rows={4}
              value={joinList(data.previous_countries)}
              onChange={e => set('previous_countries', parseList(e.target.value))}
              placeholder={"Brazil\nCanada\nFrance\nKenya\nSenegal"}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Current Network Countries <span className="text-slate-500 font-normal">(one per line)</span>
            </label>
            <textarea
              rows={6}
              value={joinList(data.current_countries)}
              onChange={e => set('current_countries', parseList(e.target.value))}
              placeholder={"Brazil\nCanada\nFrance\nKenya\nSenegal\nNigeria\nSouth Africa\nIndia\nColombia\nSpain\nBelgium\nUnited States"}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Link to Partner Network Website <span className="text-slate-500 font-normal">(optional)</span></label>
            <input
              type="url"
              value={data.network_url}
              onChange={e => set('network_url', e.target.value)}
              placeholder="https://www.biodivcampus.org/en/institutions"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      )}
    </div>
  );
}
