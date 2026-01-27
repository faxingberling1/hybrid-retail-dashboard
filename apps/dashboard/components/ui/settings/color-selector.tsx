interface ColorOption {
  id: string;
  value: string;
  name: string;
}

interface ColorSelectorProps {
  label: string;
  selectedColor: string;
  onChange: (color: string) => void;
  colors: ColorOption[];
  className?: string;
}

export default function ColorSelector({
  label,
  selectedColor,
  onChange,
  colors,
  className = ""
}: ColorSelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        {label}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onChange(color.value)}
            className={`p-3 border rounded-lg text-center ${
              selectedColor === color.value
                ? 'ring-2 ring-offset-2 ring-purple-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div
              className="h-8 w-8 rounded-full mx-auto mb-2"
              style={{ backgroundColor: color.value }}
            />
            <div className="text-xs font-medium">{color.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}