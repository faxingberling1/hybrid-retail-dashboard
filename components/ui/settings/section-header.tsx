interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  );
}