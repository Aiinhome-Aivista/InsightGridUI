import React from 'react'

/**
 * Analytics Page Component
 * 
 * Displays analytics dashboard with charts and metrics
 */
function Analytics() {
    const metrics = [
        { label: 'Page Views', value: '45,231', change: '+12.5%', trend: 'up' },
        { label: 'Conversion Rate', value: '3.24%', change: '+0.8%', trend: 'up' },
        { label: 'Avg Session', value: '4m 32s', change: '-0.5%', trend: 'down' },
        { label: 'Bounce Rate', value: '42.3%', change: '-2.1%', trend: 'up' },
    ]

    const topProducts = [
        { name: 'Wireless Headphones', sales: 234, revenue: '$30,366', trend: '+15%' },
        { name: 'Smart Watch', sales: 189, revenue: '$56,681', trend: '+22%' },
        { name: 'Laptop Stand', sales: 156, revenue: '$7,798', trend: '+8%' },
        { name: 'USB-C Hub', sales: 134, revenue: '$10,719', trend: '+12%' },
        { name: 'Mechanical Keyboard', sales: 98, revenue: '$15,679', trend: '+5%' },
    ]

    const trafficSources = [
        { source: 'Direct', visitors: 12543, percentage: 42 },
        { source: 'Organic Search', visitors: 8932, percentage: 30 },
        { source: 'Social Media', visitors: 5421, percentage: 18 },
        { source: 'Referral', visitors: 2987, percentage: 10 },
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="mt-1 text-sm text-gray-500">Track your store performance and insights</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <select className="input-field">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last 12 months</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <div key={index} className="card">
                        <div>
                            <p className="text-sm text-gray-600">{metric.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                            <div className="mt-2 flex items-center">
                                <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.change}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">vs last period</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <p className="text-blue-600 font-medium">Revenue Chart</p>
                            <p className="text-sm text-blue-500 mt-1">Integrate Chart.js or Recharts</p>
                        </div>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                    <div className="space-y-4">
                        {trafficSources.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{item.source}</span>
                                    <span className="text-sm text-gray-600">{item.visitors.toLocaleString()} visitors</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <div className="text-right mt-1">
                                    <span className="text-xs text-gray-500">{item.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sales</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{product.sales}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.revenue}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            {product.trend}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-primary-600">4.8</div>
                            <div className="flex items-center justify-center mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Based on 1,234 reviews</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Repeat Customer Rate</h3>
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-green-600">68%</div>
                            <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Abandonment</h3>
                    <div className="flex items-center justify-center h-40">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-orange-600">32%</div>
                            <p className="text-sm text-gray-500 mt-2">-3% from last month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
