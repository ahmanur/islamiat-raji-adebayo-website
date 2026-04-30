import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from './cmsDefaults';

function writeClient() {
  return supabaseAdmin ?? supabase;
}

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
  await writeClient().from('cms_content').upsert(
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
  await writeClient().from('cms_content').upsert(rows, { onConflict: 'section,key' });
}

export type ListKey =
  | 'research_projects'
  | 'research_themes'
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
  await writeClient().from('cms_lists').upsert(
    { ...item, list_key: listKey, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  );
}

export async function deleteListItem(id: string): Promise<void> {
  await writeClient().from('cms_lists').delete().eq('id', id);
}

export async function reorderList(listKey: ListKey, ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, i) =>
      writeClient().from('cms_lists').update({ sort_order: i }).eq('id', id)
    )
  );
}

export async function seedAllDefaults(): Promise<void> {
  const client = writeClient();
  const contentSections = Object.entries(CONTENT_DEFAULTS) as [SectionKey, Record<string, string>][];
  for (const [section, values] of contentSections) {
    const rows = Object.entries(values).map(([key, value]) => ({
      section,
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    await client.from('cms_content').upsert(rows, { onConflict: 'section,key', ignoreDuplicates: false });
  }

  const listEntries = Object.entries(LIST_DEFAULTS) as [ListKey, Array<Record<string, string>>][];
  for (const [listKey, items] of listEntries) {
    if (items.length === 0) continue;
    const { data: existing } = await supabase
      .from('cms_lists')
      .select('id')
      .eq('list_key', listKey)
      .limit(1);

    if (existing && existing.length > 0) continue;

    const rows = items.map((data, i) => ({
      id: crypto.randomUUID(),
      list_key: listKey,
      sort_order: i,
      data,
      updated_at: new Date().toISOString(),
    }));
    await client.from('cms_lists').insert(rows);
  }
}
