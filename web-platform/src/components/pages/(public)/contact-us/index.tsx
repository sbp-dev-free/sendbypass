"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { Icon } from "@/components/shared";
import { TOPIC_OPTIONS } from "@/constants/static-pages/contact-us";
import { useTicketMutation } from "@/services/tickets";
import {
  contactUsSchema,
  ContactUsTypeFormData,
} from "@/validations/contact-us";

import { StaticPageFrame } from "../StaticPageFrame";

export const ContactUs = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ContactUsTypeFormData>({
    resolver: zodResolver(contactUsSchema),
    mode: "onChange",
    defaultValues: {
      consent: false,
      subscribe: false,
    },
  });

  const [sendTicket, { isLoading }] = useTicketMutation();

  const onSubmit = async (values: ContactUsTypeFormData) => {
    try {
      await sendTicket(values).unwrap();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StaticPageFrame title="Contact Us">
      <div className="flex flex-col-reverse gap-20 items-start md:pt-40 md:flex-row text-body-large text-on-surface">
        <div className="flex-1 space-y-16 w-full md:pr-20">
          <div className="pl-12 space-y-4">
            <h4 className="text-title-large text-on-surface">Let’s Talk!</h4>
            <p className="text-body-small text-outline">
              If you have questions, feedback, or need to report an issue, just
              send us a message — we’re here to help!
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-24">
            <TextField
              label="Your name ✱"
              fullWidth
              {...register("name")}
              autoComplete="off"
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
            <div className="flex flex-col gap-16 md:flex-row">
              <TextField
                label="Topic ✱"
                className="w-full md:w-[220px]"
                error={!!errors.topic}
                helperText={errors.topic?.message as string}
                select
                slotProps={{
                  select: {
                    IconComponent: () => (
                      <Icon name="Caret Down MD" className="text-[20px] mr-6" />
                    ),
                  },
                }}
                value={watch("topic") ?? ""}
                onChange={(e) => {
                  setValue("topic", e.target.value);
                }}
              >
                {TOPIC_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    className="!p-8"
                  >
                    <span className="text-body-medium">{option.label}</span>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Email ✱"
                fullWidth
                {...register("email")}
                autoComplete="off"
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />
            </div>
            <TextField
              label="Phone number ✱"
              autoComplete="off"
              fullWidth
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message as string}
            />
            <TextField
              label="Your message ✱"
              fullWidth
              multiline
              rows={4}
              {...register("message")}
              autoComplete="off"
              error={!!errors.message}
              helperText={errors.message?.message as string}
            />
            <div>
              <div className="-mb-12">
                <label
                  htmlFor="consent"
                  className="text-body-small text-on-surface-variant"
                >
                  <Controller
                    name="consent"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  I&apos;ve read and agree to Sendbypass’s Terms & Conditions
                  and Privacy Policy.
                </label>
              </div>
              <div>
                <label
                  htmlFor="subscribe"
                  className="text-body-small text-on-surface-variant"
                >
                  <Controller
                    name="subscribe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  Keep me updated on news and offers
                </label>
              </div>
            </div>
            <LoadingButton
              variant="filled"
              type="submit"
              className="h-[56px] w-[140px]"
              loading={isLoading}
            >
              Send
            </LoadingButton>
          </form>
        </div>
        <div className="flex-1 p-8 space-y-24 w-full border border-surface-container rounded-large">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2306.3315235557866!2d25.25706587707169!3d54.68619347363561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd940a4105caa5%3A0x552da22654df07ab!2sJ.%20Jasinskio%20g.%2016B%2C%20Vilnius%2C%2003163%20Vilniaus%20m.%20sav.%2C%20Lithuania!5e0!3m2!1sen!2s!4v1746095969759!5m2!1sen!2s"
            className="w-full h-[218px] md:h-[324px] rounded-large"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="px-8 pb-16 space-y-16 md:space-y-24">
            <div className="flex gap-16 items-start">
              <div className="pt-8 space-y-8">
                <div className="rounded-full size-6 bg-primary" />
                <div className="rounded-full size-6 bg-outline-variant" />
              </div>
              <div className="space-y-4">
                <h5 className="text-title-medium text-on-surface">
                  Headquarters
                </h5>
                <p className="text-body-medium text-on-surface-variant">
                  Vilnius, J. Jasinskio g. 16B,
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-16 md:gap-[162px] md:items-center">
              <div className="flex gap-16 items-start">
                <div className="pt-8 space-y-8">
                  <div className="rounded-full size-6 bg-primary" />
                  <div className="rounded-full size-6 bg-outline-variant" />
                </div>
                <div className="space-y-4">
                  <h5 className="text-title-medium text-on-surface">Email</h5>
                  <Link
                    href="mailto:Info@Sendbypass.com"
                    className="text-body-medium text-on-surface-variant"
                  >
                    Info@Sendbypass.com
                  </Link>
                </div>
              </div>
              <div className="flex gap-16 items-start">
                <div className="pt-8 space-y-8">
                  <div className="rounded-full size-6 bg-primary" />
                  <div className="rounded-full size-6 bg-outline-variant" />
                </div>
                <div className="space-y-4">
                  <h5 className="text-title-medium text-on-surface">Phone</h5>
                  <Link
                    href="tel:+37062549672"
                    className="text-body-medium text-on-surface-variant"
                  >
                    +370 693 91091
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageFrame>
  );
};
