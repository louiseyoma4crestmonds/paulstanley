import CauseCard from '../CauseCard';
import educationImage from '@assets/generated_images/Education_charity_cause_7be64c6a.png';

export default function CauseCardExample() {
  return (
    <div className="max-w-sm">
      <CauseCard
        id="1"
        title="Education for All"
        description="Help provide quality education and learning resources to underprivileged children in communities around the world."
        goal={50000}
        raised={32500}
        image={educationImage}
      />
    </div>
  );
}
