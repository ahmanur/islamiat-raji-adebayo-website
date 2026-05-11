import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { getList } from '@/lib/cms';

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
              { key: 'map_link', label: 'Google Maps Link (optional)', type: 'url', placeholder: 'https://maps.google.com/…' },
              { key: 'collaborators', label: 'Collaborators (one per line)', type: 'textarea', placeholder: 'Dr. Jane Smith — Cornell University\nProf. Kwame Osei — University of Ghana' },
              { key: 'network', label: 'Partner Network', type: 'network' },
            ]}
            defaultItems={LIST_DEFAULTS.research_projects}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
