import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faEye, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      
  <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
    
    
    {/* Profile Header */}
    <div className="relative">
      <div className="absolute inset-0">
        <img
          src="https://cdn11.bigcommerce.com/s-9cmhid8o4z/images/stencil/1280x1280/products/449/7658/bd-3x3m-7_2__15175.1637769728.jpg?c=1" 
          alt="Cover"
          className="w-full h-20 object-cover"
        />
      </div>
      <div className="relative flex flex-col items-center pt-8">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="w-full h-full object-cover cursor-pointer"
          />
          
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
        </div>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <h1 className="text-xl font-semibold mt-2">{currentUser.username}</h1>
        <p className="text-gray-500 text-sm mt-1">{currentUser.email}</p>
      </div>
    </div>

    {/* Profile Form */}
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Username"
            defaultValue={currentUser.username}
            id="username"
            className="border border-gray-300 p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            onChange={handleChange}
          />
          
          
          <input
            type="email"
            placeholder="Email"
            id="email"
            defaultValue={currentUser.email}
            className="border border-gray-300 p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            onChange={handleChange}
          />
          
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="border border-gray-300 p-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm flex items-center justify-center"
          >
            {loading ? (
              <span>Updating...</span>
            ) : (
              <>
                <FontAwesomeIcon icon={faPencilAlt} className="h-5 w-5 mr-2" />
                <span>Update Profile</span>
              </>
            )}
          </button>
          <Link
            className="bg-green-600 text-white py-2 rounded-md shadow-sm text-center hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
            to={'/create-listing'}
          >
            <FontAwesomeIcon icon={faPencilAlt} className="h-5 w-5 mr-2" />
            <span>Create Listing</span>
          </Link>
        </div>
      </form>
    </div>

    {/* Account Actions */}
    <div className="p-4 border-t border-gray-200">
      <div className="flex justify-between text-xs text-gray-600">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer hover:text-red-600 transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faTrashAlt} className="h-5 w-5 mr-1" />
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="cursor-pointer hover:text-red-600 transition-colors flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 mr-1" />
          Sign Out
        </span>
      </div>
    </div>

    {/* Feedback and Listings */}
    <div className="p-4 border-t border-gray-200">
      <p className="text-red-600 text-sm mb-2">{error}</p>
      <p className="text-green-600 text-sm mb-2">{updateSuccess ? 'Profile updated successfully!' : ''}</p>
      <button
        onClick={handleShowListings}
        className="text-blue-600 text-sm font-semibold hover:underline flex items-center"
      >
        <FontAwesomeIcon icon={faEye} className="h-5 w-5 mr-2" />
        Show Your Listings
      </button>
      <p className="text-red-600 text-sm mt-2">{showListingsError}</p>
      

      {/* User Listings */}
      {userListings && userListings.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Your Listings</h2>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex items-center justify-between bg-white border border-gray-300 rounded-md p-3 mb-2 shadow-sm transition-transform transform hover:scale-105"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-14 w-14 object-cover rounded-md"
                />
              </Link>
              <Link
                className="flex-1 text-gray-700 text-sm font-semibold truncate hover:underline"
                to={`/listing/${listing._id}`}
              >
                {listing.name}
              </Link>
              <div className="flex gap-1">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-600 text-xs font-semibold hover:underline flex items-center"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4 mr-1" />
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-blue-600 text-xs font-semibold hover:underline flex items-center">
                    <FontAwesomeIcon icon={faPencilAlt} className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>




  );
}