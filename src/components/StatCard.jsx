import PropTypes from 'prop-types';

/**
 * Reusable stat card component for the admin dashboard.
 * Displays a label, value, and optional icon with configurable color.
 * @param {{ title: string, value: number|string, icon?: string, color?: string }} props
 * @returns {JSX.Element}
 */
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    violet: 'bg-violet-100 text-violet-800 border-violet-200',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const colorClasses = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${colorClasses}`}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
        {icon && (
          <span className="text-3xl" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.string,
  color: PropTypes.string,
};

StatCard.defaultProps = {
  icon: undefined,
  color: 'blue',
};

export default StatCard;