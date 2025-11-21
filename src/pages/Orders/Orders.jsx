import React, { useState } from 'react'

/**
 * Orders Page Component
 * 
 * Displays order management with filtering and status tracking
 */
function Orders() {
    const [selectedTab, setSelectedTab] = useState('all')

    // Sample orders data
    const orders = [
        { id: '#ORD-1001', customer: 'Alice Johnson', date: '2024-01-15', items: 3, total: '$389.97', status: 'Delivered', paymentStatus: 'Paid' },
        { id: '#ORD-1002', customer: 'Bob Smith', date: '2024-01-15', items: 1, total: '$299.99', status: 'Processing', paymentStatus: 'Paid' },
        { id: '#ORD-1003', customer: 'Carol White', date: '2024-01-14', items: 2, total: '$179.98', status: 'Shipped', paymentStatus: 'Paid' },
        { id: '#ORD-1004', customer: 'David Brown', date: '2024-01-14', items: 1, total: '$79.99', status: 'Pending', paymentStatus: 'Pending' },
        { id: '#ORD-1005', customer: 'Emma Davis', date: '2024-01-13', items: 4, total: '$519.96', status: 'Delivered', paymentStatus: 'Paid' },
        { id: '#ORD-1006', customer: 'Frank Miller', date: '2024-01-13', items: 2, total: '$229.98', status: 'Cancelled', paymentStatus: 'Refunded' },
        { id: '#ORD-1007', customer: 'Grace Lee', date: '2024-01-12', items: 1, total: '$159.99', status: 'Shipped', paymentStatus: 'Paid' },
        { id: '#ORD-1008', customer: 'Henry Wilson', date: '2024-01-12', items: 3, total: '$449.97', status: 'Processing', paymentStatus: 'Paid' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800'
            case 'Shipped':
                return 'bg-blue-100 text-blue-800'
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800'
            case 'Pending':
                return 'bg-orange-100 text-orange-800'
            case 'Cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'Refunded':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const tabs = [
        { id: 'all', label: 'All Orders', count: 1234 },
        { id: 'pending', label: 'Pending', count: 45 },
        { id: 'processing', label: 'Processing', count: 89 },
        { id: 'shipped', label: 'Shipped', count: 156 },
        { id: 'delivered', label: 'Delivered', count: 923 },
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="mt-1 text-sm text-gray-500">Track and manage all your orders</p>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-2">
                    <button className="btn-secondary">
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
                            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">$45,231</p>
                            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Avg Order Value</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">$36.65</p>
                            <p className="text-xs text-red-600 mt-1">-3% from last month</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">45</p>
                            <p className="text-xs text-gray-600 mt-1">Needs attention</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${selectedTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{order.items}</td>
                                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.total}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                            View Details
                                        </button>
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

export default Orders
