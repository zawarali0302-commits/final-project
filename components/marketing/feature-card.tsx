interface FeatureCardProps {
    title: string;
    description: string;
}
const FeatureCard = ({ title, description }: FeatureCardProps) => {
return (
<div className="p-6 rounded-2xl border">
<h4 className="font-semibold mb-2">{title}</h4>
<p className="text-gray-600">{description}</p>
</div>
);
}

export default FeatureCard;