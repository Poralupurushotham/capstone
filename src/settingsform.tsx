import { FormEvent, useState } from "react";

type Settings = {
  name: string;
  email: string;
  notifications: boolean;
  theme: "light" | "dark";
};

type Errors = Partial<Record<keyof Settings, string>>;

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    name: "",
    email: "",
    notifications: true,
    theme: "light",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  function validate(): Errors {
    const nextErrors: Errors = {};

    if (!settings.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (settings.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!settings.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  }

  function handleChange<K extends keyof Settings>(
    field: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    // Clear the field's error as the user edits it.
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Replace with your API request.
    console.log("Saving settings:", settings);
    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-lg space-y-6 rounded-lg border bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your account preferences.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={settings.name}
          onChange={(e) => handleChange("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />

        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={settings.email}
          onChange={(e) => handleChange("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />

        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label
            htmlFor="notifications"
            className="text-sm font-medium"
          >
            Email notifications
          </label>
          <p className="text-sm text-gray-500">
            Receive updates and account notifications.
          </p>
        </div>

        <input
          id="notifications"
          name="notifications"
          type="checkbox"
          checked={settings.notifications}
          onChange={(e) =>
            handleChange("notifications", e.target.checked)
          }
          className="h-4 w-4"
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium">
          Theme
        </label>

        <select
          id="theme"
          name="theme"
          value={settings.theme}
          onChange={(e) =>
            handleChange("theme", e.target.value as Settings["theme"])
          }
          className="mt-1 w-full rounded-md border px-3 py-2"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Save settings
        </button>

        {saved && (
          <span className="text-sm text-green-600">
            Settings saved successfully.
          </span>
        )}
      </div>
    </form>
  );
}
