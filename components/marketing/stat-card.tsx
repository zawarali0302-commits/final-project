interface StatCardProps {
    value: string;
    label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
return (
<div>
<p className="text-3xl font-bold">{value}</p>
<p className="text-gray-500">{label}</p>
</div>
);
}

export default StatCard;