import { Card } from "@/components/ui/card";

export function ServiceCategories() {
  const services = [
    { 
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
      title: "Girlfriend Experience (GFE)", 
      description: "Intimate, passionate companionship with genuine connection and affection",
      color: "from-pink-500 to-rose-500"
    },
    { 
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop",
      title: "Dinner & Social Events", 
      description: "Sophisticated companion for business dinners, galas, and social occasions",
      color: "from-purple-500 to-indigo-500"
    },
    { 
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
      title: "Overnight & Travel", 
      description: "Extended bookings for overnight stays and international travel companionship",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop",
      title: "Pornstar Experience (PSE)", 
      description: "Adventurous, uninhibited experiences for those seeking excitement",
      color: "from-red-500 to-pink-500"
    },
    { 
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      title: "Massage & Spa", 
      description: "Professional relaxation and sensual massage experiences",
      color: "from-teal-500 to-cyan-500"
    },
    { 
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=300&fit=crop",
      title: "VIP Elite Services", 
      description: "Exclusive premium experiences with our highest-rated companions",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-transparent to-black/40">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Premium Escort Services
          </h2>
          <p className="text-xl text-gray-300">
            Exclusive experiences tailored to your desires
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {services.map((service, idx) => (
            <Card key={idx} className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-30 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <div className="p-6 text-center relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">{service.title}</h3>
                <p className="text-gray-300 group-hover:text-white transition-colors">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}