import ProgressCircle from '../ProgressCircle';

export default function ProgressCircleExample() {
  const requirements = [
    { id: "promo", label: "Promo Code or Fan Card", completed: true },
    { id: "donation", label: "Donate to a Cause", completed: true },
    { id: "product", label: "Purchase a Product", completed: false },
    { id: "logistics", label: "Pay Logistics Fee", completed: false },
  ];

  return (
    <div className="p-8">
      <ProgressCircle progress={50} requirements={requirements} />
    </div>
  );
}
