// components/sections/CategoryShowcase.tsx
const categories = [
  { name: "Men", icon: "🧥" },
  { name: "Women", icon: "👗" },
  { name: "Electronics", icon: "📱" },
  { name: "Footwear", icon: "👟" },
];

const CategoryShowcase = () => {
  return (
    <section className="py-12 px-6 bg-white text-center">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-4xl mb-2">{cat.icon}</div>
            <p className="text-lg font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
