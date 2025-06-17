fix bug

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Camera, CheckCircle, User, TrendingUp, Calendar, Filter, Plus, X, ChevronDown, LogOut, Sparkles, MapPin, Globe, Heart, MessageCircle, Award, Clock, ArrowLeft } from 'lucide-react';

// --- Helper: Google Icon SVG ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


// Custom scrollbar hide styles
const scrollbarHideStyles = `
  <style id="scrollbar-styles">
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  </style>
`;

// Inject styles into document head once
if (typeof document !== 'undefined' && !document.getElementById('scrollbar-styles')) {
  document.head.insertAdjacentHTML('beforeend', scrollbarHideStyles);
}


// Mock Firebase for preview environment
// In a real application, you would initialize Firebase here and use its actual SDK methods.
const initialSampleReviews = [
    // Original 9 Items (imageUrl removed, will be generated, fallback added)
    { id: "sample-1", itemName: "Local Car Repair", mainCategory: "Real World", category: "Local Services", subCategory: "Mechanics", location: { city: "Bangkok", district: "Lat Phrao" }, rating: 4.5, reviewCount: 23, fallbackImageUrl: "https://placehold.co/400x250/3498db/ffffff?text=Car+Repair", reviews: [{ id: 1, author: "Sarah K.", rating: 5, date: "2024-03-15", comment: "Quick and honest car repair.", verified: true, helpful: 15 }] },
    { id: "sample-2", itemName: "@bangkok_fashion_daily", mainCategory: "Online", category: "Instagram", subCategory: "Influencer", location: { city: "Online" }, rating: 4.2, reviewCount: 60, fallbackImageUrl: "https://placehold.co/400x250/e74c3c/ffffff?text=Fashion+Blog", reviews: [{ id: 3, author: "Style Seeker", rating: 5, date: "2024-03-20", comment: "Great styling tips!", verified: true, helpful: 32 }] },
    { id: "sample-3", itemName: "Pro Moving Services", mainCategory: "Real World", category: "Local Services", subCategory: "Movers", location: { city: "Bangkok", district: "Yan Nawa" }, rating: 4.9, reviewCount: 15, fallbackImageUrl: "https://placehold.co/400x250/2ecc71/ffffff?text=Moving+Services", reviews: [{ id: 5, author: "Customer C", rating: 5, date: "2024-06-10", comment: "Quick, efficient, and careful.", verified: true, helpful: 7 }] },
    { id: "sample-4", itemName: "Authentic Isaan Restaurant", mainCategory: "Real World", category: "Restaurants & Cafes", subCategory: "Thai Food", location: { city: "Bangkok", district: "Bang Rak" }, rating: 4.7, reviewCount: 50, fallbackImageUrl: "https://placehold.co/400x250/f39c12/ffffff?text=Isaan+Restaurant", reviews: [{ id: 7, author: "FoodieBKK", rating: 5, date: "2024-05-10", comment: "Amazing Som Tum and Larb Gai!", verified: true, helpful: 25 }] },
    { id: "sample-5", itemName: "Math Tutor Expert", mainCategory: "Real World", category: "Education Centers", subCategory: "Tutoring Center", location: { city: "Bangkok", district: "Pathum Wan" }, rating: 4.5, reviewCount: 10, fallbackImageUrl: "https://placehold.co/400x250/9b59b6/ffffff?text=Math+Tutor", reviews: [{ id: 8, author: "Student Parent", rating: 5, date: "2024-05-20", comment: "Our son's grades improved significantly.", verified: true, helpful: 5 }] },
    { id: "sample-6", itemName: "Vintage Camera Shop", mainCategory: "Real World", category: "Goods & Products", subCategory: "Collectibles", location: { city: "Bangkok", district: "Bang Rak" }, rating: 4.0, reviewCount: 12, fallbackImageUrl: "https://placehold.co/400x250/1abc9c/ffffff?text=Camera+Shop", reviews: [{ id: 9, author: "CollectorGuy", rating: 4, date: "2024-06-01", comment: "Found a rare vintage camera.", verified: false, helpful: 3 }] },
    { id: "sample-7", itemName: "Online Marketing Agency", mainCategory: "Online", category: "Website", subCategory: "Service Provider", location: { city: "Online" }, rating: 4.7, reviewCount: 8, fallbackImageUrl: "https://placehold.co/400x250/34495e/ffffff?text=Marketing+Agency", reviews: [{ id: 10, author: "Client M", rating: 5, date: "2024-06-15", comment: "Amazing post-processing work.", verified: true, helpful: 2 }] },
    { id: "sample-8", itemName: "Hip Cafe", mainCategory: "Real World", category: "Restaurants & Cafes", subCategory: "Cafe", location: { city: "Bangkok", district: "Watthana" }, rating: 4.3, reviewCount: 30, fallbackImageUrl: "https://placehold.co/400x250/95a5a6/ffffff?text=Hip+Cafe", reviews: [{ id: 11, author: "Coffee Lover", rating: 5, date: "2024-06-18", comment: "Best pour-over coffee in Thong Lo.", verified: true, helpful: 10 }] },
    { id: "sample-9", itemName: "Co-working Space", mainCategory: "Real World", category: "Local Services", subCategory: "Other", location: { city: "Bangkok", district: "Watthana" }, rating: 4.6, reviewCount: 25, fallbackImageUrl: "https://placehold.co/400x250/7f8c8d/ffffff?text=Co-working", reviews: [{ id: 12, author: "Digital Nomad", rating: 5, date: "2024-06-20", comment: "Fast internet, comfy chairs.", verified: true, helpful: 8 }] },

    // --- NEWLY ADDED ITEMS FOR FULL SUB-CATEGORY COVERAGE ---
    { id: "new-fb-shop", itemName: "BKK Gadgets (FB)", mainCategory: "Online", category: "Facebook", subCategory: "Shop", location: { city: "Online" }, rating: 4.8, reviewCount: 150, fallbackImageUrl: "https://placehold.co/400x250/2980b9/ffffff?text=Gadgets+Shop", reviews: [{ id: 13, author: "TechieTom", rating: 5, date: "2024-06-12", comment: "Fast shipping on Facebook.", verified: true, helpful: 45 }] },
    { id: "new-fb-page", itemName: "Thai Food Lovers Page", mainCategory: "Online", category: "Facebook", subCategory: "Page", location: { city: "Online" }, rating: 4.9, reviewCount: 1200, fallbackImageUrl: "https://placehold.co/400x250/8e44ad/ffffff?text=Food+Page", reviews: [{ id: 14, author: "Somchai C.", rating: 5, date: "2024-05-30", comment: "Best recipes.", verified: true, helpful: 250 }] },
    { id: "new-fb-group", itemName: "Bangkok Expat Buy/Sell", mainCategory: "Online", category: "Facebook", subCategory: "Group", location: { city: "Online" }, rating: 4.5, reviewCount: 45, fallbackImageUrl: "https://placehold.co/400x250/2c3e50/ffffff?text=Buy/Sell+Group", reviews: [{ id: 15, author: "NewbieNancy", rating: 4, date: "2024-06-10", comment: "Found great deals.", verified: false, helpful: 12 }] },
    { id: "new-shopee-shop", itemName: "SuperDeals Shopee", mainCategory: "Online", category: "Shopee", subCategory: "Shop", location: { city: "Online" }, rating: 4.7, reviewCount: 5000, fallbackImageUrl: "https://placehold.co/400x250/f1c40f/ffffff?text=Shopee+Shop", reviews: [{ id: 16, author: "ShopperSue", rating: 5, date: "2024-06-14", comment: "My go-to shop on Shopee.", verified: true, helpful: 123 }] },
    { id: "new-shopee-seller", itemName: "Seller: JaneD_bkk", mainCategory: "Online", category: "Shopee", subCategory: "Seller", location: { city: "Online" }, rating: 4.9, reviewCount: 210, fallbackImageUrl: "https://placehold.co/400x250/e67e22/ffffff?text=Shopee+Seller", reviews: [{ id: 17, author: "HappyBuyer", rating: 5, date: "2024-06-11", comment: "Seller was very responsive.", verified: true, helpful: 30 }] },
    { id: "new-ig-shop", itemName: "@ChicBoutique.BKK", mainCategory: "Online", category: "Instagram", subCategory: "Shop", location: { city: "Online" }, rating: 4.6, reviewCount: 88, fallbackImageUrl: "https://placehold.co/400x250/16a085/ffffff?text=Chic+Boutique", reviews: [{ id: 18, author: "FashionistaFae", rating: 5, date: "2024-06-05", comment: "The dress is gorgeous!", verified: true, helpful: 22 }] },
    { id: "new-tiktok-influencer", itemName: "DanceMachine_TikTok", mainCategory: "Online", category: "TikTok", subCategory: "Influencer", location: { city: "Online" }, rating: 4.9, reviewCount: 1200, fallbackImageUrl: "https://placehold.co/400x250/27ae60/ffffff?text=TikTok+Influencer", reviews: [{ id: 19, author: "Fan1", rating: 5, date: "2025-06-17", comment: "Best dance challenges!", verified: false, helpful: 300 }] },
    { id: "new-tiktok-shop", itemName: "TikTok Finds Store", mainCategory: "Online", category: "TikTok", subCategory: "Shop", location: { city: "Online" }, rating: 4.5, reviewCount: 120, fallbackImageUrl: "https://placehold.co/400x250/d35400/ffffff?text=TikTok+Shop", reviews: [{ id: 20, author: "ViralBuyer", rating: 4, date: "2024-06-30", comment: "Found the viral gadget here.", verified: true, helpful: 50 }] },
    { id: "new-yt-channel", itemName: "Tech Tomorrow", mainCategory: "Online", category: "YouTube", subCategory: "Channel", location: { city: "Online" }, rating: 4.8, reviewCount: 450, fallbackImageUrl: "https://placehold.co/400x250/c0392b/ffffff?text=YouTube+Channel", reviews: [{ id: 21, author: "GadgetGeek", rating: 5, date: "2024-06-28", comment: "Unbiased and detailed reviews.", verified: true, helpful: 150 }] },
    { id: "new-yt-creator", itemName: "Creator: Chef Praiya", mainCategory: "Online", category: "YouTube", subCategory: "Content Creator", location: { city: "Online" }, rating: 4.9, reviewCount: 800, fallbackImageUrl: "https://placehold.co/400x250/7f8c8d/ffffff?text=Chef+Creator", reviews: [{ id: 22, author: "HomeCook", rating: 5, date: "2024-06-25", comment: "Her cooking is so inspiring.", verified: true, helpful: 200 }] },
    { id: "new-ls-tutor", itemName: "English Express Tutors", mainCategory: "Real World", category: "Local Services", subCategory: "Tutors", location: { city: "Bangkok", district: "Pathum Wan" }, rating: 4.7, reviewCount: 35, fallbackImageUrl: "https://placehold.co/400x250/1abc9c/ffffff?text=English+Tutor", reviews: [{ id: 23, author: "Parent_P", rating: 5, date: "2024-06-20", comment: "My daughter's confidence in English has soared.", verified: true, helpful: 10 }] },
    { id: "new-ls-handyman", itemName: "Mr. Fix-It", mainCategory: "Real World", category: "Local Services", subCategory: "Handymen", location: { city: "Bangkok", district: "Watthana" }, rating: 4.8, reviewCount: 42, fallbackImageUrl: "https://placehold.co/400x250/2ecc71/ffffff?text=Handyman", reviews: [{ id: 24, author: "HarryH", rating: 5, date: "2024-06-01", comment: "Fixed my leaky faucet in no time.", verified: true, helpful: 18 }] },
    { id: "new-ls-cleaner", itemName: "SparkleClean BKK", mainCategory: "Real World", category: "Local Services", subCategory: "Cleaners", location: { city: "Bangkok", district: "Sathorn" }, rating: 4.9, reviewCount: 75, fallbackImageUrl: "https://placehold.co/400x250/3498db/ffffff?text=Cleaner", reviews: [{ id: 25, author: "BusyBob", rating: 5, date: "2024-06-15", comment: "My condo has never been this clean.", verified: true, helpful: 25 }] },
    { id: "new-ls-plumber", itemName: "Reliable Plumbers", mainCategory: "Real World", category: "Local Services", subCategory: "Plumbers", location: { city: "Bangkok", district: "Chatuchak" }, rating: 4.7, reviewCount: 33, fallbackImageUrl: "https://placehold.co/400x250/9b59b6/ffffff?text=Plumber", reviews: [{ id: 26, author: "StressedSteve", rating: 5, date: "2024-05-25", comment: "Came at 2 AM for a burst pipe. Lifesavers!", verified: true, helpful: 11 }] },
    { id: "new-ls-electrician", itemName: "Watt's Up Electricians", mainCategory: "Real World", category: "Local Services", subCategory: "Electricians", location: { city: "Bangkok", district: "Bang Kapi" }, rating: 4.8, reviewCount: 29, fallbackImageUrl: "https://placehold.co/400x250/e74c3c/ffffff?text=Electrician", reviews: [{ id: 27, author: "OfficeOlly", rating: 5, date: "2024-06-02", comment: "Rewired our office over the weekend.", verified: true, helpful: 9 }] },
    { id: "new-fb-car", itemName: "John's Used Cars (FB)", mainCategory: "Real World", category: "Facebook Marketplace", subCategory: "Used Cars", location: { city: "Bangkok", district: "Bang Khen" }, rating: 4.4, reviewCount: 19, fallbackImageUrl: "https://placehold.co/400x250/f39c12/ffffff?text=Used+Car", reviews: [{ id: 28, author: "FrankF", rating: 4, date: "2024-06-08", comment: "Car was as described. Fair deal.", verified: false, helpful: 5 }] },
    { id: "new-fb-furniture", itemName: "Secondhand Sofa (FB)", mainCategory: "Real World", category: "Facebook Marketplace", subCategory: "Used Furniture", location: { city: "Bangkok", district: "Prawet" }, rating: 5.0, reviewCount: 1, fallbackImageUrl: "https://placehold.co/400x250/7f8c8d/ffffff?text=Used+Sofa", reviews: [{ id: 29, author: "HappyHome", rating: 5, date: "2025-06-17", comment: "Great condition and a great price!", verified: false, helpful: 1 }] },
    { id: "new-fb-electronics", itemName: "Used iPhone (FB)", mainCategory: "Real World", category: "Facebook Marketplace", subCategory: "Used Electronics", location: { city: "Bangkok", district: "Don Mueang" }, rating: 4.0, reviewCount: 5, fallbackImageUrl: "https://placehold.co/400x250/2c3e50/ffffff?text=Used+iPhone", reviews: [{ id: 30, author: "BuyerBen", rating: 4, date: "2024-06-29", comment: "Battery health was lower than stated, but works.", verified: false, helpful: 2 }] },
    { id: "new-ll-condo", itemName: "Landlord: Mrs. Somchai", mainCategory: "Real World", category: "Landlords", subCategory: "Condo", location: { city: "Bangkok", district: "Huai Khwang" }, rating: 4.9, reviewCount: 8, fallbackImageUrl: "https://placehold.co/400x250/3498db/ffffff?text=Condo+Building", reviews: [{ id: 31, author: "TenantTom", rating: 5, date: "2024-06-01", comment: "Best landlord ever.", verified: true, helpful: 4 }] },
    { id: "new-ll-apt", itemName: "Sukhumvit Suites", mainCategory: "Real World", category: "Landlords", subCategory: "Apartment", location: { city: "Bangkok", district: "Khlong Toei" }, rating: 4.1, reviewCount: 22, fallbackImageUrl: "https://placehold.co/400x250/e74c3c/ffffff?text=Apartment+Building", reviews: [{ id: 32, author: "ExpatEve", rating: 4, date: "2024-05-15", comment: "Good location, but the walls are a bit thin.", verified: true, helpful: 6 }] },
    { id: "new-ll-house", itemName: "Rental House Ladprao", mainCategory: "Real World", category: "Landlords", subCategory: "House", location: { city: "Bangkok", district: "Lat Phrao" }, rating: 4.6, reviewCount: 3, fallbackImageUrl: "https://placehold.co/400x250/2ecc71/ffffff?text=House+Rental", reviews: [{ id: 33, author: "FamilyMan", rating: 5, date: "2024-04-10", comment: "Perfect for our family, great garden.", verified: true, helpful: 1 }] },
];

// MOCK USER DATA
const mockUser = {
    uid: 'mock-google-user-123',
    displayName: 'Demo User',
    photoURL: 'https://placehold.co/100x100/8e44ad/ffffff?text=DU'
};

// Mock Firebase for preview environment
const mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
        const user = mockAuth.currentUser;
        setTimeout(() => callback(user), 100);
        return () => {};
    },
    // SIMULATE Google Sign-In
    signInWithGoogle: () => {
        mockAuth.currentUser = mockUser;
        return Promise.resolve({ user: mockAuth.currentUser });
    },
    signOut: () => {
        mockAuth.currentUser = null;
        return Promise.resolve();
    }
};

const mockFirestore = {
    collection: (path) => ({
        query: () => ({
            onSnapshot: (callback) => {
                setTimeout(() => {
                    callback({
                        docs: initialSampleReviews.map((item) => ({
                            id: item.id,
                            data: () => item
                        }))
                    });
                }, 100);
                return () => {};
            }
        })
    }),
    addDoc: (collectionRef, data) => {
        console.log("Mock Firestore: addDoc called with", data);
        return Promise.resolve({ id: `mock-doc-${Date.now()}` });
    },
    setDoc: (docRef, data) => {
        console.log("Mock Firestore: setDoc called for", docRef.id, "with", data);
        return Promise.resolve();
    },
    getDocs: (q) => Promise.resolve({ docs: initialSampleReviews.map((item) => ({ id: item.id, data: () => item })) }),
    doc: (collectionRef, id) => ({ id: id })
};

// Mocked Firebase functions
const auth = mockAuth;
const db = mockFirestore;
// --- Firebase shims (fixed) ---
const collection = (path) => mockFirestore.collection(path);
const query      = (collectionRef) => collectionRef.query();
const onSnapshot = (queryRef, callback) => queryRef.onSnapshot(callback);
const doc        = (collectionRef, id) => mockFirestore.doc(collectionRef, id);
const setDoc     = mockFirestore.setDoc;
const addDoc     = mockFirestore.addDoc;
const getDocs    = (queryRef) => mockFirestore.getDocs(queryRef);
const onAuthStateChanged = (authInstance, callback) => mockAuth.onAuthStateChanged(callback);
const signInWithGoogle = mockAuth.signInWithGoogle; // Use the mock Google sign-in
const signOut = mockAuth.signOut;

const appId = 'preview-app-id';

// Function to generate image using Imagen API
const generateImage = async (prompt) => {
    try {
        const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1} };
        const apiKey = ""; // Canvas will automatically provide the API key
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorDetails = `Status: ${response.status}`;
            try {
                const errorBody = await response.text();
                errorDetails += `, Body: ${errorBody}`;
            } catch (readError) {
                errorDetails += `, Failed to read response body`;
            }
            throw new Error(`API call failed: ${errorDetails}`);
        }

        const result = await response.json();

        if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
            return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        } else {
            console.error("Image generation failed or returned no data:", result);
            return null;
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};


// StarRating Component with enhanced design
const StarRating = ({ rating, size = 'sm', interactive = false, onRate }) => {
    const starSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;
    const [hoveredStar, setHoveredStar] = useState(null);
    
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => interactive && onRate && onRate(star)}
                    onMouseEnter={() => interactive && setHoveredStar(star)}
                    onMouseLeave={() => interactive && setHoveredStar(null)}
                    className={`transition-all duration-200 ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                    disabled={!interactive}
                >
                    <Star
                        size={starSize}
                        className={`transition-colors duration-200 ${
                            (hoveredStar ? star <= hoveredStar : star <= rating)
                                ? 'fill-amber-400 text-amber-400 drop-shadow-lg' 
                                : 'text-gray-600 hover:text-gray-500'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

// Enhanced ReviewItem Component
const ReviewItem = ({ item, onClick, language, categories, citiesData, bangkokStreetsData, generatedImages, setGeneratedImages }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Get the specific image status for *this* item from the overall state
    const currentItemImageStatus = generatedImages[item.id];

    // Effect to generate image if not already generated or if it failed previously
    useEffect(() => {
        // Only generate if no image status or if there was an error in a previous attempt (up to 3 retries)
        if (!currentItemImageStatus || (!currentItemImageStatus.url && !currentItemImageStatus.loading && (currentItemImageStatus.error || (currentItemImageStatus.retries !== undefined && currentItemImageStatus.retries < 3)))) {
            const currentRetries = currentItemImageStatus?.retries || 0;
            
            // Only initiate generation if not already loading
            if (currentItemImageStatus && currentItemImageStatus.loading) {
                return;
            }

            setGeneratedImages(prev => ({ 
                ...prev, 
                [item.id]: { loading: true, url: null, error: false, retries: currentRetries + 1 } 
            }));

            // Modified prompt to specify English text only
            const prompt = `A shop front image of "${item.itemName}" which is a ${item.subCategory || item.category} in ${item.location.city !== 'Online' ? item.location.city : 'digital space'}. Ensure any text visible in the image is in English. Style: realistic, high detail.`;
            generateImage(prompt).then(url => {
                setGeneratedImages(prev => ({ ...prev, [item.id]: { ...prev[item.id], loading: false, url: url, error: false } }));
            }).catch(error => {
                console.error("Failed to generate image for item:", item.itemName, error);
                setGeneratedImages(prev => ({ ...prev, [item.id]: { ...prev[item.id], loading: false, url: null, error: true } })); 
            });
        }
    }, [
        item.id, 
        item.itemName, 
        item.category, 
        item.subCategory, 
        item.location.city, 
        currentItemImageStatus?.url, 
        currentItemImageStatus?.loading, 
        currentItemImageStatus?.error, 
        currentItemImageStatus?.retries, 
        setGeneratedImages 
    ]);

    const getCategoryLabel = (mainCat, cat, subCat) => {
        const mainLabel = categories.find(c => c.value === mainCat)?.[`label_${language}`] || mainCat;
        const platformOrCat = mainCat === 'Online' 
            ? categories.find(c => c.value === mainCat)?.platforms?.find(p => p.value === cat)?.[`label_${language}`] || cat
            : categories.find(c => c.value === mainCat)?.subcategories?.find(s => s.value === cat)?.[`label_${language}`] || cat;
        const subCatLabel = (mainCat === 'Online' ? (categories.find(c => c.value === mainCat)?.platforms?.find(p => p.value === cat)?.subcategories?.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat) : (categories.find(c => c.value === mainCat)?.subcategories?.find(s => s.value === cat)?.subcategories.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat));
        
        let parts = [mainLabel];
        if (platformOrCat && platformOrCat !== cat) parts.push(platformOrCat);
        if (subCatLabel && subCatLabel !== subCat) parts.push(subCatLabel);
        
        if (parts.length === 1 && cat && cat !== 'all') {
            const currentCategoryData = (mainCat === 'Online' ? categories.find(c => c.value === mainCat)?.platforms : categories.find(c => c.value === mainCat)?.subcategories)?.find(c => c.value === cat);
            if (currentCategoryData) parts.push(currentCategoryData[`label_${language}`] || cat);
        }
        if (parts.length === 2 && subCat && subCat !== 'all') {
            let currentSubCategoryData;
            if (mainCat === 'Online') {
                const platform = categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat);
                currentSubCategoryData = platform?.subcategories.find(s => s.value === subCat);
            } else {
                const category = categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat);
                currentSubCategoryData = category?.subcategories.find(sc => sc.value === subCat);
            }
            if (currentSubCategoryData) parts.push(currentSubCategoryData[`label_${language}`] || subCat);
        }

        return parts.filter(Boolean).join(' / ');
    };

    const getLocationLabel = (loc) => {
        if (!loc || !loc.city) return '';
        const cityLabel = citiesData.find(c => c.value === loc.city)?.[`label_${language}`] || loc.city;
        const districtLabel = loc.district ? (citiesData.find(c => c.value === loc.city)?.districts.find(d => d.value === loc.district)?.[`label_${language}`] || loc.district) : '';
        
        let parts = [cityLabel];
        if (districtLabel) parts.push(districtLabel);

        return parts.filter(Boolean).join(', ');
    };

    const imageUrlToDisplay = currentItemImageStatus?.url || item.fallbackImageUrl;

    return (
        <div
            className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700/50 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-gray-600/50 ${isHovered ? 'ring-2 ring-purple-500/20' : ''}`}
            onClick={() => onClick(item)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl" />
            
            {currentItemImageStatus?.loading ? (
                <div className="mb-4 overflow-hidden rounded-xl aspect-video bg-gray-700 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-400 ml-3">Generating image...</span>
                </div>
            ) : imageUrlToDisplay ? (
                <div className="mb-4 overflow-hidden rounded-xl aspect-video">
                    <img
                        src={imageUrlToDisplay}
                        alt={item.itemName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/333/555?text=Image+Error"; }}
                    />
                </div>
            ) : (
                <div className="mb-4 overflow-hidden rounded-xl aspect-video bg-gray-700 flex items-center justify-center text-gray-400">
                    <Camera size={48} className="text-gray-500"/>
                </div>
            )}

            <div className="relative flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-100 mb-3 tracking-tight">{item.itemName}</h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <StarRating rating={item.rating} size="md" />
                            <span className="text-lg font-bold text-gray-100">
                                {item.rating ? item.rating.toFixed(1) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                            <MessageCircle size={14} />
                            <span>{item.reviewCount || 0} reviews</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                            {getCategoryLabel(item.mainCategory, item.category, item.subCategory)}
                        </span>
                        {item.location && item.location.city && item.location.city !== "Online" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                                <MapPin size={12} />
                                {getLocationLabel(item.location)}
                            </span>
                        )}
                        {item.location && item.location.city === "Online" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 border border-blue-500/20 backdrop-blur-sm">
                                <Globe size={12} />
                                {language === 'en' ? 'Digital' : 'ดิจิทัล'}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`transition-all duration-300 ${isHovered ? 'rotate-90' : ''}`}>
                    <ChevronDown className="text-gray-500" size={20} />
                </div>
            </div>

            {item.reviews && item.reviews.length > 0 && (
                <div className="mt-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-white">
                                {item.reviews[0].author.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-100">{item.reviews[0].author}</span>
                                {item.reviews[0].verified && (
                                    <div className="flex items-center gap-1">
                                        <CheckCircle className="text-blue-400" size={14} />
                                        <span className="text-xs text-blue-400">Verified</span>
                                    </div>
                                )}
                            </div>
                            <StarRating rating={item.reviews[0].rating} size="sm" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2 italic">
                        "{language === 'en' ? item.reviews[0].comment : item.reviews[0].comment_th || item.reviews[0].comment}"
                    </p>
                </div>
            )}
        </div>
    );
};

// New ItemDetailPage component
const ItemDetailPage = ({ item, onBack, language, categories, citiesData, bangkokStreetsData, generatedImages, setGeneratedImages }) => {
    if (!item) return null;

    const currentItemImageStatus = generatedImages[item.id];

    useEffect(() => {
        if (!currentItemImageStatus || (!currentItemImageStatus.url && !currentItemImageStatus.loading && (currentItemImageStatus.error || currentItemImageStatus.retries === undefined || currentItemImageStatus.retries < 3))) {
            const currentRetries = currentItemImageStatus?.retries || 0;
            if (currentItemImageStatus && currentItemImageStatus.loading) {
                return;
            }

            setGeneratedImages(prev => ({ 
                ...prev, 
                [item.id]: { loading: true, url: null, error: false, retries: currentRetries + 1 } 
            }));
            
            const prompt = `A detailed photo of the shop front of "${item.itemName}" which is a ${item.subCategory || item.category} in ${item.location.city !== 'Online' ? item.location.city + ', ' + item.location.district : 'the online world'}. Ensure any text visible in the image is in English. Focus on the exterior.`;
            generateImage(prompt).then(url => {
                setGeneratedImages(prev => ({ ...prev, [item.id]: { ...prev[item.id], loading: false, url: url, error: false } }));
            }).catch(error => {
                console.error("Failed to generate image for item:", item.itemName, error);
                setGeneratedImages(prev => ({ ...prev, [item.id]: { ...prev[item.id], loading: false, url: null, error: true } }));
            });
        }
    }, [
        item.id, 
        item.itemName, 
        item.category, 
        item.subCategory, 
        item.location.city, 
        item.location.district,
        currentItemImageStatus?.url, 
        currentItemImageStatus?.loading, 
        currentItemImageStatus?.error, 
        currentItemImageStatus?.retries, 
        setGeneratedImages 
    ]);


    const getCategoryLabel = (mainCat, cat, subCat) => {
        const mainLabel = categories.find(c => c.value === mainCat)?.[`label_${language}`] || mainCat;
        const platformOrCat = mainCat === 'Online' 
            ? categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat)?.[`label_${language}`] || cat
            : categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat)?.[`label_${language}`] || cat;
        const subCatLabel = (mainCat === 'Online' ? (categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat)?.subcategories.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat) : (categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat)?.subcategories.find(sc => sc.value === subCat)?.[`label_${language}`] || subCat));
        
        let parts = [mainLabel];
        if (platformOrCat && platformOrCat !== cat) parts.push(platformOrCat);
        if (subCatLabel && subCatLabel !== subCat) parts.push(subCatLabel);

        if (parts.length === 1 && cat && cat !== 'all') { 
            const currentCategoryData = (mainCat === 'Online' ? categories.find(c => c.value === mainCat)?.platforms : categories.find(c => c.value === mainCat)?.subcategories)?.find(c => c.value === cat);
            if (currentCategoryData) parts.push(currentCategoryData[`label_${language}`] || cat);
        }
        if (parts.length === 2 && subCat && subCat !== 'all') { 
            let currentSubCategoryData;
            if (mainCat === 'Online') {
                const platform = categories.find(c => c.value === mainCat)?.platforms.find(p => p.value === cat);
                currentSubCategoryData = platform?.subcategories.find(s => s.value === subCat);
            } else {
                const category = categories.find(c => c.value === mainCat)?.subcategories.find(s => s.value === cat);
                currentSubCategoryData = category?.subcategories.find(sc => sc.value === subCat);
            }
            if (currentSubCategoryData) parts.push(currentSubCategoryData[`label_${language}`] || subCat);
        }
        return parts.filter(Boolean).join(' / ');
    };

    const getLocationLabel = (loc) => {
        if (!loc || !loc.city) return '';
        const cityLabel = citiesData.find(c => c.value === loc.city)?.[`label_${language}`] || loc.city;
        const districtLabel = loc.district ? (citiesData.find(c => c.value === loc.city)?.districts.find(d => d.value === loc.district)?.[`label_${language}`] || loc.district) : '';
        
        let parts = [cityLabel];
        if (districtLabel) parts.push(districtLabel);

        return parts.filter(Boolean).join(', ');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <header className="bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/50 p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-semibold">{language === 'en' ? 'Back to List' : 'กลับไปที่รายการ'}</span>
                    </button>
                    <h2 className="text-xl font-bold text-gray-100 truncate">{item.itemName}</h2>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                 <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700/50 p-6 md:p-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
                    
                    <div className="relative">
                        {currentItemImageStatus?.loading ? (
                            <div className="mb-6 overflow-hidden rounded-xl aspect-video shadow-lg bg-gray-700 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-lg text-gray-400 ml-4">Generating image...</span>
                            </div>
                        ) : currentItemImageStatus?.url ? (
                            <div className="mb-6 overflow-hidden rounded-xl aspect-video shadow-lg">
                                <img
                                    src={currentItemImageStatus.url}
                                    alt={item.itemName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x250/333/555?text=Image+Error"; }}
                                />
                            </div>
                        ) : (
                            <div className="mb-6 overflow-hidden rounded-xl aspect-video shadow-lg bg-gray-700 flex items-center justify-center text-gray-400">
                                <Camera size={64} className="text-gray-500"/>
                            </div>
                        )}
                        <h2 className="text-3xl font-bold text-gray-100 mb-6 tracking-tight">{item.itemName}</h2>
                        
                        <div className="mb-6 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/20 backdrop-blur-sm">
                                {getCategoryLabel(item.mainCategory, item.category, item.subCategory)}
                            </span>
                            {item.location && item.location.city && item.location.city !== "Online" &&(
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/20 backdrop-blur-sm">
                                    <MapPin size={14} />
                                    {getLocationLabel(item.location)}
                                </span>
                            )}
                        </div>

                        <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <span className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                        {item.rating ? item.rating.toFixed(1) : 'N/A'}
                                    </span>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {language === 'en' ? 'out of 5' : 'จาก 5'}
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <StarRating rating={item.rating || 0} size="lg" />
                                    <p className="text-sm text-gray-400 mt-2">
                                        {language === 'en' ? `Based on ${item.reviewCount || 0} reviews` : `อิงจาก ${item.reviewCount || 0} รีวิว`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <TrendingUp size={18} />
                                    <span className="text-sm font-semibold">{language === 'en' ? "Activity" : "กิจกรรม"}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-100">{language === 'en' ? "High" : "สูง"}</p>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    <Clock size={18} />
                                    <span className="text-sm font-semibold">{language === 'en' ? "Last Review" : "รีวิวล่าสุด"}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-100">{language === 'en' ? "Recent" : "เร็วๆ นี้"}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-100 mb-4">{language === 'en' ? "All Reviews" : "รีวิวทั้งหมด"}</h3>
                            {item.reviews && item.reviews.length > 0 ? (
                                item.reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((review) => (
                                    <div key={review.id} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                                <span className="text-sm font-bold text-white">
                                                    {review.author.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-semibold text-gray-100">{review.author}</span>
                                                    {review.verified && (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="text-blue-400" size={12} />
                                                            <span className="text-xs text-blue-400">Verified</span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-500">{review.date}</span>
                                                </div>
                                                <StarRating rating={review.rating} size="sm" />
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed pl-12">
                                            {language === 'en' ? review.comment : review.comment_th || review.comment}
                                        </p>
                                        <div className="flex items-center gap-4 mt-4 pl-12">
                                            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-400 transition-colors">
                                                <Heart size={14} />
                                                <span>{language === 'en' ? "Helpful" : "มีประโยชน์"} ({review.helpful})</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>{language === 'en' ? "No reviews yet. Be the first!" : "ยังไม่มีรีวิว เป็นคนแรก!"}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


// Enhanced ReviewFormModal Component
const ReviewFormModal = ({ show, onClose, newReview, setNewReview, onSubmit, categories, citiesData, bangkokStreetsData, language }) => {
    if (!show) return null;

    const selectedMainCategoryObj = categories.find(cat => cat.value === newReview.mainCategory);
    const categoriesForForm = selectedMainCategoryObj?.subcategories || selectedMainCategoryObj?.platforms || [];

    let subcategoriesOrPlatformsForForm = [];
    if (newReview.mainCategory === 'Online') {
        const selectedPlatformObj = categoriesForForm.find(p => p.value === newReview.category);
        subcategoriesOrPlatformsForForm = selectedPlatformObj?.subcategories || [];
    } else if (newReview.mainCategory === 'Real World') {
        const selectedCategoryObj = categoriesForForm.find(c => c.value === newReview.category);
        subcategoriesOrPlatformsForForm = selectedCategoryObj?.subcategories || [];
    }

    const selectedCityInForm = citiesData.find(city => city.value === newReview.location.city);
    const districtsForForm = selectedCityInForm?.districts || [];

    const selectedDistrictInForm = districtsForForm.find(d => d.value === newReview.location.district);
    const zonesForForm = selectedDistrictInForm?.zones || [];

    const selectedZoneInForm = zonesForForm.find(z => z.value === newReview.location.zone);
    const subDistrictsForForm = selectedZoneInForm ? (selectedDistrictInForm?.subDistricts.filter(sd => selectedZoneInForm.khwaengValues.includes(sd.value)) || []) : (selectedDistrictInForm?.subDistricts || []);

    const getStreetsForCurrentLocation = () => {
        if (newReview.location.city !== 'Bangkok') return [];

        let relevantKhwaengs = [];
        if (newReview.location.subDistrict) {
            relevantKhwaengs.push(newReview.location.subDistrict);
        } else if (newReview.location.zone && selectedZoneInForm) {
            relevantKhwaengs = selectedZoneInForm.khwaengValues;
        } else if (newReview.location.district && selectedDistrictInForm) {
            relevantKhwaengs = selectedDistrictInForm.subDistricts.map(sd => sd.value);
        }

        if (relevantKhwaengs.length === 0) { // If no specific sub-location is chosen, return all Bangkok streets
            return bangkokStreetsData;
        }

        const streets = bangkokStreetsData.filter(street => 
            street.associatedKhwaengs && street.associatedKhwaengs.some(khwaeng => relevantKhwaengs.includes(khwaeng))
        );
        return streets;
    };

    const streetsForForm = getStreetsForCurrentLocation();

    const selectedStreetInForm = streetsForForm.find(s => s.value === newReview.location.street);
    const alleysForForm = selectedStreetInForm?.alleys || [];

    const showLocationFields = newReview.mainCategory === 'Real World';
    
    const generateTags = () => {
        const tags = [];
        
        // Main Category
        if (newReview.mainCategory) {
            const mainCat = categories.find(c => c.value === newReview.mainCategory);
            if (mainCat) tags.push(language === 'en' ? mainCat.label : mainCat.label_th);
        }
    
        // Category / Platform
        if (newReview.category && selectedMainCategoryObj) {
            const catList = selectedMainCategoryObj.platforms || selectedMainCategoryObj.subcategories || [];
            const cat = catList.find(c => c.value === newReview.category);
            if (cat) tags.push(language === 'en' ? cat.label : cat.label_th);
        }
    
        // Sub-Category
        if (newReview.subCategory && subcategoriesOrPlatformsForForm.length > 0) {
            const subCat = subcategoriesOrPlatformsForForm.find(sc => sc.value === newReview.subCategory);
            if (subCat) tags.push(language === 'en' ? subCat.label : subCat.label_th);
        }
    
        // Location tags
        if (showLocationFields) {
            if (newReview.location.city) {
                const city = citiesData.find(c => c.value === newReview.location.city);
                if(city) tags.push(language === 'en' ? city.label : city.label_th);
            }
            if (newReview.location.district) {
                 const dist = districtsForForm.find(d => d.value === newReview.location.district);
                if(dist) tags.push(language === 'en' ? dist.label : dist.label_th);
            }
            if (newReview.location.zone) {
                const zn = zonesForForm.find(z => z.value === newReview.location.zone);
                if(zn) tags.push(language === 'en' ? zn.label : zn.label_th);
            }
             if (newReview.location.subDistrict) {
                const subDist = subDistrictsForForm.find(sd => sd.value === newReview.location.subDistrict);
                if(subDist) tags.push(language === 'en' ? subDist.label : subDist.label_th);
            }
             if (newReview.location.street) {
                const str = streetsForForm.find(s => s.value === newReview.location.street);
                if(str) tags.push(language === 'en' ? str.label : str.label_th);
            }
             if (newReview.location.alley) {
                const al = alleysForForm.find(a => a.value === newReview.location.alley);
                if(al) tags.push(language === 'en' ? al.label : al.label_th);
            }
            if (newReview.location.specificArea) {
                 tags.push(newReview.location.specificArea);
            }
        } else { // Online
             if (newReview.location.specificArea) { // URL/Handle
                 tags.push(newReview.location.specificArea);
             }
        }
    
        return tags.filter(Boolean); // Remove any null/undefined entries
    }

    const generatedTags = generateTags();


    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 text-gray-100 max-h-[90vh] overflow-y-auto border border-gray-700/50 scrollbar-hide">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">{language === 'en' ? "Write a Review" : "เขียนรีวิว"}</h2>
                        <p className="text-sm text-gray-400 mt-1">{language === 'en' ? "Share your experience" : "แบ่งปันประสบการณ์ของคุณ"}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300 hover:rotate-90 transition-all duration-300"
                        aria-label={language === 'en' ? "Close review form" : "ปิดแบบฟอร์มรีวิว"}
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "What are you reviewing?" : "คุณกำลังรีวิวอะไร?"}
                        </label>
                        <input
                            type="text"
                            id="itemName"
                            value={newReview.itemName}
                            onChange={(e) => setNewReview({...newReview, itemName: e.target.value})}
                            placeholder={language === 'en' ? "e.g., John's Used Cars, @foodie_reviews_ny" : "เช่น รถมือสองของจอห์น, @รีวิวของอร่อยนิวยอร์ก"}
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="mainCategory" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Main Category" : "หมวดหมู่หลัก"}
                        </label>
                        <select
                            id="mainCategory"
                            value={newReview.mainCategory}
                            onChange={(e) => setNewReview({
                                ...newReview,
                                mainCategory: e.target.value,
                                category: '',
                                subCategory: '',
                                location: { 
                                    city: e.target.value === 'Online' ? 'Online' : (e.target.value === 'Real World' ? 'Bangkok' : ''),
                                    district: '', 
                                    zone: '', 
                                    subDistrict: '',
                                    street: '',
                                    alley: '',
                                    specificArea: ''
                                }
                            })}
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                        >
                            <option value="">{language === 'en' ? "Select a main category" : "เลือกหมวดหมู่หลัก"}</option>
                            {categories.filter(cat => cat.isTopLevel).map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.icon} {language === 'en' ? cat.label : cat.label_th}
                                </option>
                            ))}
                        </select>
                    </div>

                    {newReview.mainCategory && categoriesForForm.length > 0 && (
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-gray-300 mb-2">
                                {newReview.mainCategory === 'Online' ? (language === 'en' ? 'Platform' : 'แพลตฟอร์ม') : (language === 'en' ? 'Category' : 'หมวดหมู่')}
                            </label>
                            <select
                                id="category"
                                value={newReview.category}
                                onChange={(e) => setNewReview({...newReview, category: e.target.value, subCategory: ''})}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                            >
                                <option value="">{newReview.mainCategory === 'Online' ? (language === 'en' ? 'Select a platform' : 'เลือกแพลตฟอร์ม') : (language === 'en' ? 'Select a category' : 'เลือกหมวดหมู่')}</option>
                                {categoriesForForm.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {language === 'en' ? cat.label : cat.label_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {newReview.category && subcategoriesOrPlatformsForForm.length > 0 && (
                        <div>
                            <label htmlFor="subCategory" className="block text-sm font-semibold text-gray-300 mb-2">
                                {language === 'en' ? "Subcategory (Optional)" : "หมวดหมู่ย่อย (ไม่บังคับ)"}
                            </label>
                            <select
                                id="subCategory"
                                value={newReview.subCategory}
                                onChange={(e) => setNewReview({...newReview, subCategory: e.target.value})}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                            >
                                <option value="">{language === 'en' ? "Select a subcategory" : "เลือกหมวดหมู่ย่อย"}</option>
                                {subcategoriesOrPlatformsForForm.map((subCat) => (
                                    <option key={subCat.value} value={subCat.value}>
                                        {language === 'en' ? subCat.label : subCat.label_th}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {showLocationFields && (
                        <div className="space-y-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                            <p className="text-sm font-semibold text-gray-300">{language === 'en' ? "Location Details" : "รายละเอียดสถานที่"}</p>
                            
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                                    {language === 'en' ? "City" : "เมือง"}
                                </label>
                                <select
                                    id="city"
                                    value={newReview.location.city}
                                    onChange={(e) => setNewReview({...newReview, location: {...newReview.location, city: e.target.value, district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: ''}})}
                                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                                >
                                    <option value="">{language === 'en' ? "Select a city" : "เลือกเมือง"}</option>
                                    {citiesData.filter(c => c.value !== 'Online').map((city) => (
                                        <option key={city.value} value={city.value}>
                                            {language === 'en' ? city.label : city.label_th}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {newReview.location.city === 'Bangkok' && districtsForForm.length > 0 && (
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "District" : "เขต"}
                                    </label>
                                    <select
                                        id="district"
                                        value={newReview.location.district}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, district: e.target.value, zone: '', subDistrict: '', street: '', alley: '', specificArea: ''}})}
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                                    >
                                        <option value="">{language === 'en' ? "Select a district" : "เลือกเขต"}</option>
                                        {districtsForForm.map((district) => (
                                            <option key={district.value} value={district.value}>
                                                {language === 'en' ? district.label : district.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {newReview.location.district && zonesForForm.length > 0 && (
                                <div>
                                    <label htmlFor="zone" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Zone (Optional)" : "โซน (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="zone"
                                        value={newReview.location.zone}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, zone: e.target.value, subDistrict: '', street: '', alley: '', specificArea: ''}})}
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                                    >
                                        <option value="">{language === 'en' ? "Select a zone" : "เลือกโซน"}</option>
                                        {zonesForForm.map((zone) => (
                                            <option key={zone.value} value={zone.value}>
                                                {language === 'en' ? zone.label : zone.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(newReview.location.district || newReview.location.zone) && subDistrictsForForm.length > 0 && (
                                <div>
                                    <label htmlFor="subDistrict" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Sub-District (Optional)" : "แขวง/ตำบล (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="subDistrict"
                                        value={newReview.location.subDistrict}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, subDistrict: e.target.value, street: '', alley: '', specificArea: ''}})}
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                                    >
                                        <option value="">{language === 'en' ? "Select a sub-district" : "เลือกแขวง/ตำบล"}</option>
                                        {subDistrictsForForm.map((subDistrict) => (
                                            <option key={subDistrict.value} value={subDistrict.value}>
                                                {language === 'en' ? subDistrict.label : subDistrict.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            
                            {/* STREET FIELD: Always show if Bangkok is selected and streets are available */}
                            {newReview.location.city === 'Bangkok' && streetsForForm.length > 0 && (
                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Street (Optional)" : "ถนน (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="street"
                                        value={newReview.location.street}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, street: e.target.value, alley: '', specificArea: ''}})}
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                                    >
                                        <option value="">{language === 'en' ? "Select a street" : "เลือกถนน"}</option>
                                        {streetsForForm.map((street) => (
                                            <option key={street.value} value={street.value}>
                                                {language === 'en' ? street.label : street.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ALLEY FIELD: Show only if a specific street is selected and alleys exist */}
                            {newReview.location.street && alleysForForm.length > 0 && (
                                <div>
                                    <label htmlFor="alley" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Alley (Optional)" : "ซอย (ไม่บังคับ)"}
                                    </label>
                                    <select
                                        id="alley"
                                        value={newReview.location.alley}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, alley: e.target.value, specificArea: ''}})}
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 backdrop-blur-sm transition-all duration-300"
                                    >
                                        <option value="">{language === 'en' ? "Select an alley" : "เลือกซอย"}</option>
                                        {alleysForForm.map((alley) => (
                                            <option key={alley.value} value={alley.value}>
                                                {language === 'en' ? alley.label : alley.label_th}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(newReview.location.subDistrict || newReview.location.alley || newReview.location.street || newReview.location.zone || newReview.location.district) && (
                                <div>
                                    <label htmlFor="specificArea" className="block text-sm font-medium text-gray-400 mb-2">
                                        {language === 'en' ? "Specific Area / Landmark (Optional)" : "พื้นที่เฉพาะ / สถานที่สำคัญ (ไม่บังคับ)"}
                                    </label>
                                    <input
                                        type="text"
                                        id="specificArea"
                                        value={newReview.location.specificArea}
                                        onChange={(e) => setNewReview({...newReview, location: {...newReview.location, specificArea: e.target.value}})}
                                        placeholder={language === 'en' ? "e.g., Near Central Embassy, Soi 21 Building A" : "เช่น ใกล้เซ็นทรัลเอ็มบาสซี, ซอย 21 ตึก A"}
                                        className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {newReview.mainCategory === 'Online' && (
                        <div>
                            <label htmlFor="specificAreaOnline" className="block text-sm font-semibold text-gray-300 mb-2">
                                {language === 'en' ? "Online URL / Handle" : "URL / ชื่อผู้ใช้"}
                            </label>
                            <input
                                type="text"
                                id="specificAreaOnline"
                                value={newReview.location.specificArea}
                                onChange={(e) => setNewReview({...newReview, location: {...newReview.location, specificArea: e.target.value}})}
                                placeholder={language === 'en' ? "e.g., youtube.com/@influencername" : "เช่น youtube.com/@ชื่ออินฟลูเอนเซอร์"}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                            />
                        </div>
                    )}

                    {generatedTags.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                {language === 'en' ? "Generated Tags" : "แท็กที่สร้างขึ้น"}
                            </label>
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-800/30 rounded-xl border border-gray-700/50">
                                {generatedTags.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                            {language === 'en' ? "Rating" : "คะแนน"}
                        </label>
                        <div className="flex justify-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                            <StarRating 
                                rating={newReview.rating} 
                                size="lg" 
                                interactive={true} 
                                onRate={(rating) => setNewReview({...newReview, rating})}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="comment" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Your Review" : "รีวิวของคุณ"}
                        </label>
                        <textarea
                            id="comment"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                            rows={4}
                            placeholder={language === 'en' ? "Share your experience..." : "แบ่งปันประสบการณ์ของคุณ..."}
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-300 resize-none"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="author" className="block text-sm font-semibold text-gray-300 mb-2">
                            {language === 'en' ? "Your Name" : "ชื่อของคุณ"}
                        </label>
                        <input
                            type="text"
                            id="author"
                            value={newReview.author}
                            onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                            placeholder={language === 'en' ? "John D." : "สมชาย ดี"}
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 backdrop-blur-sm transition-all duration-300"
                        />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => console.log(language === 'en' ? 'Photo upload functionality would be implemented here.' : 'ฟังก์ชันอัปโหลดรูปภาพจะถูกนำมาใช้ที่นี่')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl hover:bg-gray-800/50 border-gray-700 text-gray-300 hover:text-gray-100 transition-all duration-300 backdrop-blur-sm"
                        >
                            <Camera size={20} />
                            {language === 'en' ? "Add Photos" : "เพิ่มรูปภาพ"}
                        </button>
                        <button
                            onClick={() => onSubmit(newReview)}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            {language === 'en' ? "Submit Review" : "ส่งรีวิว"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main App Component with enhanced design
const App = () => {
    const [page, setPage] = useState('home'); // 'home' or 'detail'
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState('en');
    const [selectedMainCategory, setSelectedMainCategory] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState('all');
    const [selectedCityFilter, setSelectedCityFilter] = useState('all');
    const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('all');
    const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');
    const [selectedSubDistrictFilter, setSelectedSubDistrictFilter] = useState('all');
    const [selectedStreetFilter, setSelectedStreetFilter] = useState('all');
    const [selectedAlleyFilter, setSelectedAlleyFilter] = useState('all');
    const [selectedSpecificAreaFilter, setSelectedSpecificAreaFilter] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null); // Changed from userId to user object
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [noMatchingReviewsMessage, setNoMatchingReviewsMessage] = useState('');
    const [isLoadingNoMatchingReviewsMessage, setIsLoadingNoMatchingReviewsMessage] = useState(false);
    const [generatedImages, setGeneratedImages] = useState({}); // State for dynamically generated images
    const [showFilters, setShowFilters] = useState(true); // State for filter section visibility
    const [showSearchBar, setShowSearchBar] = useState(true); // State for search bar visibility


    // Data structures remain the same
    const categories = [ { value: 'all', label: 'All Categories', label_th: 'ทุกหมวดหมู่', icon: '🌐', isTopLevel: true }, { value: 'Online', label: 'Online', label_th: 'ออนไลน์', icon: '💻', isTopLevel: true, platforms: [ { value: 'Facebook', label: 'Facebook', label_th: 'เฟซบุ๊ก', subcategories: [ { value: 'Influencer', label: 'Influencer', label_th: 'อินฟลูเอนเซอร์' }, { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, { value: 'Page', label: 'Page', label_th: 'เพจ' }, { value: 'Group', label: 'Group', label_th: 'กลุ่ม' }, ] }, { value: 'Shopee', label: 'Shopee', label_th: 'ช้อปปี้', subcategories: [ { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, { value: 'Seller', label: 'Seller', label_th: 'ผู้ขาย' }, ] }, { value: 'Instagram', label: 'Instagram', label_th: 'อินสตาแกรม', subcategories: [ { value: 'Influencer', label: 'Influencer', label_th: 'อินฟลูเอนเซอร์' }, { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, ] }, { value: 'TikTok', label: 'TikTok', label_th: 'ติ๊กต็อก', subcategories: [ { value: 'Influencer', label: 'Influencer', label_th: 'อินฟลูเอนเซอร์' }, { value: 'Shop', label: 'Shop', label_th: 'ร้านค้า' }, ] }, { value: 'YouTube', label: 'YouTube', label_th: 'ยูทูป', subcategories: [ { value: 'Channel', label: 'Channel', label_th: 'ช่อง' }, { value: 'Content Creator', label: 'Content Creator', label_th: 'ผู้สร้างเนื้อหา' }, ] }, { value: 'Telegram', label: 'Telegram', label_th: 'เทเลแกรม', subcategories: [ { value: 'Group', label: 'Group', label_th: 'กลุ่ม' }, { value: 'Channel', label: 'Channel', label_th: 'ช่อง' }, ] }, { value: 'Line', label: 'Line', label_th: 'ไลน์', subcategories: [ { value: 'Official Account', label: 'Official Account', label_th: 'บัญชีทางการ' }, { value: 'Group', label: 'Group', label_th: 'กลุ่ม' }, ] }, { value: 'Website', label: 'Website', label_th: 'เว็บไซต์', subcategories: [ { value: 'E-commerce', label: 'E-commerce', label_th: 'อีคอมเมิร์ซ' }, { value: 'Blog', label: 'Blog', label_th: 'บล็อก' }, { value: 'Forum', label: 'Forum', label_th: 'ฟอรั่ม' }, { value: 'Service Provider', label: 'Service Provider', label_th: 'ผู้ให้บริการ' }, ] }, { value: 'Online Service (General)', label: 'Online Service (General)', label_th: 'บริการออนไลน์ (ทั่วไป)' }, ] }, { value: 'Real World', label: 'Real World', label_th: 'โลกจริง', icon: '🌍', isTopLevel: true, subcategories: [ { value: 'Local Services', label: 'Local Services', label_th: 'บริการท้องถิ่น', icon: '🛠️', subcategories: [ { value: 'Movers', label: 'Movers', label_th: 'ผู้ให้บริการขนย้าย' }, { value: 'Tutors', label: 'Tutors', label_th: 'ติวเตอร์' }, { value: 'Handymen', label: 'Handymen', label_th: 'ช่างซ่อมบำรุง' }, { value: 'Cleaners', label: 'Cleaners', label_th: 'ผู้ให้บริการทำความสะอาด' }, { value: 'Plumbers', label: 'Plumbers', label_th: 'ช่างประปา' }, { value: 'Electricians', label: 'Electricians', label_th: 'ช่างไฟฟ้า' }, { value: 'Mechanics', label: 'Mechanics', label_th: 'ช่างยนต์' }, ] }, { value: 'Facebook Marketplace', label: 'Facebook Marketplace', label_th: 'ตลาด Facebook', icon: '🛒', subcategories: [ { value: 'Used Cars', label: 'Used Cars', label_th: 'รถยนต์มือสอง' }, { value: 'Used Furniture', label: 'Used Furniture', label_th: 'เฟอร์นิเจอร์มือสอง' }, { value: 'Used Electronics', label: 'Used Electronics', label_th: 'อุปกรณ์อิเล็กทรอนิกส์มือสอง' }, ] }, { value: 'Goods & Products', label: 'Goods & Products', label_th: 'สินค้าและผลิตภัณฑ์', icon: '📦', subcategories: [ { value: 'Used Clothing', label: 'Used Clothing', label_th: 'เสื้อผ้ามือสอง' }, { value: 'Used Electronics', label: 'Used Electronics', label_th: 'อุปกรณ์อิเล็กทรอนิกส์มือสอง' }, { value: 'Furniture', label: 'Furniture', label_th: 'เฟอร์นิเจอร์' }, { value: 'Antiques', label: 'Antiques', label_th: 'ของเก่า' }, { value: 'Collectibles', label: 'Collectibles', label_th: 'ของสะสม' }, ] }, { value: 'Landlords', label: 'Landlords', label_th: 'เจ้าของที่ดิน/อาคาร', icon: '🏠', subcategories: [ { value: 'Apartment', label: 'Apartment', label_th: 'อพาร์ตเมนต์' }, { value: 'Condo', label: 'Condo', label_th: 'คอนโด' }, { value: 'House', label: 'House', label_th: 'บ้าน' }, ] }, { value: 'Restaurants & Cafes', label: 'Restaurants & Cafes', label_th: 'ร้านอาหารและคาเฟ่', icon: '🍽️', subcategories: [ { value: 'Thai Food', label: 'Thai Food', label_th: 'อาหารไทย' }, { value: 'Japanese Food', label: 'Japanese Food', label_th: 'อาหารญี่ปุ่น' }, { value: 'Italian Food', label: 'Italian Food', label_th: 'อาหารอิตาเลียน' }, { value: 'Cafe', label: 'Cafe', label_th: 'คาเฟ่' }, { value: 'Street Food Stall', label: 'Street Food Stall', label_th: 'ร้านอาหารริมทาง' }, { value: 'Fine Dining', label: 'Fine Dining', label_th: 'ร้านอาหารหรู' }, ] }, { value: 'Retail Stores', label: 'Retail Stores', label_th: 'ร้านค้าปลีก', icon: '🛍️', subcategories: [ { value: 'Fashion Boutique', label: 'Fashion Boutique', label_th: 'ร้านบูติกเสื้อผ้า' }, { value: 'Electronics Store', label: 'Electronics Store', label_th: 'ร้านเครื่องใช้ไฟฟ้า' }, { value: 'Supermarket', label: 'Supermarket', label_th: 'ซูเปอร์มาร์เก็ต' }, { value: 'Convenience Store', label: 'Convenience Store', label_th: 'ร้านสะดวกซื้อ' }, ] }, { value: 'Education Centers', label: 'Education Centers', label_th: 'ศูนย์การศึกษา', icon: '🎓', subcategories: [ { value: 'Language School', label: 'Language School', label_th: 'โรงเรียนสอนภาษา' }, { value: 'Tutoring Center', label: 'Tutoring Center', label_th: 'ศูนย์กวดวิชา' }, { value: 'Workshop/Classes', label: 'Workshop/Classes', label_th: 'เวิร์คช็อป/คลาสเรียน' }, ] }, { value: 'Healthcare Services', label: 'Healthcare Services', label_th: 'บริการด้านสุขภาพ', icon: '🏥', subcategories: [ { value: 'Clinic', label: 'Clinic', label_th: 'คลินิก' }, { value: 'Hospital', label: 'Hospital', label_th: 'โรงพยาบาล' }, { value: 'Dentist', label: 'Dentist', label_th: 'ทันตแพทย์' }, { value: 'Pharmacy', label: 'Pharmacy', label_th: 'ร้านขายยา' }, ] }, ] } ];
    const citiesData = [ { value: 'Bangkok', label: 'Bangkok', label_th: 'กรุงเทพมหานคร', districts: [ { value: 'Sathorn', label: 'Sathorn', label_th: 'สาทร', zones: [ { value: 'Sathorn-Silom CBD', label: 'Sathorn-Silom CBD', label_th: 'สาทร-สีลม ศูนย์กลางธุรกิจ', khwaengValues: ['Thung Wat Don', 'Thung Maha Mek', 'Yan Nawa (Sathorn)', 'Chong Nonsi (Sathorn)', 'Suan Phlu'] }, { value: 'Riverside Area (Sathorn)', label: 'Riverside Area (Sathorn)', label_th: 'พื้นที่ริมแม่น้ำ (สาทร)', khwaengValues: ['Thung Wat Don', 'Yan Nawa (Sathorn)'] }, { value: 'Naradhiwas Area (Sathorn)', label: 'Naradhiwas Area (Sathorn)', label_th: 'พื้นที่นราธิวาส (สาทร)', khwaengValues: ['Thung Wat Don', 'Chong Nonsi (Sathorn)', 'Thung Maha Mek'] }, ], subDistricts: [ { value: 'Thung Wat Don', label: 'Thung Wat Don', label_th: 'ทุ่งวัดดอน' }, { value: 'Yan Nawa (Sathorn)', label: 'Yan Nawa', label_th: 'ยานนาวา' }, { value: 'Thung Maha Mek', label: 'Thung Maha Mek', label_th: 'ทุ่งมหาเมฆ' }, { value: 'Chong Nonsi (Sathorn)', label: 'Chong Nonsi', label_th: 'ช่องนนทรี' }, { value: 'Suan Phlu', label: 'Suan Phlu', label_th: 'สวนพลู' }, ] }, { value: 'Watthana', label: 'Watthana', label_th: 'วัฒนา', zones: [ { value: 'Sukhumvit Main Area (Watthana)', label: 'Sukhumvit Main Area', label_th: 'สุขุมวิทพื้นที่หลัก (วัฒนา)', khwaengValues: ['Khlong Toei Nuea', 'Phrom Phong', 'Thong Lo (Watthana)', 'Ekkamai (Watthana)', 'Khlong Tan Nuea'] }, { value: 'Asok-Nana Area', label: 'Asok-Nana Area', label_th: 'อโศก-นานา', khwaengValues: ['Khlong Toei Nuea'] }, { value: 'Phrom Phong - Thong Lo', label: 'Phrom Phong - ทองหล่อ', label_th: 'พร้อมพงษ์ - ทองหล่อ', khwaengValues: ['Phrom Phong', 'Thong Lo (Watthana)'] }, { value: 'Ekkamai Area', label: 'Ekkamai Area', label_th: 'เอกมัย', khwaengValues: ['Ekkamai (Watthana)', 'Khlong Tan Nuea'] }, ], subDistricts: [ { value: 'Khlong Toei Nuea', label: 'Khlong Toei Nuea', label_th: 'คลองเตยเหนือ' }, { value: 'Phrom Phong', label: 'Phrom Phong', label_th: 'พร้อมพงษ์' }, { value: 'Thong Lo (Watthana)', label: 'Thong Lo', label_th: 'ทองหล่อ' }, { value: 'Ekkamai (Watthana)', label: 'Ekkamai', label_th: 'เอกมัย' }, { value: 'Khlong Tan Nuea', label: 'Khlong Tan Nuea', label_th: 'คลองตันเหนือ' }, ] }, { value: 'Khlong Toei', label: 'Khlong Toei', label_th: 'คลองเตย', zones: [ { value: 'Sukhumvit Extension (Khlong Toei)', label: 'Sukhumvit Extension', label_th: 'สุขุมวิทส่วนขยาย (คลองเตย)', khwaengValues: ['Khlong Toei (Khwaeng)', 'Khlong Tan (Khlong Toei)', 'Phra Khanong (Khlong Toei)', 'Lumphini (Khlong Toei)'] }, { value: 'Port Area (Khlong Toei)', label: 'Port Area', label_th: 'พื้นที่ท่าเรือ (คลong Toei)', khwaengValues: ['Khlong Toei (Khwaeng)'] }, { value: 'Convention Center Area', label: 'Convention Center Area', label_th: 'พื้นที่ศูนย์ประชุม', khwaengValues: ['Khlong Toei (Khwaeng)'] }, ], subDistricts: [ { value: 'Khlong Toei (Khwaeng)', label: 'Khlong Toei', label_th: 'คลองเตย' }, { value: 'Khlong Tan (Khlong Toei)', label: 'Khlong Tan', label_th: 'คลองตัน' }, { value: 'Phra Khanong (Khlong Toei)', label: 'Phra Khanong', label_th: 'พระโขนง' }, { value: 'Lumphini (Khlong Toei)', label: 'Lumphini', label_th: 'ลุมพินี' }, ] }, { value: 'Lat Phrao', label: 'Lat Phrao', label_th: 'ลาดพร้าว', zones: [ { value: 'Ladprao Main Road Area', label: 'Ladprao Main Road Area', label_th: 'พื้นที่ถนนลาดพร้าวสายหลัก', khwaengValues: ['Lat Phrao (Khwaeng)'] }, { value: 'Ladprao Soi Areas', label: 'Ladprao Soi Areas', label_th: 'พื้นที่ซอยลาดพร้าว', khwaengValues: ['Lat Phrao (Khwaeng)', 'Chorakhe Bua'] }, { value: 'Chok Chai 4 Area', label: 'Chok Chai 4 Area', label_th: 'พื้นที่โชคชัย 4', khwaengValues: ['Lat Phrao (Khwaeng)'] }, ], subDistricts: [ { value: 'Lat Phrao (Khwaeng)', label: 'Lat Phrao', label_th: 'ลาดพร้าว' }, { value: 'Chorakhe Bua', label: 'Chorakhe Bua', label_th: 'จระเข้บัว' }, ] }, ] }, { value: 'Online', label: 'Online', label_th: 'ออนไลน์', districts: [] }, ];
    const bangkokStreetsData = [ { value: 'Sukhumvit Road', label: 'Sukhumvit Road', label_th: 'ถนนสุขุมวิท', alleys: [ { value: 'Sukhumvit Soi 1', label: 'Sukhumvit Soi 1', label_th: 'สุขุมวิท ซอย 1' }, { value: 'Sukhumvit Soi 3 (Soi Nana Nuea)', label: 'Sukhumvit Soi 3 (Nana Nuea)', label_th: 'สุขุมวิท ซอย 3 (นานาเหนือ)' }, { value: 'Sukhumvit Soi 11', label: 'Sukhumvit Soi 11', label_th: 'สุขุมวิท ซอย 11' }, { value: 'Sukhumvit Soi 21 (Soi Asok)', label: 'Sukhumvit Soi 21 (Asok)', label_th: 'สุขุมวิท ซอย 21 (อโศก)' }, ], associatedKhwaengs: ['Khlong Toei Nuea', 'Phrom Phong', 'Thong Lo (Watthana)', 'Ekkamai (Watthana)', 'Khlong Tan Nuea', 'Khlong Toei (Khwaeng)', 'Phra Khanong (Khlong Toei)'] }, { value: 'Lat Phrao Road', label: 'Lat Phrao Road', label_th: 'ถนนลาดพร้าว', alleys: [ { value: 'Lat Phrao Soi 1', label: 'Lat Phrao Soi 1', label_th: 'ลาดพร้าว ซอย 1' }, { value: 'Lat Phrao Soi 71', label: 'Lat Phrao Soi 71', label_th: 'ลาดพร้าว ซอย 71' }, { value: 'Lat Phrao Soi 101', label: 'Lat Phrao Soi 101', label_th: 'ลาดพร้าว ซอย 101' }, ], associatedKhwaengs: ['Lat Phrao (Khwaeng)', 'Chorakhe Bua'] }, { value: 'Silom Road', label: 'Silom Road', label_th: 'ถนนสีลม', alleys: [ { value: 'Silom Soi 1', label: 'Silom Soi 1', label_th: 'สีลม ซอย 1' }, { value: 'Silom Soi 9', label: 'Silom Soi 9', label_th: 'สีลม ซอย 9' }, ], associatedKhwaengs: ['Silom', 'Suriyawong', 'Si Phraya'] }, ];

    const [newReview, setNewReview] = useState({
        itemName: '',
        mainCategory: '',   
        category: '',   
        subCategory: '',    
        location: { city: '', district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: '' },
        rating: 5,
        comment: '',
        author: ''
    });

    const filteredReviews = reviews.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMainCategory = selectedMainCategory === 'all' || item.mainCategory === selectedMainCategory;
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSubCategory = selectedSubCategory === 'all' || item.subCategory === selectedSubCategory;
        const matchesCity = selectedCityFilter === 'all' || (item.location && item.location.city === selectedCityFilter);
        const matchesDistrict = selectedDistrictFilter === 'all' || (item.location && item.location.district === selectedDistrictFilter);
        const matchesZone = selectedZoneFilter === 'all' || (item.location && item.location.zone === selectedZoneFilter);
        const matchesSubDistrict = selectedSubDistrictFilter === 'all' || (item.location && item.location.subDistrict === selectedSubDistrictFilter);
        const matchesStreet = selectedStreetFilter === 'all' || (item.location && item.location.street === selectedStreetFilter);
        const matchesAlley = selectedAlleyFilter === 'all' || (item.location && item.location.alley === selectedAlleyFilter);
        const matchesSpecificArea = selectedSpecificAreaFilter === '' || (item.location && item.location.specificArea && item.location.specificArea.toLowerCase().includes(selectedSpecificAreaFilter.toLowerCase()));
        
        return matchesSearch && matchesMainCategory && matchesCategory && matchesSubCategory && matchesCity && matchesDistrict && matchesZone && matchesSubDistrict && matchesStreet && matchesAlley && matchesSpecificArea;
    });

    const currentSelectedMainCategory = categories.find(cat => cat.value === selectedMainCategory);
    const categoriesForFilter = currentSelectedMainCategory?.platforms || currentSelectedMainCategory?.subcategories || [];
    const currentSelectedCategoryFilterObj = categoriesForFilter.find(cat => cat.value === selectedCategory);
    const subcategoriesForFilter = currentSelectedCategoryFilterObj?.subcategories || [];
    const currentSelectedCityFilterObj = citiesData.find(city => city.value === selectedCityFilter);
    const districtsForFilter = currentSelectedCityFilterObj?.districts || [];
    const currentSelectedDistrictFilterObj = districtsForFilter.find(d => d.value === selectedDistrictFilter);
    const zonesForFilter = currentSelectedDistrictFilterObj?.zones || [];
    const currentSelectedZoneFilterObj = zonesForFilter.find(z => z.value === selectedZoneFilter);
    const subDistrictsForFilter = currentSelectedZoneFilterObj 
        ? (currentSelectedDistrictFilterObj?.subDistricts.filter(sd => currentSelectedZoneFilterObj.khwaengValues.includes(sd.value)) || [])
        : (currentSelectedDistrictFilterObj?.subDistricts || []);

    const getStreetsForFilter = useCallback(() => {
        if (selectedCityFilter !== 'Bangkok') return [];
    
        let relevantKhwaengs = [];
    
        if (selectedSubDistrictFilter !== 'all') {
            relevantKhwaengs.push(selectedSubDistrictFilter);
        } else if (selectedZoneFilter !== 'all' && currentSelectedZoneFilterObj) {
            relevantKhwaengs = currentSelectedZoneFilterObj.khwaengValues;
        } else if (selectedDistrictFilter !== 'all' && currentSelectedDistrictFilterObj) {
            relevantKhwaengs = currentSelectedDistrictFilterObj.subDistricts.map(sd => sd.value);
        } else if (selectedDistrictFilter === 'all') {
            return bangkokStreetsData; // No district selected, show all streets for Bangkok
        }
    
        if (relevantKhwaengs.length === 0) return [];
    
        return bangkokStreetsData.filter(street =>
            street.associatedKhwaengs && street.associatedKhwaengs.some(khwaeng => relevantKhwaengs.includes(khwaeng))
        );
    }, [selectedCityFilter, selectedDistrictFilter, selectedZoneFilter, selectedSubDistrictFilter, currentSelectedDistrictFilterObj, currentSelectedZoneFilterObj, bangkokStreetsData]);

    const streetsForFilter = getStreetsForFilter();
    const currentSelectedStreetFilterObj = streetsForFilter.find(s => s.value === selectedStreetFilter);
    const alleysForFilter = currentSelectedStreetFilterObj?.alleys || [];

    // Auth and data effects remain the same
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (isAuthReady) {
            setReviews(initialSampleReviews);
        }
    }, [isAuthReady]);

    // Update newReview author when user logs in
    useEffect(() => {
        if (user) {
            setNewReview(prev => ({ ...prev, author: user.displayName || '' }));
        }
    }, [user]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setPage('detail');
    };

    const handleBack = () => {
        setSelectedItem(null);
        setPage('home');
    };
      
    const handleLogin = async () => {
        try {
            const { user: loggedInUser } = await signInWithGoogle();
            setUser(loggedInUser);
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const handleLogout = async () => {
        await signOut();
        setUser(null);
        setPage('home'); // Go to home page on logout
    };
    
    const handleSubmitReview = (newReviewData) => {
        if (!user) {
            console.log(language === 'en' ? 'You must be logged in to submit a review.' : 'คุณต้องเข้าสู่ระบบเพื่อส่งรีวิว');
            alert(language === 'en' ? 'Please sign in to write a review.' : 'กรุณาเข้าสู่ระบบเพื่อเขียนรีวิว');
            return;
        }
        if (!newReviewData.itemName.trim() || !newReviewData.mainCategory || !newReviewData.category || !newReviewData.comment.trim() || !newReviewData.author.trim()) {
            console.log(language === 'en' ? 'Please fill in all required fields (Item Name, Main Category, Category, Your Review, Your Name).' : 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมด (ชื่อรายการ, หมวดหมู่หลัก, หมวดหมู่, รีวิวของคุณ, ชื่อของคุณ)');
            return;
        }

        const reviewToAdd = {
            id: Date.now(),
            author: newReviewData.author.trim(),
            rating: newReviewData.rating,
            date: new Date().toISOString().split('T')[0],
            comment: newReviewData.comment.trim(),
            comment_th: newReviewData.comment_th ? newReviewData.comment_th.trim() : '',
            verified: true, // Mark as verified since user is logged in
            helpful: 0,
            authorId: user.uid, // Add author's ID
            authorPhotoURL: user.photoURL // Add author's photo
        };

        const existingItemIndex = reviews.findIndex(item => 
            item.itemName.toLowerCase() === newReviewData.itemName.toLowerCase().trim() &&
            item.mainCategory === newReviewData.mainCategory &&
            item.category === newReviewData.category &&
            item.subCategory === newReviewData.subCategory
        );

        let updatedReviews = [...reviews];
        let updatedItem;

        if (existingItemIndex > -1) {
            const itemToUpdate = { ...updatedReviews[existingItemIndex] };
            const newReviewCount = itemToUpdate.reviewCount + 1;
            const oldTotalRating = itemToUpdate.rating * itemToUpdate.reviewCount;
            itemToUpdate.rating = (oldTotalRating + newReviewData.rating) / newReviewCount;
            itemToUpdate.reviewCount = newReviewCount;
            itemToUpdate.reviews = [reviewToAdd, ...itemToUpdate.reviews];
            updatedReviews[existingItemIndex] = itemToUpdate;
            updatedItem = itemToUpdate;
            console.log(language === 'en' ? 'Review added to existing item!' : 'เพิ่มรีวิวในรายการที่มีอยู่แล้ว!');
        } else {
            const newItem = {
                id: `new-item-${Date.now()}`,
                itemName: newReviewData.itemName.trim(),
                mainCategory: newReviewData.mainCategory,
                category: newReviewData.category,
                subCategory: newReviewData.subCategory,
                location: newReviewData.location,
                rating: newReviewData.rating,
                reviewCount: 1,
                reviews: [reviewToAdd]
            };
            updatedReviews = [newItem, ...updatedReviews];
            updatedItem = newItem;
            console.log(language === 'en' ? 'New item and review submitted!' : 'ส่งรายการใหม่และรีวิวแล้ว!');
        }
        
        setReviews(updatedReviews);
        setShowReviewForm(false);
        setNewReview({
            itemName: '', mainCategory: '', category: '', subCategory: '', 
            location: { city: '', district: '', zone: '', subDistrict: '', street: '', alley: '', specificArea: '' },
            rating: 5, comment: '', author: user.displayName || ''
        });
        
        if (page === 'detail') {
            setSelectedItem(updatedItem);
        }
    };

    useEffect(() => {
        if (filteredReviews.length === 0 && isAuthReady && page === 'home') {
            setIsLoadingNoMatchingReviewsMessage(true);
            setTimeout(() => {
                const message = language === 'en' 
                    ? `No reviews match your filters. Be the first to add one!`
                    : `ไม่พบรีวิวที่ตรงกับเกณฑ์ของคุณ เป็นคนแรกที่เพิ่มรีวิว!`;
                setNoMatchingReviewsMessage(message);
                setIsLoadingNoMatchingReviewsMessage(false);
            }, 300);
        }
    }, [filteredReviews.length, isAuthReady, language, page]);

    if (page === 'detail') {
        return (
            <ItemDetailPage 
                item={selectedItem}
                onBack={handleBack}
                language={language}
                categories={categories}
                citiesData={citiesData}
                bangkokStreetsData={bangkokStreetsData}
                generatedImages={generatedImages}
                setGeneratedImages={setGeneratedImages}
            />
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-sans antialiased">
            {/* Enhanced Header */}
            <header className="bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b border-gray-800/50 p-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                                <Award className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
                                    ReviewAnything
                                </h1>
                                <p className="text-xs text-gray-500">{language === 'en' ? 'Trusted Community Reviews' : 'รีวิวจากชุมชนที่เชื่อถือได้'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowSearchBar(prev => !prev)}
                                className="p-2 text-gray-400 hover:text-gray-100 transition-colors hover:bg-gray-800/50 rounded-lg"
                                title={language === 'en' ? (showSearchBar ? "Hide Search" : "Show Search") : (showSearchBar ? "ซ่อนค้นหา" : "แสดงค้นหา")}
                            >
                                <Search size={18} />
                            </button>
                            <button
                                onClick={() => setShowFilters(prev => !prev)}
                                className="p-2 text-gray-400 hover:text-gray-100 transition-colors hover:bg-gray-800/50 rounded-lg"
                                title={language === 'en' ? (showFilters ? "Hide Filters" : "Show Filters") : (showFilters ? "ซ่อนตัวกรอง" : "แสดงตัวกรอง")}
                            >
                                <Filter size={18} />
                            </button>
                            
                            <div className="w-px h-6 bg-gray-700 mx-1"></div>

                            {user ? (
                                <>
                                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                                <span className="text-sm font-semibold hidden sm:inline">{user.displayName}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-400 hover:text-gray-100 transition-colors hover:bg-gray-800/50 rounded-lg"
                                    title={language === 'en' ? "Logout" : "ออกจากระบบ"}
                                >
                                    <LogOut size={20} />
                                </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm"
                                >
                                    <GoogleIcon />
                                    {language === 'en' ? "Sign in with Google" : "เข้าสู่ระบบด้วย Google"}
                                </button>
                            )}

                             <button
                                onClick={() => setShowReviewForm(true)}
                                disabled={!user}
                                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm ${
                                    !user ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title={!user ? (language === 'en' ? "Sign in to write a review" : "เข้าสู่ระบบเพื่อเขียนรีวิว") : (language === 'en' ? "Write a review" : "เขียนรีวิว")}
                            >
                                <Plus size={18} />
                                <span className="hidden sm:inline">{language === 'en' ? "Write Review" : "เขียนรีวิว"}</span>
                            </button>

                            <button
                                onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 text-sm font-semibold border border-gray-600/50 hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-md"
                            >
                                {language === 'en' ? '🇹🇭' : '🇬🇧'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        {/* Enhanced Search Bar (Conditionally Rendered) */}
                        {showSearchBar && (
                            <div className="relative group mb-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl blur group-focus-within:blur-md transition-all duration-300" />
                                <Search className="absolute left-4 top-3.5 text-gray-400 z-10" size={20} />
                                <input
                                    type="text"
                                    placeholder={language === 'en' ? "Search anything... sellers, influencers, courses, landlords..." : "ค้นหาอะไรก็ได้... ผู้ขาย, อินฟลูเอนเซอร์, คอร์สเรียน, เจ้าของที่ดิน..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="relative w-full pl-12 pr-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800/80 backdrop-blur-sm border-gray-700/50 text-gray-100 placeholder-gray-500 transition-all duration-300"
                                />
                            </div>
                        )}
                        
                        {/* Enhanced Filter Pills (Conditionally Rendered) */}
                        {showFilters && (
                            <div className="space-y-3">
                                {/* Main Category Filter */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {categories.filter(cat => cat.isTopLevel).map((cat) => (
                                        <button
                                            key={cat.value}
                                            onClick={() => {
                                                setSelectedMainCategory(cat.value);
                                                setSelectedCategory('all'); setSelectedSubCategory('all'); setSelectedCityFilter('all'); setSelectedDistrictFilter('all'); setSelectedZoneFilter('all'); setSelectedSubDistrictFilter('all'); setSelectedStreetFilter('all'); setSelectedAlleyFilter('all'); setSearchQuery(''); setSelectedSpecificAreaFilter('');
                                            }}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 text-sm font-semibold transform hover:scale-105 ${
                                                selectedMainCategory === cat.value 
                                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                                                    : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600/50'
                                            }`}
                                        >
                                            <span className="text-lg">{cat.icon}</span>
                                            <span>{language === 'en' ? cat.label : cat.label_th}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Subcategory Filters with enhanced styling */}
                                {selectedMainCategory !== 'all' && categoriesForFilter.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                        <span className="text-xs font-semibold text-gray-400 flex items-center px-2 uppercase tracking-wider">
                                            {selectedMainCategory === 'Online' ? (language === 'en' ? 'Platform' : 'แพลตฟอร์ม') : (language === 'en' ? 'Category' : 'หมวดหมู่')}
                                        </span>
                                        <button 
                                            onClick={() => { setSelectedCategory('all'); setSelectedSubCategory('all'); }} 
                                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                selectedCategory === 'all' 
                                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30' 
                                                    : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                            }`}
                                        >
                                            All
                                        </button>
                                        {categoriesForFilter.map((cat) => (
                                            <button 
                                                key={cat.value} 
                                                onClick={() => { setSelectedCategory(cat.value); setSelectedSubCategory('all'); }} 
                                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                    selectedCategory === cat.value 
                                                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30' 
                                                        : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                }`}
                                            >
                                                {language === 'en' ? cat.label : cat.label_th}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Second-level subcategory Filter */}
                                {selectedCategory !== 'all' && subcategoriesForFilter.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                        <span className="text-xs font-semibold text-gray-400 flex items-center px-2 uppercase tracking-wider">
                                            {language === 'en' ? "Type" : "ประเภท"}
                                        </span>
                                        <button 
                                            onClick={() => setSelectedSubCategory('all')} 
                                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                selectedSubCategory === 'all' 
                                                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30' 
                                                    : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                            }`}
                                        >
                                            All
                                        </button>
                                        {subcategoriesForFilter.map((subCat) => (
                                            <button 
                                                key={subCat.value} 
                                                onClick={() => setSelectedSubCategory(subCat.value)} 
                                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                    selectedSubCategory === subCat.value 
                                                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30' 
                                                        : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                }`}
                                            >
                                                {language === 'en' ? subCat.label : subCat.label_th}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Location Filters - Enhanced for Real World */}
                                {(selectedMainCategory === 'all' || selectedMainCategory === 'Real World') && (
                                    <>
                                        {/* City Filter */}
                                        <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                            <span className="text-xs font-semibold text-emerald-400 flex items-center px-2 uppercase tracking-wider">
                                                <MapPin size={14} className="mr-1" />
                                                {language === 'en' ? "City" : "เมือง"}
                                            </span>
                                            <button 
                                                onClick={() => {
                                                    setSelectedCityFilter('all'); 
                                                    setSelectedDistrictFilter('all'); 
                                                    setSelectedZoneFilter('all'); 
                                                    setSelectedSubDistrictFilter('all'); 
                                                    setSelectedStreetFilter('all'); 
                                                    setSelectedAlleyFilter('all');
                                                }} 
                                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                    selectedCityFilter === 'all' 
                                                        ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                        : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                }`}
                                            >
                                                All Cities
                                            </button>
                                            {citiesData.filter(c => c.value !== 'Online').map((city) => (
                                                <button 
                                                    key={city.value} 
                                                    onClick={() => {
                                                        setSelectedCityFilter(city.value); 
                                                        setSelectedDistrictFilter('all'); 
                                                        setSelectedZoneFilter('all'); 
                                                        setSelectedSubDistrictFilter('all'); 
                                                        setSelectedStreetFilter('all'); 
                                                        setSelectedAlleyFilter('all'); 
                                                    }} 
                                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                        selectedCityFilter === city.value 
                                                            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                            : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                    }`}
                                                >
                                                    {language === 'en' ? city.label : city.label_th}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        {/* District Filter */}
                                        {selectedCityFilter === 'Bangkok' && districtsForFilter.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                                <span className="text-xs font-semibold text-emerald-400 flex items-center px-2 uppercase tracking-wider ml-4">
                                                    ↳ {language === 'en' ? "District" : "เขต"}
                                                </span>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedDistrictFilter('all'); 
                                                        setSelectedZoneFilter('all'); 
                                                        setSelectedSubDistrictFilter('all'); 
                                                        setSelectedStreetFilter('all'); 
                                                        setSelectedAlleyFilter('all');
                                                    }} 
                                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                        selectedDistrictFilter === 'all' 
                                                            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                            : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                    }`}
                                                >
                                                    All Districts
                                                </button>
                                                {districtsForFilter.map((district) => (
                                                    <button 
                                                        key={district.value} 
                                                        onClick={() => {
                                                            setSelectedDistrictFilter(district.value); 
                                                            setSelectedZoneFilter('all'); 
                                                            setSelectedSubDistrictFilter('all'); 
                                                            setSelectedStreetFilter('all'); 
                                                            setSelectedAlleyFilter('all'); 
                                                        }} 
                                                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                            selectedDistrictFilter === district.value 
                                                                ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                                : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                        }`}
                                                    >
                                                        {language === 'en' ? district.label : district.label_th}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                            {/* Zone Filter */}
                                        {selectedCityFilter === 'Bangkok' && selectedDistrictFilter !== 'all' && zonesForFilter.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                                <span className="text-xs font-semibold text-emerald-400 flex items-center px-2 uppercase tracking-wider ml-8">
                                                    ↳ {language === 'en' ? "Zone" : "โซน"}
                                                </span>
                                                <button 
                                                    onClick={() => { 
                                                        setSelectedZoneFilter('all'); 
                                                        setSelectedSubDistrictFilter('all'); 
                                                        setSelectedStreetFilter('all'); 
                                                        setSelectedAlleyFilter('all'); 
                                                    }} 
                                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                        selectedZoneFilter === 'all' 
                                                            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                            : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                    }`}
                                                >
                                                   All Zones
                                                </button>
                                                {zonesForFilter.map((zone) => (
                                                    <button 
                                                        key={zone.value} 
                                                        onClick={() => { 
                                                            setSelectedZoneFilter(zone.value); 
                                                            setSelectedSubDistrictFilter('all'); 
                                                            setSelectedStreetFilter('all'); 
                                                            setSelectedAlleyFilter('all'); 
                                                        }} 
                                                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                            selectedZoneFilter === zone.value 
                                                                ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                                : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                        }`}
                                                    >
                                                        {language === 'en' ? zone.label : zone.label_th}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Sub-District Filter */}
                                        {selectedCityFilter === 'Bangkok' && (selectedDistrictFilter !== 'all' || selectedZoneFilter !== 'all') && subDistrictsForFilter.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                                <span className="text-xs font-semibold text-emerald-400 flex items-center px-2 uppercase tracking-wider ml-12">
                                                    ↳ {language === 'en' ? "Sub-District" : "แขวง"}
                                                </span>
                                                <button 
                                                    onClick={() => { 
                                                        setSelectedSubDistrictFilter('all'); 
                                                        setSelectedStreetFilter('all'); 
                                                        setSelectedAlleyFilter('all'); 
                                                    }} 
                                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                        selectedSubDistrictFilter === 'all' 
                                                            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                            : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                    }`}
                                                >
                                                    All Sub-Districts
                                                </button>
                                                {subDistrictsForFilter.map((subDistrict) => (
                                                    <button 
                                                        key={subDistrict.value} 
                                                        onClick={() => { 
                                                            setSelectedSubDistrictFilter(subDistrict.value); 
                                                            setSelectedStreetFilter('all'); 
                                                            setSelectedAlleyFilter('all'); 
                                                        }} 
                                                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                            selectedSubDistrictFilter === subDistrict.value 
                                                                ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                                : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                        }`}
                                                    >
                                                        {language === 'en' ? subDistrict.label : subDistrict.label_th}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* STREET FILTER */}
                                        {selectedCityFilter === 'Bangkok' && streetsForFilter.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                                <span className="text-xs font-semibold text-emerald-400 flex items-center px-2 uppercase tracking-wider ml-16">
                                                    ↳ {language === 'en' ? "Street" : "ถนน"}
                                                </span>
                                                <button 
                                                    onClick={() => { 
                                                        setSelectedStreetFilter('all'); 
                                                        setSelectedAlleyFilter('all'); 
                                                    }} 
                                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                        selectedStreetFilter === 'all' 
                                                            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                            : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                    }`}
                                                >
                                                    All Streets
                                                </button>
                                                {streetsForFilter.map((street) => (
                                                    <button 
                                                        key={street.value} 
                                                        onClick={() => { 
                                                            setSelectedStreetFilter(street.value); 
                                                            setSelectedAlleyFilter('all'); 
                                                        }} 
                                                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                            selectedStreetFilter === street.value 
                                                                ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                                : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                        }`}
                                                    >
                                                        {language === 'en' ? street.label : street.label_th}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* ALLEY FILTER */}
                                        {selectedCityFilter === 'Bangkok' && selectedStreetFilter !== 'all' && alleysForFilter.length > 0 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2 border-t pt-3 border-gray-800/50 scrollbar-hide">
                                                <span className="text-xs font-semibold text-emerald-400 flex items-center px-2 uppercase tracking-wider ml-20">
                                                    ↳ {language === 'en' ? "Alley" : "ซอย"}
                                                </span>
                                                <button 
                                                    onClick={() => setSelectedAlleyFilter('all')} 
                                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                        selectedAlleyFilter === 'all' 
                                                            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                            : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                    }`}
                                                >
                                                    All Alleys
                                                </button>
                                                {alleysForFilter.map((alley) => (
                                                    <button 
                                                        key={alley.value} 
                                                        onClick={() => setSelectedAlleyFilter(alley.value)} 
                                                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 text-sm font-medium ${
                                                            selectedAlleyFilter === alley.value 
                                                                ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 border border-emerald-500/30' 
                                                                : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-700/30'
                                                        }`}
                                                    >
                                                        {language === 'en' ? alley.label : alley.label_th}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!isAuthReady ? (
                        <div className="text-center py-20 col-span-full">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full mb-4">
                                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-gray-400">{language === 'en' ? 'Loading Reviews...' : 'กำลังโหลดรีวิว...'}</p>
                        </div>
                    ) : filteredReviews.length > 0 ? (
                        filteredReviews.map((item) => (
                            <ReviewItem 
                                key={item.id} 
                                item={item} 
                                onClick={handleItemClick} 
                                language={language} 
                                categories={categories} 
                                citiesData={citiesData} 
                                bangkokStreetsData={bangkokStreetsData} 
                                generatedImages={generatedImages}
                                setGeneratedImages={setGeneratedImages}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 col-span-full">
                            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-gray-400 text-lg">
                                {isLoadingNoMatchingReviewsMessage ? (language === 'en' ? 'Searching...' : 'กำลังค้นหา...') : noMatchingReviewsMessage}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <ReviewFormModal
                show={showReviewForm}
                onClose={() => setShowReviewForm(false)}
                newReview={newReview}
                setNewReview={setNewReview}
                onSubmit={handleSubmitReview}
                categories={categories}
                citiesData={citiesData}
                bangkokStreetsData={bangkokStreetsData}
                language={language}
            />
        </div>
    );
};

export default App;
