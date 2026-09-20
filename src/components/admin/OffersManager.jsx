import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Tag, Plus, Edit, Trash2, CheckCircle, ToggleLeft, ToggleRight, 
  Sparkles, Calendar, Percent, X, Save, AlertTriangle, Upload 
} from 'lucide-react';

export const OffersManager = () => {
  const { offers, addOffer, updateOffer, deleteOffer, toggleOfferStatus, categories, showToast } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteConfirmOffer, setDeleteConfirmOffer] = useState(null);

  const [offerForm, setOfferForm] = useState({
    name: '',
    description: '',
    discountPercent: 20,
    offerPrice: '',
    couponCode: 'FUNRADO20',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    isActive: true,
    bannerImage: '/images/cycles_showcase/hero_supercar.png'
  });

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'add') {
          setOfferForm(prev => ({ ...prev, bannerImage: reader.result }));
        } else if (type === 'edit' && editingOffer) {
          setEditingOffer(prev => ({ ...prev, bannerImage: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAddOffer = (e) => {
    e.preventDefault();
    if (!offerForm.name.trim() || !offerForm.couponCode.trim()) {
      showToast("Please provide offer name and coupon code");
      return;
    }
    addOffer(offerForm);
    setIsAddModalOpen(false);
    setOfferForm({
      name: '',
      description: '',
      discountPercent: 20,
      offerPrice: '',
      couponCode: 'FUNRADO20',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      isActive: true,
      bannerImage: '/images/cycles_showcase/hero_supercar.png'
    });
  };

  const handleSaveEditOffer = (e) => {
    e.preventDefault();
    if (!editingOffer || !editingOffer.name.trim()) return;
    updateOffer(editingOffer.id, editingOffer);
    setEditingOffer(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 p-5 rounded-2xl border border-stone-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Offers & Coupons Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {offers.length} Active Offers
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Create promotional discount banners, flash sale coupons, and offer tags that automatically display on customer product cards.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((off) => {
          const isActive = off.isActive;
          return (
            <div 
              key={off.id}
              className={`bg-stone-900 border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 ${
                isActive ? 'border-amber-500/40 hover:border-amber-500/60' : 'border-stone-800 opacity-60'
              }`}
            >
              {/* Offer Banner Preview */}
              <div className="relative h-40 bg-black overflow-hidden group">
                <img 
                  src={off.bannerImage || '/images/cycles_showcase/hero_supercar.png'} 
                  alt={off.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => { e.target.src = '/images/cycles_showcase/hero_supercar.png'; }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                {/* Coupon Code Pill */}
                <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-mono font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{off.couponCode}</span>
                </div>

                {/* Active Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${
                    isActive ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/30 text-rose-300 border-rose-500/40'
                  }`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-black text-white truncate drop-shadow">{off.name}</h3>
                  <p className="text-xs text-amber-300 font-bold">{off.discountPercent}% OFF • {off.description}</p>
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Valid: {off.startDate} to {off.endDate}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  
                  {/* Edit */}
                  <button
                    onClick={() => setEditingOffer(off)}
                    className="col-span-1 bg-stone-800 hover:bg-amber-500/20 text-stone-200 hover:text-amber-300 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-stone-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {/* Activate / Deactivate Toggle */}
                  <button
                    onClick={() => toggleOfferStatus(off.id)}
                    className={`col-span-1 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-colors ${
                      isActive 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isActive ? <ToggleRight className="w-4 h-4 text-amber-400" /> : <ToggleLeft className="w-4 h-4 text-emerald-400" />}
                    <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteConfirmOffer(off)}
                    className="col-span-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CREATE OFFER MODAL                                            */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Create New Offer & Coupon</span>
            </h3>

            <form onSubmit={handleSaveAddOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Offer Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Summer Special 25% OFF"
                  value={offerForm.name} 
                  onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Coupon Code *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="SUMMER25"
                    value={offerForm.couponCode} 
                    onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value.toUpperCase() })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-300 font-bold focus:border-amber-400 outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Discount (%)</label>
                  <input 
                    type="number" 
                    placeholder="25"
                    value={offerForm.discountPercent} 
                    onChange={(e) => setOfferForm({ ...offerForm, discountPercent: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Start Date</label>
                  <input 
                    type="date" 
                    value={offerForm.startDate} 
                    onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">End Date</label>
                  <input 
                    type="date" 
                    value={offerForm.endDate} 
                    onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Offer Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'add')}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Short Description</label>
                <textarea 
                  rows="2" 
                  placeholder="Get flat 25% off on all kids ride-ons and electric motorbikes!"
                  value={offerForm.description} 
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EDIT OFFER MODAL                                             */}
      {/* ------------------------------------------------------------- */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setEditingOffer(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Edit className="w-5 h-5 text-amber-400" />
              <span>Edit Offer - {editingOffer.name}</span>
            </h3>

            <form onSubmit={handleSaveEditOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Offer Name</label>
                <input 
                  type="text" 
                  required 
                  value={editingOffer.name} 
                  onChange={(e) => setEditingOffer({ ...editingOffer, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Coupon Code</label>
                  <input 
                    type="text" 
                    required 
                    value={editingOffer.couponCode} 
                    onChange={(e) => setEditingOffer({ ...editingOffer, couponCode: e.target.value.toUpperCase() })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-amber-300 font-bold focus:border-amber-400 outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Discount (%)</label>
                  <input 
                    type="number" 
                    value={editingOffer.discountPercent} 
                    onChange={(e) => setEditingOffer({ ...editingOffer, discountPercent: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Replace Offer Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, 'edit')}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION POPUP                                      */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmOffer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-white">Delete Offer?</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirmOffer.name}"</strong>?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOffer(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteOffer(deleteConfirmOffer.id);
                  setDeleteConfirmOffer(null);
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
