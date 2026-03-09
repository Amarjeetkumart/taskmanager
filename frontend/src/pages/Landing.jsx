import { Link } from 'react-router-dom';
import { Home, CheckSquare, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center py-20 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="bg-primary-600 p-6 rounded-full">
              <CheckSquare className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Task Manager
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay organized, boost productivity, and accomplish your goals with our powerful task management system
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary px-8 py-3 text-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-lg">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-slide-up">
          <div className="card text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Task Organization</h3>
            <p className="text-gray-600">
              Create, organize, and manage tasks with priorities, due dates, and tags
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your productivity with detailed statistics and task status tracking
            </p>
          </div>

          <div className="card text-center hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Home className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">User-Friendly</h3>
            <p className="text-gray-600">
              Intuitive interface with beautiful design makes task management effortless
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 py-12 card bg-gradient-to-r from-primary-500 to-primary-600">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of users who are managing their tasks efficiently
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
