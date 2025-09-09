import React, { useEffect, useState } from "react";
import { Menu, Search, Users } from "lucide-react";
import { getWalletBySource, Wallets } from "polkadot-api/wallets";
import {
  connectInjectedExtension,
  type InjectedExtension,
} from "polkadot-api/pjs-signer";

// Main component for the landing page
export const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <Header />
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
  const [wallets, setWallets] = useState<Wallets | null>(null);
  const [extension, setExtension] = useState<InjectedExtension>();

  useEffect(() => {
    const wallet = window.localStorage.getItem(SELECTED_EXTENSION);
    if (!wallet) return;
    connectInjectedExtension(wallet).then(setExtension);
  }, []);

  useEffect(() => {
    if (!extension) return;
    const accounts = extension.getAccounts();
    if (accounts.length > 0) {
      accounts[0];
    }
  }, [extension]);

  const handleSignIn = async () => {
    try {
      // PAPI's getWallets will handle discovering installed wallet extensions.
      const discoveredWallets = await Wallets.get();
      setWallets(discoveredWallets);

      if (discoveredWallets.get().length === 0) {
        alert("No Polkadot wallet extensions found. Please install one.");
        return;
      }

      // For this example, we'll connect to the first discovered wallet.
      // In a real app, you would present a list of `discoveredWallets` to the user.
      const firstWallet = discoveredWallets.get()[0];
      const wallet = getWalletBySource(firstWallet.source);

      // This will trigger the wallet's pop-up to request permission.
      const connected = await wallet?.connect("ChefLink");

      const accounts = await connected?.getAccounts();
      const firstAccount = accounts?.[0];

      if (firstAccount) {
        console.log("Connected account:", firstAccount.address);
        alert(`Connected with account: ${firstAccount.address}`);
      } else {
        alert("No accounts found in the selected wallet.");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Error connecting to wallet. See console for details.");
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-full shadow-md hover:bg-gray-200 transition-colors"
    >
      Sign In
    </button>
  );
};

// Header Component
const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center text-white">
      <button className="p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-colors">
        <Menu size={24} />
      </button>
      <SignInButton />
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
const CreatorCard = ({ image, title, author, authorImage }) => (
  <div className="bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
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
  </div>
);

// Chef Creators Section
const ChefCreatorsSection = () => {
  const creators = [
    {
      image:
        "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=2070&auto=format&fit=crop",
      title: "Italian Masterclass",
      author: "Chef Isabella Rossi",
      authorImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=2070&auto=format&fit=crop",
      title: "Secrets of French Pastry",
      author: "Chef Antoine Dubois",
      authorImage:
        "https://plus.unsplash.com/premium_photo-1661778091956-15dbe6e47442?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image:
        "https://images.unsplash.com/photo-1621852004164-729463996434?q=80&w=1949&auto=format&fit=crop",
      title: "Authentic Japanese Ramen",
      author: "Chef Kenji Tanaka",
      authorImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1604147057169-4b0a1399a5a3?q=80&w=1974&auto=format&fit=crop",
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
const ForumCard = ({ image, title, author, category }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <p className="text-sm text-red-500 font-semibold mb-1">{category}</p>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">By {author}</p>
      <button className="w-full py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors">
        Read
      </button>
    </div>
  </div>
);

// Community Forum Section
const CommunityForumSection = () => {
  const posts = [
    {
      image: "https://placehold.co/600x400/111827/ffffff?text=Chef+Cooking",
      title: "Mastering the Art of Sous Vide",
      author: "Chef Anton",
      category: "Techniques",
    },
    {
      image: "https://placehold.co/600x400/4d7c0f/ffffff?text=Fresh+Pasta",
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

// Taste Selections Section (Placeholder)
const TasteSelectionsSection = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Taste Selections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Placeholder content */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-200 h-64 rounded-xl animate-pulse"
            ></div>
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
