import {useState} from 'react';
import {Star} from 'lucide-react';
import axiosFetch from "../../utils/axiosFetch.js";
import Cookies from "js-cookie";

const ReviewPopup = (props) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async () => {
        await axiosFetch.post(`/api/v1/reviews/add/${props.id}`,
            {
                touristUserId: Cookies.get("UUID"),
                rating: rating,
                comment: comment,
                bookingId:props.bookingId,
            }
        ).then(props.onClose)
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="p-4 border-b bg-primary text-white">
                    <h2 className="text-xl font-bold">Write a Review</h2>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Star Rating */}
                    <div className="flex items-center justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-8 h-8 cursor-pointer transition-colors ${
                                    (hoveredRating || rating) >= star
                                        ? 'fill-accent text-accent'
                                        : 'text-light'
                                }`}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>

                    {/* Comment Section */}
                    <textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 border rounded-lg hover:bg-light transition-colors"
                        onClick={props.onClose}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!rating}
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                            rating
                                ? 'bg-secondary hover:bg-primary'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewPopup;