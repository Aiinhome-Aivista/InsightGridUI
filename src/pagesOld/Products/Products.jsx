import React, { useState } from 'react'

/**
 * Products Page Component
 * 
 * Displays product catalog with search, filter, and management features
 */
function Products() {
    const [searchTerm, setSearchTerm] = useState('')

    // Sample product data
    const products = [
        { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: '$129.99', stock: 45, status: 'Active', image: '🎧' },
        { id: 2, name: 'Smart Watch', category: 'Electronics', price: '$299.99', stock: 23, status: 'Active', image: '⌚' },
        { id: 3, name: 'Laptop Stand', category: 'Accessories', price: '$49.99', stock: 67, status: 'Active', image: '💻' },
        { id: 4, name: 'USB-C Hub', category: 'Accessories', price: '$79.99', stock: 12, status: 'Low Stock', image: '🔌' },
        { id: 5, name: 'Mechanical Keyboard', category: 'Electronics', price: '$159.99', stock: 34, status: 'Active', image: '⌨️' },
        { id: 6, name: 'Wireless Mouse', category: 'Electronics', price: '$39.99', stock: 0, status: 'Out of Stock', image: '🖱️' },
        { id: 7, name: 'Monitor 27"', category: 'Electronics', price: '$349.99', stock: 18, status: 'Active', image: '🖥️' },
        { id: 8, name: 'Desk Lamp', category: 'Accessories', price: '$29.99', stock: 56, status: 'Active', image: '💡' },
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800'
            case 'Low Stock':
                return 'bg-yellow-100 text-yellow-800'
            case 'Out of Stock':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your product catalog and inventory</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button className="btn-primary">
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">567</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                            📦
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Products</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">523</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                            ✅
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">23</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                            ⚠️
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">21</p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                            ❌
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <select className="input-field sm:w-48">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Accessories</option>
                    </select>
                    <select className="input-field sm:w-48">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200">
                        <div className="text-center">
                            <div className="text-6xl mb-4">{product.image}</div>
                            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xl font-bold text-primary-600">{product.price}</span>
                                <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                            </div>
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                                {product.status}
                            </span>
                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 btn-primary py-2 text-sm">Edit</button>
                                <button className="flex-1 btn-secondary py-2 text-sm">View</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Products
