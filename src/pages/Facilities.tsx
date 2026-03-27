import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Navigation, Search } from "lucide-react";

const lucknowFacilities = [
  { name: "Lucknow Nagar Nigam Recycling Center", type: "Recycling", distance: "1.2 km", hours: "8AM - 5PM", materials: "Plastics, Glass, Metal, Paper", color: "bg-category-recycle", phone: "+91 522-2617893", lat: 26.8467, lng: 80.9462 },
  { name: "Gomti Nagar Waste Collection Point", type: "Recycling", distance: "2.1 km", hours: "7AM - 6PM", materials: "Household recyclables, E-waste", color: "bg-category-recycle", phone: "+91 522-2302090", lat: 26.8568, lng: 81.0048 },
  { name: "Chinhat Compost Facility", type: "Composting", distance: "5.8 km", hours: "6AM - 4PM", materials: "Food waste, Garden trimmings, Agri-waste", color: "bg-category-compost", phone: "+91 522-2690011", lat: 26.8800, lng: 81.0400 },
  { name: "LSML Hazardous Waste Depot", type: "Hazardous", distance: "4.3 km", hours: "9AM - 3PM", materials: "Batteries, Paints, Chemicals, Medical waste", color: "bg-category-hazard", phone: "+91 522-2614500", lat: 26.8300, lng: 80.9100 },
  { name: "Aliganj Kabadiwala Hub", type: "Reuse", distance: "3.0 km", hours: "9AM - 7PM", materials: "Scrap metal, Paper, Electronics, Clothing", color: "bg-category-upcycle", phone: "+91 522-2325678", lat: 26.8800, lng: 80.9350 },
  { name: "Indira Nagar E-Waste Center", type: "Recycling", distance: "2.5 km", hours: "10AM - 5PM", materials: "Computers, Phones, Printers, Cables", color: "bg-category-recycle", phone: "+91 522-2718900", lat: 26.8700, lng: 80.9900 },
];

const Facilities = () => {
  return (
    <div className="min-h-screen bg-background pb-24 pt-6 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">Facilities</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by material (e.g., batteries)"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Lucknow Map */}
        <div className="h-56 rounded-2xl overflow-hidden border border-border mb-6 shadow-sm">
          <iframe
            title="Lucknow Waste Facilities Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=80.85%2C26.78%2C81.08%2C26.93&layer=mapnik&marker=26.8467%2C80.9462"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

        <p className="text-xs text-muted-foreground font-data mb-4 flex items-center gap-1.5">
          <MapPin size={12} className="text-primary" />
          Showing facilities in Lucknow, Uttar Pradesh
        </p>

        {/* Facility list */}
        <div className="space-y-3">
          {lucknowFacilities.map((facility, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl glass-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full ${facility.color} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-display font-bold text-foreground">{facility.name}</h3>
                  <p className="text-[10px] font-data text-muted-foreground mt-0.5">{facility.type} • {facility.distance}</p>
                  <p className="text-xs text-muted-foreground mt-1">{facility.materials}</p>
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-data text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={10} /> {facility.hours}</span>
                    <span className="flex items-center gap-1"><Phone size={10} /> {facility.phone}</span>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary transition-colors"
                >
                  <Navigation size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
