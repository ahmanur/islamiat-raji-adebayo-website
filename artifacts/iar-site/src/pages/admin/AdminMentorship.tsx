import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ListEditor } from '@/components/admin/ListEditor';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const COLLABORATOR_FIELDS = [
  {
    key: 'image',
    label: 'Photo',
    type: 'image' as const,
    imageFallback: '',
    imageHint: 'Headshot or profile photo.',
  },
  { key: 'name', label: 'Name', placeholder: 'Full Name' },
  { key: 'profile_url', label: 'Profile URL (name will link here)', placeholder: 'https://university.edu/people/name' },
  { key: 'role', label: 'Role / Position', placeholder: 'Associate Professor' },
  { key: 'institution', label: 'Institution', placeholder: 'Cornell University' },
];

const PERSON_FIELDS = [
  {
    key: 'image',
    label: 'Photo',
    type: 'image' as const,
    imageFallback: '',
    imageHint: 'Headshot or profile photo.',
  },
  { key: 'name', label: 'Name', placeholder: 'Full Name' },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: ['current', 'past'],
  },
  { key: 'role', label: 'Role / Position', placeholder: 'PhD Student' },
  { key: 'institution', label: 'Institution', placeholder: 'Cornell University' },
  { key: 'description', label: 'Bio / Description', type: 'textarea' as const },
  { key: 'email', label: 'Email Address', placeholder: 'name@university.edu' },
  {
    key: 'links',
    label: 'Profile Links (comma-separated "Label|URL" pairs)',
    placeholder: 'CV|https://..., Google Scholar|https://..., Twitter/X|https://...',
  },
];

export function AdminMentorship() {
  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">People</h1>
          <p className="text-slate-400 text-sm">Edit the intro text, roles, and People sub-sections (Collaborators, Mentees, Funding).</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-4">Section Text</h2>
          <ContentEditor
            section="mentorship"
            fields={[
              {
                key: 'bg_image',
                label: 'Section Image (shown on the right side of the People header)',
                type: 'image',
                imageHint: 'Landscape or square photo. Displayed with a subtle colour overlay.',
              },
              { key: 'intro', label: 'Introduction (displayed as pull quote)', type: 'textarea' },
              { key: 'para2', label: 'Second Paragraph', type: 'textarea' },
              { key: 'quote', label: 'Featured Quote (shown on image card)', type: 'textarea' },
              { key: 'application', label: 'How to Apply / Contact', type: 'textarea' },
            ]}
            defaults={CONTENT_DEFAULTS.mentorship}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Roles / Opportunity Cards</h2>
          <p className="text-slate-500 text-xs mb-4">Shown as small cards on the upper People section.</p>
          <ListEditor
            listKey="mentorship_roles"
            itemLabel="Role"
            fields={[
              { key: 'title', label: 'Role Title', placeholder: 'Graduate Students' },
              { key: 'description', label: 'Description', type: 'textarea' },
            ]}
            defaultItems={LIST_DEFAULTS.mentorship_roles}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Collaborators</h2>
          <p className="text-slate-500 text-xs mb-4">Each entry appears as a clickable name in the Collaborators list. The name links to the Profile URL.</p>
          <ListEditor
            listKey="collaborators"
            itemLabel="Collaborator"
            fields={COLLABORATOR_FIELDS}
            defaultItems={LIST_DEFAULTS.collaborators}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Mentees</h2>
          <p className="text-slate-500 text-xs mb-4">Each entry appears as a photo card in the Mentees section.</p>
          <ListEditor
            listKey="mentees"
            itemLabel="Mentee"
            fields={PERSON_FIELDS}
            defaultItems={LIST_DEFAULTS.mentees}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Funding</h2>
          <p className="text-slate-500 text-xs mb-4">Each entry appears as a card in the Funding section. Use the photo field for a funder logo.</p>
          <ListEditor
            listKey="funding"
            itemLabel="Funder"
            fields={[
              {
                key: 'image',
                label: 'Logo / Image',
                type: 'image' as const,
                imageFallback: '',
                imageHint: 'Funder logo or representative image.',
              },
              { key: 'name', label: 'Funder / Organisation Name', placeholder: 'NSF' },
              { key: 'role', label: 'Grant / Award Title', placeholder: 'Rose Postdoctoral Fellowship' },
              { key: 'institution', label: 'Programme (optional)', placeholder: '' },
              { key: 'description', label: 'Description', type: 'textarea' as const },
            ]}
            defaultItems={LIST_DEFAULTS.funding}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
