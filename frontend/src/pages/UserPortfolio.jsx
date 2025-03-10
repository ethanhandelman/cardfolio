import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile } from '../services/userService';

const Card = ({ card }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 transition transform hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[2/3] overflow-hidden rounded-md border border-gray-300">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-700">{card.value}</span>
          <span className="text-sm text-gray-500">Fun Fact</span>
        </div>
        <p className="mt-2 text-gray-700">{card.funFact}</p>
      </div>
    </div>
  );
};

function UserPortfolio() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profile = await getUserProfile(username);
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [username]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans pt-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error === 'User not found' ? 'User Not Found' : 'Error Loading Profile'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error === 'User not found' 
              ? `We couldn't find a user with the username "${username}".` 
              : 'There was a problem loading this user profile.'}
          </p>
          <div className="mt-6">
            <Link 
              to="/browse" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Browse Collectors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans pt-16">
      <main className="container mx-auto px-6 py-10">
        {/* User Profile Section */}
        <section className="mb-10 bg-white rounded-xl shadow-md overflow-hidden relative">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img 
                  src={userProfile.profileImage} 
                  alt="Profile Picture" 
                  className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-sm object-cover"
                />
              </div>
              
              {/* User Info */}
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{userProfile.name || 'Cardfolio User'}</h2>
                  <span className="text-gray-600 text-lg">@{userProfile.username}</span>
                </div>
                
                {userProfile.location && (
                  <div className="flex items-center text-gray-700 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{userProfile.location}</span>
                  </div>
                )}
                
                {userProfile.bio && (
                  <p className="text-gray-700 max-w-3xl">
                    {userProfile.bio}
                  </p>
                )}
              </div>
              
              {/* Collection Stats */}
              <div className="flex-shrink-0 flex flex-row md:flex-col gap-4 mt-4 md:mt-0">
                <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="block text-2xl font-bold text-amber-700">{userProfile.stats?.cardCount || 0}</span>
                  <span className="text-sm text-gray-600">Cards</span>
                </div>
                <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="block text-2xl font-bold text-amber-700">{userProfile.stats?.totalValue || '$0'}</span>
                  <span className="text-sm text-gray-600">Value</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Collection Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}'s Collection</h2>
          <span className="text-gray-600">{userProfile.stats?.cardCount || 0} cards</span>
        </div>
        
        {/* Card Collection */}
        {userProfile.cards && userProfile.cards.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProfile.cards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </section>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Cards in Collection</h3>
            <p className="text-gray-500">
              This collector hasn't added any cards to their collection yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserPortfolio;