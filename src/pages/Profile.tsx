import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ImageGrid from '@/components/ImageGrid';
import { Settings, Link as LinkIcon, Grid, Heart, MessageSquare, Bookmark, Loader2, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, getUserImages, followUser } from '@/services/imageService';
import { Profile as ProfileType, Image } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  useEffect(() => {
    if (!username && isAuthenticated && user) {
      navigate(`/profile/${user.username}`);
    }
  }, [username, isAuthenticated, user, navigate]);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const profileData = await getUserProfile(username);
        
        if (profileData) {
          setProfile(profileData);
          setIsFollowing(profileData.is_following || false);
          
          if (isAuthenticated && user && user.id === profileData.id) {
            setIsOwnProfile(true);
          } else {
            setIsOwnProfile(false);
          }
          
          const userImages = await getUserImages(profileData.id);
          setImages(userImages);
        } else {
          toast({
            variant: "destructive",
            title: "Profile not found",
            description: "The requested profile could not be found.",
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [username, isAuthenticated, user, navigate, toast]);
  
  useRealtimeSubscription({
    schema: 'public',
    table: 'follows',
  }, (payload) => {
    if (username) {
      getUserProfile(username).then(updatedProfile => {
        if (updatedProfile) {
          setProfile(updatedProfile);
          setIsFollowing(updatedProfile.is_following || false);
        }
      });
    }
  });
  
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }).format(date);
  };
  
  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users",
      });
      navigate('/login');
      return;
    }
    
    if (!profile) return;
    
    try {
      setIsFollowing(!isFollowing);
      
      if (isFollowing) {
        setProfile(prev => prev ? {
          ...prev,
          follower_count: (prev.follower_count || 0) - 1
        } : null);
      } else {
        setProfile(prev => prev ? {
          ...prev,
          follower_count: (prev.follower_count || 0) + 1
        } : null);
      }
      
      await followUser(profile.id);
      
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing 
          ? `You unfollowed ${profile.username}` 
          : `You are now following ${profile.username}`,
      });
    } catch (error: any) {
      setIsFollowing(!isFollowing);
      
      if (profile) {
        setProfile(prev => prev ? {
          ...prev,
          follower_count: profile.follower_count
        } : null);
      }
      
      toast({
        variant: "destructive",
        title: "Action failed",
        description: error.message || "Failed to update follow status.",
      });
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Profile link copied to clipboard",
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Profile not found</h1>
          <p className="mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="h-64 w-full bg-cover bg-center bg-gradient-to-r from-primary/30 to-secondary/30">
        <div className="w-full h-full bg-gradient-to-b from-black/20 to-black/60"></div>
      </div>
      
      <div className="container max-w-6xl">
        <div className="relative px-4">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20">
            <div className="z-10">
              <Avatar className="h-32 w-32 ring-4 ring-background">
                {profile.profile_image_url ? (
                  <AvatarImage src={profile.profile_image_url} alt={profile.username} />
                ) : null}
                <AvatarFallback className="text-4xl">
                  {profile.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 pt-4 md:pt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{profile.full_name || profile.username}</h1>
                  <div className="text-muted-foreground">@{profile.username}</div>
                </div>
                
                <div className="flex gap-2 mt-4 md:mt-0">
                  {!isOwnProfile ? (
                    <Button 
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      className="gap-1"
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      className="gap-1"
                    >
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={handleShare}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              <p className="mt-4">{profile.bio || 'No bio yet.'}</p>
              
              <p className="text-sm text-muted-foreground mt-2">
                Joined {formatJoinDate(profile.created_at)}
              </p>
              
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <div className="font-bold">{images.length}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.follower_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.following_count || 0}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 px-4">
          <Tabs defaultValue="posts">
            <TabsList className="justify-start mb-8">
              <TabsTrigger value="posts">
                <Grid className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="likes">
                <Heart className="h-4 w-4 mr-2" />
                Likes
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="collections">
                <Bookmark className="h-4 w-4 mr-2" />
                Collections
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="animate-fade-in">
              {images.length > 0 ? (
                <div className="masonry-grid">
                  {images.map(image => (
                    <div 
                      key={image.id}
                      className="masonry-item relative overflow-hidden rounded-lg group cursor-pointer"
                      onClick={() => navigate(`/image/${image.id}`)}
                    >
                      <img 
                        src={image.image_url} 
                        alt={image.title} 
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <h3 className="text-white font-medium">{image.title}</h3>
                        <div className="flex items-center gap-3 text-white/90 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {image.likes_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {image.comments_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">No posts yet</p>
                  {isOwnProfile && (
                    <Button onClick={() => navigate('/upload')}>Upload your first image</Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="likes" className="animate-fade-in">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Images liked by @{profile.username} will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="animate-fade-in">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Images commented on by @{profile.username} will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="collections" className="animate-fade-in">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Collections created by @{profile.username} will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
