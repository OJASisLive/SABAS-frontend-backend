import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUserCircle, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image ? `${import.meta.env.VITE_TUNNEL_ADDRESS}${user.image}` : null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('mobile', formData.mobile);
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_TUNNEL_ADDRESS}/api/auth/users/${user._id}`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        updateUser(response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsEditing(false);
    setMessage({ type: '', text: '' });
    setImageFile(null);
    setImagePreview(user?.image ? `${import.meta.env.VITE_TUNNEL_ADDRESS}${user.image}` : null);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
    });
  };

  if (!user) return <div className="text-center py-8">Please log in to view profile.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <img
              src={imagePreview || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-200"
              onError={(e) => {
                e.target.src = '/default-avatar.png'; // Fallback if image fails
              }}
            />
            <FaUserCircle
              size={96}
              className={`absolute inset-0 text-gray-300 ${imagePreview ? 'hidden' : ''}`}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{formData.name}</h3>
            <p className="text-gray-600">{formData.email}</p>
            <p className="text-gray-600">{formData.mobile || 'No mobile number'}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition flex items-center space-x-2"
        >
          <FaEdit />
          <span>Edit Profile</span>
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Profile</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes size={20} />
              </button>
            </div>

            {message.type && (
              <div className={`p-3 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FaCheck className="animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
