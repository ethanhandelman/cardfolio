import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

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

function UserPortfolio() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  
  // Placeholder user data - in a real app, you would fetch this from an API
  const [profile, setProfile] = useState(null);
  const [cards, setCards] = useState([]);

  // Calculate total collection value
  const calculateTotalValue = () => {
    return cards.reduce((total, card) => {
      // Extract numeric value from string (remove $ and any commas)
      const value = parseFloat(card.value.replace(/[$,]/g, '')) || 0;
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
  
  // Simulate fetching user data
  useEffect(() => {
    // In a real app, you would make an API call here
    // For demo purposes, we'll simulate loading data
    setLoading(true);
    
    const timer = setTimeout(() => {
      // Mock data for different users
      if (username === "card_master") {
        setProfile({
          name: "Alex Thompson",
          username: "card_master",
          location: "New York, NY",
          bio: "Professional card collector and trader. Specializing in vintage sports cards from the 60s and 70s. Always happy to discuss rare finds or potential trades.",
          profileImage: "https://randomuser.me/api/portraits/men/44.jpg"
        });
        setCards([
          {
            id: 1,
            image: "https://www.psacard.com/cardfacts/baseball-cards/1952-topps/mickey-mantle-311/19154/images/19154",
            title: "Mickey Mantle 1952 Topps",
            value: "$500",
            funFact: "One of the most iconic baseball cards ever produced.",
          },
          {
            id: 2,
            image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
            title: "Babe Ruth Vintage Card",
            value: "$750",
            funFact: "Found this gem at an estate sale in Boston.",
          },
        ]);
      } else if (username === "vintage_collector") {
        setProfile({
          name: "Sarah Parker",
          username: "vintage_collector",
          location: "San Francisco, CA",
          bio: "Passionate about vintage collectibles of all kinds. My trading card collection focuses on non-sports cards and limited editions from the 80s and 90s.",
          profileImage: "https://randomuser.me/api/portraits/women/33.jpg"
        });
        setCards([
          {
            id: 1,
            image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
            title: "Original Star Wars Series",
            value: "$300",
            funFact: "Complete set from the first movie release.",
          },
          {
            id: 2,
            image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
            title: "Magic: The Gathering Alpha",
            value: "$1200",
            funFact: "One of only 1,100 rare cards printed in the Alpha set.",
          },
          {
            id: 3,
            image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
            title: "Pokemon First Edition",
            value: "$850",
            funFact: "Near mint condition, kept in protective sleeve since purchase.",
          },
        ]);
      } else {
        // Default profile for any other username
        setProfile({
          name: "Trading Card Enthusiast",
          username: username,
          location: "Collector's Corner",
          bio: "A passionate trading card collector sharing their prized possessions.",
          profileImage: "https://randomuser.me/api/portraits/lego/1.jpg"
        });
        setCards([
          {
            id: 1,
            image: "https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg",
            title: "Sample Trading Card",
            value: "$50",
            funFact: "A sample card from this collector's showcase.",
          },
        ]);
      }
      
      setLoading(false);
    }, 1000); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [username]);

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
          <h2 className="text-2xl font-bold text-gray-900">{profile.name}'s Collection</h2>
          <span className="text-gray-600">{cards.length} cards</span>
        </div>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default UserPortfolio