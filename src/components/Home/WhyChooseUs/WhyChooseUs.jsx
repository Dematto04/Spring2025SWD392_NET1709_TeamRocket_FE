import { CheckCircle, ShieldCheck, Star, ThumbsUp } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Star size={32} className="text-primary" />,
      title: "Top-Rated Services",
      desc: "Only verified and high-quality housekeepers.",
    },
    {
      icon: <ShieldCheck size={32} className="text-primary" />,
      title: "Safe & Secure",
      desc: "Your safety is our priority with background-checked professionals.",
    },
    {
      icon: <ThumbsUp size={32} className="text-primary" />,
      title: "Easy Booking",
      desc: "Book and manage services hassle-free in just a few clicks.",
    },
    {
      icon: <CheckCircle size={32} className="text-primary" />,
      title: "Customer Satisfaction",
      desc: "We ensure satisfaction with 24/7 support and a feedback system.",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto text-center px-6 lg:px-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl fade-in">
          Why Choose Us?
        </h2>
        <p className="mt-4 text-primary-foreground fade-in delay-100">
          Discover why thousands trust us for their home service needs.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 transform transition duration-300 hover:-translate-y-2 fade-up delay-100"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl text-primary font-semibold">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
