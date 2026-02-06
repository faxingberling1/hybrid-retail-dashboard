interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ""
}: InputFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}