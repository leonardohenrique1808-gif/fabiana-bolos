// src/hooks/useClients.js
import { useState } from "react";
import { LS, san, obfClt, deobfClt } from "../utils/helpers";

export function useClients() {
  const [clients, setClientsState] = useState(() =>
    (LS.get("fab_clients") ?? []).map(deobfClt)
  );

  const persist = (next) => {
    setClientsState(next);
    LS.set("fab_clients", next.map(obfClt));
  };

  /**
   * Adiciona um cliente novo.
   * Se já existir um pré-cadastro com o mesmo telefone (isPreRegistered),
   * mescla os dados, remove a flag e ativa a conta, preservando o histórico.
   */
  const addClient = (dados) => {
    const telDigits = (dados.telefone ?? "").replace(/\D/g, "");
    const existente = clients.find(
      (c) => (c.telefone ?? "").replace(/\D/g, "") === telDigits
    );

    if (existente) {
      const merged = san({
        ...existente,
        ...dados,
        id:              existente.id,
        historico:       existente.historico ?? [],
        isPreRegistered: false,
      });
      const next = clients.map((c) => (c.id === existente.id ? merged : c));
      persist(next);
      return merged;
    }

    const novo = san({
      id:          Date.now(),
      historico:   [],
      endereco:    "",
      ...dados,
    });
    persist([...clients, novo]);
    return novo;
  };

  /**
   * Cria um pré-cadastro pelo Admin.
   * isPreRegistered: true indica que o cliente ainda precisa completar o perfil.
   */
  const preRegisterClient = (nome, telefone) => {
    const telDigits = telefone.replace(/\D/g, "");
    const existente = clients.find(
      (c) => (c.telefone ?? "").replace(/\D/g, "") === telDigits
    );
    if (existente) return existente;

    const novo = san({
      id:              Date.now(),
      nome,
      telefone,
      aniversario:     "",
      historico:       [],
      endereco:        "",
      isPreRegistered: true,
    });
    persist([...clients, novo]);
    return novo;
  };

  const updateClient = (id, patch) => {
    const next = clients.map((c) =>
      c.id === id ? san({ ...c, ...patch }) : c
    );
    persist(next);
    return next.find((c) => c.id === id);
  };

  const setClients = (v) => persist(san(v));

  return {
    clients,
    addClient,
    preRegisterClient,
    updateClient,
    setClients,
  };
}