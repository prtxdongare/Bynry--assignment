import { Link } from 'react-router-dom'
import { MapPin, User } from 'lucide-react'

export default function ProfileCard({ profile, onSummary }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img 
          src={profile.photo || 'https://via.placeholder.com/150'} 
          alt={profile.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 left-0 bg-blue-500 text-white px-2 py-1 m-2 rounded-md text-sm font-semibold">
          {profile.name}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4 line-clamp-2">{profile.description}</p>
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm">{profile.address}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/profile/${profile._id}`}
            className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out flex items-center"
          >
            <User size={16} className="mr-1" />
            <span>View Details</span>
          </Link>
          <button
            onClick={onSummary}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Summary
          </button>
        </div>
      </div>
    </div>
  )
}