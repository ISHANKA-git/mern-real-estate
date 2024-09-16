import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <main className="p-4 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
  <h1 className="text-3xl font-bold text-center my-6 text-slate-800">
    <i className="fas fa-home mr-2 text-blue-600"></i>
    Create a Listing
  </h1>

  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-4">
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <i className="fas fa-tag absolute top-3 left-3 text-gray-400"></i>
        </div>

        {/* Description */}
        <div className="relative">
          <textarea
            placeholder="Description"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <i className="fas fa-align-left absolute top-3 left-3 text-gray-400"></i>
        </div>

        {/* Address */}
        <div className="relative">
          <input
            type="text"
            placeholder="Address"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <i className="fas fa-map-marker-alt absolute top-3 left-3 text-gray-400"></i>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sale"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.type === "sale"}
            />
            <label htmlFor="sale" className="ml-2 text-sm text-gray-600">Sell</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rent"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.type === "rent"}
            />
            <label htmlFor="rent" className="ml-2 text-sm text-gray-600">Rent</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="parking"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.parking}
            />
            <label htmlFor="parking" className="ml-2 text-sm text-gray-600">Parking Spot</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="furnished"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.furnished}
            />
            <label htmlFor="furnished" className="ml-2 text-sm text-gray-600">Furnished</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="offer"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onChange={handleChange}
              checked={formData.offer}
            />
            <label htmlFor="offer" className="ml-2 text-sm text-gray-600">Offer</label>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="space-y-4">
        {/* Bedrooms and Bathrooms */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <input
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <i className="fas fa-bed absolute top-3 left-3 text-gray-400"></i>
            <label htmlFor="bedrooms" className="block mt-1 text-sm text-gray-600">Beds</label>
          </div>
          <div className="relative w-1/2">
            <input
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <i className="fas fa-bath absolute top-3 left-3 text-gray-400"></i>
            <label htmlFor="bathrooms" className="block mt-1 text-sm text-gray-600">Baths</label>
          </div>
        </div>

        {/* Regular Price and Discount Price */}
        <div className="relative">
          <input
            type="number"
            id="regularPrice"
            min="50"
            max="10000000"
            required
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formData.regularPrice}
          />
          <i className="fas fa-dollar-sign absolute top-3 left-3 text-gray-400"></i>
          <label htmlFor="regularPrice" className="block mt-1 text-sm text-gray-600">Regular Price</label>
          {formData.type === "rent" && <span className="text-xs text-gray-500">($ / month)</span>}
        </div>

        {formData.offer && (
          <div className="relative">
            <input
              type="number"
              id="discountPrice"
              min="0"
              max="10000000"
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.discountPrice}
            />
            <i className="fas fa-tags absolute top-3 left-3 text-gray-400"></i>
            <label htmlFor="discountPrice" className="block mt-1 text-sm text-gray-600">Discounted Price</label>
            {formData.type === "rent" && <span className="text-xs text-gray-500">($ / month)</span>}
          </div>
        )}

        {/* Image Upload Section */}
        <p className="text-sm font-semibold">
          <i className="fas fa-image text-blue-600 mr-2"></i>Images:
          <span className="font-normal text-gray-500 ml-2">The first image will be the cover (max 6)</span>
        </p>
        <div className="flex gap-4 items-center">
          <input
            onChange={(e) => setFiles(e.target.files)}
            className="p-3 border border-gray-300 rounded-lg w-full"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="p-3 bg-green-600 text-white rounded-lg uppercase hover:bg-green-700 disabled:opacity-70"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
          <div key={url} className="flex justify-between p-3 border items-center rounded-lg shadow-sm">
            <img src={url} alt="listing" className="w-20 h-20 object-cover rounded-lg" />
            <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-600 uppercase hover:text-red-700">
              Delete
            </button>
          </div>
        ))}

        <button
          disabled={loading || uploading}
          className="w-full p-3 bg-blue-600 text-white rounded-lg uppercase hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>
    </div>
  </form>
</main>
</div>

  );
}