
'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

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
  terms: z.string().refine((val) => val === 'on', {
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

  // Setup Nodemailer transporter
  // IMPORTANT: You need to configure your email provider details.
  // For development, you can use a service like Ethereal (https://ethereal.email/)
  // For production, use a transactional email service (e.g., SendGrid, Mailgun) or your own SMTP server.
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP host
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'your_email@gmail.com', // Replace with your email
      pass: process.env.EMAIL_PASS, // Replace with your email password or app-specific password
    },
  });

  const conceptNoteBuffer = Buffer.from(await data.conceptNote.arrayBuffer());

  try {
    await transporter.sendMail({
      from: `"Code for Impact" <your_email@gmail.com>`, // Replace with your sender name and email
      to: 'info@masteryhub.co.rw',
      subject: `New Project Application: ${data.projectName}`,
      html: `
        <h1>New Project Application</h1>
        <h2>Applicant Details</h2>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone || 'N/A'}</li>
          <li><strong>Company:</strong> ${data.company || 'N/A'}</li>
        </ul>
        <h2>Project Details</h2>
        <ul>
          <li><strong>Project Name:</strong> ${data.projectName}</li>
          <li><strong>Sector:</strong> ${data.sector}</li>
        </ul>
        <h3>Project Explanation</h3>
        <p>${data.explanation}</p>
        <h3>Social/Environmental Impact</h3>
        <p>${data.impact}</p>
        <h3>Differentiation</h3>
        <p>${data.differentiation}</p>
        <h3>Innovation</h3>
        <p>${data.innovation}</p>
      `,
      attachments: [
        {
          filename: data.conceptNote.name,
          content: conceptNoteBuffer,
          contentType: data.conceptNote.type,
        },
      ],
    });

    return {
      message: 'Application submitted successfully!',
      success: true,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      message: 'Sorry, we were unable to submit your application at this time. Please try again later.',
      success: false,
    };
  }
}

    