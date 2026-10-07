import React, { useState } from 'react';
import { Listing, Category } from '../../types';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';
import { Sprout, MapPin, Tag, Image, Phone, Check, AlertCircle, ArrowLeft } from 'lucide-react';

interface ListingFormProps {
  initialData?: Partial<Listing>;
  categories: Category[];
  onSubmit: (data: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  farmerCounty: string;
  farmerPhone: string;
  farmerId: string;
}

export const ListingForm: React.FC<ListingFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  farmerCounty,
  farmerPhone,
  farmerId,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || categories[0]?.id || 'cat-1');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState<number | ''>(initialData?.price ?? '');
  const [priceUnit, setPriceUnit] = useState(initialData?.price_unit || 'kg');
  const [quantity, setQuantity] = useState<number | ''>(initialData?.quantity ?? 100);
  const [unit, setUnit] = useState(initialData?.unit || 'kg');
  const [county, setCounty] = useState(initialData?.county || farmerCounty || 'Kericho');
  const [subCounty, setSubCounty] = useState(initialData?.sub_county || '');
  const [ward, setWard] = useState(initialData?.ward || '');
  const [locationName, setLocationName] = useState(
    initialData?.location_name || `${farmerCounty} Market`
  );
  const [contactPhone, setContactPhone] = useState(initialData?.contact_phone || farmerPhone || '');
  const [whatsappNumber, setWhatsappNumber] = useState(initialData?.whatsapp_number || farmerPhone || '');
  const [imageUrl, setImageUrl] = useState(
    initialData?.images && initialData.images.length > 0 ? initialData.images[0].image_url : ''
  );
  const [isAvailable, setIsAvailable] = useState(
    initialData?.is_available !== undefined ? initialData.is_available : true
  );
  const [status, setStatus] = useState<Listing['status']>(initialData?.status || 'published');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dependent SubCounties
  const selectedCountyObj = KENYA_COUNTIES.find((c) => c.name === county);
  const subCounties = selectedCountyObj ? selectedCountyObj.subCounties : [];
  const selectedSubCountyObj = subCounties.find((sc) => sc.name === subCounty);
  const wards = selectedSubCountyObj ? selectedSubCountyObj.wards : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a listing title.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setErrorMsg('Please enter a valid price (KSh).');
      return;
    }
    if (quantity === '' || Number(quantity) <= 0) {
      setErrorMsg('Please enter a valid quantity.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a description for potential buyers.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const defaultImg =
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';

      await onSubmit({
        farmer_id: farmerId,
        category_id: categoryId,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        price_unit: priceUnit.trim(),
        quantity: Number(quantity),
        unit: unit.trim(),
        county,
        sub_county: subCounty,
        ward,
        location_name: locationName.trim(),
        contact_phone: contactPhone.trim(),
        whatsapp_number: whatsappNumber.trim(),
        status,
        is_available: isAvailable,
        images: [{ id: `img-${Date.now()}`, listing_id: '', image_url: defaultImg, sort_order: 0 }],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save listing. Please check inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#0D3B2E] text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold font-serif">
              {initialData?.id ? 'Edit Agricultural Listing' : 'Publish New Agricultural Listing'}
            </h2>
            <p className="text-xs text-emerald-100/80">
              Fill in your crop, produce, livestock or service details to connect with buyers.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#0D3B2E] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Tag className="w-4 h-4 text-[#E2C37A]" />
            <span>1. Basic Listing Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Listing Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 500kg Fresh Hass Avocados, Friesian Dairy Cow, Tractor Services..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe crop quality, variety, harvest date, feeding history, transport arrangements, or minimum order requirements..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Quantity */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#0D3B2E] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sprout className="w-4 h-4 text-[#E2C37A]" />
            <span>2. Pricing & Quantity Available</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Price */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Price per Unit (KSh) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 30"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-[#0D3B2E] focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            {/* Price Unit */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Price Unit</label>
              <input
                type="text"
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                placeholder="e.g. kg, head, bag (90kg), acre, crate"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Total Quantity Available <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>

            {/* Quantity Unit */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Quantity Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. kg, heads, bags, crates"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#0D3B2E] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-[#E2C37A]" />
            <span>3. Farm & Product Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* County */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">County</label>
              <select
                value={county}
                onChange={(e) => {
                  setCounty(e.target.value);
                  setSubCounty('');
                  setWard('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-County */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Sub-County</label>
              <select
                value={subCounty}
                onChange={(e) => {
                  setSubCounty(e.target.value);
                  setWard('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
              >
                <option value="">Select Sub-County</option>
                {subCounties.map((sc) => (
                  <option key={sc.name} value={sc.name}>
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Ward</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none cursor-pointer"
              >
                <option value="">Select Ward</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Landmark */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Landmark / Market</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Chemosit Market, Bureti"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Photos */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-[#0D3B2E] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Image className="w-4 h-4 text-[#E2C37A]" />
            <span>4. Photos & Contact Options</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">
                Photo URL (Produce or Livestock Photo)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or paste direct image link"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                A clear, authentic farm photo increases buyer inquiries by 3x.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Direct Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+254700112233"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#0D3B2E] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Availability & Status */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-[#0D3B2E] rounded focus:ring-[#0D3B2E]"
              />
              <span>Currently Available for Sale</span>
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-600">Publish Mode:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Listing['status'])}
                className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-800"
              >
                <option value="published">Publish Live Immediately</option>
                <option value="draft">Save as Draft</option>
                <option value="sold">Mark as Sold</option>
              </select>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#0D3B2E] hover:bg-[#16503f] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#E2C37A]" />
              <span>{isSubmitting ? 'Saving...' : 'Save & Publish Listing'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
