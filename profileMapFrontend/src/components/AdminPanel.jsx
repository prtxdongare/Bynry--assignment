import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react';

const fetchProfiles = async () => {
  const response = await fetch('http://localhost:3000/api/profiles');
  if (!response.ok) {
    throw new Error('Error fetching profiles');
  }
  return response.json();
};

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const [editingProfile, setEditingProfile] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const { data: profiles, isLoading, error } = useQuery('profiles', fetchProfiles);
  
  const addProfileMutation = useMutation(
    (newProfile) => fetch('http://localhost:3000/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile),
    }).then(res => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
        resetForm();
      },
    }
  );

  const updateProfileMutation = useMutation(
    (updatedProfile) => fetch(`http://localhost:3000/api/update/${updatedProfile.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    }).then(res => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
        resetForm();
      },
    }
  );

  const deleteProfileMutation = useMutation(
    (id) => fetch(`http://localhost:3000/api/delete/${id}`, { method: 'DELETE' }).then(res => {
      if (!res.ok) {
        throw new Error('Error deleting profile');
      }
      return res.json();
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
      },
    }
  );

  const resetForm = () => {
    setEditingProfile(null);
    setIsFormVisible(false);
  };

  const handleDelete = (id) => {
    setDeleteConfirmation(id);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg mt-4">
      Error fetching profiles: {error.message}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
        <button
          onClick={() => setIsFormVisible(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <PlusCircle className="mr-2" size={20} />
          Add New Profile
        </button>
      </div>

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">{editingProfile ? 'Edit Profile' : 'Add New Profile'}</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const profileData = Object.fromEntries(formData.entries());
              if (editingProfile) {
                updateProfileMutation.mutate({ ...profileData, id: editingProfile._id });
              } else {
                addProfileMutation.mutate(profileData);
              }
            }}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" defaultValue={editingProfile?.name || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-2 py-2" required />
                </div>
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo URL</label>
                  <input type="url" id="photo" name="photo" defaultValue={editingProfile?.photo || 'https://via.placeholder.com/150'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-2 py-2" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description" name="description" defaultValue={editingProfile?.description || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-2 py-2" rows={3} required></textarea>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" id="address" name="address" defaultValue={editingProfile?.address || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-2 py-2" required />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">contact</label>
                  <input type="text" id="contact" name="contact" defaultValue={editingProfile?.contact || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-2 py-2"/>
                </div>
                <div>
                  <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests</label>
                  <input type="text" id="interests" name="interests" defaultValue={editingProfile?.interests || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-2 py-2" />
                </div>
              </div>
              {(addProfileMutation.isError || updateProfileMutation.isError) && (
                <div className="mt-2 text-red-600 text-sm">
                  An error occurred. Please try again.
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" disabled={addProfileMutation.isLoading || updateProfileMutation.isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {editingProfile ? 'Update Profile' : 'Add Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Profile</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles?.map((profile) => (
                <tr key={profile._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/profile/${profile._id}`} className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={profile.photo || 'https://via.placeholder.com/50'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                        <div className="text-xs text-gray-500">{profile.address}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{profile.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingProfile(profile);
                        setIsFormVisible(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(profile._id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this profile? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProfileMutation.mutate(deleteConfirmation);
                  setDeleteConfirmation(null);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}