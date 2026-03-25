import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Navigation, Search } from "lucide-react";

const mockFacilities = [
  { name: "GreenCycle Recycling Center", type: "Recycling", distance: "0.8 km", hours: "8AM - 6PM", materials: "Plastics, Glass, Metal, Paper", color: "bg-category-recycle", phone: "(555) 123-4567" },
  { name: "City Compost Drop-off", type: "Composting", distance: "1.2 km", hours: "7AM - 5PM", materials: "Food waste, Yard trimmings", color: "bg-category-compost", phone: "(555) 234-5678" },
  { name: "HazWaste Solutions", type: "Hazardous", distance: "2.4 km", hours: "9AM - 4PM", materials: "Batteries, Paint, Electronics, Chemicals", color: "bg-category-hazard", phone: "(555) 345-6789" },
  { name: "ReUse Hub Thrift", type: "Reuse", distance: "1.7 km", hours: "10AM - 7PM", materials: "Clothing, Furniture, Books, Toys", color: "bg-category-upcycle", phone: "(555) 456-7890" },
  { name: "Metro Recycling Depot", type: "Recycling", distance: "3.1 km", hours: "6AM - 8PM", materials: "All recyclables, E-waste", color: "bg-category-recycle", phone: "(555) 567-8901" },
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

        {/* Map placeholder */}
        <div className="h-48 rounded-xl bg-card border border-border mb-6 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-data">Interactive map coming soon</p>
          </div>
        </div>

        {/* Facility list */}
        <div className="space-y-3">
          {mockFacilities.map((facility, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl bg-card border border-border"
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
                <button className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-primary transition-colors">
                  <Navigation size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
