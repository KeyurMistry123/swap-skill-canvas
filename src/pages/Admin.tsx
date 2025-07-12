
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  FileText, 
  Download, 
  Search,
  Filter,
  Ban,
  AlertTriangle,
  Check,
  X,
  Eye,
  ArrowLeft,
  LogOut,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@mit.edu', status: 'Active', joinDate: '2023-09-15', swaps: 12, reports: 0 },
    { id: 2, name: 'Sarah Chen', email: 'sarah@harvard.edu', status: 'Active', joinDate: '2023-08-20', swaps: 8, reports: 1 },
    { id: 3, name: 'Mike Rodriguez', email: 'mike@stanford.edu', status: 'Warned', joinDate: '2023-10-01', swaps: 5, reports: 2 },
    { id: 4, name: 'Emma Wilson', email: 'emma@yale.edu', status: 'Banned', joinDate: '2023-07-10', swaps: 15, reports: 3 }
  ];

  const skillQueue = [
    { id: 1, user: 'Alex Johnson', skill: 'Machine Learning', description: 'Advanced ML algorithms and neural networks', status: 'Pending', submitted: '2024-01-10' },
    { id: 2, user: 'Lisa Wang', skill: 'UI/UX Design', description: 'Modern design principles and prototyping', status: 'Pending', submitted: '2024-01-09' },
    { id: 3, user: 'David Brown', skill: 'Blockchain Development', description: 'Smart contracts and DeFi applications', status: 'Approved', submitted: '2024-01-08' }
  ];

  const swapLogs = [
    { id: 1, requester: 'John Doe', provider: 'Sarah Chen', skill: 'React Development', status: 'Completed', date: '2024-01-10', duration: '2 hours' },
    { id: 2, requester: 'Mike Rodriguez', provider: 'Emma Wilson', skill: 'Python Programming', status: 'In Progress', date: '2024-01-09', duration: '1.5 hours' },
    { id: 3, requester: 'Lisa Wang', provider: 'Alex Johnson', skill: 'Data Science', status: 'Cancelled', date: '2024-01-08', duration: '3 hours' }
  ];

  const handleUserAction = (userId: number, action: string) => {
    console.log(`${action} user ${userId}`);
  };

  const handleSkillAction = (skillId: number, action: string) => {
    console.log(`${action} skill ${skillId}`);
  };

  const handleBroadcast = () => {
    if (broadcastMessage.trim()) {
      console.log('Broadcasting message:', broadcastMessage);
      setBroadcastMessage('');
    }
  };

  const handleExport = (type: string) => {
    console.log(`Exporting ${type} report`);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-xl font-bold text-gray-900">SkillSwap Admin</span>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
              <Link to="/discover" className="text-gray-700 hover:text-indigo-600 transition-colors">Discover</Link>
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600 transition-colors">Profile</Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full cursor-pointer"></div>
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

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-indigo-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Manage users, skills, and platform activities</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Skills</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Swaps</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reports</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'skills'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Skill Queue
            </button>
            <button
              onClick={() => setActiveTab('swaps')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'swaps'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Swap Logs
            </button>
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'broadcast'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Broadcast
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => handleExport('users')} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Swaps</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'Warned'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>{user.swaps}</TableCell>
                      <TableCell>{user.reports}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'view')}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'warn')}>
                            <AlertTriangle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, 'ban')}>
                            <Ban className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'skills' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Skill Descriptions Queue</CardTitle>
                <Button onClick={() => handleExport('skills')} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skillQueue.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.user}</TableCell>
                      <TableCell>{skill.skill}</TableCell>
                      <TableCell className="max-w-xs truncate">{skill.description}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          skill.status === 'Approved' 
                            ? 'bg-green-100 text-green-800'
                            : skill.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {skill.status}
                        </span>
                      </TableCell>
                      <TableCell>{skill.submitted}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleSkillAction(skill.id, 'approve')}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSkillAction(skill.id, 'reject')}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'swaps' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Swap Logs</CardTitle>
                <Button onClick={() => handleExport('swaps')} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requester</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {swapLogs.map((swap) => (
                    <TableRow key={swap.id}>
                      <TableCell className="font-medium">{swap.requester}</TableCell>
                      <TableCell>{swap.provider}</TableCell>
                      <TableCell>{swap.skill}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          swap.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : swap.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {swap.status}
                        </span>
                      </TableCell>
                      <TableCell>{swap.date}</TableCell>
                      <TableCell>{swap.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'broadcast' && (
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="broadcast-message">Message to all users</Label>
                  <Textarea
                    id="broadcast-message"
                    placeholder="Enter your message here..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button onClick={handleBroadcast} disabled={!broadcastMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;
