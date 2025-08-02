import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema } from "@/validator/inquiry.validator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { removeEmptyFields } from "@/utils";
import { useCreateInquiryMutation } from "@/store/services/inquiry.service";
import { FileText, Store, Mail, Phone, User } from "lucide-react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

type FormData = z.infer<typeof inquirySchema>;

export default function InquiryForm() {
  const [createInquiry] = useCreateInquiryMutation();
  const form = useForm<FormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      restaurantName: "",
      email: "",
      phone: "",
      name: "",
      description:"",
      numberOfOutlets: undefined,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const cleanedData = removeEmptyFields(data);
      const response = await createInquiry(cleanedData).unwrap();
      
      if (response.success) {
        toast.success(response.message);
        form.reset();
      } else {
        toast.error(response.message || "Failed to submit inquiry");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit inquiry. Please try again.";
      toast.error(errorMessage);
      console.error("Inquiry submission error:", error);
    }
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Restaurant Partnership
          </h1>
          <p className="text-muted-foreground">
            Join our network and grow your business with us
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Fill out the details below and we'll get back to you soon
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <div className="space-y-6">
                
                {/* Restaurant Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          Restaurant Name
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter restaurant name"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-[16px]">
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numberOfOutlets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Store className="w-4 h-4 text-primary" />
                          Number of Outlets
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 3"
                            className="h-10"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? undefined : parseInt(value));
                            }}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <div className="min-h-[16px]">
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email Address
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="owner@restaurant.com"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-[16px]">
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Phone Number
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="h-10"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-[16px]">
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Contact Person */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Contact Person Name
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Smith"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <div className="min-h-[16px]">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Additional Information
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your restaurant, cuisine type, and what you're looking for..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="min-h-[16px]">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full h-11 font-medium"
                >
                  Submit Partnership Inquiry
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Questions? Contact us at{" "}
            <span className="text-primary font-medium">partnerships@company.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
