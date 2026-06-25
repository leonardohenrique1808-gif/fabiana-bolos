import React from "react";
import { ClientAuth } from "../components/ClientAuth";

export function ClientRegisterScreen({ onSave, onBack }) {
  return (
    <ClientAuth
      mode="register"
      onSave={onSave}
      onBack={onBack}
    />
  );
}
