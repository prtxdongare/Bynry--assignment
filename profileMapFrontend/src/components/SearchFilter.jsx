import { useEffect, useState } from 'react';

function SearchFilter({ searchTerm, setSearchTerm, filterCriteria, setFilterCriteria }) {
  const [locations, setLocations] = useState([]); // State to hold location options
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationsFetched, setLocationsFetched] = useState(false); // Track if locations are fetched

  // Function to fetch locations from the backend
  const fetchLocations = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const response = await fetch('http://localhost:3000/api/locations'); // Adjust this URL according to your backend
      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }
      const data = await response.json();
      setLocations(data); // Assume data is an array of location strings
      setLocationsFetched(true); // Mark locations as fetched
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Fetch locations only when the dropdown is focused or clicked
  const handleSelectFocus = () => {
    if (!locationsFetched) {
      fetchLocations();
    }
  };

  // Show a loading message while fetching
  if (loading) return <div>Loading locations...</div>;
  
  // Show an error message if locations couldn't be fetched
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
        />
      </div>
      <div className="flex-1">
        <select
          value={filterCriteria}
          onChange={(e) => setFilterCriteria(e.target.value)}
          onFocus={handleSelectFocus} // Fetch locations on focus
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
        >
          <option value="">Filter by location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;
