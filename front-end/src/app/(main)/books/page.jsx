import AllBooksClient from "@/components/books/AllBooksClient";

const AllBooksPage = () => {
  return (
    <section className="py-20 bg-base-200 min-h-screen inter">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-[clamp(2.2rem,3vw,3rem)] font-bold text-primary playfair">
            All Books
          </h2>

          <p className="text-base-content/70 mt-3 max-w-2xl mx-auto">
            Browse our curated collection of books from trusted librarians
            across Bangladesh.
          </p>
        </div>

        {/* Client Component */}
        <AllBooksClient />

      </div>
    </section>
  );
};

export default AllBooksPage;