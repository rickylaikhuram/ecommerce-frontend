import React, { useState } from 'react';
import { Search, Filter, User, Eye, Mail, Phone, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { mockCustomers, mockUsers } from '../../data/mockData';
import type{ Customer, User as UserType } from '../../types/temp';

const Customers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'users'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Customer | UserType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (profile: Customer | UserType) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const isCustomer = (profile: Customer | UserType): profile is Customer => {
    return 'totalOrders' in profile;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage customers and user accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'customers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Customers ({mockCustomers.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Users ({mockUsers.length})
          </button>
        </div>
      </Card>

      {/* Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Content */}
      {activeTab === 'customers' ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Orders</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Total Spent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Order</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{customer.totalOrders}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">${customer.totalSpent}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {customer.lastOrderAt?.toLocaleDateString() || 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(customer)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Last Login</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isActive ? 'success' : 'error'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.lastLoginAt?.toLocaleDateString() || 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProfile && isCustomer(selectedProfile) ? 'Customer Profile' : 'User Profile'}
        size="lg"
      >
        {selectedProfile && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedProfile.name}</h3>
                <p className="text-gray-600">{selectedProfile.email}</p>
                {!isCustomer(selectedProfile) && (
                  <Badge variant={selectedProfile.role === 'admin' ? 'info' : 'default'}>
                    {selectedProfile.role}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedProfile.email}</span>
                  </div>
                  {selectedProfile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedProfile.phone}</span>
                    </div>
                  )}
                  {selectedProfile.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <div>{selectedProfile.address.street}</div>
                        <div>{selectedProfile.address.city}, {selectedProfile.address.state} {selectedProfile.address.zipCode}</div>
                        <div>{selectedProfile.address.country}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Account Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Registered:</span>
                    <div className="font-medium">{selectedProfile.registeredAt.toLocaleDateString()}</div>
                  </div>
                  
                  {isCustomer(selectedProfile) ? (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">Total Orders:</span>
                        <div className="font-medium">{selectedProfile.totalOrders}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Total Spent:</span>
                        <div className="font-medium">${selectedProfile.totalSpent}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Last Order:</span>
                        <div className="font-medium">
                          {selectedProfile.lastOrderAt?.toLocaleDateString() || 'Never'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">Last Login:</span>
                        <div className="font-medium">
                          {selectedProfile.lastLoginAt?.toLocaleDateString() || 'Never'}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <div className="font-medium">
                          <Badge variant={selectedProfile.isActive ? 'success' : 'error'}>
                            {selectedProfile.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;