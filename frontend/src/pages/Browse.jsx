import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAbsoluteImageUrl } from '../services/userService';

const UserCard = ({ user }) => {
  return (
    <Link to={`/portfolio/${user.username}`} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transition transform hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center gap-4">
          <img 
            src={user.profileImage} 
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user.name || user.username}</h3>
            <p className="text-gray-600 mb-2">@{user.username}</p>
            {user.location && (
              <div className="flex items-center text-gray-700 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex justify-between">
            <div className="text-center">
              <span className="block text-lg font-bold text-amber-700">{user.cardCount}</span>
              <span className="text-xs text-gray-600">Cards</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-amber-700">{user.value}</span>
              <span className="text-xs text-gray-600">Value</span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-blue-600">{user.joined}</span>
              <span className="text-xs text-gray-600">Joined</span>
            </div>
          </div>
        </div>
        
        {user.topCategories && user.topCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {user.topCategories.map((category, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

const TrendingCard = ({ card }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition hover:shadow-lg">
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-bold text-gray-800">{card.title}</h3>
          <span className="text-sm font-bold text-amber-700">{card.value}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Owned by <Link to={`/portfolio/${card.owner}`} className="text-blue-600 hover:underline">@{card.owner}</Link></p>
      </div>
    </div>
  );
};

function Browse() {
  // Sample users data - in a real app, this would come from an API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Mike Johnson",
      username: "card_collector94",
      location: "Chicago, IL",
      profileImage: getAbsoluteImageUrl("https://randomuser.me/api/portraits/men/32.jpg"),
      cardCount: 127,
      value: "$12.4k",
      joined: "2020",
      topCategories: ["Baseball", "Vintage", "Limited Edition"]
    },
    {
      id: 2,
      name: "Alex Thompson",
      username: "card_master",
      location: "New York, NY",
      profileImage: getAbsoluteImageUrl("https://randomuser.me/api/portraits/men/44.jpg"),
      cardCount: 89,
      value: "$8.2k",
      joined: "2019",
      topCategories: ["Sports", "60s-70s", "Rare Finds"]
    },
    {
      id: 3,
      name: "Sarah Parker",
      username: "vintage_collector",
      location: "San Francisco, CA",
      profileImage: getAbsoluteImageUrl("https://randomuser.me/api/portraits/women/33.jpg"),
      cardCount: 215,
      value: "$23.5k",
      joined: "2018",
      topCategories: ["Non-Sports", "80s-90s", "Limited Edition"]
    },
    {
      id: 4,
      name: "James Wilson",
      username: "sports_cards_only",
      location: "Dallas, TX",
      profileImage: getAbsoluteImageUrl("https://randomuser.me/api/portraits/men/62.jpg"),
      cardCount: 156,
      value: "$18.9k",
      joined: "2021",
      topCategories: ["Football", "Basketball", "Modern"]
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      username: "trading_queen",
      location: "Miami, FL",
      profileImage: getAbsoluteImageUrl("https://randomuser.me/api/portraits/women/55.jpg"),
      cardCount: 94,
      value: "$7.3k",
      joined: "2022",
      topCategories: ["Pokemon", "Trading", "Holographic"]
    },
    {
      id: 6,
      name: "David Lee",
      username: "rare_finds",
      location: "Seattle, WA",
      profileImage: getAbsoluteImageUrl("https://randomuser.me/api/portraits/men/76.jpg"),
      cardCount: 67,
      value: "$30.2k",
      joined: "2017",
      topCategories: ["Autographed", "Investment Grade", "Premium"]
    }
  ]);

  // Sample trending cards data
  const [trendingCards, setTrendingCards] = useState([
    {
      id: 1,
      title: "Mickey Mantle 1952 Topps",
      value: "$500",
      owner: "card_master",
      image: getAbsoluteImageUrl("https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg"),
    },
    {
      id: 2,
      title: "Magic: The Gathering Alpha",
      value: "$1,200",
      owner: "vintage_collector",
      image: getAbsoluteImageUrl("https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg"),
    },
    {
      id: 3,
      title: "Pokemon First Edition",
      value: "$850",
      owner: "vintage_collector",
      image: getAbsoluteImageUrl("https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg"),
    },
    {
      id: 4,
      title: "Jackie Robinson Rookie",
      value: "$425",
      owner: "card_collector94",
      image: getAbsoluteImageUrl("https://images.fineartamerica.com/images/artworkimages/medium/3/jackie-robinson-baseball-card-restored-and-enhanced-20230622-wingsdomain-art-and-photography.jpg"),
    }
  ]);

  // Update to include real users (you'd fetch this data from API)
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       // Fetch users from your API here
  //       // const response = await fetch('http://localhost:5000/api/users');
  //       // const data = await response.json();
  //       // setUsers(data.users);
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };
  //   
  //   fetchUsers();
  // }, []);

  return (
    <div className="min-h-screen bg-slate-100 font-sans pt-16">
      <main className="container mx-auto px-6 py-10">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Amazing Trading Card Collections</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow collectors, discover rare cards, and showcase your own collection on Cardfolio.
          </p>
        </section>
        
        {/* Trending Cards Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Cards</h2>
            <Link to="/explore-cards" className="text-blue-600 hover:underline">View all</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {trendingCards.map(card => (
              <TrendingCard key={card.id} card={card} />
            ))}
          </div>
        </section>
        
        {/* Featured Collectors Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Collectors</h2>
            <Link to="/explore-users" className="text-blue-600 hover:underline">View all</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Browse;