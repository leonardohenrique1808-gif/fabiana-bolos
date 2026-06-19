// src/hooks/useClients.js
import { useState } from "react";
import { LS, san, obfClt, deobfClt } from "../utils/helpers";

// Se usar Firebase: import { saveClient } from "../utils/db";
const saveClientRemote = () => {};

export function useClients() {
  const [clients, setClients] = useState(() =>
    (LS.get("fab_clients") ?? []).map(deobfClt)
  );

  const persist = (next) => {
    setClients(next);
    LS.set("fab_clients", next.map(obfClt));
  };

  /**
   * Adiciona um cliente novo.
   * Se já existir um pré-cadastro com o mesmo telefone, mescla os dados
   * e ativa a conta (remove isPreRegistered).
   */
  const addClient = (dados) => {
    const telDigits = dados.telefone?.replace(/\D/g, "");
    const existente = clients.find(
      c => c.telefone?.replace(/\D/g, "") === telDigits
    );

    if (existente) {
      // Merge: mantém histórico de pedidos antigos e ativa o perfil
      const merged = san({
        ...existente,
        ...dados,
        id:            existente.id,
        historico:     existente.historico ?? [],
        isPreRegistered: false,
      });
      const next = clients.map(c => c.id === existente.id ? merged : c);
      persist(next);
      saveClientRemote(obfClt(merged));
      return merged;
    }

    const novo = san({ id: Date.now(), historico: [], ...dados });
    persist([...clients, novo]);
    saveClientRemote(obfClt(novo));
    return novo;
  };

  /**
   * Lança um pré-cadastro pelo Admin.
   * Cria o cliente com isPreRegistered: true se o telefone ainda não existir.
   */
  const preRegisterClient = (nome, telefone) => {
    const telDigits = telefone.replace(/\D/g, "");
    const existente = clients.find(
      c => c.telefone?.replace(/\D/g, "") === telDigits
    );
    if (existente) return existente; // já existe, retorna sem duplicar

    const novo = san({
      id:             Date.now(),
      nome,
      telefone,
      aniversario:    "",
      historico:      [],
      endereco:       "",
      isPreRegistered: true,
    });
    persist([...clients, novo]);
    saveClientRemote(obfClt(novo));
    return novo;
  };

  const updateClient = (id, patch) => {
    const next = clients.map(c =>
      c.id === id ? san({ ...c, ...patch }) : c
    );
    persist(next);
    const updated = next.find(c => c.id === id);
    if (updated) saveClientRemote(obfClt(updated));
  };

  const setClientsRaw = (v) => persist(san(v));

  return {
    clients,
    addClient,
    preRegisterClient,
    updateClient,
    setClients: setClientsRaw,
  };
}