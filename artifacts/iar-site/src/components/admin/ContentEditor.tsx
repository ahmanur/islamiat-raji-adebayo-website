import React, { useEffect, useState } from 'react';
import { getContent, setContentBulk, type SectionKey } from '@/lib/cms';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'url';
  placeholder?: string;
}

interface ContentEditorProps {
  section: SectionKey;
  fields: Field[];
  defaults?: Record<string, string>;
}

export function ContentEditor({ section, fields, defaults = {} }: ContentEditorProps) {
  const [values, setValues] = useState<Record<string, string>>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent(section).then(data => {
      setValues({ ...defaults, ...data });
      setLoading(false);
    });
  }, [section]);

  const handleSave = async () => {
    setSaving(true);
    await setContentBulk(section, values);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading…</div>;
  }

  return (
    <div className="space-y-5">
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              rows={5}
              value={values[field.key] ?? ''}
              onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
          ) : (
            <input
              type={field.type === 'url' ? 'url' : 'text'}
              value={values[field.key] ?? ''}
              onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
      >
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}
