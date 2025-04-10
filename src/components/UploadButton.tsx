
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const UploadButton = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const handleUploadClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images",
      });
      navigate('/login');
      return;
    }
    
    navigate('/upload');
  };
  
  return (
    <Button 
      onClick={handleUploadClick} 
      className="floating-btn"
      aria-label="Upload image"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
};

export default UploadButton;
