import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * VendorDashboard Component
 * 
 * Main dashboard page that renders INSIDE the Layout component
 * Angular equivalent: Root → <router-outlet> → Layout → <router-outlet> → VendorDashboard
 * 
 * Features:
 * - Statistics cards
 * - Recent activity
 * - Charts placeholder
 * - Responsive grid layout
 */
function VendorDashboard() {
    const navigate = useNavigate()

    // Sample data
    const stats = [
        {
            title: 'Total Revenue',
            value: '$45,231',
            change: '+12.5%',
            trend: 'up',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-green-500',
        },
        {
            title: 'Total Orders',
            value: '1,234',
            change: '+8.2%',
            trend: 'up',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            color: 'bg-blue-500',
        },
        {
            title: 'Active Products',
            value: '567',
            change: '+3.1%',
            trend: 'up',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-purple-500',
        },
        {
            title: 'Pending Reviews',
            value: '23',
            change: '-2.4%',
            trend: 'down',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
            ),
            color: 'bg-orange-500',
        },
    ]

    const recentOrders = [
        { id: '#ORD-001', customer: 'Alice Johnson', product: 'Wireless Headphones', amount: '$129.99', status: 'Completed' },
        { id: '#ORD-002', customer: 'Bob Smith', product: 'Smart Watch', amount: '$299.99', status: 'Processing' },
        { id: '#ORD-003', customer: 'Carol White', product: 'Laptop Stand', amount: '$49.99', status: 'Shipped' },
        { id: '#ORD-004', customer: 'David Brown', product: 'USB-C Hub', amount: '$79.99', status: 'Pending' },
        { id: '#ORD-005', customer: 'Emma Davis', product: 'Keyboard', amount: '$159.99', status: 'Completed' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800'
            case 'Processing':
                return 'bg-blue-100 text-blue-800'
            case 'Shipped':
                return 'bg-purple-100 text-purple-800'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your store.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button className="btn-primary">
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                                <div className="mt-2 flex items-center">
                                    <span
                                        className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">vs last month</span>
                                </div>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart Placeholder */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                    <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-primary-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <p className="text-primary-600 font-medium">Chart Component Here</p>
                        </div>
                    </div>
                </div>

                {/* Sales Chart Placeholder */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <svg className="w-16 h-16 mx-auto text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            <p className="text-purple-600 font-medium">Chart Component Here</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button
                        onClick={() => navigate('/orders')}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        View All →
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{order.product}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.amount}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VendorDashboard
