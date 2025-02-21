import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Card = ({ card }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition transform hover:-translate-y-1 hover:shadow-xl">
      <img
        src={card.image}
        alt="Trading Card"
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">{card.value}</span>
          <span className="text-sm text-gray-500">Fun Fact</span>
        </div>
        <p className="mt-2 text-gray-700">{card.funFact}</p>
      </div>
    </div>
  );
};

function App() {
  // Initial card data
  const [cards, setCards] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/300x200?text=Card+1",
      value: "$100",
      funFact: "This card was featured in a rare auction.",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/300x200?text=Card+2",
      value: "$250",
      funFact: "Limited edition with unique artwork.",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/300x200?text=Card+3",
      value: "$75",
      funFact: "This card has an interesting backstory in the trading community.",
    },
  ]);

  // Form state for new card inputs
  const [valueInput, setValueInput] = useState("");
  const [funFactInput, setFunFactInput] = useState("");

  // Function to handle adding a new card
  const handleAddCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: Date.now(), // Unique id based on timestamp
      image: "https://via.placeholder.com/300x200?text=New+Card", // Default placeholder image
      value: valueInput,
      funFact: funFactInput,
    };

    setCards([...cards, newCard]);
    setValueInput("");
    setFunFactInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-200 via-pink-200 to-red-200">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Cardfolio</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">Your Collection</h2>
          <p className="text-gray-600">Showcase your prized trading cards below!</p>
        </section>
        <section className="mb-10">
          <form onSubmit={handleAddCard} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              placeholder="Card Value (e.g. $100)"
              className="flex-1 p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              value={funFactInput}
              onChange={(e) => setFunFactInput(e.target.value)}
              placeholder="Fun Fact"
              className="flex-1 p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded"
            >
              Add Card
            </button>
          </form>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default App
