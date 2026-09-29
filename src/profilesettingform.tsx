import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileSettingsSchema,
  type ProfileSettingsFormValues,
} from "./profile-settings-schema";

type ProfileSettingsFormProps = {
  defaultValues?: Partial<ProfileSettingsFormValues>;
  onSubmit?: (values: ProfileSettingsFormValues) => Promise<void>;
};

const defaultFormValues: ProfileSettingsFormValues = {
  username: "",
  email: "",
  notificationFrequency: "instant",
  bio: "",
};

export function ProfileSettingsForm({
  defaultValues,
  onSubmit = mockSubmit,
}: ProfileSettingsFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      ...defaultFormValues,
      ...defaultValues,
    },
  });

  const bio = watch("bio") ?? "";
  const bioLength = bio.length;

  async function submitForm(values: ProfileSettingsFormValues) {
    setSubmitError(null);

    try {
      // Zod has already trimmed the relevant fields.
      await onSubmit(values);
    } catch {
      setSubmitError(
        "Unable to save your settings. Please try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      noValidate
      className="mx-auto w-full max-w-xl space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      aria-label="Profile settings"
    >
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Profile Settings
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Update your profile information and notification preferences.
        </p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      {/* Username */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-900"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          autoComplete="username"
          aria-label="Username"
          aria-invalid={Boolean(errors.username)}
          aria-describedby={
            errors.username ? "username-error" : undefined
          }
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
            errors.username
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
          {...register("username")}
        />

        {errors.username && (
          <p
            id="username-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-900"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-label="Email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "email-error" : undefined
          }
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
          {...register("email")}
        />

        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Notification Frequency */}
      <div className="space-y-2">
        <label
          htmlFor="notificationFrequency"
          className="block text-sm font-medium text-gray-900"
        >
          Notification Frequency
        </label>

        <select
          id="notificationFrequency"
          aria-label="Notification Frequency"
          aria-invalid={Boolean(errors.notificationFrequency)}
          aria-describedby={
            errors.notificationFrequency
              ? "notification-frequency-error"
              : undefined
          }
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ${
            errors.notificationFrequency
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
          {...register("notificationFrequency")}
        >
          <option value="instant">Instant</option>
          <option value="daily">Daily Digest</option>
          <option value="never">Never</option>
        </select>

        {errors.notificationFrequency && (
          <p
            id="notification-frequency-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.notificationFrequency.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-900"
          >
            Bio
          </label>

          <span
            aria-live="polite"
            className={`text-xs ${
              bioLength > 160
                ? "text-red-600"
                : "text-gray-500"
            }`}
          >
            {bioLength}/160
          </span>
        </div>

        <textarea
          id="bio"
          rows={4}
          maxLength={160}
          aria-label="Bio"
          aria-invalid={Boolean(errors.bio)}
          aria-describedby={errors.bio ? "bio-error" : "bio-counter"}
          className={`w-full resize-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
            errors.bio
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
          }`}
          {...register("bio")}
        />

        <span id="bio-counter" className="sr-only">
          {bioLength} of 160 characters used
        </span>

        {errors.bio && (
          <p
            id="bio-error"
            role="alert"
            className="text-sm text-red-600"
          >
            {errors.bio.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        aria-label={
          isSubmitting ? "Saving profile settings" : "Save settings"
        }
        className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <svg
              className="mr-2 h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Saving...
          </>
        ) : (
          "Save settings"
        )}
      </button>
    </form>
  );
}

/**
 * Mock API implementation.
 *
 * The special username "network_fail" is useful for manually
 * testing the network-error state.
 */
async function mockSubmit(
  values: ProfileSettingsFormValues,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (values.username === "network_fail") {
    throw new Error("Network request failed");
  }

  console.log("Profile settings saved:", values);
}
