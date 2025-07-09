import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, Package } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { mockSalesData, mockOrders } from '../../data/mockData';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${mockSalesData.totalRevenue.toLocaleString()}`,
      change: `+${mockSalesData.monthlyGrowth}%`,
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Orders',
      value: mockSalesData.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Today\'s Sales',
      value: `$${mockSalesData.todaysSales.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Active Products',
      value: '127',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'text-orange-600'
    }
  ];

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Orders" subtitle="Latest customer orders">
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">{order.customerName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${order.total}</div>
                  <Badge variant={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'shipped' ? 'info' :
                    order.status === 'pending' ? 'warning' : 'default'
                  }>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Common administrative tasks">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left">
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <div className="font-medium text-gray-900">Add Product</div>
              <div className="text-sm text-gray-500">Create new product</div>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />
              <div className="font-medium text-gray-900">Process Orders</div>
              <div className="text-sm text-gray-500">Manage pending orders</div>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <div className="font-medium text-gray-900">View Customers</div>
              <div className="text-sm text-gray-500">Customer management</div>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500">View detailed reports</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;