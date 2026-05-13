import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { CONTENT_DEFAULTS } from '@/lib/cmsDefaults';
import { getContent, setContentBulk } from '@/lib/cms';

export function AdminHero() {
  const [images, setImages] = useState({
    bg_image: '',
    portrait_image: '',
    bird_image: '',
  });
  const [loadingImages, setLoadingImages] = useState(true);
  const [savingImages, setSavingImages] = useState(false);
  const [savedImages, setSavedImages] = useState(false);

  useEffect(() => {
    getContent('hero').then(data => {
      setImages({
        bg_image: data.bg_image ?? '',
        portrait_image: data.portrait_image ?? '',
        bird_image: data.bird_image ?? '',
      });
      setLoadingImages(false);
    });
  }, []);

  const handleSaveImages = async () => {
    setSavingImages(true);
    await setContentBulk('hero', images);
    setSavingImages(false);
    setSavedImages(true);
    setTimeout(() => setSavedImages(false), 2500);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-xl font-semibold text-white mb-1">Hero Section</h1>
          <p className="text-slate-400 text-sm">Edit the homepage hero text and images.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-5">Images</h2>
          {loadingImages ? (
            <div className="text-slate-400 text-sm">Loading…</div>
          ) : (
            <div className="space-y-6">
              <ImagePicker
                label="Background / Forest Image"
                value={images.bg_image}
                fallback="/images/forest-bg.png"
                onChange={v => setImages(p => ({ ...p, bg_image: v }))}
                hint="Full-bleed background image behind the hero. Works best with a wide landscape photo."
              />
              <ImagePicker
                label="Portrait Photo"
                value={images.portrait_image}
                fallback="/images/portrait.jpg"
                onChange={v => setImages(p => ({ ...p, portrait_image: v }))}
                hint="The main portrait on the right side of the hero. Works best in portrait orientation."
              />
              <ImagePicker
                label="Decorative Corner Image"
                value={images.bird_image}
                fallback="/images/hero-bird.png"
                onChange={v => setImages(p => ({ ...p, bird_image: v }))}
                hint="Small image overlapping the portrait. Optional accent photo (bird, field, etc.)."
              />
              <button
                onClick={handleSaveImages}
                disabled={savingImages}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-colors"
              >
                {savingImages ? 'Saving…' : savedImages ? '✓ Saved!' : 'Save Images'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-5">Text Content</h2>
          <ContentEditor
            section="hero"
            fields={[
              { key: 'badge', label: 'Badge Text' },
              { key: 'headline', label: 'Headline' },
              { key: 'headline_accent', label: 'Headline Accent (italic)' },
              { key: 'tagline', label: 'Tagline / Subtitle', type: 'textarea' },
              { key: 'btn_primary', label: 'Primary Button Text' },
              { key: 'btn_secondary', label: 'Secondary Button Text' },
              { key: 'institution', label: 'Institution Line' },
            ]}
            defaults={CONTENT_DEFAULTS.hero}
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-white font-medium text-sm mb-1">Footer</h2>
          <p className="text-slate-500 text-xs mb-5">Edit the name, bio blurb, copyright line, and credit shown in the site footer.</p>
          <ContentEditor
            section="footer"
            fields={[
              { key: 'name', label: 'Name / Title' },
              { key: 'bio', label: 'Bio Blurb', type: 'textarea' },
              { key: 'copyright', label: 'Copyright Text', placeholder: 'Your Name. All rights reserved.' },
              { key: 'credit', label: 'Credit Line (leave blank to hide)', placeholder: 'Designed by …' },
            ]}
            defaults={CONTENT_DEFAULTS.footer}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
