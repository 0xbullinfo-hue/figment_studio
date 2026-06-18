
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { useStudioStore } from '../store.ts';

interface AssetManagerProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

const AssetManager: React.FC<AssetManagerProps> = ({ onBack, onNavigate }) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { projects } = useStudioStore();
  const [folders, setFolders] = useState([
    { name: 'Skyline Penthouse', assets: 24, color: 'blue', updated: '2 hours ago' },
    { name: 'Nexus Hub District', assets: 102, color: 'orange', updated: 'Yesterday' }
  ]);
  const [initialAssets, setInitialAssets] = useState([
    { name: 'Exterior_View_V1.jpg', project: 'Skyline Penthouse', size: '4.2 MB', type: 'image', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=400' },
    { name: 'Main_Section_A.pdf', project: 'Nexus Hub District', size: '12.8 MB', type: 'blueprint' },
    { name: 'Site_Walkthrough.mp4', project: 'Skyline Penthouse', size: '85 MB', type: 'video', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400' }
  ]);

  useEffect(() => {
    // Dynamically inject user projects from the Zustand store
    const storeFolders = projects.map(p => ({
      name: p.title,
      assets: p.assets?.length || 0,
      color: 'blue',
      updated: 'Recently'
    }));

    const storeAssets = projects.flatMap(p =>
      (p.assets || []).map(a => ({
        name: a.name,
        project: p.title,
        size: a.size || '1MB',
        type: a.format || 'file',
        url: '' // Placeholder
      }))
    );

    setFolders(prev => {
      // Avoid exact duplicates by name
      const newFolders = storeFolders.filter(sf => !prev.some(pf => pf.name === sf.name));
      return [...newFolders, ...prev];
    });

    setInitialAssets(prev => {
      const newAssets = storeAssets.filter(sa => !prev.some(pa => pa.name === sa.name && pa.project === sa.project));
      return [...newAssets, ...prev];
    });
  }, [projects]);

  const filteredAssets = initialAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder ? asset.project === selectedFolder : true;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="bg-[#fcfcfc] text-[#1c140d] antialiased min-h-screen font-body">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="size-9 bg-primary flex items-center justify-center rounded-lg text-white">
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">BACK <span className="text-primary font-black">TO PORTAL</span></h2>
            </button>
            <div className="hidden md:flex items-center flex-1 min-w-[320px]">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                  className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-gray-500"
                  placeholder="Search projects, renders, or blueprints..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
              Upload
            </button>
            <div className="h-10 w-[1px] bg-gray-200 mx-2"></div>
            <div className="size-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary">JT</div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        <aside className="w-64 fixed h-[calc(100vh-80px)] overflow-y-auto py-8 px-6 hidden lg:block border-r border-gray-100 text-left">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Management</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${!selectedFolder ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="material-symbols-outlined">folder_open</span>
                  <span>All Files</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-left">
                  <span className="material-symbols-outlined">schedule</span>
                  <span>Recent</span>
                </button>
                <button onClick={() => onNavigate('billing')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-left">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <span>Invoices</span>
                </button>
              </nav>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Project Filter</h3>
              <div className="flex flex-col gap-2">
                {folders.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFolder(selectedFolder === f.name ? null : f.name)}
                    className={`text-xs px-4 py-2 rounded-lg border text-left transition-all ${selectedFolder === f.name ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <nav className="flex items-center gap-2 text-sm font-medium">
              <button onClick={() => setSelectedFolder(null)} className="text-gray-400 hover:text-primary transition-colors">Library</button>
              <span className="material-symbols-outlined text-sm text-gray-300">chevron_right</span>
              <span className="text-gray-900 font-bold">{selectedFolder || 'All Assets'}</span>
            </nav>
          </div>

          {!selectedFolder && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-extrabold text-[#1c140d]">Project Folders</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {folders.map((folder, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedFolder(folder.name)}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:border-primary transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="size-14 bg-gray-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-3xl">folder</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{folder.name}</h3>
                      <p className="text-sm text-gray-500">{folder.assets} assets • {folder.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-extrabold text-[#1c140d]">
                {selectedFolder ? `${selectedFolder} Assets` : 'Recent Assets'}
              </h2>
            </div>
            {filteredAssets.length === 0 ? (
              <div className="py-20 text-center text-gray-400 italic">No assets found matching your criteria.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAssets.map((asset, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                    <div className="aspect-square bg-gray-50 relative overflow-hidden flex items-center justify-center">
                      {asset.url ? (
                        <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${asset.url})` }}></div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <span className="material-symbols-outlined text-5xl">description</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button className="bg-white text-primary p-2 rounded-full hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined">download</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs truncate">{asset.name}</p>
                      <p className="text-[9px] text-gray-400 mt-1 uppercase font-black">{asset.size} • {asset.project}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AssetManager;
