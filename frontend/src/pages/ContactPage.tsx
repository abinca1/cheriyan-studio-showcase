import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/layout/Navigation";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks";
import { z } from "zod";
import SocialMediaLinks from "@/components/business/SocialMediaLinks";
import apiClient from "@/lib/axios";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Contact form mutation
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // const response = await apiClient.post("/api/contact/", data);
      // return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      reset();
    },
    onError: (error: any) => {
      console.error("Contact form error:", error);
      toast({
        title: "Failed to send message",
        description:
          error?.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@cheriyan.photography",
      href: "mailto:hello@cheriyan.photography",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Studio",
      value: "123 Photography Lane, Creative City, CC 12345",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Let's discuss your photography needs and create something
              beautiful together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="font-display text-3xl font-bold mb-6">
                  Contact Information
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-8">
                  Feel free to reach out through any of the channels below. I'm
                  always excited to discuss new projects and creative
                  opportunities.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.href}
                    className="flex items-start gap-4 p-4 rounded-sm bg-muted/30 hover:bg-muted/50 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="mt-1">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-body font-semibold mb-1">
                        {info.label}
                      </div>
                      <div className="font-body text-sm text-muted-foreground">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="pt-8">
                <h3 className="font-body font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 font-body text-sm text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: By Appointment Only</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-scale-in">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="font-body text-sm font-medium mb-2 block"
                  >
                    Name *
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="border border-gray-300 bg-muted/30 focus:border-green-500 focus:bg-white focus-visible:ring-0 transition-colors duration-200"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-body text-sm font-medium mb-2 block"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="border border-gray-300 bg-muted/30 focus:border-green-500 focus:bg-white focus-visible:ring-0 transition-colors duration-200"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="font-body text-sm font-medium mb-2 block"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="border border-gray-300 bg-muted/30 focus:border-green-500 focus:bg-white focus-visible:ring-0 transition-colors duration-200"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="font-body text-sm font-medium mb-2 block"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    className="border border-gray-300 bg-muted/30 focus:border-green-500 focus:bg-white focus-visible:ring-0 transition-colors duration-200"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || contactMutation.isPending}
                >
                  {isSubmitting || contactMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            {/* Social Media Links */}
            <div className="flex justify-center">
              <SocialMediaLinks
                className="justify-center"
                iconSize={24}
                showLabels={false}
              />
            </div>

            {/* Copyright */}
            <p className="font-body text-sm text-muted-foreground">
              © {new Date().getFullYear()} Photography by Cheriyan. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
