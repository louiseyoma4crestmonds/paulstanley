import ProductCard from '../ProductCard';
import tshirtImage from '@assets/generated_images/Celebrity_merchandise_tshirt_f2cb91ad.png';

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        name="Signature T-Shirt"
        price={45}
        image={tshirtImage}
        description="Premium quality cotton t-shirt with exclusive design"
        stock={15}
      />
    </div>
  );
}
