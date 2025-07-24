'use server';

import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Updated schema to handle FormData directly
const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectName: z.string().min(1, 'Project name is required.'),
  sector: z.string().min(1, 'Sector is required.'),
  explanation: z.string().min(1, 'Project explanation is required.'),
  impact: z.string().min(1, 'Social/Environmental Impact is required.'),
  differentiation: z
    .string()
    .min(1, 'Differentiation from existing solutions is required.'),
  innovation: z.string().min(1, 'Innovation aspect is required.'),
  conceptNote: z
    .any()
    .refine((file): file is File => file instanceof File && file.size > 0, 'Concept note is required.')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      '.pdf, .doc, and .docx files are accepted.'
    ),
  terms: z.string().refine((val) => val === 'true', {
    message: 'You must agree to the terms and conditions.',
  }),
});

export type FormState = {
  message: string;
  success: boolean;
  errors?: {
    [key: string]: string[] | undefined;
  };
};

export async function submitApplication(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    projectName: formData.get('projectName'),
    sector: formData.get('sector'),
    explanation: formData.get('explanation'),
    impact: formData.get('impact'),
    differentiation: formData.get('differentiation'),
    innovation: formData.get('innovation'),
    conceptNote: formData.get('conceptNote'),
    terms: formData.get('terms'),
  });

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    console.error('Server-side validation failed:', errorMessages);
    return {
      message: "There was a problem with your submission. Please check the form and try again.",
      success: false,
      errors: errorMessages,
    };
  }

  const data = validatedFields.data;

  // In a real application, you would use a service like Resend, Nodemailer, or an API to send the email.
  console.log('--- Simulating Email Submission ---');
  console.log('To: info@masteryhub.co.rw');
  console.log('Subject: New Project Application:', data.projectName);
  console.log('--- Applicant Details ---');
  console.log('Name:', data.name);
  console.log('Email:', data.email);
  console.log('Phone:', data.phone || 'N/A');
  console.log('Company:', data.company || 'N/A');
  console.log('--- Project Details ---');
  console.log('Project Name:', data.projectName);
  console.log('Sector:', data.sector);
  console.log('--- Attached File ---');
  console.log('File Name:', data.conceptNote.name);
  console.log('File Type:', data.conceptNote.type);
  console.log('File Size:', `${(data.conceptNote.size / 1024).toFixed(2)} KB`);
  console.log('---------------------------------');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    message: 'Application submitted successfully!',
    success: true,
  };
}
