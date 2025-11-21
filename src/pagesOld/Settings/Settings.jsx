import React, { useState } from 'react'

/**
 * Settings Page Component
 * 
 * Application settings and configuration
 */
function Settings() {
    const [activeTab, setActiveTab] = useState('general')
    const [settings, setSettings] = useState({
        storeName: 'VendorApp Store',
        email: 'admin@vendorapp.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business St, City, State 12345',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
        notifications: {
            email: true,
            sms: false,
            push: true,
        },
        privacy: {
            profileVisible: true,
            showEmail: false,
            showPhone: false,
        },
    })

    const tabs = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'privacy', label: 'Privacy', icon: '🔒' },
        { id: 'billing', label: 'Billing', icon: '💳' },
    ]

    const handleToggle = (category, field) => {
        setSettings({
            ...settings,
            [category]: {
                ...settings[category],
                [field]: !settings[category][field],
            },
        })
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="card">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <span className="text-xl mr-3">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                    <input
                                        type="text"
                                        value={settings.storeName}
                                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={settings.email}
                                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={settings.phone}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                                    <textarea
                                        value={settings.address}
                                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                        rows={3}
                                        className="input-field"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="INR">INR - Indian Rupee</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Denver">Mountain Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                        <select
                                            value={settings.language}
                                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button className="btn-secondary">Cancel</button>
                                    <button className="btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === 'notifications' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('notifications', 'email')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('notifications', 'sms')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.sms ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('notifications', 'push')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications.push ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Public Profile</h3>
                                        <p className="text-sm text-gray-500">Make your profile visible to others</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('privacy', 'profileVisible')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.profileVisible ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Show Email Address</h3>
                                        <p className="text-sm text-gray-500">Display email on public profile</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('privacy', 'showEmail')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.showEmail ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Show Phone Number</h3>
                                        <p className="text-sm text-gray-500">Display phone on public profile</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('privacy', 'showPhone')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.privacy.showPhone ? 'bg-primary-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Billing Settings */}
                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <div className="card">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Plan</h2>
                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Professional Plan</h3>
                                        <p className="text-sm text-gray-600 mt-1">$49/month • Billed monthly</p>
                                    </div>
                                    <button className="btn-primary">Upgrade Plan</button>
                                </div>
                            </div>

                            <div className="card">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold">
                                            VISA
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                                            <p className="text-xs text-gray-500">Expires 12/2025</p>
                                        </div>
                                    </div>
                                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                        Update
                                    </button>
                                </div>
                            </div>

                            <div className="card">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing History</h2>
                                <div className="space-y-3">
                                    {[
                                        { date: 'Jan 1, 2024', amount: '$49.00', status: 'Paid' },
                                        { date: 'Dec 1, 2023', amount: '$49.00', status: 'Paid' },
                                        { date: 'Nov 1, 2023', amount: '$49.00', status: 'Paid' },
                                    ].map((invoice, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{invoice.date}</p>
                                                <p className="text-xs text-gray-500">Professional Plan</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                                                <span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                                    {invoice.status}
                                                </span>
                                                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
