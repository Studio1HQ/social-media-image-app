
import { useState } from 'react';
import { Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Image } from "@/types";

interface ImageGridProps {
  images: Image[];
}

interface ImageCardProps {
  image: Image;
}

const ImageCard = ({ image }: ImageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

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

const ImageGrid = ({ images }: ImageGridProps) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No images to display</p>
      </div>
    );
  }
  
  return (
    <div className="masonry-grid">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;
