import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MapPin, Phone, Heart, ArrowLeft, Loader } from 'lucide-react';
import Map from './Map';

const fetchProfile = async (id) => {
  const response = await fetch(`http://localhost:3000/api/profile/${id}`);
  if (!response.ok) {
    throw new Error('Profile not found');
  }
  return response.json();
};

export default function ProfileDetails() {
  const { id } = useParams();
  const { data: profile, isLoading, error } = useQuery(['profile', id], () => fetchProfile(id));

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin h-12 w-12 text-blue-500" />
    </div>
  );
  
  if (error) return (
    <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg mt-4">
      {error.message}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6">
        <ArrowLeft size={20} className="mr-2" />
        Back to Profiles
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <img
              src={profile.photo || 'https://via.placeholder.com/200'}
              alt={profile.name}
              className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{profile.name}</h1>
            <p className="text-gray-600 mb-6">{profile.description}</p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-2" />
                <span>{profile.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={20} className="mr-2" />
                <span>{profile.contact}</span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location</h2>
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner h-[400px]">
              <Map selectedProfile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}