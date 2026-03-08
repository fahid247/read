import ContactForm from "@/components/ContactForm/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";


const ContactUs = () => {
  return (
    <section className="min-h-screen bg-base-100 py-20 px-6 inter">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl playfair">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base-content/70">
            Have questions, feedback, or collaboration ideas? The Read On Route
            team is always happy to hear from you.
          </p>
        </div>

        <div className="grid gap-14 md:grid-cols-2">
          {/* Contact Info (Server-rendered) */}
          <div className="space-y-8">
            {[
              { icon: Mail, title: "Email", value: "fahid32446@gmail.com" },
              { icon: Phone, title: "Phone", value: "+880 1644-887100" },
              { icon: MapPin, title: "Location", value: "Dhaka, Bangladesh" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group flex items-start gap-4 rounded-2xl bg-base-200 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-base-content/70">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form (Client component) */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactUs;