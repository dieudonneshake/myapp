'use client';

import * as React from 'react';
import { useActionState, useTransition } from 'react';
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

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const countryCodes = [
  { "value": "+93", "label": "Afghanistan (+93)" },
  { "value": "+355", "label": "Albania (+355)" },
  { "value": "+213", "label": "Algeria (+213)" },
  { "value": "+1-684", "label": "American Samoa (+1-684)" },
  { "value": "+376", "label": "Andorra (+376)" },
  { "value": "+244", "label": "Angola (+244)" },
  { "value": "+1-264", "label": "Anguilla (+1-264)" },
  { "value": "+672", "label": "Antarctica (+672)" },
  { "value": "+1-268", "label": "Antigua and Barbuda (+1-268)" },
  { "value": "+54", "label": "Argentina (+54)" },
  { "value": "+374", "label": "Armenia (+374)" },
  { "value": "+297", "label": "Aruba (+297)" },
  { "value": "+61", "label": "Australia (+61)" },
  { "value": "+43", "label": "Austria (+43)" },
  { "value": "+994", "label": "Azerbaijan (+994)" },
  { "value": "+1-242", "label": "Bahamas (+1-242)" },
  { "value": "+973", "label": "Bahrain (+973)" },
  { "value": "+880", "label": "Bangladesh (+880)" },
  { "value": "+1-246", "label": "Barbados (+1-246)" },
  { "value": "+375", "label": "Belarus (+375)" },
  { "value": "+32", "label": "Belgium (+32)" },
  { "value": "+501", "label": "Belize (+501)" },
  { "value": "+229", "label": "Benin (+229)" },
  { "value": "+1-441", "label": "Bermuda (+1-441)" },
  { "value": "+975", "label": "Bhutan (+975)" },
  { "value": "+591", "label": "Bolivia (+591)" },
  { "value": "+387", "label": "Bosnia and Herzegovina (+387)" },
  { "value": "+267", "label": "Botswana (+267)" },
  { "value": "+55", "label": "Brazil (+55)" },
  { "value": "+246", "label": "British Indian Ocean Territory (+246)" },
  { "value": "+1-284", "label": "British Virgin Islands (+1-284)" },
  { "value": "+673", "label": "Brunei (+673)" },
  { "value": "+359", "label": "Bulgaria (+359)" },
  { "value": "+226", "label": "Burkina Faso (+226)" },
  { "value": "+257", "label": "Burundi (+257)" },
  { "value": "+855", "label": "Cambodia (+855)" },
  { "value": "+237", "label": "Cameroon (+237)" },
  { "value": "+1", "label": "Canada (+1)" },
  { "value": "+238", "label": "Cape Verde (+238)" },
  { "value": "+1-345", "label": "Cayman Islands (+1-345)" },
  { "value": "+236", "label": "Central African Republic (+236)" },
  { "value": "+235", "label": "Chad (+235)" },
  { "value": "+56", "label": "Chile (+56)" },
  { "value": "+86", "label": "China (+86)" },
  { "value": "+61", "label": "Christmas Island (+61)" },
  { "value": "+61", "label": "Cocos Islands (+61)" },
  { "value": "+57", "label": "Colombia (+57)" },
  { "value": "+269", "label": "Comoros (+269)" },
  { "value": "+682", "label": "Cook Islands (+682)" },
  { "value": "+506", "label": "Costa Rica (+506)" },
  { "value": "+385", "label": "Croatia (+385)" },
  { "value": "+53", "label": "Cuba (+53)" },
  { "value": "+599", "label": "Curacao (+599)" },
  { "value": "+357", "label": "Cyprus (+357)" },
  { "value": "+420", "label": "Czech Republic (+420)" },
  { "value": "+243", "label": "Democratic Republic of the Congo (+243)" },
  { "value": "+45", "label": "Denmark (+45)" },
  { "value": "+253", "label": "Djibouti (+253)" },
  { "value": "+1-767", "label": "Dominica (+1-767)" },
  { "value": "+1-809", "label": "Dominican Republic (+1-809)" },
  { "value": "+670", "label": "East Timor (+670)" },
  { "value": "+593", "label": "Ecuador (+593)" },
  { "value": "+20", "label": "Egypt (+20)" },
  { "value": "+503", "label": "El Salvador (+503)" },
  { "value": "+240", "label": "Equatorial Guinea (+240)" },
  { "value": "+291", "label": "Eritrea (+291)" },
  { "value": "+372", "label": "Estonia (+372)" },
  { "value": "+251", "label": "Ethiopia (+251)" },
  { "value": "+500", "label": "Falkland Islands (+500)" },
  { "value": "+298", "label": "Faroe Islands (+298)" },
  { "value": "+679", "label": "Fiji (+679)" },
  { "value": "+358", "label": "Finland (+358)" },
  { "value": "+33", "label": "France (+33)" },
  { "value": "+689", "label": "French Polynesia (+689)" },
  { "value": "+241", "label": "Gabon (+241)" },
  { "value": "+220", "label": "Gambia (+220)" },
  { "value": "+995", "label": "Georgia (+995)" },
  { "value": "+49", "label": "Germany (+49)" },
  { "value": "+233", "label": "Ghana (+233)" },
  { "value": "+350", "label": "Gibraltar (+350)" },
  { "value": "+30", "label": "Greece (+30)" },
  { "value": "+299", "label": "Greenland (+299)" },
  { "value": "+1-473", "label": "Grenada (+1-473)" },
  { "value": "+1-671", "label": "Guam (+1-671)" },
  { "value": "+502", "label": "Guatemala (+502)" },
  { "value": "+44-1481", "label": "Guernsey (+44-1481)" },
  { "value": "+224", "label": "Guinea (+224)" },
  { "value": "+245", "label": "Guinea-Bissau (+245)" },
  { "value": "+592", "label": "Guyana (+592)" },
  { "value": "+509", "label": "Haiti (+509)" },
  { "value": "+504", "label": "Honduras (+504)" },
  { "value": "+852", "label": "Hong Kong (+852)" },
  { "value": "+36", "label": "Hungary (+36)" },
  { "value": "+354", "label": "Iceland (+354)" },
  { "value": "+91", "label": "India (+91)" },
  { "value": "+62", "label": "Indonesia (+62)" },
  { "value": "+98", "label": "Iran (+98)" },
  { "value": "+964", "label": "Iraq (+964)" },
  { "value": "+353", "label": "Ireland (+353)" },
  { "value": "+44-1624", "label": "Isle of Man (+44-1624)" },
  { "value": "+972", "label": "Israel (+972)" },
  { "value": "+39", "label": "Italy (+39)" },
  { "value": "+225", "label": "Ivory Coast (+225)" },
  { "value": "+1-876", "label": "Jamaica (+1-876)" },
  { "value": "+81", "label": "Japan (+81)" },
  { "value": "+44-1534", "label": "Jersey (+44-1534)" },
  { "value": "+962", "label": "Jordan (+962)" },
  { "value": "+7", "label": "Kazakhstan (+7)" },
  { "value": "+254", "label": "Kenya (+254)" },
  { "value": "+686", "label": "Kiribati (+686)" },
  { "value": "+383", "label": "Kosovo (+383)" },
  { "value": "+965", "label": "Kuwait (+965)" },
  { "value": "+996", "label": "Kyrgyzstan (+996)" },
  { "value": "+856", "label": "Laos (+856)" },
  { "value": "+371", "label": "Latvia (+371)" },
  { "value": "+961", "label": "Lebanon (+961)" },
  { "value": "+266", "label": "Lesotho (+266)" },
  { "value": "+231", "label": "Liberia (+231)" },
  { "value": "+218", "label": "Libya (+218)" },
  { "value": "+423", "label": "Liechtenstein (+423)" },
  { "value": "+370", "label": "Lithuania (+370)" },
  { "value": "+352", "label": "Luxembourg (+352)" },
  { "value": "+853", "label": "Macau (+853)" },
  { "value": "+389", "label": "Macedonia (+389)" },
  { "value": "+261", "label": "Madagascar (+261)" },
  { "value": "+265", "label": "Malawi (+265)" },
  { "value": "+60", "label": "Malaysia (+60)" },
  { "value": "+960", "label": "Maldives (+960)" },
  { "value": "+223", "label": "Mali (+223)" },
  { "value": "+356", "label": "Malta (+356)" },
  { "value": "+692", "label": "Marshall Islands (+692)" },
  { "value": "+222", "label": "Mauritania (+222)" },
  { "value": "+230", "label": "Mauritius (+230)" },
  { "value": "+262", "label": "Mayotte (+262)" },
  { "value": "+52", "label": "Mexico (+52)" },
  { "value": "+691", "label": "Micronesia (+691)" },
  { "value": "+373", "label": "Moldova (+373)" },
  { "value": "+377", "label": "Monaco (+377)" },
  { "value": "+976", "label": "Mongolia (+976)" },
  { "value": "+382", "label": "Montenegro (+382)" },
  { "value": "+1-664", "label": "Montserrat (+1-664)" },
  { "value": "+212", "label": "Morocco (+212)" },
  { "value": "+258", "label": "Mozambique (+258)" },
  { "value": "+95", "label": "Myanmar (+95)" },
  { "value": "+264", "label": "Namibia (+264)" },
  { "value": "+674", "label": "Nauru (+674)" },
  { "value": "+977", "label": "Nepal (+977)" },
  { "value": "+31", "label": "Netherlands (+31)" },
  { "value": "+599", "label": "Netherlands Antilles (+599)" },
  { "value": "+687", "label": "New Caledonia (+687)" },
  { "value": "+64", "label": "New Zealand (+64)" },
  { "value": "+505", "label": "Nicaragua (+505)" },
  { "value": "+227", "label": "Niger (+227)" },
  { "value": "+234", "label": "Nigeria (+234)" },
  { "value": "+683", "label": "Niue (+683)" },
  { "value": "+850", "label": "North Korea (+850)" },
  { "value": "+1-670", "label": "Northern Mariana Islands (+1-670)" },
  { "value": "+47", "label": "Norway (+47)" },
  { "value": "+968", "label": "Oman (+968)" },
  { "value": "+92", "label": "Pakistan (+92)" },
  { "value": "+680", "label": "Palau (+680)" },
  { "value": "+970", "label": "Palestine (+970)" },
  { "value": "+507", "label": "Panama (+507)" },
  { "value": "+675", "label": "Papua New Guinea (+675)" },
  { "value": "+595", "label": "Paraguay (+595)" },
  { "value": "+51", "label": "Peru (+51)" },
  { "value": "+63", "label": "Philippines (+63)" },
  { "value": "+64", "label": "Pitcairn (+64)" },
  { "value": "+48", "label": "Poland (+48)" },
  { "value": "+351", "label": "Portugal (+351)" },
  { "value": "+1-787", "label": "Puerto Rico (+1-787)" },
  { "value": "+974", "label": "Qatar (+974)" },
  { "value": "+242", "label": "Republic of the Congo (+242)" },
  { "value": "+262", "label": "Reunion (+262)" },
  { "value": "+40", "label": "Romania (+40)" },
  { "value": "+7", "label": "Russia (+7)" },
  { "value": "+250", "label": "Rwanda (+250)" },
  { "value": "+590", "label": "Saint Barthelemy (+590)" },
  { "value": "+290", "label": "Saint Helena (+290)" },
  { "value": "+1-869", "label": "Saint Kitts and Nevis (+1-869)" },
  { "value": "+1-758", "label": "Saint Lucia (+1-758)" },
  { "value": "+590", "label": "Saint Martin (+590)" },
  { "value": "+508", "label": "Saint Pierre and Miquelon (+508)" },
  { "value": "+1-784", "label": "Saint Vincent and the Grenadines (+1-784)" },
  { "value": "+685", "label": "Samoa (+685)" },
  { "value": "+378", "label": "San Marino (+378)" },
  { "value": "+239", "label": "Sao Tome and Principe (+239)" },
  { "value": "+966", "label": "Saudi Arabia (+966)" },
  { "value": "+221", "label": "Senegal (+221)" },
  { "value": "+381", "label": "Serbia (+381)" },
  { "value": "+248", "label": "Seychelles (+248)" },
  { "value": "+232", "label": "Sierra Leone (+232)" },
  { "value": "+65", "label": "Singapore (+65)" },
  { "value": "+1-721", "label": "Sint Maarten (+1-721)" },
  { "value": "+421", "label": "Slovakia (+421)" },
  { "value": "+386", "label": "Slovenia (+386)" },
  { "value": "+677", "label": "Solomon Islands (+677)" },
  { "value": "+252", "label": "Somalia (+252)" },
  { "value": "+27", "label": "South Africa (+27)" },
  { "value": "+82", "label": "South Korea (+82)" },
  { "value": "+211", "label": "South Sudan (+211)" },
  { "value": "+34", "label": "Spain (+34)" },
  { "value": "+94", "label": "Sri Lanka (+94)" },
  { "value": "+249", "label": "Sudan (+249)" },
  { "value": "+597", "label": "Suriname (+597)" },
  { "value": "+47", "label": "Svalbard and Jan Mayen (+47)" },
  { "value": "+268", "label": "Swaziland (+268)" },
  { "value": "+46", "label": "Sweden (+46)" },
  { "value": "+41", "label": "Switzerland (+41)" },
  { "value": "+963", "label": "Syria (+963)" },
  { "value": "+886", "label": "Taiwan (+886)" },
  { "value": "+992", "label": "Tajikistan (+992)" },
  { "value": "+255", "label": "Tanzania (+255)" },
  { "value": "+66", "label": "Thailand (+66)" },
  { "value": "+228", "label": "Togo (+228)" },
  { "value": "+690", "label": "Tokelau (+690)" },
  { "value": "+676", "label": "Tonga (+676)" },
  { "value": "+1-868", "label": "Trinidad and Tobago (+1-868)" },
  { "value": "+216", "label": "Tunisia (+216)" },
  { "value": "+90", "label": "Turkey (+90)" },
  { "value": "+993", "label": "Turkmenistan (+993)" },
  { "value": "+1-649", "label": "Turks and Caicos Islands (+1-649)" },
  { "value": "+688", "label": "Tuvalu (+688)" },
  { "value": "+1-340", "label": "U.S. Virgin Islands (+1-340)" },
  { "value": "+256", "label": "Uganda (+256)" },
  { "value": "+380", "label": "Ukraine (+380)" },
  { "value": "+971", "label": "United Arab Emirates (+971)" },
  { "value": "+44", "label": "United Kingdom (+44)" },
  { "value": "+1", "label": "United States (+1)" },
  { "value": "+598", "label": "Uruguay (+598)" },
  { "value": "+998", "label": "Uzbekistan (+998)" },
  { "value": "+678", "label": "Vanuatu (+678)" },
  { "value": "+379", "label": "Vatican (+379)" },
  { "value": "+58", "label": "Venezuela (+58)" },
  { "value": "+84", "label": "Vietnam (+84)" },
  { "value": "+681", "label": "Wallis and Futuna (+681)" },
  { "value": "+212", "label": "Western Sahara (+212)" },
  { "value": "+967", "label": "Yemen (+967)" },
  { "value": "+260", "label": "Zambia (+260)" },
  { "value": "+263", "label": "Zimbabwe (+263)" }
];

const uniqueCountryCodes = Array.from(new Set(countryCodes.map(c => c.label)))
  .map(label => {
    return countryCodes.find(c => c.label === label)!;
  });


const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  countryCode: z.string().optional(),
  phoneNumber: z.string().optional(),
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
}).refine(data => {
    return !(data.phoneNumber && !data.countryCode);
}, {
    message: "Please select a country code",
    path: ["countryCode"],
}).refine(data => {
    return !(data.countryCode && !data.phoneNumber);
}, {
    message: "Please enter a phone number",
    path: ["phoneNumber"],
});

type FormValues = z.infer<typeof formSchema>;

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full font-headline bg-accent hover:bg-accent/90 text-accent-foreground"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
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
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState(submitApplication, {
    message: '',
    success: false,
    errors: {},
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      countryCode: '',
      phoneNumber: '',
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

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  React.useEffect(() => {
    if (state.success) {
      setSubmitted(true);
      form.reset();
    } else if (state.message && !state.success) {
      form.clearErrors();
      if (state.errors) {
        // Keep the checkbox state on server-side validation error
        const currentValues = form.getValues();

        for (const [key, value] of Object.entries(state.errors)) {
          if (value && value.length > 0) {
            form.setError(key as keyof FormValues, {
              type: 'server',
              message: value.join(', '),
            });
          }
        }
        // Restore values after setting errors
        form.reset(currentValues);

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

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    const { countryCode, phoneNumber, ...restOfData } = data;

    // Combine country code and phone number
    const fullPhoneNumber = (countryCode && phoneNumber) ? `${countryCode}${phoneNumber}` : '';

    const submissionData: Record<string, any> = {
      ...restOfData,
      phone: fullPhoneNumber,
    };


    Object.entries(submissionData).forEach(([key, value]) => {
        if (key === 'conceptNote' && value?.[0]) {
            formData.append(key, value[0]);
        } else if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value as string);
        }
    });

    startTransition(() => {
      formAction(formData);
    });
  };


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
        onSubmit={form.handleSubmit(onSubmit)}
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
            <div className="md:col-span-1">
                <FormLabel>Phone Number</FormLabel>
                <div className="flex gap-2 mt-2">
                    <FormField
                    control={form.control}
                    name="countryCode"
                    render={({ field }) => (
                        <FormItem className="w-1/3">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               {uniqueCountryCodes.map((country) => (
                                <SelectItem key={country.label} value={country.value}>
                                    {country.label}
                                </SelectItem>
                               ))}
                            </SelectContent>
                        </Select>
                        <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem className="w-2/3">
                        <FormControl>
                            <Input placeholder="788 123 456" {...field} />
                        </FormControl>
                         <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </div>
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
                        </SelectTrigger>
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
                     <FormLabel className="font-normal">
                      I have read and understood the{" "}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="link" type="button" className="p-0 h-auto text-base align-baseline">Terms and Conditions</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Terms and Conditions for Submission</AlertDialogTitle>
                            <AlertDialogDescription className="text-left max-h-[60vh] overflow-y-auto">
                              By submitting your application to the Code for Impact Competition organized by Mastery Hub of Rwanda, you agree to the following terms and conditions:
                              <br/><br/>
                              <strong className="font-bold text-foreground">Confidentiality Commitment</strong><br/>
                              We understand the importance of protecting your ideas and innovations. Mastery Hub of Rwanda is committed to treating all submitted information — including your project concept, documents, and personal/business details — with the highest degree of confidentiality. We will not intentionally share, distribute, or disclose your information to any unauthorized third party.
                              <br/><br/>
                               <strong className="font-bold text-foreground">Non-Disclosure and Good Faith Handling</strong><br/>
                              All submissions will be accessed only by authorized reviewers and stakeholders involved in the competition's evaluation and coordination process. We will handle your information responsibly and in good faith, ensuring it is only used for the purposes of this competition.
                              <br/><br/>
                               <strong className="font-bold text-foreground">No Guarantee of Absolute Protection</strong><br/>
                              While we will do our best to maintain the confidentiality of your project, we cannot guarantee 100% protection of your intellectual property. The nature of open competitions involves some level of risk, and although minimal, it is not entirely avoidable.
                              <br/><br/>
                               <strong className="font-bold text-foreground">Your Responsibility to Protect High-Value Intellectual Property</strong><br/>
                              If you believe that your idea, innovation, or project holds significant commercial value or uniqueness, we strongly recommend that you formally register or protect it through the Rwanda Development Board (RDB) or any recognized intellectual property protection agency before submitting it to this competition.
                               <br/><br/>
                               <strong className="font-bold text-foreground">Applicant Accountability</strong><br/>
                              You, the applicant, are fully responsible for ensuring that your submission does not infringe on any third-party rights, and that you are authorized to submit the idea, especially if it involves other stakeholders or team members.
                               <br/><br/>
                               <strong className="font-bold text-foreground">Right to Use Submitted Content for Judging and Communication</strong><br/>
                              By submitting your project, you grant Mastery Hub of Rwanda permission to internally use the information strictly for evaluating your eligibility, judging, communicating with you, and if selected, for non-confidential promotional purposes (with your consent).
                               <br/><br/>
                               <strong className="font-bold text-foreground">Disqualification Clause</strong><br/>
                              Any submission that violates these terms or is found to contain plagiarized or fraudulent information may be disqualified from the competition.
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
                      . "I have read and understood the Terms and Conditions. I agree to allow Mastery Hub of Rwanda to process and evaluate my submission under the above guidelines. I understand that while all reasonable efforts will be made to protect my intellectual property, full protection cannot be guaranteed, and I am responsible for registering sensitive projects with RDB before submitting." *
                    </FormLabel>
                  </div>
                  <FormMessage/>
                </div>
              </FormItem>
            )}
          />

          <SubmitButton isSubmitting={isSubmitting || isPending} />
        </div>
      </form>
    </Form>
  );
}
