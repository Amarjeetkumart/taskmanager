import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { userService } from '../../services/user.service';
import toast from 'react-hot-toast';
import { User, Mail, Calendar, Save } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getCurrentUser();
      setUser(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await userService.updateProfile(formData);
      setUser(data.user);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="card">
          {!editing ? (
            <>
              <div className="flex items-center mb-6">
                <div className="bg-primary-100 p-4 rounded-full">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">@{user?.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </div>
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                </div>

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <User className="h-4 w-4 mr-1" />
                    Role
                  </div>
                  <span className="badge bg-primary-100 text-primary-800">
                    {user?.role}
                  </span>
                </div>

                {user?.createdAt && (
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Member Since
                    </div>
                    <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button onClick={() => setEditing(true)} className="btn-primary">
                  Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input-field bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6 pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
