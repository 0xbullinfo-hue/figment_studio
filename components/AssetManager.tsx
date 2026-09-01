import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardShell from './DashboardShell.tsx';
import { useStudioStore } from '../store.ts';
import {
  Search,
  FolderOpen,
  Download,
  FileText,
} from 'lucide-react';

const AssetManager: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { projects } = useStudioStore();
  const [folders, setFolders] = useState([
    { name: 'Skyline Penthouse', assets: 24, color: 'blue', updated: '2 hours ago' },
    { name: 'Nexus Hub District', assets: 102, color: 'orange', updated: 'Yesterday' },
  ]);
  const [initialAssets, setInitialAssets] = useState([
    { name: 'Exterior_View_V1.jpg', project: 'Skyline Penthouse', size: '4.2 MB', type: 'image', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400' },
    { name: 'Main_Section_A.pdf', project: 'Nexus Hub District', size: '12.8 MB', type: 'blueprint' },
    { name: 'Site_Walkthrough.mp4', project: 'Skyline Penthouse', size: '85 MB', type: 'video', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400' },
  ]);

  useEffect(() => {
    // Dynamically inject user projects from the Zustand store
    const storeFolders = projects.map((p) => ({
      name: p.title,
      assets: p.assets?.length || 0,
      color: 'blue',
      updated: 'Recently',
    }));

    const storeAssets = projects.flatMap((p) =>
      (p.assets || []).map((a) => ({
        name: a.name,
        project: p.title,
        size: a.size || '1MB',
        type: a.format || 'file',
        url: '',
      }))
    );

    setFolders((prev) => {
      const newFolders = storeFolders.filter((sf) => !prev.some((pf) => pf.name === sf.name));
      return [...newFolders, ...prev];
    });

    setInitialAssets((prev) => {
      const newAssets = storeAssets.filter((sa) => !prev.some((pa) => pa.name === sa.name && pa.project === sa.project));
      return [...newAssets, ...prev];
    });
  }, [projects]);

  const filteredAssets = initialAssets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? asset.project === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  return (
    <DashboardShell title="Assets" subtitle="Access and download project deliverables">
      <Helmet>
        <title>Asset Manager | Figment Studio</title>
        <meta name="description" content="Securely access, search, and download your project models, blueprints, and high-resolution visual assets from Figment Studio." />
      </Helmet>

      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Search Bar */}
          <div className="max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
              <input
                className="w-full bg-[#121212] border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:border-primary focus:ring-1 focus:ring-primary/20 text-sm text-white placeholder:text-white/20 outline-none transition-all"
                placeholder="Search projects, renders, or blueprints..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {!selectedFolder && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">Project Folders</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {folders.map((folder, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFolder(folder.name)}
                    className="bg-[#121212] p-5 rounded-xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="size-14 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <FolderOpen className="w-7 h-7" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white mb-1">{folder.name}</h3>
                      <p className="text-xs text-white/40">{folder.assets} assets — {folder.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">
                {selectedFolder ? `${selectedFolder} Assets` : 'Recent Assets'}
              </h2>
            </div>
            {filteredAssets.length === 0 ? (
              <div className="py-20 text-center text-white/30 text-sm font-sans">No assets found matching your criteria.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAssets.map((asset, i) => (
                  <div key={i} className="bg-[#121212] rounded-xl overflow-hidden hover:border-primary/30 transition-all group border border-white/5">
                    <div className="aspect-square bg-white/5 relative overflow-hidden flex items-center justify-center">
                      {asset.url ? (
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${asset.url})` }} />
                      ) : (
                        <div className="text-center text-white/20">
                          <FileText className="w-12 h-12 mx-auto" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button className="bg-primary text-white p-2.5 rounded-full hover:scale-110 transition-transform">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs text-white truncate">{asset.name}</p>
                      <p className="text-[9px] text-white/30 mt-1 uppercase font-medium">{asset.size} — {asset.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AssetManager;
