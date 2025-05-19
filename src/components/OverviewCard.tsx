import React from "react";

type OverviewCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, description }) => {
  return (
    <section className="bg-white rounded-xl shadow p-6 flex flex-col items-start" aria-label={title}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <div className="text-3xl font-extrabold text-blue-600 mb-1">{value}</div>
      {description && <p className="text-gray-500 text-sm">{description}</p>}
    </section>
  );
};

export default OverviewCard; 