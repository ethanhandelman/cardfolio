import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AddCardModal from '../components/AddCardModal';
import EditProfileModal from '../components/EditProfileModal';
import { getUserCards, deleteCard } from '../services/cardService';
import { getAbsoluteImageUrl } from '../services/userService';

const Card = ({ card, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 transition transform hover:-translate-y-1 hover:shadow-xl relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Card Actions */}
      <div 
        className={`absolute top-2 right-2 flex space-x-1 ${
          showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}
      >
        <button
          onClick={() => onDelete(card.id)}
          className="bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full"
          title="Delete card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="aspect-[2/3] overflow-hidden rounded-md border border-gray-300">
        <img
          src={getAbsoluteImageUrl(card.image)}
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

const AddCardButton = ({ onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[320px] cursor-pointer hover:border-blue-500 transition transform hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Add New Card</h3>
      <p className="text-gray-500 text-center">Click to add a new card to your collection</p>
    </div>
  );
};

function MyPortfolio() {
  // Get user from auth context
  const { currentUser } = useAuth();
  
  // State for modals
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // User profile state - initialized from auth context
  const [profile, setProfile] = useState({
    name: currentUser?.name || "Trading Card Collector",
    username: currentUser?.username || "collector",
    location: currentUser?.location || "Card Collectors Club",
    bio: currentUser?.bio || "Share your story as a card collector...",
    profileImage: getAbsoluteImageUrl(currentUser?.profileImage) || "https://randomuser.me/api/portraits/lego/1.jpg"
  });
  
  // State for cards
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's cards on component mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const cardsData = await getUserCards();
        
        // Process cards to fix image URLs
        const processedCards = cardsData.map(card => ({
          ...card,
          image: getAbsoluteImageUrl(card.image)
        }));
        
        setCards(processedCards);
        setError(null);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, []);

  // Calculate total collection value
  const calculateTotalValue = () => {
    return cards.reduce((total, card) => {
      // Extract numeric value from string (remove $ and any commas)
      const value = parseFloat((card.value || '0').replace(/[$,]/g, '')) || 0;
      return total + value;
    }, 0);
  };

  // Format value as currency
  const formatCurrency = (value) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };
  
  // Function to handle adding a new card
  const handleAddCard = (newCard) => {
    // Fix image URL
    const processedCard = {
      ...newCard,
      image: getAbsoluteImageUrl(newCard.image)
    };
    setCards(prevCards => [...prevCards, processedCard]);
  };
  
  // Function to handle deleting a card
  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await deleteCard(cardId);
        setCards(prevCards => prevCards.filter(card => card.id !== cardId));
      } catch (err) {
        console.error('Error deleting card:', err);
        alert('Failed to delete card. Please try again.');
      }
    }
  };
  
  // Function to handle updating profile
  const handleUpdateProfile = (updatedProfile) => {
    setProfile({
      ...updatedProfile,
      profileImage: getAbsoluteImageUrl(updatedProfile.profileImage)
    });
    // In a real app, you would also update this in your backend/database
  };

  // Modal functions
  const openCardModal = () => setIsCardModalOpen(true);
  const closeCardModal = () => setIsCardModalOpen(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 font-sans pt-16">
      <main className="container mx-auto px-6 py-10">
        {/* User Profile Section */}
        <section className="mb-10 bg-white rounded-xl shadow-md overflow-hidden relative">
          {/* Edit Profile Button */}
          <button
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            onClick={openProfileModal}
            aria-label="Edit Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img 
                  src={profile.profileImage} 
                  alt="Profile Picture" 
                  className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-sm object-cover"
                />
              </div>
              
              {/* User Info */}
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                  <span className="text-gray-600 text-lg">@{profile.username}</span>
                </div>
                
                <div className="flex items-center text-gray-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{profile.location}</span>
                </div>
                
                <p className="text-gray-700 max-w-3xl">
                  {profile.bio}
                </p>
              </div>
              
              {/* Collection Stats */}
              <div className="flex-shrink-0 flex flex-row md:flex-col gap-4 mt-4 md:mt-0">
                <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="block text-2xl font-bold text-amber-700">{cards.length}</span>
                  <span className="text-sm text-gray-600">Cards</span>
                </div>
                <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="block text-2xl font-bold text-amber-700">{formatCurrency(calculateTotalValue())}</span>
                  <span className="text-sm text-gray-600">Value</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Collection Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Collection</h2>
          <span className="text-gray-600">{cards.length} cards</span>
        </div>
        
        {/* Cards Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-6">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card 
                key={card.id} 
                card={card} 
                onDelete={handleDeleteCard}
              />
            ))}
            
            {/* Add Card Button */}
            <AddCardButton onClick={openCardModal} />
          </section>
        )}
      </main>
      
      {/* Modals */}
      <AddCardModal 
        isOpen={isCardModalOpen} 
        onClose={closeCardModal} 
        onAddCard={handleAddCard} 
      />
      
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        profile={profile}
        onSave={handleUpdateProfile}
      />
    </div>
  );
}

export default MyPortfolio;