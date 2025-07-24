
'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  Building2,
  Lightbulb,
  Paperclip,
  Loader2,
  PartyPopper,
} from 'lucide-react';

import { submitApplication, type FormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectName: z.string().trim().min(1, 'Project Name is required'),
  sector: z.string().min(1, 'Please select a sector'),
  explanation: z
    .string()
    .trim()
    .min(10, 'Please provide a more detailed explanation'),
  impact: z
    .string()
    .trim()
    .min(10, 'Please describe the social/environmental impact'),
  differentiation: z
    .string()
    .trim()
    .min(10, 'Please describe what makes your project different'),
  innovation: z
    .string()
    .trim()
    .min(10, 'Please describe the innovative aspects'),
  conceptNote:
    typeof window === 'undefined'
      ? z.any()
      : z
          .any()
          .refine((files) => files?.length == 1, 'Concept Note is required.')
          .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            `Max file size is 5MB.`
          )
          .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            '.pdf, .doc, and .docx files are accepted.'
          ),
  terms: z.string().refine((val) => val === 'on', {
    message: 'You must agree to the terms and conditions.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full font-headline bg-accent hover:bg-accent/90 text-accent-foreground"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Application'
      )}
    </Button>
  );
}

export function ImpactFlowForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = React.useState(false);
  
  const [state, formAction] = useActionState(submitApplication, {
    message: '',
    success: false,
    errors: {},
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      projectName: '',
      sector: '',
      explanation: '',
      impact: '',
      differentiation: '',
      innovation: '',
      conceptNote: undefined,
      terms: undefined,
    },
  });

  React.useEffect(() => {
    if (state.success) {
      setSubmitted(true);
      form.reset();
    } else if (state.message && !state.success) {
      form.clearErrors();
      if (state.errors) {
        // Keep the checkbox state on server-side validation error
        const currentTerms = form.getValues('terms');
        form.reset(form.getValues()); // Keep form values
        form.setValue('terms', currentTerms);

        for (const [key, value] of Object.entries(state.errors)) {
          if (value && value.length > 0) {
            form.setError(key as keyof FormValues, {
              type: 'server',
              message: value.join(', '),
            });
          }
        }
      } else {
        toast({
            variant: 'destructive',
            title: 'Submission Failed',
            description: state.message,
        });
      }
    }
  }, [state, form, toast]);


  const fileRef = form.register('conceptNote');

  if (submitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <PartyPopper className="w-16 h-16 mx-auto text-accent" />
          <CardTitle className="font-headline text-3xl mt-4">Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground text-lg">
            Your application has been submitted successfully. We will review your
            project and get back to you soon.
          </p>
            <Button onClick={() => setSubmitted(false)} className="mt-4 mx-auto block">Submit Another</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form 
        action={formAction} 
        className="space-y-6"
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              Applicant Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sustainable Water Solutions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sector *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sector" />
                        </Trigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="governance">Governance</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="technology_and_ai">Technology and AI</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Explanation *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Briefly explain what your project is about..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social / Environmental Impact *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Describe the positive impact of your project..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="differentiation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Differentiation from existing solutions *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="How is your project different from what already exists?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="innovation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Innovation *</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="What is the key innovation in your project?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conceptNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Concept Note *
                  </FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormDescription>
                    Upload your project concept note (PDF, DOC, DOCX, max 5MB).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                   <Checkbox
                    checked={field.value === 'on'}
                    onCheckedChange={(checked) => {
                      return field.onChange(checked ? 'on' : 'off');
                    }}
                    name={field.name}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <div className="flex items-center gap-1">
                     <FormLabel>
                      I agree to the
                    </FormLabel>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="link" type="button" className="p-0 h-auto text-base">terms and conditions</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
                          <AlertDialogDescription>
                            Mastery Hub of Rwanda will do its best to keep the confidentiality of submitted projects and ideas. All reasonable measures will be taken to avoid unauthorized sharing or theft.
                            <br /><br />
                            However, we cannot guarantee 100% protection. If your project is highly sensitive or groundbreaking, it is your responsibility to register or protect it legally through RDB or an appropriate institution before submission.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => {
                            form.setValue('terms', 'on', { shouldValidate: true });
                          }}>Accept</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <FormLabel>*</FormLabel>
                  </div>
                  <FormMessage/>
                </div>
              </FormItem>
            )}
          />

          <SubmitButton />
        </div>
      </form>
    </Form>
  );
}

    