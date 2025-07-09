import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../../components/ui/Card';

const Analytics: React.FC = () => {

  const metrics = [
    {
      title: 'Revenue Growth',
      value: '23.7%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Customer Retention',
      value: '68.2%',
      trend: 'down',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Average Order Value',
      value: '$127.50',
      trend: 'up',
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Detailed insights into your store performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {metric.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend === 'up' ? '+' : '-'}12.5%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 ${metric.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>


      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Top Products" subtitle="Best selling items">
          <div className="space-y-4">
            {[
              { name: 'Wireless Headphones', sales: 234, revenue: '$46,800' },
              { name: 'Smart Watch', sales: 156, revenue: '$46,800' },
              { name: 'Laptop Bag', sales: 89, revenue: '$8,010' },
              { name: 'Desk Lamp', sales: 67, revenue: '$4,020' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.sales} sales</div>
                </div>
                <div className="font-semibold text-gray-900">{product.revenue}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Traffic Sources" subtitle="Where your customers come from">
          <div className="space-y-4">
            {[
              { source: 'Organic Search', percentage: 45, color: 'bg-blue-500' },
              { source: 'Social Media', percentage: 28, color: 'bg-green-500' },
              { source: 'Direct Traffic', percentage: 18, color: 'bg-purple-500' },
              { source: 'Email Marketing', percentage: 9, color: 'bg-orange-500' }
            ].map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{source.source}</span>
                  <span className="font-medium">{source.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${source.color}`}
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Customer Insights" subtitle="Customer behavior metrics">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">2.4</div>
              <div className="text-sm text-blue-700">Average Session Duration</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">3.2</div>
              <div className="text-sm text-green-700">Pages per Session</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">68%</div>
              <div className="text-sm text-purple-700">Return Customer Rate</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">4.6</div>
              <div className="text-sm text-orange-700">Average Rating</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;