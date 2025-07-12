import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, MessageCircle, MapPin, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All Skills',
    'Programming',
    'Design',
    'Languages',
    'Music',
    'Photography',
    'Cooking',
    'Fitness'
  ];

  const users = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'SC',
      location: 'New York, NY',
      rating: 4.9,
      reviewCount: 23,
      skills: ['Web Design', 'Photoshop', 'UI/UX'],
      wants: ['Python', 'Data Science'],
      availability: ['Evenings', 'Weekends'],
      bio: 'Design student passionate about creating beautiful user experiences.'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      avatar: 'MJ',
      location: 'Los Angeles, CA',
      rating: 4.8,
      reviewCount: 17,
      skills: ['Guitar', 'Music Theory', 'Songwriting'],
      wants: ['React', 'JavaScript'],
      availability: ['Afternoons'],
      bio: 'Music major who loves teaching guitar and learning tech skills.'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      avatar: 'ER',
      location: 'Austin, TX',
      rating: 5.0,
      reviewCount: 31,
      skills: ['Spanish', 'Photography', 'Travel Writing'],
      wants: ['Digital Marketing', 'SEO'],
      availability: ['Mornings', 'Evenings'],
      bio: 'International student sharing language skills and cultural knowledge.'
    },
    {
      id: 4,
      name: 'Alex Kim',
      avatar: 'AK',
      location: 'Seattle, WA',
      rating: 4.7,
      reviewCount: 12,
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      wants: ['Graphic Design', 'Video Editing'],
      availability: ['Weekends'],
      bio: 'CS student exploring the intersection of technology and creativity.'
    }
  ];

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
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
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors">Profile</Link>
              <Link to="/chat" className="text-gray-700 hover:text-indigo-600 transition-colors">Messages</Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer" onClick={() => navigate('/profile')}></div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Skills</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by skill or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(index === 0 ? 'all' : category.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (index === 0 && selectedCategory === 'all') || selectedCategory === category.toLowerCase()
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{user.rating}</span>
                    <span className="text-sm text-gray-500">({user.reviewCount})</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{user.bio}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Wants to Learn</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.wants.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Available</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.availability.map((time) => (
                        <span key={time} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button className="flex-1">
                    Request Swap
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigate('/chat')}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
