
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import UploadButton from '@/components/UploadButton';
import SideMenu from '@/components/SideMenu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getImages } from '@/services/imageService';
import { Image } from '@/types';
import { Heart, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showSidebar, setShowSidebar] = useState(true);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { isAuthenticated } = useAuth();
  
  const fetchImages = useCallback(async (filter?: string) => {
    try {
      setLoading(true);
      const imagesData = await getImages(filter);
      setImages(imagesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    let filter: string | undefined;
    
    if (activeTab === 'recent') {
      filter = 'recent';
    } else if (activeTab === 'popular') {
      filter = 'popular';
    } else if (activeTab === 'following') {
      filter = 'following';
    }
    
    fetchImages(filter);
  }, [activeTab, fetchImages]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Image Card component
  const ImageCard = ({ image }: { image: Image }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="masonry-item relative overflow-hidden rounded-lg group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/image/${image.id}`)}
      >
        <div className="relative aspect-auto">
          <img 
            src={image.image_url} 
            alt={image.title} 
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          
          {/* Overlay with info */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end transition-opacity",
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            )}
          >
            <div className="text-white">
              <div className="font-medium mb-1">{image.username || 'Unknown'}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Heart className={`w-4 h-4 ${image.liked_by_user ? 'fill-white text-white' : ''}`} /> 
                  <span className="text-sm">{image.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> 
                  <span className="text-sm">{image.comments_count || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Expand button */}
          <button 
            className={cn(
              "absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/image/${image.id}`);
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container py-4 flex">
        {/* Only show sidebar on desktop */}
        <div className="hidden md:block">
          {showSidebar && <SideMenu />}
        </div>
        
        <main className={cn("w-full", showSidebar ? "md:ml-64" : "")}>
          <div className="flex justify-between items-center mb-6">
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={handleTabChange} 
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                {isAuthenticated && (
                  <TabsTrigger value="following">Following</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            
            <div className="hidden md:flex">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
              </Button>
            </div>
          </div>
          
          <div className="animate-fade-in">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => fetchImages()}>Try Again</Button>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No images found</p>
                {isAuthenticated && (
                  <Button onClick={() => navigate('/upload')}>Upload an Image</Button>
                )}
              </div>
            ) : (
              <div className="masonry-grid">
                {images.map((image) => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <UploadButton />
    </div>
  );
};

export default Index;
