import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export function CityLinks() {
  const cities = [
    { name: "Zürich", escorts: 200, href: "/escort-zurich", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" },
    { name: "Geneva", escorts: 150, href: "/escort-geneva", image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&h=400&fit=crop" },
    { name: "Basel", escorts: 120, href: "/escort-basel", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop" },
    { name: "Bern", escorts: 100, href: "/escort-bern", image: "https://images.unsplash.com/photo-1509023464722-0177331693ae?w=600&h=400&fit=crop" },
    { name: "Lausanne", escorts: 90, href: "/escort-lausanne", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop" },
    { name: "Lucerne", escorts: 75, href: "/escort-lucerne", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop" }
  ];

  return (
    <section id="cities" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Elite Escorts Across Switzerland
            </h2>
            <p className="text-xl text-gray-300">
              Premium companionship services in all major Swiss cities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, idx) => (
              <Link key={idx} href={city.href}>
                <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-2 cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={city.image} 
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:via-black/40 transition-all" />
                    <div className="absolute bottom-4 left-4 right-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                      <h3 className="text-3xl font-black text-white mb-1 group-hover:text-yellow-400 transition-colors">{city.name}</h3>
                      <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{city.escorts} escorts available</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-white transition-colors">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Demo-Profile</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-white border-white/30 group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all duration-300">
                        Browse
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}