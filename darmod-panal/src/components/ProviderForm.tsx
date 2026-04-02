"use client";

import { useState, useRef } from "react";
import { createProvider, updateProvider } from "@/lib/api";
import { Upload, X, Loader2, MapPin } from "lucide-react";

interface ProviderFormProps {
  provider?: any;
  categories: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

const ProviderForm = ({ provider, categories, onSuccess, onCancel }: ProviderFormProps) => {
  const [formData, setFormData] = useState({
    firstnameFr: provider?.firstnameFr || "",
    lastnameFr: provider?.lastnameFr || "",
    firstnameAr: provider?.firstnameAr || "",
    lastnameAr: provider?.lastnameAr || "",
    phone: provider?.phone || "",
    descriptionFr: provider?.descriptionFr || "",
    descriptionAr: provider?.descriptionAr || "",
    latitude: provider?.latitude || "33.5731",
    longitude: provider?.longitude || "-7.5898",
    categoryId: provider?.categoryId || (categories[0]?.id || ""),
    rating: provider?.rating || 5,
    age: provider?.age || 30,
    isActive: provider?.isActive !== undefined ? provider.isActive : true,
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(provider?.photo || null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },
      (error) => {
        alert("Unable to retrieve your location: " + error.message);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value.toString());
      });
      if (photo) {
        data.append("photo", photo);
      }

      if (provider) {
        await updateProvider(provider.id, data);
      } else {
        await createProvider(data);
      }
      onSuccess();
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="provider-form">
      <div className="photo-upload-section">
        <div className="photo-preview-container" onClick={() => fileInputRef.current?.click()}>
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="photo-preview" />
          ) : (
            <img src="/profile.png" alt="Default Profile" className="photo-preview opacity-50" />
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: "none" }} 
          />
        </div>
        {photoPreview && (
          <button 
            type="button" 
            className="btn-icon remove-photo" 
            onClick={() => { setPhoto(null); setPhotoPreview(null); }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>First Name (FR)</label>
          <input
            type="text"
            className="input"
            value={formData.firstnameFr}
            onChange={(e) => setFormData({ ...formData, firstnameFr: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name (FR)</label>
          <input
            type="text"
            className="input"
            value={formData.lastnameFr}
            onChange={(e) => setFormData({ ...formData, lastnameFr: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>First Name (AR)</label>
          <input
            type="text"
            className="input"
            value={formData.firstnameAr}
            onChange={(e) => setFormData({ ...formData, firstnameAr: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name (AR)</label>
          <input
            type="text"
            className="input"
            value={formData.lastnameAr}
            onChange={(e) => setFormData({ ...formData, lastnameAr: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            className="input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+2126..."
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            className="input"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nameFr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Latitude
            <button 
              type="button" 
              className="btn-text" 
              onClick={getCurrentLocation}
              title="Get current location"
            >
              <MapPin size={14} /> Use My Location
            </button>
          </label>
          <input
            type="number"
            step="any"
            className="input"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input
            type="number"
            step="any"
            className="input"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            className="input"
            value={formData.rating || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, rating: val === "" ? 0 : parseInt(val) });
            }}
            required
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            className="input"
            value={formData.age || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, age: val === "" ? 0 : parseInt(val) });
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Description (FR)</label>
        <textarea
          className="input"
          value={formData.descriptionFr}
          onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
          rows={3}
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label>Description (AR)</label>
        <textarea
          className="input"
          value={formData.descriptionAr}
          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
          rows={3}
          required
        ></textarea>
      </div>

      <div className="form-group-checkbox">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
        />
        <label htmlFor="isActive">Active Status</label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>{provider ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>{provider ? "Update Provider" : "Create Provider"}</span>
          )}
        </button>
      </div>

    </form>
  );
};

export default ProviderForm;
