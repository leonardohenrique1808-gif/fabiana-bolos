import React from "react";
import { ClientAuth } from "../components/ClientAuth";

export function ClientLoginScreen({ clients, onLogin, onRegister, onBack }) {
  return (
    <ClientAuth
      mode="login"
      clients={clients}
      onLogin={onLogin}
      onRegister={onRegister}
      onBack={onBack}
    />
  );
}
