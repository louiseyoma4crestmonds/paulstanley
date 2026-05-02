import HeroSection from '../HeroSection';
import heroImage from '@assets/generated_images/Celebrity_hero_portrait_5b95c4c3.png';

export default function HeroSectionExample() {
  return (
    <HeroSection
      image={heroImage}
      celebName="Marcus Johnson"
      tagline="Connecting Hearts, Changing Lives"
      description="Join me on this incredible journey of giving back to communities, creating unforgettable experiences, and making a real difference in the world."
    />
  );
}
