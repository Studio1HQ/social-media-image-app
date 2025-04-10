
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Image,
  LogOut,
  Trash2
} from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample user data
  const [user, setUser] = useState({
    name: 'NatureLover',
    username: 'nature_lover',
    email: 'nature@example.com',
    bio: 'Wildlife photographer and nature enthusiast. Capturing the beauty of our planet one shot at a time.',
    profilePic: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    comments: true,
    likes: true,
    follows: true,
    directMessages: true,
    emailDigest: false
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    privateProfile: false,
    hideFollowing: false,
    hideLocation: true,
    hideActivityStatus: false
  });
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };
  
  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Privacy settings updated",
      description: "Your privacy settings have been saved.",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Settings</h2>
              
              <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                <TabsList className="flex flex-col items-start h-auto bg-transparent p-0 space-y-1">
                  <TabsTrigger 
                    value="profile"
                    className="justify-start w-full data-[state=active]:bg-accent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account"
                    className="justify-start w-full data-[state=active]:bg-accent"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications"
                    className="justify-start w-full data-[state=active]:bg-accent"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="privacy"
                    className="justify-start w-full data-[state=active]:bg-accent"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Separator className="my-4" />
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="profile">
              {/* Profile Settings */}
              <TabsContent value="profile" className="animate-fade-in">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-6">Profile Information</h3>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Profile picture */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.profilePic} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm">
                          <Image className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          JPG, PNG or GIF. 1MB max.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label 
                          htmlFor="name" 
                          className="text-sm font-medium"
                        >
                          Name
                        </label>
                        <Input 
                          id="name"
                          value={user.name}
                          onChange={(e) => setUser({...user, name: e.target.value})}
                        />
                      </div>
                      
                      {/* Username */}
                      <div>
                        <label 
                          htmlFor="username" 
                          className="text-sm font-medium"
                        >
                          Username
                        </label>
                        <Input 
                          id="username"
                          value={user.username}
                          onChange={(e) => setUser({...user, username: e.target.value})}
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label 
                          htmlFor="email" 
                          className="text-sm font-medium"
                        >
                          Email
                        </label>
                        <Input 
                          id="email"
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                      </div>
                      
                      {/* Bio */}
                      <div>
                        <label 
                          htmlFor="bio" 
                          className="text-sm font-medium"
                        >
                          Bio
                        </label>
                        <Textarea 
                          id="bio"
                          value={user.bio}
                          onChange={(e) => setUser({...user, bio: e.target.value})}
                          className="resize-none"
                          rows={4}
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Brief description for your profile. Max 160 characters.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              {/* Account Settings */}
              <TabsContent value="account" className="animate-fade-in">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-6">Account Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Password section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Change Password</h4>
                      
                      <div>
                        <label 
                          htmlFor="current-password" 
                          className="text-sm font-medium"
                        >
                          Current Password
                        </label>
                        <Input 
                          id="current-password"
                          type="password"
                        />
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="new-password" 
                          className="text-sm font-medium"
                        >
                          New Password
                        </label>
                        <Input 
                          id="new-password"
                          type="password"
                        />
                      </div>
                      
                      <div>
                        <label 
                          htmlFor="confirm-password" 
                          className="text-sm font-medium"
                        >
                          Confirm New Password
                        </label>
                        <Input 
                          id="confirm-password"
                          type="password"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>
                          Update Password
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Danger Zone */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-destructive">Danger Zone</h4>
                      
                      <div className="border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">Delete Account</h5>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all of your content.
                            </p>
                          </div>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications" className="animate-fade-in">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-6">Notification Settings</h3>
                  
                  <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Comments</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when someone comments on your posts.
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.comments}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, comments: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Likes</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when someone likes your posts.
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.likes}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, likes: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Follows</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications when someone follows you.
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.follows}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, follows: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Direct Messages</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new direct messages.
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.directMessages}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, directMessages: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Email Digest</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive a weekly email digest of your activity.
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailDigest}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, emailDigest: checked})
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Save Preferences
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
              
              {/* Privacy Settings */}
              <TabsContent value="privacy" className="animate-fade-in">
                <div className="glass-card p-6">
                  <h3 className="text-xl font-medium mb-6">Privacy Settings</h3>
                  
                  <form onSubmit={handleSavePrivacy} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Private Profile</h4>
                          <p className="text-sm text-muted-foreground">
                            Only approved followers can see your photos and videos.
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.privateProfile}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, privateProfile: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Hide Following</h4>
                          <p className="text-sm text-muted-foreground">
                            Hide your following list from other users.
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.hideFollowing}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, hideFollowing: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Hide Location Data</h4>
                          <p className="text-sm text-muted-foreground">
                            Hide location data from your posts.
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.hideLocation}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, hideLocation: checked})
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium">Hide Activity Status</h4>
                          <p className="text-sm text-muted-foreground">
                            Hide your online/offline status from other users.
                          </p>
                        </div>
                        <Switch 
                          checked={privacySettings.hideActivityStatus}
                          onCheckedChange={(checked) => 
                            setPrivacySettings({...privacySettings, hideActivityStatus: checked})
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        Save Settings
                      </Button>
                    </div>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
