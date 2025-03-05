import { useState, useEffect } from 'react';

const AddCardModal = ({ isOpen, onClose, onAddCard }) => {
  const [titleInput, setTitleInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [funFactInput, setFunFactInput] = useState("");
  
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onAddCard({
      id: Date.now(),
      image: "https://via.placeholder.com/300x200?text=New+Card",
      title: titleInput,
      value: valueInput,
      funFact: funFactInput,
    });
    
    // Reset form
    setTitleInput("");
    setValueInput("");
    setFunFactInput("");
    
    // Close modal
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-blue-900 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Add New Card</h3>
          <button 
            className="text-white hover:text-gray-200 focus:outline-none"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Card Title
              </label>
              <input
                id="title"
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Mickey Mantle Rookie Card"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Card Value
              </label>
              <input
                id="value"
                type="text"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                placeholder="e.g. $100"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label htmlFor="funFact" className="block text-sm font-medium text-gray-700 mb-1">
                Fun Fact
              </label>
              <textarea
                id="funFact"
                value={funFactInput}
                onChange={(e) => setFunFactInput(e.target.value)}
                placeholder="Share something interesting about this card..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                rows="3"
                required
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none"
              >
                Add Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;