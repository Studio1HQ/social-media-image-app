
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Download, 
  MoreHorizontal,
  Send,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  getImageById, 
  likeImage as likeImageService, 
  addComment as addCommentService,
  getImageComments
} from '@/services/imageService';
import { Image, Comment } from '@/types';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { Link } from 'react-router-dom';

const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [image, setImage] = useState<Image | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fetchImage = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const fetchedImage = await getImageById(id);
      
      if (fetchedImage) {
        setImage(fetchedImage);
      } else {
        setError('Image not found');
        toast({
          variant: "destructive",
          title: "Error",
          description: "The requested image could not be found.",
        });
      }
    } catch (err: any) {
      console.error('Error fetching image:', err);
      setError('Failed to load image');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load image. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);
  
  const fetchComments = useCallback(async () => {
    if (!id) return;
    
    try {
      const fetchedComments = await getImageComments(id);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, [id]);
  
  useEffect(() => {
    fetchImage();
    fetchComments();
  }, [fetchImage, fetchComments]);
  
  // Real-time subscription for likes
  useRealtimeSubscription({
    schema: 'public',
    table: 'likes',
    event: ['INSERT', 'DELETE']
  }, (payload) => {
    console.log('Likes change detected:', payload);
    fetchImage();
  });
  
  // Real-time subscription for comments
  useRealtimeSubscription({
    schema: 'public',
    table: 'comments',
    event: ['INSERT', 'UPDATE']
  }, (payload) => {
    console.log('Comment change detected:', payload);
    fetchComments();
  });
  
  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like images",
      });
      navigate('/login');
      return;
    }
    
    if (!image) return;
    
    try {
      const newLikedStatus = !image.liked_by_user;
      const newLikesCount = image.likes_count !== undefined ? 
        (newLikedStatus ? image.likes_count + 1 : image.likes_count - 1) : 
        0;
      
      setImage(prev => prev ? { 
        ...prev, 
        liked_by_user: newLikedStatus,
        likes_count: newLikesCount
      } : null);
      
      await likeImageService(image.id);
    } catch (error: any) {
      if (image.liked_by_user !== undefined) {
        setImage(prev => prev ? { 
          ...prev, 
          liked_by_user: image.liked_by_user,
          likes_count: image.likes_count
        } : null);
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status. Please try again.",
      });
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Image link copied to clipboard",
    });
  };
  
  const handleDownload = () => {
    if (!image) return;
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    });
    
    window.open(image.image_url, '_blank');
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
      });
      navigate('/login');
      return;
    }
    
    if (!commentText.trim() || !image) return;
    
    try {
      setIsSubmitting(true);
      await addCommentService(image.id, commentText.trim());
      setCommentText('');
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-6xl py-20 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
            <p className="text-lg">Loading image...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !image) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-6xl py-20 flex justify-center items-center">
          <div className="glass-card p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Image Not Found</h1>
            <p className="mb-6">The image you're looking for might have been removed or doesn't exist.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-6xl py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <img 
                src={image?.image_url} 
                alt={image?.title} 
                className="max-h-[80vh] w-auto max-w-full object-contain" 
              />
            </div>
          </div>
          
          <div className="lg:w-1/3 flex flex-col">
            <div className="glass-card p-6 mb-6">
              <Link 
                to={`/profile/${image?.username}`} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-10 w-10">
                  {image?.profile_image_url ? (
                    <AvatarImage src={image.profile_image_url} alt={image.username || 'User'} />
                  ) : null}
                  <AvatarFallback>
                    {(image?.full_name || image?.username || 'U').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{image?.full_name || image?.username}</div>
                  <div className="text-sm text-muted-foreground">@{image?.username}</div>
                </div>
              </Link>
              <Button 
                variant="outline"
                disabled={!isAuthenticated || user?.id === image?.user_id}
              >
                {user?.id === image?.user_id ? 'You' : 'Follow'}
              </Button>
              
              <h1 className="text-2xl font-bold mb-2">{image?.title}</h1>
              <p className="text-muted-foreground mb-4">{image?.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {image?.tags && image.tags.map((tag) => (
                  <Button
                    key={tag}
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => navigate(`/tag/${tag}`)}
                  >
                    #{tag}
                  </Button>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                Posted on {image?.created_at ? formatDate(image.created_at) : ''}
              </div>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant={image?.liked_by_user ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className={image?.liked_by_user ? "bg-primary/90 hover:bg-primary/80" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${image?.liked_by_user ? 'fill-current' : ''}`} />
                    {image?.likes_count || 0}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {comments.length}
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline"
                        size="sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Add to collection</DropdownMenuItem>
                      <DropdownMenuItem>Report image</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleShare}>Copy link</DropdownMenuItem>
                      <DropdownMenuItem>Embed</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold mb-4">Comments ({comments.length})</h2>
              
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    {user?.profile_image_url ? (
                      <AvatarImage src={user.profile_image_url} alt={user.username} />
                    ) : null}
                    <AvatarFallback>
                      {user ? (user.username?.substring(0, 2).toUpperCase()) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={isAuthenticated ? "Add a comment..." : "Sign in to comment"}
                      className="resize-none mb-2"
                      rows={2}
                      disabled={!isAuthenticated || isSubmitting}
                    />
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        type="submit"
                        disabled={!isAuthenticated || !commentText.trim() || isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-1" />
                        )}
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Link to={`/profile/${comment.username}`}>
                        <Avatar className="h-8 w-8">
                          {comment.profile_image_url ? (
                            <AvatarImage src={comment.profile_image_url} alt={comment.username} />
                          ) : null}
                          <AvatarFallback>
                            {(comment.full_name || comment.username || '?').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link 
                              to={`/profile/${comment.username}`} 
                              className="font-medium hover:underline"
                            >
                              {comment.full_name || comment.username}
                            </Link>
                            <Link 
                              to={`/profile/${comment.username}`} 
                              className="text-sm text-muted-foreground ml-2 hover:underline"
                            >
                              @{comment.username}
                            </Link>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="mt-1">{comment.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <Heart className="h-4 w-4 mr-1" />
                            <span className="text-xs">0</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-auto p-0">
                            <span className="text-xs">Reply</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
