import { vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "components/Layout/Login";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { TelegramClient, Api } from "telegram";

vi.mock("telegram", () => {
  const original = vi.requireActual("telegram");
  return {
    ...original,
    TelegramClient: vi.fn(),
  };
});

vi.mock("telegram/sessions", () => ({
  StringSession: vi.fn(),
}));

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: {
      auth: (state = preloadedState.auth || { askLogin: true }) => state,
      user: (state = preloadedState.user || {}) => state,
    },
    preloadedState,
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render initial login form", () => {
    renderWithProviders(<Login />, {
      preloadedState: { auth: { askLogin: true } },
    });
    
    expect(screen.getByText("Login to Telegram")).toBeInTheDocument();
    expect(screen.getByLabelText("API ID")).toBeInTheDocument();
    expect(screen.getByLabelText("API Hash")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("should handle login process and change stage on QR code", async () => {
    const mockConnect = vi.fn().mockResolvedValue();
    const mockSignInUserWithQrCode = vi.fn().mockImplementation((cred, callbacks) => {
      // Simulate QR code callback
      callbacks.qrCode({ token: Buffer.from("testtoken") });
      return Promise.resolve(new Api.User({ phone: "123", firstName: "Test" }));
    });
    const mockDisconnect = vi.fn().mockResolvedValue();
    
    const mockSession = { save: vi.fn().mockReturnValue("sessionString") };
    
    TelegramClient.mockImplementation(() => ({
      connect: mockConnect,
      signInUserWithQrCode: mockSignInUserWithQrCode,
      disconnect: mockDisconnect,
      session: mockSession,
    }));

    renderWithProviders(<Login />, {
      preloadedState: { auth: { askLogin: true } },
    });

    fireEvent.change(screen.getByLabelText("API ID"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("API Hash"), { target: { value: "hash" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Login by QR code")).toBeInTheDocument();
    });
  });

  it("should handle error during login", async () => {
    const mockConnect = vi.fn().mockRejectedValue(new Error("connect failed"));
    TelegramClient.mockImplementation(() => ({
      connect: mockConnect,
    }));
    
    renderWithProviders(<Login />, {
      preloadedState: { auth: { askLogin: true } },
    });

    fireEvent.change(screen.getByLabelText("API ID"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("API Hash"), { target: { value: "hash" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled();
    });
    // The button might still show loading or revert, error toast would be called
  });
});
