import React, { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { getList, upsertListItem, type ListRecord } from '@/lib/cms';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

type ProjectRecord = ListRecord & { data: { title?: string; theme?: string; theme_order?: number; [key: string]: any } };

function ThemeProjectReorder() {
  const [themes, setThemes] = useState<string[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    Promise.all([
      getList('research_themes'),
      getList('research_projects'),
    ]).then(([themeRows, projectRows]) => {
      const titles = themeRows.map(r => r.data.title as string).filter(Boolean);
      setThemes(titles);
      if (titles.length > 0 && !activeTheme) setActiveTheme(titles[0]);
      const ps = projectRows.map(r => ({
        ...r,
        data: { ...r.data, theme_order: Number(r.data.theme_order ?? 999) },
      })) as ProjectRecord[];
      setProjects(ps);
      setLoaded(true);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const projectsForTheme = (theme: string) =>
    [...projects.filter(p => p.data.theme?.trim().toLowerCase() === theme.trim().toLowerCase())]
      .sort((a, b) => (a.data.theme_order ?? 999) - (b.data.theme_order ?? 999));

  const move = (theme: string, index: number, dir: -1 | 1) => {
    const group = projectsForTheme(theme);
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= group.length) return;
    const a = group[index];
    const b = group[newIndex];
    setProjects(prev =>
      prev.map(p => {
        if (p.id === a.id) return { ...p, data: { ...p.data, theme_order: newIndex } };
        if (p.id === b.id) return { ...p, data: { ...p.data, theme_order: index } };
        return p;
      })
    );
    setSaved(false);
  };

  const save = async (theme: string) => {
    const group = projectsForTheme(theme);
    setSaving(true);
    await Promise.all(
      group.map((p, i) =>
        upsertListItem('research_projects', { ...p, data: { ...p.data, theme_order: i } })
      )
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!loaded) return <p className="text-slate-500 text-xs py-4">Loading projects…</p>;
  if (themes.length === 0) return <p className="text-slate-500 text-xs py-4">No themes found. Add themes above first.</p>;

  return (
    <div>
      {/* Theme tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {themes.map(t => (
          <button
            key={t}
            onClick={() => { setActiveTheme(t); setSaved(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTheme === t
                ? 'bg-primary text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTheme && (() => {
        const group = projectsForTheme(activeTheme);
        if (group.length === 0) return (
          <p className="text-slate-500 text-xs py-3">
            No projects assigned to <span className="text-slate-300">{activeTheme}</span> yet.
          </p>
        );
        return (
          <div className="space-y-2">
            {group.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
              >
                <span className="text-primary text-xs font-bold w-5 text-center flex-shrink-0">{i + 1}</span>
                <span className="text-white text-sm flex-1 truncate">{p.data.title || '(untitled)'}</span>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => move(activeTheme, i, -1)}
                    disabled={i === 0}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(activeTheme, i, 1)}
                    disabled={i === group.length - 1}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-3">
              <button
                onClick={() => save(activeTheme)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : saving ? 'Saving…' : 'Save Order'}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export function AdminResearch() {
  const [themeOptions, setThemeOptions] = useState<string[]>(
    LIST_DEFAULTS.research_themes.map(t => t.title as string)
  );

  useEffect(() => {
    getList('research_themes').then(rows => {
      if (rows.length > 0) {
        const titles = rows.map(r => (r.data.title as string)).filter(Boolean);
        if (titles.length > 0) setThemeOptions(titles);
      }
    });
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Research</h1>
          <p className="text-slate-400 text-sm">Edit the research introduction, themes, and projects.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Section Introduction</h2>
          <ContentEditor
            section="research"
            fields={[
              {
                key: 'bg_image',
                label: 'Section Background Image',
                type: 'image',
                imageHint: 'Optional full-width photo shown behind the Research section.',
              },
              { key: 'intro', label: 'Introduction Paragraph', type: 'textarea' },
            ]}
            defaults={CONTENT_DEFAULTS.research}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-medium text-sm">Research Themes</h2>
          </div>
          <p className="text-slate-500 text-xs mb-4">
            Themes appear as cards on the Research page. Icon options: <span className="text-slate-400">mic, trees, globe, leaf, heart, mountain, flask, bird</span>
          </p>
          <ListEditor
            listKey="research_themes"
            itemLabel="Theme"
            addAtTop
            fields={[
              {
                key: 'image',
                label: 'Theme Image',
                type: 'image',
                imageHint: 'Optional photo shown at the top of the theme card.',
              },
              { key: 'icon', label: 'Icon Name', placeholder: 'mic / trees / globe / leaf / heart / mountain' },
              { key: 'title', label: 'Theme Title', placeholder: 'Bioacoustics' },
              { key: 'description', label: 'Short Description (shown on Research page card)', type: 'textarea' },
              { key: 'intro', label: 'Theme Introduction (shown at top of theme page, before projects)', type: 'textarea' },
            ]}
            defaultItems={LIST_DEFAULTS.research_themes}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-white font-medium text-sm">Research Projects</h2>
          </div>
          <p className="text-slate-500 text-xs mb-4">
            Each project has an image you can upload. The first item is shown as the current project.
          </p>
          <ListEditor
            listKey="research_projects"
            itemLabel="Project"
            addAtTop
            fields={[
              {
                key: 'image',
                label: 'Project Image',
                type: 'image',
                imageFallback: '/images/spectrogram-art.png',
                imageHint: 'Photo representing this research project.',
              },
              { key: 'title', label: 'Project Title', placeholder: 'Urban Campus Soundscape Project' },
              { key: 'theme', label: 'Research Theme', type: 'select', options: themeOptions },
              { key: 'status', label: 'Status', placeholder: 'Current Project / Past Project / Doctoral Research' },
              { key: 'location', label: 'Location / Institution', placeholder: 'Cornell University, Ithaca NY' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'methods', label: 'Methods (comma-separated)', placeholder: 'Autonomous acoustic recorders, Community science' },
              {
                key: 'gallery',
                label: 'Additional Photos',
                type: 'gallery',
                imageHint: 'Upload extra photos shown in the project gallery on the detail page.',
              },
              {
                key: 'map_image',
                label: 'Map / Site Photo',
                type: 'image',
                imageHint: 'A map, satellite image, or site overview photo.',
              },
              { key: 'map_embed', label: 'Map Embed Code (paste Google Maps iframe or embed URL)', type: 'textarea', placeholder: '<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>' },
              { key: 'map_link', label: 'Google Maps Link (optional, for "Open in Maps" button)', type: 'url', placeholder: 'https://maps.google.com/…' },
              { key: 'collaborators', label: 'Collaborators (one per line)', type: 'textarea', placeholder: 'Dr. Jane Smith — Cornell University\nProf. Kwame Osei — University of Ghana' },
              { key: 'network', label: 'Partner Network', type: 'network' },
            ]}
            defaultItems={LIST_DEFAULTS.research_projects}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Project Order Within Themes</h2>
          <p className="text-slate-500 text-xs mb-5">
            Use the arrows to set the display order of projects within each theme. Select a theme tab, rearrange, then click Save Order.
          </p>
          <ThemeProjectReorder />
        </div>
      </div>
    </AdminLayout>
  );
}
