import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ImageIcon, Upload, Trash2, Eye, RefreshCw, Sparkles, Check, 
  X, Filter, Plus, Save, Layers, AlertTriangle 
} from 'lucide-react';

export const WebsiteImageManager = () => {
  const { 
    websiteImages, 
    updateWebsiteImage, 
    addWebsiteImage, 
    deleteWebsiteImage, 
    categories, 
    updateCategory, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('All');
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [deleteConfirmImg, setDeleteConfirmImg] = useState(null);

  const [newImageForm, setNewImageForm] = useState({
    name: '',
    type: 'Promotional Banners',
    location: 'Homepage Banner Section',
    image: '/images/cycles_showcase/hero_cycle.png'
  });

  const IMAGE_TYPES = [
    'All',
    'Category Images',
    'Product Images',
    'Offer/Sale Images',
    'Promotional Banners',
    'Collection Images',
    'Mobile Images',
    'Website Background Images',
    'Advertisement Images'
  ];

  const filteredImages = websiteImages.filter(img => {
    if (activeTab === 'All') return true;
    return img.type === activeTab;
  });

  const handleFileUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateWebsiteImage(id, reader.result);
      
      // Also update matching category if it's a category banner!
      const targetImg = websiteImages.find(i => i.id === id);
      if (targetImg && targetImg.type === 'Category Images') {
        const matchedCategory = categories.find(c => targetImg.name.toLowerCase().includes(c.name.toLowerCase()));
        if (matchedCategory) {
          updateCategory(matchedCategory.id, { bannerImage: reader.result });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropFile = (id, e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(id, file);
    }
  };

  const handleSaveNewAsset = (e) => {
    e.preventDefault();
    if (!newImageForm.name.trim() || !newImageForm.image) {
      showToast("Please provide asset title and image file");
      return;
    }
    addWebsiteImage(newImageForm);
    setIsAddImageModalOpen(false);
    setNewImageForm({
      name: '',
      type: 'Promotional Banners',
      location: 'Homepage Banner Section',
      image: '/images/cycles_showcase/hero_cycle.png'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 p-5 rounded-2xl border border-stone-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Website Image Manager</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {websiteImages.length} Image Assets
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Replace banners, background graphics, category cards, offer posters, and mobile images across the FUNRADO website.
          </p>
        </div>

        <button
          onClick={() => setIsAddImageModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload Custom Website Asset</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {IMAGE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activeTab === type
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-md'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((asset) => (
          <div 
            key={asset.id} 
            className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-500/40 transition-all duration-300"
          >
            {/* Image Preview & Drag and Drop Area */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropFile(asset.id, e)}
              className="relative h-48 bg-black overflow-hidden group cursor-pointer"
            >
              <img 
                src={asset.image} 
                alt={asset.name} 
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                onError={(e) => { e.target.src = '/images/cycles_showcase/hero_cycle.png'; }}
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition-opacity backdrop-blur-xs">
                <Upload className="w-6 h-6 text-amber-400 mb-1" />
                <span>Drag & Drop New Image to Replace</span>
                <span className="text-[10px] text-stone-300 font-normal mt-0.5">Instant Live Update</span>
              </div>

              {/* Type Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-extrabold text-amber-300">
                {asset.type}
              </div>
            </div>

            {/* Content Details & Replace Actions */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-white truncate">{asset.name}</h3>
                <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                  <span className="font-semibold text-stone-300">Used at:</span> 
                  <span className="text-amber-400/90 font-mono truncate">{asset.location}</span>
                </p>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                
                {/* Upload / Replace */}
                <label className="col-span-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors" title="Replace Image">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(asset.id, e.target.files?.[0])}
                  />
                </label>

                {/* Preview */}
                <button
                  onClick={() => setPreviewModalImg(asset)}
                  className="col-span-1 bg-stone-800 hover:bg-stone-700 text-stone-200 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-stone-700 transition-colors"
                  title="Preview Full Image"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => setDeleteConfirmImg(asset)}
                  className="col-span-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* UPLOAD CUSTOM WEBSITE ASSET MODAL                             */}
      {/* ------------------------------------------------------------- */}
      {isAddImageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setIsAddImageModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Upload Custom Website Asset</span>
            </h3>

            <form onSubmit={handleSaveNewAsset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Asset Title / Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Festival Season Sale Banner"
                  value={newImageForm.name} 
                  onChange={(e) => setNewImageForm({ ...newImageForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Asset Category</label>
                  <select
                    value={newImageForm.type}
                    onChange={(e) => setNewImageForm({ ...newImageForm, type: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  >
                    {IMAGE_TYPES.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Where It Is Used</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Header Marquee / Footer"
                    value={newImageForm.location} 
                    onChange={(e) => setNewImageForm({ ...newImageForm, location: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Upload Drop Zone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Image Asset File *</label>
                <div className="border-2 border-dashed border-stone-800 hover:border-amber-400/50 bg-stone-950 rounded-2xl p-4 text-center cursor-pointer">
                  {newImageForm.image ? (
                    <div className="relative h-32 w-full rounded-xl overflow-hidden bg-black">
                      <img src={newImageForm.image} alt="New Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="py-6 text-stone-400">
                      <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                      <span className="text-xs font-bold text-stone-300">Select Image File</span>
                    </div>
                  )}

                  <input 
                    type="file" 
                    accept="image/*" 
                    id="new-asset-file"
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewImageForm(prev => ({ ...prev, image: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="new-asset-file" className="block text-xs font-extrabold text-amber-400 mt-2 hover:underline cursor-pointer">
                    Browse File (JPG, PNG, WEBP)
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddImageModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Website Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PREVIEW IMAGE MODAL                                           */}
      {/* ------------------------------------------------------------- */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-amber-500/30 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-white rounded-full bg-stone-900 border border-stone-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-80 rounded-2xl overflow-hidden bg-black border border-stone-800 p-2 flex items-center justify-center">
              <img src={previewModalImg.image} alt={previewModalImg.name} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-300">
              <span className="font-bold text-white text-base">{previewModalImg.name}</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                {previewModalImg.type}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION POPUP                                      */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmImg && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-white">Delete Asset?</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirmImg.name}"</strong>?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmImg(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteWebsiteImage(deleteConfirmImg.id);
                  setDeleteConfirmImg(null);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
