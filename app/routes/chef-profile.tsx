import { Star, Utensils, MessageCircle, Heart, EyeOff } from "lucide-react";
import { useParams } from "react-router-dom";

const chefProfile = {
  name: "Chef Isabella Rossi",
  profilePicture:
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
  bio: "With over 15 years of experience in Michelin-starred kitchens, Isabella brings a passion for Italian and French cuisine. Her philosophy is to use fresh, local ingredients to create unforgettable dining experiences.",
  cuisines: ["Italian", "French", "Mediterranean"],
  reviews: [
    {
      author: "John Doe",
      rating: 5,
      comment:
        "Chef Isabella's tasting menu was a culinary journey! Every dish was a piece of art.",
    },
    {
      author: "Jane Smith",
      rating: 5,
      comment:
        "We hired Isabella for a private dinner, and it was the best decision. The food was exquisite, and she was so professional.",
    },
    {
      author: "Sam Wilson",
      rating: 4,
      comment:
        "Amazing food, especially the pasta. Would have liked a bit more variety in the dessert options.",
    },
  ],
};

const ChefProfilePage = () => {
  const { username } = useParams();

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <img
            src={chefProfile.profilePicture}
            alt={chefProfile.name}
            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold">{chefProfile.name}</h1>
            <p className="text-lg text-gray-500">@{username}</p>
            <p className="text-red-500 text-lg mb-4">Private Chef</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm">
                <MessageCircle size={16} />
                Message
              </button>
              <button className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full text-sm">
                <Heart size={16} />
                Favorite
              </button>
              <button className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm">
                <EyeOff size={16} />
                Hide
              </button>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <p className="text-sm font-semibold text-gray-600">Accepts:</p>
              <div className="flex gap-2">
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs font-bold">
                  USDC
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs font-bold">
                  DOT
                </span>
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs font-bold">
                  DAI
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Bio */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">About Me</h2>
          <p className="text-lg leading-relaxed">{chefProfile.bio}</p>
        </section>

        {/* Cuisines */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center">
            <Utensils className="mr-2" /> Cuisines
          </h2>
          <div className="flex flex-wrap gap-2">
            {chefProfile.cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-md"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Reviews</h2>
          <div className="space-y-6">
            {chefProfile.reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="ml-4 font-bold">{review.author}</p>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChefProfilePage;
