
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Edit, 
  Plus,
  Camera,
  Settings,
  Globe,
  Lock,
  ArrowLeft,
  LogOut,
  ExternalLink,
  UserPlus,
  UserCheck,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [followRequested, setFollowRequested] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [newPortfolioLink, setNewPortfolioLink] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUserProfile(data);
        } else {
          alert(data.error || 'Failed to fetch profile');
          navigate('/login');
        }
      } catch (err) {
        alert('Network error');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const reviews = [
    {
      id: 1,
      reviewer: 'Sarah Chen',
      rating: 5,
      skill: 'React Development',
      comment: 'John is an excellent teacher! He explained complex concepts clearly and was very patient.',
      date: '2 weeks ago'
    },
    {
      id: 2,
      reviewer: 'Mike Rodriguez',
      rating: 5,
      skill: 'Python Programming',
      comment: 'Great experience learning Python basics. John provided helpful resources and practice problems.',
      date: '1 month ago'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFollowRequest = () => {
    setFollowRequested(true);
  };

  const handleAddPortfolioLink = (skillName: string) => {
    if (newPortfolioLink) {
      console.log(`Adding portfolio link for ${skillName}: ${newPortfolioLink}`);
      setNewPortfolioLink('');
    }
  };

  // Check if current user can view private profile
  const canViewProfile = isPublic || isFollowing;

  if (loading) return <div>Loading...</div>;

  // Use userProfile for rendering if available, fallback to static data otherwise
  const profile = userProfile || {
    name: 'John Doe',
    avatar: 'JD',
    location: 'Boston, MA',
    university: 'MIT',
    major: 'Computer Science',
    year: 'Junior',
    rating: 4.8,
    reviewCount: 15,
    swapsCompleted: 12,
    joinDate: 'September 2023',
    bio: 'CS student passionate about technology and learning. I love teaching programming and want to learn creative skills like design and music.',
    skillsOffered: [
      { name: 'React Development', level: 'Advanced', students: 8, verified: true },
      { name: 'Python Programming', level: 'Intermediate', students: 5, verified: true },
      { name: 'Data Structures', level: 'Advanced', students: 12, verified: false }
    ],
    skillsWanted: [
      { name: 'Guitar', priority: 'High' },
      { name: 'Digital Marketing', priority: 'Medium' },
      { name: 'Photoshop', priority: 'Low' }
    ],
    availability: ['Monday Evenings', 'Wednesday Afternoons', 'Weekends'],
    badges: ['First Swap', 'Top Rated', 'Quick Responder', 'Helpful Teacher'],
    portfolioLinks: [
      { skill: 'React Development', url: 'https://github.com/johndoe/react-projects', title: 'React Projects Portfolio' },
      { skill: 'Python Programming', url: 'https://github.com/johndoe/python-apps', title: 'Python Applications' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SkillSwap</span>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
              <Link to="/discover" className="text-gray-700 hover:text-indigo-600 transition-colors">Discover</Link>
              <Link to="/chat" className="text-gray-700 hover:text-indigo-600 transition-colors">Messages</Link>
              <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"></div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {profile.avatar}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {profile.joinDate}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{profile.university} • {profile.major} • {profile.year}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    {!canViewProfile && (
                      <Button 
                        size="sm" 
                        onClick={handleFollowRequest}
                        disabled={followRequested}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        {followRequested ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow to Learn
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{profile.bio}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{profile.rating}</span>
                      <span className="text-gray-600 ml-1">({profile.reviewCount} reviews)</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold">{profile.swapsCompleted}</span> swaps completed
                    </div>
                  </div>

                  {/* Profile Visibility Toggle */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {isPublic ? (
                        <Globe className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="text-sm font-medium">
                        {isPublic ? 'Public Profile' : 'Private Profile'}
                      </span>
                    </div>
                    <Switch
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {!canViewProfile ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Private Profile</h3>
              <p className="text-gray-600 mb-4">
                This user has a private profile. Send a follow request to view their skills and request swaps.
              </p>
              <Button 
                onClick={handleFollowRequest}
                disabled={followRequested}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {followRequested ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Request Sent
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Follow Request
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skills & Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skills Offered */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Skills I Can Teach
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.skillsOffered.map((skill, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{skill.name}</h4>
                            {skill.verified && (
                              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Verified
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>Level: {skill.level}</span>
                          <span>{skill.students} students taught</span>
                        </div>
                        
                        {/* Portfolio Links */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Portfolio/Work Examples:</Label>
                          {profile.portfolioLinks
                            .filter(link => link.skill === skill.name)
                            .map((link, linkIndex) => (
                              <div key={linkIndex} className="flex items-center space-x-2">
                                <ExternalLink className="h-4 w-4 text-indigo-600" />
                                <a 
                                  href={link.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                                >
                                  {link.title}
                                </a>
                              </div>
                            ))}
                          
                          {/* Add Portfolio Link */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="mt-2">
                                <Plus className="h-3 w-3 mr-1" />
                                Add Portfolio Link
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Portfolio Link for {skill.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="portfolio-url">Portfolio URL</Label>
                                  <Input
                                    id="portfolio-url"
                                    placeholder="https://github.com/username/project"
                                    value={newPortfolioLink}
                                    onChange={(e) => setNewPortfolioLink(e.target.value)}
                                  />
                                </div>
                                <Button onClick={() => handleAddPortfolioLink(skill.name)}>
                                  Add Link
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Wanted */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Skills I Want to Learn
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.skillsWanted.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <span className={`text-sm px-2 py-1 rounded ${
                            skill.priority === 'High' 
                              ? 'bg-red-100 text-red-800'
                              : skill.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {skill.priority} Priority
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.reviewer}</h4>
                            <p className="text-sm text-gray-600">For {review.skill}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.availability.map((time, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700">{time}</span>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Time Slot
                  </Button>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {profile.badges.map((badge, index) => (
                      <div key={index} className="text-center p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-2"></div>
                        <span className="text-xs font-medium text-gray-700">{badge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
