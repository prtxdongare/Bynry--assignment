import { useState } from 'react'
import { useQuery } from 'react-query'
import ProfileCard from './ProfileCard'
import SearchFilter from './SearchFilter'
import Map from './Map'
import { Loader } from 'lucide-react'

const fetchProfiles = async () => {
  const response = await fetch('http://localhost:3000/api/profiles');
  if (!response.ok) {
    throw new Error('Failed to fetch profiles');
  }
  return response.json();
}

export default function ProfileList() {
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCriteria, setFilterCriteria] = useState('')

  const { data: profiles, isLoading, error } = useQuery('profiles', fetchProfiles)

  const filteredProfiles = profiles?.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCriteria === '' || profile.address.includes(filterCriteria))
  )

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin h-12 w-12 text-blue-500" />
    </div>
  )

  if (error) return (
    <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg mt-4">
      Error fetching profiles: {error.message}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Explorer</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCriteria={filterCriteria}
            setFilterCriteria={setFilterCriteria}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {filteredProfiles?.map(profile => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                onSummary={() => setSelectedProfile(profile)}
              />
            ))}
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Map View</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <Map selectedProfile={selectedProfile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}