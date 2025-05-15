'use client';

import { CountrySelector } from '@/components/forms/country-selector';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ControlledInput } from '@/components/ui/ControlledInput';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import diceIcon from '@/public/dice-icon.png';
import infoIcon from '@/public/file-icon.png';
import heartIcon from '@/public/heart-icon.png';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const acceptedFileExtensions = ['.pdf', '.doc', '.docx'];

const visaOptions = [
  {label: 'O-1', value: 'o1'},
  {label: 'EB1A', value: 'eb1a'},
  {label: 'EB2 NIW', value: 'eb2niw'},
  {label: "I don't know", value: 'idk'},
];

const formSchema = z.object({
  firstName: z.string().min(3, 'First Name is required'),
  lastName: z.string().min(3, 'Last Name is required'),
  email: z.string().email('Invalid email'),
  country: z.string().min(1, 'Country of citizenship is required'),
  linkedIn: z
    .string()
    .url('URL')
    .refine((val) => val.startsWith('https://'), {
      message: 'The URL must start with https://',
    }),
  visas: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
  resume: z.any().refine(
    (file) => {
      if (file && !Array.isArray(file)) {
        return acceptedFileExtensions.some((ext) => file.endsWith(ext));
      }
    },
    {
      message: `File must be one of the following types: ${acceptedFileExtensions.join(', ')}`,
    }
  ),
  additionalInfo: z.string().min(1, 'Additional Information is required'),
});

type FormData = z.infer<typeof formSchema>;

export function LeadForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      linkedIn: '',
      visas: [],
      resume: '',
      additionalInfo: '',
    },
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: {isSubmitting, isSubmitSuccessful},
  } = form;

  const onSubmit = async (data: FormData) => {
    await fetch('/api/lead', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    reset();
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg px-4 py-20">
      {isSubmitSuccessful ? (
        <div>
          <h2 className="block text-2xl font-bold mb-3 text-center w-full">
            <Image src={infoIcon} alt="File Icon" width={40} className="mb-5 mx-auto" role="presentation" />
            Thank You
          </h2>
          <p className="text-center font-bold text-lg text-foreground">
            Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai
            <Button asChild>
              <Link href="/" className="w-full mt-10 max-w-sm mx-auto" replace>
                Go Back to Homepage
              </Link>
            </Button>
          </p>
        </div>
      ) : (
        <Form {...form}>
          <div className="mb-10">
            <Image src={infoIcon} alt="File Icon" width={75} className="mb-5 mx-auto" role="presentation" />
            <h2 className="block text-2xl font-bold mb-3 text-center w-full">Want to understand your visa options?</h2>
            <p className="text-center font-bold text-lg">
              Submit the form below and our team of experienced attorneys will review your information and send a
              preliminary assessment of your case based on your goals.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-sm mx-auto" noValidate>
            <div className="space-y-4">
              <ControlledInput
                isLoading={isSubmitting}
                control={control}
                name="firstName"
                autoComplete="given-name"
                placeholder="First name"
                required
              />

              <ControlledInput
                isLoading={isSubmitting}
                control={control}
                name="lastName"
                autoComplete="family-name"
                placeholder="Last name"
                required
              />

              <ControlledInput
                isLoading={isSubmitting}
                control={control}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
              />

              <FormField
                name="country"
                render={({field}) => {
                  const isCountryValid =
                    control.getFieldState(field.name)?.error === undefined && !form.getFieldState(field.name).invalid;

                  return (
                    <FormItem>
                      <FormControl>
                        <CountrySelector
                          isValid={isCountryValid}
                          onSelect={(value) => {
                            form.clearErrors(field.name);
                            return field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <ControlledInput
                isLoading={isSubmitting}
                control={control}
                id="linkedIn"
                type="url"
                autoComplete="url"
                placeholder="LinkedIn Profile/Personal Website"
                name="linkedIn"
                required
              />

              <ControlledInput
                isLoading={isSubmitting}
                control={control}
                id="resume"
                type="file"
                label="Resume/CV"
                accept={acceptedFileExtensions.join(',')}
                name="resume"
                required
              />
            </div>

            <div>
              <Image src={diceIcon} alt="Heart Icon" width={75} className="mb-5 mx-auto" role="presentation" />
              <h2 className="block text-2xl font-bold mb-5 text-center w-full">Visa categories of interest</h2>
              <FormField
                control={control}
                name="visas"
                render={() => {
                  return (
                    <FormItem className="flex flex-col">
                      {visaOptions.map((option) => (
                        <FormField
                          key={option.value}
                          control={control}
                          name="visas"
                          render={({field}) => (
                            <FormItem key={option.value} className="flex flex-row items-start gap-x-3 space-y-0">
                              <FormControl className="m-0">
                                <Checkbox
                                  name="visas"
                                  id={option.value}
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.value])
                                      : field.onChange(field.value?.filter((value) => value !== option.value));
                                  }}
                                />
                              </FormControl>
                              <Label
                                htmlFor={option.value}
                                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                {option.label}
                              </Label>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({field}) => (
                <FormItem>
                  <Image src={heartIcon} alt="Heart Icon" width={75} className="mb-5 mx-auto" role="presentation" />
                  <Label htmlFor="additionalInfo" className="block text-2xl font-bold mb-5 text-center w-full">
                    How can we help you?
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?"
                    className={cn('min-h-36', {
                      'border-destructive': form.getFieldState(field.name).invalid,
                    })}
                    rows={4}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
