import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Upload as UploadIcon, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '@/services/imageService';
import { useAuth } from '@/context/AuthContext';

interface UploadFormValues {
  title: string;
  description: string;
  tags: string;
  privacy: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<UploadFormValues>({
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      privacy: 'public'
    }
  });
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
        });
      }
    }
  }, [toast]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be smaller than 10MB",
      });
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload images",
      });
      navigate('/login');
      return;
    }

    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to upload",
      });
      return;
    }
    
    const formValues = form.getValues();
    
    try {
      setIsUploading(true);
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const tags = formValues.tags
        ? formValues.tags.split(',').map(tag => tag.trim().toLowerCase())
        : [];
      
      const result = await uploadImage(
        imageFile, 
        {
          title: formValues.title,
          description: formValues.description,
          tags,
          privacy: formValues.privacy as "public" | "private"
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful!",
        description: "Your image has been uploaded.",
      });
      
      if (result) {
        navigate(`/image/${result.id}`);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your image.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container py-8 max-w-3xl">
        <div className="glass-card p-6">
          <h1 className="text-2xl font-bold mb-6">Upload Image</h1>
          
          <form onSubmit={handleSubmit}>
            {!imagePreview ? (
              <div 
                className={`dropzone ${dragActive ? 'border-primary bg-primary/5' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <UploadIcon className="h-12 w-12 mb-4 text-muted-foreground/70" />
                <p className="mb-2 text-lg">Drag and drop your image here</p>
                <p className="mb-4 text-sm">Supports: JPEG, PNG, WebP (max 10MB)</p>
                <Button type="button" className="cursor-pointer">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select from computer
                    <Input 
                      id="file-upload" 
                      type="file"
                      className="hidden"
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </label>
                </Button>
              </div>
            ) : (
              <div className="mb-6 relative">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[500px] object-contain bg-black/5" 
                  />
                  <Button 
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    type="button"
                    onClick={removeImage}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {imagePreview && (
              <div className="space-y-4 mt-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    id="title"
                    placeholder="Add a title for your image"
                    disabled={isUploading}
                    {...form.register('title', { required: true })}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    id="description"
                    placeholder="Add a description (optional)" 
                    className="resize-none"
                    disabled={isUploading}
                    {...form.register('description')}
                  />
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags</label>
                  <Input 
                    id="tags"
                    placeholder="Add tags separated by commas (nature, landscape, etc.)" 
                    disabled={isUploading}
                    {...form.register('tags')}
                  />
                </div>
                
                <div>
                  <label htmlFor="privacy" className="block text-sm font-medium mb-1">Privacy</label>
                  <Select 
                    defaultValue="public" 
                    disabled={isUploading}
                    onValueChange={(value) => form.setValue('privacy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select privacy setting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {isUploading && (
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-2">
                    <div 
                      className="bg-primary h-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="pt-4 flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isUploading || !imageFile}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Image'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
