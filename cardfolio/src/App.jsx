import { useState } from 'react'
import './App.css'
import AddCardModal from './AddCardModal'

const Card = ({ card }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 transition transform hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[2/3] overflow-hidden rounded-md border border-gray-300">
        <img
          src={card.image}
          alt="Trading Card"
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

function App() {
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initial card data
  const [cards, setCards] = useState([
    {
      id: 1,
      image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
      title: "Jackie Robinson Rookie Card",
      value: "$100",
      funFact: "This card was featured in a rare auction.",
    },
    {
      id: 2,
      image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
      title: "Jackie Robinson Limited Edition",
      value: "$250",
      funFact: "Limited edition with unique artwork.",
    },
    {
      id: 3,
      image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
      title: "Jackie Robinson Heritage",
      value: "$75",
      funFact: "This card has an interesting backstory in the trading community.",
    },
  ]);

  // Function to handle adding a new card
  const handleAddCard = (newCard) => {
    setCards([...cards, newCard]);
  };

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-blue-900 shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Cardfolio</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        {/* User Profile Section */}
        <section className="mb-10 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Profile Picture" 
                  className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-sm object-cover"
                />
              </div>
              
              {/* User Info */}
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Mike Johnson</h2>
                  <span className="text-gray-600 text-lg">@card_collector94</span>
                </div>
                
                <div className="flex items-center text-gray-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Chicago, IL</span>
                </div>
                
                <p className="text-gray-700 max-w-3xl">
                  Passionate card collector for over 15 years. Specializing in baseball memorabilia and rare editions. 
                  Always looking to connect with fellow collectors to share stories and potentially trade gems from our collections.
                </p>
              </div>
              
              {/* Collection Stats */}
              <div className="flex-shrink-0 flex flex-row md:flex-col gap-4 mt-4 md:mt-0">
                <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="block text-2xl font-bold text-amber-700">{cards.length}</span>
                  <span className="text-sm text-gray-600">Cards</span>
                </div>
                <div className="text-center px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="block text-2xl font-bold text-amber-700">$12.4k</span>
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
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
          
          {/* Add Card Button */}
          <AddCardButton onClick={openModal} />
        </section>
      </main>
      
      {/* Add Card Modal */}
      <AddCardModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onAddCard={handleAddCard} 
      />
    </div>
  );
}

export default App