import { useState, useEffect } from 'react';
import { addCard } from '../services/cardService';

const AddCardModal = ({ isOpen, onClose, onAddCard }) => {
  const [titleInput, setTitleInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [funFactInput, setFunFactInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
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
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError("Please select an image file (PNG, JPG, JPEG)");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setError("");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!titleInput || !valueInput) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!imageFile) {
      setError("Please select an image for the card");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    try {
      // Call API to add card
      const newCard = await addCard(
        {
          title: titleInput,
          value: valueInput,
          funFact: funFactInput
        },
        imageFile
      );
      
      // Reset form
      setTitleInput("");
      setValueInput("");
      setFunFactInput("");
      setImageFile(null);
      setImagePreview("");
      
      // Notify parent component
      onAddCard(newCard);
      
      // Close modal
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded p-3">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Title <span className="text-red-500">*</span>
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
                  Card Value <span className="text-red-500">*</span>
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
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Image <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-blue-500 transition">
                  {imagePreview ? (
                    <div className="relative w-full aspect-[2/3]">
                      <img 
                        src={imagePreview} 
                        alt="Card Preview" 
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center">
                  <label className="block w-full">
                    <span className="sr-only">Choose card image</span>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    For best results, use a vertical aspect ratio (2:3) image
                  </p>
                </div>
              </div>
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
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none ${
                  isSubmitting 
                    ? 'bg-amber-500 cursor-wait' 
                    : 'bg-amber-700 hover:bg-amber-800'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Card...
                  </span>
                ) : (
                  'Add Card'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCardModal;