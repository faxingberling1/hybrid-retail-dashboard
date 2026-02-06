"use client"
import { useState } from "react"

export function CalculatorWidget() {
    const [display, setDisplay] = useState('0.00')

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Calculator</h2>
            <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '×', 'C', '0', '.', '÷'].map((btn) => (
                    <button
                        key={btn}
                        onClick={() => {
                            // Simple mock functionality for display
                            if (btn === 'C') setDisplay('0.00')
                            else if (display === '0.00') setDisplay(btn)
                            else setDisplay(prev => prev + btn)
                        }}
                        className={`p-4 rounded-lg font-medium ${['+', '-', '×', '÷'].includes(btn)
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : btn === 'C'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {btn}
                    </button>
                ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-right text-2xl font-bold text-gray-900">{display}</div>
            </div>
        </div>
    )
}
