interface StatCardProps {
    value: string;
    label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
return (
<div className="rounded-2xl border bg-background p-4 text-center">
<p className="text-3xl font-semibold tracking-tight">{value}</p>
<p className="text-sm text-muted-foreground">{label}</p>
</div>
);
}

export default StatCard;
