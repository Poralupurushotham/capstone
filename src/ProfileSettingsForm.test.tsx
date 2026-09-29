import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProfileSettingsForm } from "./ProfileSettingsForm";
import type { ProfileSettingsFormValues } from "./profile-settings-schema";

function renderForm(
  onSubmit?: (
    values: ProfileSettingsFormValues,
  ) => Promise<void>,
) {
  return render(
    <ProfileSettingsForm
      onSubmit={onSubmit}
    />,
  );
}

async function fillValidForm() {
  const user = userEvent.setup();

  await user.type(
    screen.getByRole("textbox", { name: "Username" }),
    "john_doe",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "john@example.com",
  );

  await user.selectOptions(
    screen.getByRole("combobox", {
      name: "Notification Frequency",
    }),
    "daily",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Bio" }),
    "Hello, I'm John.",
  );

  return user;
}

describe("ProfileSettingsForm", () => {
  it("submits valid form data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderForm(onSubmit);

    await user.type(
      screen.getByRole("textbox", { name: "Username" }),
      "john_doe",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "john@example.com",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Notification Frequency",
      }),
      "daily",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Bio" }),
      "Hello world",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save settings",
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      username: "john_doe",
      email: "john@example.com",
      notificationFrequency: "daily",
      bio: "Hello world",
    });
  });

  it("trims whitespace before submitting", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderForm(onSubmit);

    await user.type(
      screen.getByRole("textbox", { name: "Username" }),
      "  john_doe  ",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "  john@example.com  ",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save settings",
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      username: "john_doe",
      email: "john@example.com",
      notificationFrequency: "instant",
      bio: "",
    });
  });

  it("renders validation errors for invalid input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderForm(onSubmit);

    await user.type(
      screen.getByRole("textbox", { name: "Username" }),
      "ab!",
    );

    await user.tab();

    expect(
      await screen.findByText(
        "Username can only contain letters, numbers, and underscores.",
      ),
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Email" }),
      "invalid-email",
    );

    await user.tab();

    expect(
      await screen.findByText(
        "Please enter a valid email address.",
      ),
    ).toBeInTheDocument();
  });

  it("shows required validation errors on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderForm(onSubmit);

    await user.click(
      screen.getByRole("button", {
        name: "Save settings",
      }),
    );

    expect(
      await screen.findByText(
        "Username must be at least 3 characters.",
      ),
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        "Please enter a valid email address.",
      ),
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("updates the bio character counter", async () => {
    const user = userEvent.setup();

    renderForm();

    const bio = screen.getByRole("textbox", {
      name: "Bio",
    });

    await user.type(bio, "Hello");

    expect(screen.getByText("5/160")).toBeInTheDocument();
  });

  it("shows the loading state while submitting", async () => {
    const user = userEvent.setup();

    let resolveSubmit!: () => void;

    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    renderForm(onSubmit);

    await fillValidForm();

    await user.click(
      screen.getByRole("button", {
        name: "Save settings",
      }),
    );

    expect(
      screen.getByRole("button", {
        name: "Saving profile settings",
      }),
    ).toBeDisabled();

    expect(screen.getByText("Saving...")).toBeInTheDocument();

    resolveSubmit();

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: "Save settings",
        }),
      ).not.toBeDisabled();
    });
  });

  it("renders a network error when submission fails", async () => {
    const user = userEvent.setup();

    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Network failure"));

    renderForm(onSubmit);

    await fillValidForm();

    await user.click(
      screen.getByRole("button", {
        name: "Save settings",
      }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(
      "Unable to save your settings. Please try again.",
    );
  });

  it("rejects usernames longer than 20 characters", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Username" }),
      "abcdefghijklmnopqrstu",
    );

    await user.tab();

    expect(
      await screen.findByText(
        "Username must be at most 20 characters.",
      ),
    ).toBeInTheDocument();
  });

  it("rejects bios longer than 160 characters", async () => {
    const user = userEvent.setup();

    renderForm();

    const bio = screen.getByRole("textbox", {
      name: "Bio",
    });

    // maxLength prevents typing beyond 160 characters in the UI.
    await user.type(bio, "a".repeat(160));

    expect(screen.getByText("160/160")).toBeInTheDocument();
  });
});
