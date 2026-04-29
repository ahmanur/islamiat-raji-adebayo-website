import { supabase } from './supabase';

export type SectionKey =
  | 'hero'
  | 'about'
  | 'research'
  | 'publications'
  | 'news'
  | 'mentorship'
  | 'outreach'
  | 'opportunities'
  | 'footer';

export interface ContentRecord {
  id: string;
  section: SectionKey;
  key: string;
  value: string;
  updated_at: string;
}

export async function getContent(section: SectionKey): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('cms_content')
    .select('key, value')
    .eq('section', section);

  if (error || !data) return {};
  return Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
}

export async function setContent(section: SectionKey, key: string, value: string): Promise<void> {
  await supabase.from('cms_content').upsert(
    { section, key, value, updated_at: new Date().toISOString() },
    { onConflict: 'section,key' }
  );
}

export async function setContentBulk(section: SectionKey, entries: Record<string, string>): Promise<void> {
  const rows = Object.entries(entries).map(([key, value]) => ({
    section,
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  await supabase.from('cms_content').upsert(rows, { onConflict: 'section,key' });
}

export type ListKey =
  | 'research_projects'
  | 'publications'
  | 'news_items'
  | 'education'
  | 'awards'
  | 'affiliations'
  | 'nav_items'
  | 'social_links'
  | 'opportunities_list'
  | 'mentorship_roles';

export interface ListRecord {
  id: string;
  list_key: ListKey;
  sort_order: number;
  data: Record<string, string>;
  updated_at: string;
}

export async function getList(listKey: ListKey): Promise<ListRecord[]> {
  const { data, error } = await supabase
    .from('cms_lists')
    .select('*')
    .eq('list_key', listKey)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as ListRecord[];
}

export async function upsertListItem(listKey: ListKey, item: Partial<ListRecord> & { data: Record<string, string> }): Promise<void> {
  await supabase.from('cms_lists').upsert(
    { ...item, list_key: listKey, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  );
}

export async function deleteListItem(id: string): Promise<void> {
  await supabase.from('cms_lists').delete().eq('id', id);
}

export async function reorderList(listKey: ListKey, ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, i) =>
      supabase.from('cms_lists').update({ sort_order: i }).eq('id', id)
    )
  );
}
