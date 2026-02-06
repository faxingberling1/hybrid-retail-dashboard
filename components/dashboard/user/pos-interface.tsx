import { QrCode } from "lucide-react"

export function POSInterface() {
    return (
        <div className="space-y-6">
            {/* Product Scan */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Scan Product</h3>
                    <QrCode className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex space-x-3">
                    <input
                        type="text"
                        placeholder="Enter product code or scan barcode..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Scan
                    </button>
                </div>
            </div>

            {/* Cart Items */}
            <div className="border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Current Sale</h3>
                    <p className="text-sm text-gray-600">3 items in cart</p>
                </div>
                <div className="p-4 space-y-3">
                    {[
                        { name: 'iPhone 15 Pro', qty: 1, price: '₨ 120,000', total: '₨ 120,000' },
                        { name: 'AirPods Pro', qty: 2, price: '₨ 30,000', total: '₨ 60,000' },
                        { name: 'USB-C Cable', qty: 1, price: '₨ 2,500', total: '₨ 2,500' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-600">Qty: {item.qty} × {item.price}</div>
                            </div>
                            <div className="font-bold text-gray-900">{item.total}</div>
                            <button className="ml-4 text-red-600 hover:text-red-700">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₨ 182,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax (17%)</span>
                            <span className="font-medium">₨ 31,025</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₨ 213,525</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
                            Hold Sale
                        </button>
                        <button className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                            Process Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
