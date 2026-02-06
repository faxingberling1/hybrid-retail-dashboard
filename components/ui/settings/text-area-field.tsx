interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = ""
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
      />
    </div>
  );
}