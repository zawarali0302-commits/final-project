interface FeatureCardProps {
    title: string;
    description: string;
}
const FeatureCard = ({ title, description }: FeatureCardProps) => {
return (
<div className="h-full rounded-2xl border bg-card/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
<h4 className="mb-2 font-semibold">{title}</h4>
<p className="text-muted-foreground">{description}</p>
</div>
);
}

export default FeatureCard;
