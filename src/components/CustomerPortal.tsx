import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Camera, 
  Video, 
  Upload, 
  Sparkles, 
  MessageSquareQuote, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  ArrowRight,
  Heart,
  Share2,
  Utensils
} from 'lucide-react';
import { FranchiseStore, StorePhotoAudit, CustomerReview } from '../types/franchise';

interface CustomerPortalProps {
  stores: FranchiseStore[];
  onOpenCustomerUpload: (storeNumber?: number) => void;
  onSelectStore: (storeNumber: number) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  stores,
  onOpenCustomerUpload,
  onSelectStore,
}) => {
  const [searchCity, setSearchCity] = useState<string>('');
  const [selectedSafetyFilter, setSelectedSafetyFilter] = useState<'all' | 'verified_safe' | 'grade_a'>('all');
  const [activePhotoModal, setActivePhotoModal] = useState<StorePhotoAudit | null>(null);

  // Filter stores
  const filteredStores = stores.filter((s) => {
    const matchesCity = !searchCity || 
      s.location.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      s.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      s.storeNumber.toString().includes(searchCity);

    if (selectedSafetyFilter === 'grade_a') return matchesCity && s.riskScore < 30;
    if (selectedSafetyFilter === 'verified_safe') return matchesCity && s.riskScore < 60;
    return matchesCity;
  });

  // Collect customer photos
  const customerCommunityPhotos = stores.flatMap((s) =>
    s.photos.map((p) => ({ ...p, storeName: s.name, storeCity: s.location.city, storeNumber: s.storeNumber }))
  );

  return (
    <div className="space-y-6">
      {/* Consumer Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-7 sm:p-9 rounded-3xl shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>AI-Verified Food Safety & Dining Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Dine with Confidence. Share Real Experience.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Check verified hygiene ratings across 500 FreshBite restaurants. Upload your dining photos, kitchen video clips, and honest reviews to help keep franchise standards world-class.
          </p>

          {/* Search & Upload Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search by city (e.g. Lucknow, Delhi, Gorakhpur)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              onClick={() => onOpenCustomerUpload(247)}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-teal-900/40 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>+ Share Review & Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-bold text-slate-800">Browse Outlets:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSelectedSafetyFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedSafetyFilter === 'all' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            All Outlets ({stores.length})
          </button>
          <button
            onClick={() => setSelectedSafetyFilter('grade_a')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedSafetyFilter === 'grade_a' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            Grade A (95%+ Clean)
          </button>
          <button
            onClick={() => setSelectedSafetyFilter('verified_safe')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedSafetyFilter === 'verified_safe' ? 'bg-teal-700 text-white' : 'text-slate-600'
            }`}
          >
            Verified Safe
          </button>
        </div>
      </div>

      {/* Store Cards Grid for Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStores.slice(0, 12).map((store) => {
          const cleanlinessPct = 100 - store.riskScore;
          const isGradeA = cleanlinessPct >= 80;
          const isCritical = store.riskScore >= 75;

          return (
            <div
              key={store.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Store Image Header */}
              <div className="relative aspect-16/9 bg-slate-950 overflow-hidden group">
                <img
                  src={store.photos[0]?.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  <span>{store.location.city}</span>
                </div>

                {/* Hygiene Badge */}
                <div className="absolute top-3 right-3">
                  {isGradeA ? (
                    <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{cleanlinessPct}% Grade A</span>
                    </span>
                  ) : isCritical ? (
                    <span className="bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Audit Pending</span>
                    </span>
                  ) : (
                    <span className="bg-amber-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                      <span>{cleanlinessPct}% Clean</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 text-white">
                  <h3 className="text-sm font-bold truncate">{store.name}</h3>
                  <p className="text-[11px] text-slate-300 truncate">{store.address}</p>
                </div>
              </div>

              {/* Store Details Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900 text-xs">
                        {(store.posMetrics.customerSatisfactionScore / 20).toFixed(1)}
                      </span>
                      <span className="text-slate-400">({store.reviews.length} reviews)</span>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500">
                      {store.photos.length} Verified Photos
                    </span>
                  </div>

                  {/* Customer Review snippet */}
                  {store.reviews[0] && (
                    <p className="text-xs text-slate-600 italic mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 line-clamp-2">
                      "{store.reviews[0].text}"
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenCustomerUpload(store.storeNumber)}
                    className="flex-1 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-teal-700" />
                    <span>Upload Review/Media</span>
                  </button>

                  <button
                    onClick={() => onSelectStore(store.storeNumber)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Visual Feed Section */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Dining Photos & Videos</h3>
            <p className="text-xs text-slate-500">Real verified photos and video footage uploaded by diners</p>
          </div>
          <button
            onClick={() => onOpenCustomerUpload(247)}
            className="text-xs text-teal-700 hover:text-teal-800 font-bold underline"
          >
            + Upload Your Experience
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {customerCommunityPhotos.slice(0, 8).map((photo, idx) => (
            <div
              key={idx}
              onClick={() => onSelectStore(photo.storeNumber)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer border border-slate-200"
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between text-white text-xs">
                <span className="text-[10px] font-bold bg-teal-600 px-1.5 py-0.5 rounded self-start">
                  Store #{photo.storeNumber}
                </span>
                <div>
                  <span className="font-bold block truncate">{photo.zone}</span>
                  <span className="text-[10px] text-slate-300 block">{photo.submittedBy || 'Diner'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
