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
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { removeEmptyFields } from "@/utils";
import { useCreateInquiryMutation } from "@/store/services/inquiry.service";
import { FileText, Store, Mail, Phone, User } from "lucide-react";
import { Building2 } from "lucide-react";

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

  // return (
  //   <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
  //     <div className="w-full max-w-2xl space-y-8">
  //       <div className="text-center">
  //         <h2 className="mt-2 text-3xl font-bold tracking-tight">
  //           Restaurant Inquiry
  //         </h2>
  //         <p className="mt-2 text-sm text-gray-600">
  //           Fill out the form below and we'll get back to you soon
  //         </p>
  //       </div>
  //       <Card>
  //         <CardHeader>
  //           <CardTitle className="text-2xl">Contact Us</CardTitle>
  //           <CardDescription>
  //             Please provide your restaurant details and we'll help you get
  //             started
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Form {...form}>
  //             <form
  //               onSubmit={form.handleSubmit(onSubmit)}
  //               className="space-y-6"
  //             >
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //                 <FormField
  //                   control={form.control}
  //                   name="restaurantName"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>
  //                         Restaurant Name<span className="text-red-400">*</span>
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="Enter restaurant name"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //                 <FormField
  //                   control={form.control}
  //                   name="numberOfOutlets"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>Number of Outlets</FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           type="number"
  //                           placeholder="Enter number of outlets"
  //                           {...field}
  //                           onChange={(e) =>
  //                             field.onChange(parseInt(e.target.value))
  //                           }
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //                 <FormField
  //                   control={form.control}
  //                   name="email"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>
  //                         Email<span className="text-red-400">*</span>
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           type="email"
  //                           placeholder="Enter your email"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //                 <FormField
  //                   control={form.control}
  //                   name="phone"
  //                   render={({ field }) => (
  //                     <FormItem>
  //                       <FormLabel>
  //                         Phone Number<span className="text-red-400">*</span>
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           type="tel"
  //                           placeholder="Enter your phone number"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <FormMessage />
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>
  //               <FormField
  //                 control={form.control}
  //                 name="name"
  //                 render={({ field }) => (
  //                   <FormItem>
  //                     <FormLabel>
  //                       Contact Person Name
  //                       <span className="text-red-400">*</span>
  //                     </FormLabel>
  //                     <FormControl>
  //                       <Input
  //                         placeholder="Enter contact person name"
  //                         {...field}
  //                       />
  //                     </FormControl>
  //                     <FormMessage />
  //                   </FormItem>
  //                 )}
  //               />
  //               <FormField
  //                 control={form.control}
  //                 name="description"
  //                 render={({ field }) => (
  //                   <FormItem className="space-y-2">
  //                     <FormLabel className="text-base">Description</FormLabel>
  //                     <FormControl>
  //                       <Textarea
  //                         placeholder="Tell us about your restaurant and requirements"
  //                         className="min-h-[120px] resize-none"
  //                         {...field}
  //                       />
  //                     </FormControl>
  //                     <FormDescription className="text-sm text-gray-500">
  //                       Please provide details about your restaurant and what you're looking for
  //                     </FormDescription>
  //                     <FormMessage className="text-sm" />
  //                   </FormItem>
  //                 )}
  //               />
  //               <Button type="submit" className="w-full">
  //                 Submit Inquiry
  //               </Button>
  //             </form>
  //           </Form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
  //     <div className="w-full max-w-4xl space-y-8">
  //       {/* Header Section */}
  //       <div className="text-center space-y-4">
  //         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
  //           <Building2 className="w-8 h-8 text-white" />
  //         </div>
  //         <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
  //           Restaurant Partnership
  //         </h1>
  //         <p className="text-lg text-slate-600 max-w-2xl mx-auto">
  //           Join our network of successful restaurants. Fill out the form below and our team will get back to you within 24 hours.
  //         </p>
  //       </div>

  //       {/* Form Card */}
  //       <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-blue-500/10">
  //         <CardHeader className="pb-8">
  //           <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
  //             <FileText className="w-6 h-6 text-blue-600" />
  //             Get Started Today
  //           </CardTitle>
  //           <CardDescription className="text-base text-slate-600">
  //             Provide your restaurant details and let us help you grow your business
  //           </CardDescription>
  //         </CardHeader>
          
  //         <CardContent className="space-y-8">
  //           <Form {...form}>
  //             <div className="space-y-8">
                
  //               {/* Restaurant Information Section */}
  //               <div className="space-y-6">
  //                 <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
  //                   Restaurant Information
  //                 </h3>
                  
  //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //                   <FormField
  //                     control={form.control}
  //                     name="restaurantName"
  //                     render={({ field }) => (
  //                       <FormItem className="space-y-3">
  //                         <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
  //                           <Building2 className="w-4 h-4 text-blue-600" />
  //                           Restaurant Name
  //                           <span className="text-red-500">*</span>
  //                         </FormLabel>
  //                         <FormControl>
  //                           <Input
  //                             placeholder="e.g., Tony's Italian Kitchen"
  //                             className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
  //                             {...field}
  //                           />
  //                         </FormControl>
  //                         <div className="min-h-[20px]">
  //                           <FormMessage className="text-xs" />
  //                         </div>
  //                       </FormItem>
  //                     )}
  //                   />
                    
  //                   <FormField
  //                     control={form.control}
  //                     name="numberOfOutlets"
  //                     render={({ field }) => (
  //                       <FormItem className="space-y-3">
  //                         <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
  //                           <Store className="w-4 h-4 text-blue-600" />
  //                           Number of Outlets
  //                         </FormLabel>
  //                         <FormControl>
  //                           <Input
  //                             type="number"
  //                             placeholder="e.g., 3"
  //                             className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
  //                             {...field}
  //                             onChange={(e) => {
  //                               const value = e.target.value;
  //                               field.onChange(value === '' ? undefined : parseInt(value));
  //                             }}
  //                             value={field.value || ''}
  //                           />
  //                         </FormControl>
  //                         <div className="min-h-[20px]">
  //                           <FormMessage className="text-xs" />
  //                         </div>
  //                       </FormItem>
  //                     )}
  //                   />
  //                 </div>
  //               </div>

  //               {/* Contact Information Section */}
  //               <div className="space-y-6">
  //                 <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
  //                   Contact Information
  //                 </h3>
                  
  //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //                   <FormField
  //                     control={form.control}
  //                     name="email"
  //                     render={({ field }) => (
  //                       <FormItem className="space-y-3">
  //                         <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
  //                           <Mail className="w-4 h-4 text-blue-600" />
  //                           Email Address
  //                           <span className="text-red-500">*</span>
  //                         </FormLabel>
  //                         <FormControl>
  //                           <Input
  //                             type="email"
  //                             placeholder="owner@restaurant.com"
  //                             className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
  //                             {...field}
  //                           />
  //                         </FormControl>
  //                         <div className="min-h-[20px]">
  //                           <FormMessage className="text-xs" />
  //                         </div>
  //                       </FormItem>
  //                     )}
  //                   />
                    
  //                   <FormField
  //                     control={form.control}
  //                     name="phone"
  //                     render={({ field }) => (
  //                       <FormItem className="space-y-3">
  //                         <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
  //                           <Phone className="w-4 h-4 text-blue-600" />
  //                           Phone Number
  //                           <span className="text-red-500">*</span>
  //                         </FormLabel>
  //                         <FormControl>
  //                           <Input
  //                             type="tel"
  //                             placeholder="+1 (555) 123-4567"
  //                             className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
  //                             {...field}
  //                           />
  //                         </FormControl>
  //                         <div className="min-h-[20px]">
  //                           <FormMessage className="text-xs" />
  //                         </div>
  //                       </FormItem>
  //                     )}
  //                   />
  //                 </div>
                  
  //                 <FormField
  //                   control={form.control}
  //                   name="name"
  //                   render={({ field }) => (
  //                     <FormItem className="space-y-3">
  //                       <FormLabel className="text-sm font-medium text-slate-700 flex items-center gap-2">
  //                         <User className="w-4 h-4 text-blue-600" />
  //                         Contact Person Name
  //                         <span className="text-red-500">*</span>
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Input
  //                           placeholder="John Smith"
  //                           className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <div className="min-h-[20px]">
  //                         <FormMessage className="text-xs" />
  //                       </div>
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>

  //               {/* Additional Information Section */}
  //               <div className="space-y-6">
  //                 <h3 className="text-lg font-medium text-slate-800 border-b border-slate-200 pb-2">
  //                   Additional Information
  //                 </h3>
                  
  //                 <FormField
  //                   control={form.control}
  //                   name="description"
  //                   render={({ field }) => (
  //                     <FormItem className="space-y-3">
  //                       <FormLabel className="text-sm font-medium text-slate-700">
  //                         Tell us about your restaurant
  //                       </FormLabel>
  //                       <FormControl>
  //                         <Textarea
  //                           placeholder="Describe your restaurant type, cuisine, target audience, and what you're looking to achieve with our partnership..."
  //                           className="min-h-[120px] resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
  //                           {...field}
  //                         />
  //                       </FormControl>
  //                       <p className="text-xs text-slate-500">
  //                         Help us understand your business better so we can provide the best support
  //                       </p>
  //                       <div className="min-h-[20px]">
  //                         <FormMessage className="text-xs" />
  //                       </div>
  //                     </FormItem>
  //                   )}
  //                 />
  //               </div>

  //               {/* Submit Button */}
  //               <div className="pt-6">
  //                 <Button 
  //                   onClick={form.handleSubmit(onSubmit)}
  //                   className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
  //                 >
  //                   Submit Partnership Inquiry
  //                 </Button>
  //               </div>
  //             </div>
  //           </Form>
  //         </CardContent>
  //       </Card>

  //       {/* Footer */}
  //       <div className="text-center text-sm text-slate-500">
  //         <p>Questions? Contact our partnership team at <span className="text-blue-600 font-medium">partnerships@company.com</span></p>
  //       </div>
  //     </div>
  //   </div>
  // );


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
