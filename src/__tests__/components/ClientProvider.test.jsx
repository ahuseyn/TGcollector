import { vi } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ClientProvider, { ClientContext } from "components/ClientProvider";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

vi.mock("telegram", () => ({
  TelegramClient: vi.fn(),
}));

vi.mock("telegram/sessions", () => ({
  StringSession: vi.fn(),
}));

describe("ClientProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide a client when valid user credentials are in store", async () => {
    const mockConnect = vi.fn().mockResolvedValue();
    const mockClientInstance = {
      connect: mockConnect,
    };
    TelegramClient.mockImplementation(() => mockClientInstance);
    StringSession.mockImplementation(() => ({}));

    const store = configureStore({
      reducer: {
        user: () => ({
          api: "123,testhash",
          session: "testsession",
        }),
      },
    });

    const TestComponent = () => {
      const client = React.useContext(ClientContext);
      return <div data-testid="client-status">{client ? "Connected" : "Disconnected"}</div>;
    };

    render(
      <Provider store={store}>
        <ClientProvider>
          <TestComponent />
        </ClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("client-status")).toHaveTextContent("Connected");
    });
    
    expect(TelegramClient).toHaveBeenCalledWith(expect.any(Object), 123, "testhash", {
      connectionRetries: 2,
    });
    expect(mockConnect).toHaveBeenCalled();
  });
  
  it("should catch connect error", async () => {
    const mockConnect = vi.fn().mockRejectedValue(new Error("connect error"));
    TelegramClient.mockImplementation(() => ({
      connect: mockConnect,
    }));
    
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const store = configureStore({
      reducer: {
        user: () => ({
          api: "123,testhash",
          session: "testsession",
        }),
      },
    });

    render(
      <Provider store={store}>
        <ClientProvider>
          <div />
        </ClientProvider>
      </Provider>
    );

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith("Error on client connection:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});
