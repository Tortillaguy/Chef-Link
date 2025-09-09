import { Menu, Search, Users } from "lucide-react";
import {
  connectInjectedExtension,
  getInjectedExtensions,
  type InjectedExtension,
} from "polkadot-api/pjs-signer";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppStore } from "~/lib/store";
import { shorthand } from "~/lib/util";

// Main component for the landing page
export const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <main>
        <HeroSection />
        <ChefCreatorsSection />
        <CommunityForumSection />
        <TasteSelectionsSection />
      </main>
      <Footer />
    </div>
  );
};

const SELECTED_EXTENSION = "selected-extension";

// Sign In Button Component
const SignInButton = () => {
  const extensions: string[] = useMemo(() => getInjectedExtensions(), []);
  const [extension, setExtension] = useState<InjectedExtension | undefined>();
  const navigate = useNavigate();
  const account = useAppStore((store) => store.account);
  const setAccount = useAppStore((store) => store.setAccount);

  useEffect(() => {
    const wallet = window.localStorage.getItem(SELECTED_EXTENSION);
    if (!wallet) return;
    connectInjectedExtension(wallet).then(setExtension);
  }, []);

  useEffect(() => {
    if (!extension) return;
    const accounts = extension.getAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    }
  }, [extension]);

  const onConnect = async () => {
    const selectedExtension = await connectInjectedExtension(extensions[0]);

    setExtension(selectedExtension);
    window.localStorage.setItem(SELECTED_EXTENSION, extensions[0]);
  };

  const onDisconnect = () => {
    extension?.disconnect();
    setAccount(undefined);
  };

  const routeToProfile = () => navigate("/profile");

  return (
    <div className="flex gap z-10">
      <button
        className="cursor-pointer"
        onClick={account ? routeToProfile : onConnect}
      >
        {account ? shorthand(account.address) : "Connect"}
      </button>
      {!!account && <button onClick={onDisconnect}>⏻</button>}
    </div>
  );
};

// Header Component
const Header = () => {

  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center text-white">
      <button className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors">
        <Menu size={24} />
      </button>
      <SignInButton/>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-white text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 px-4">
        <h1 className="text-5xl md:text-7xl font-bold">
          Chef<span className="text-red-500">Link</span>
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl mx-auto">
          Connect with Private Chefs for Memorable Group Dinners & Personalized
          Meal Plans
        </p>
        <button className="mt-8 px-10 py-4 bg-red-500 text-white font-bold rounded-full text-lg hover:bg-red-600 transition-colors shadow-lg">
          Sign Up Now
        </button>
      </div>
    </section>
  );
};

// Card for Chef Creators
const CreatorCard = ({ image, title, author, authorImage }: any) => {
  return <a href={`/chef/${author}`}  className="bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
    <img
      src={image}
      alt={title}
      className="w-full h-32 object-cover rounded-lg mb-3"
    />
    <h3 className="font-semibold text-md mb-2">{title}</h3>
    <div className="flex items-center text-sm text-gray-500">
      <img
        src={authorImage}
        alt={author}
        className="w-6 h-6 rounded-full mr-2"
      />
      <span>{author}</span>
    </div>
  </a>
}

// Chef Creators Section
const ChefCreatorsSection = () => {
  const creators = [
    {
      image:
        "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2070&auto=format&fit=crop",
      title: "Secrets of French Pastry",
      author: "Chef Isabella Rossi",
      authorImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    },
    {
      image:
        "/chef2.png",
      title: "Italian Cuisine",
      author: "Chef Antoine Dubois",
      authorImage:
        "https://plus.unsplash.com/premium_photo-1661778091956-15dbe6e47442?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image:
        "/chef3.png",
      title: "Authentic Japanese Ramen",
      author: "Chef Kenji Tanaka",
      authorImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    },
    {
      image:
        "/chef1.png",
      title: "Vegan Comfort Food",
      author: "Chef Maya Evans",
      authorImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Chef Creators</h2>
          <div className="flex items-center space-x-2">
            <Search className="text-gray-500" />
            <Users className="text-gray-500" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {creators.map((creator, index) => (
            <CreatorCard key={index} {...creator} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Community Forum Card
const ForumCard = ({ image, title, author, category }: any) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <p className="text-sm text-red-500 font-semibold mb-1">{category}</p>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">By {author}</p>
      <button className="w-full py-2 bg-red-100 text-slate-800 font-semibold rounded-lg hover:bg-red-200 transition-colors">
        Read
      </button>
    </div>
  </div>
);

// Community Forum Section
const CommunityForumSection = () => {
  const posts = [
    {
      image: "/steak.png",
      title: "Mastering the Art of Sous Vide",
      author: "Chef Anton",
      category: "Techniques",
    },
    {
      image: "/pasta.png",
      title: "Community Favorite Pasta Dishes",
      author: "Community",
      category: "Community Forum",
    },
  ];
  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Community Forum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <ForumCard key={index} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Recipe Card
const RecipeCard = ({ image, title, category }: any) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
    <img src={image} alt={title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <p className="text-sm text-red-500 font-semibold mb-1">{category}</p>
      <h3 className="font-bold text-md">{title}</h3>
    </div>
  </div>
);

// Taste Selections Section
const TasteSelectionsSection = () => {
  const recipes = [
    {
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
      title: "Fresh Summer Salad",
      category: "Healthy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
      title: "Gourmet Pizza",
      category: "Italian",
    },
    {
      image:
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1974&auto=format&fit=crop",
      title: "Chocolate Lava Cake",
      category: "Dessert",
    },
    {
      image:
        "/avocado_toast.png",
      title: "Avocado Toast",
      category: "Breakfast",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Taste Selections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component (Placeholder)
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} ChefLink. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingPage;
