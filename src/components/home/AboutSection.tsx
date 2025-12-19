import { Card } from "@/components/ui/card";

export function AboutSection() {
  const features = [
    {
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
      title: "100% Verified & Safe",
      description: "Every escort is ID verified and background checked. Your safety is our priority.",
      color: "bg-blue-500"
    },
    {
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
      title: "Elite Selection Only",
      description: "Handpicked sophisticated companions. Educated, beautiful, and professional.",
      color: "bg-purple-500"
    },
    {
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
      title: "Complete Discretion",
      description: "Anonymous bookings, encrypted communications. Your privacy absolutely guaranteed.",
      color: "bg-pink-500"
    },
    {
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=300&fit=crop",
      title: "Top Rated Service",
      description: "Highest client satisfaction ratings. Verified reviews from real clients.",
      color: "bg-yellow-500"
    },
    {
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=300&fit=crop",
      title: "24/7 Availability",
      description: "Round-the-clock bookings. Escorts available any time, day or night.",
      color: "bg-green-500"
    },
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      title: "Professional Service",
      description: "Licensed, legal, and compliant. Premium experience every time.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Why Choose iWantSexNow.ch?
            </h2>
            <p className="text-xl text-gray-300">
              The premier luxury escort service in Switzerland
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <Card key={idx} className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${feature.color} opacity-30 group-hover:opacity-20 transition-opacity duration-300`} />
                </div>
                <div className="p-6 relative">
                  <div className={`absolute top-0 left-0 w-full h-1 ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}