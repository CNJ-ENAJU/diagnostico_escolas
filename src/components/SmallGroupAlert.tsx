import React from "react";
import { AlertTriangle } from "lucide-react";
import { SMALL_GROUP_WARNING, MIN_PUBLIC_GROUP_SIZE } from "../config";

interface SmallGroupAlertProps {
  nAtual: number;
}

export const SmallGroupAlert: React.FC<SmallGroupAlertProps> = ({ nAtual }) => {
  return (
    <div className="alert-small-group" role="alert">
      <AlertTriangle size={24} style={{ flexShrink: 0 }} />
      <div>
        <strong>Salvaguarda Metodológica de Pequenos Grupos (Regra R01.1):</strong>
        <div style={{ marginTop: "0.25rem" }}>
          {SMALL_GROUP_WARNING}
        </div>
        <div style={{ fontSize: "0.75rem", marginTop: "0.35rem", opacity: 0.85 }}>
          Subamostra atual: <strong>N = {nAtual}</strong> (Mínimo exigido para desagregações analíticas: N ≥ {MIN_PUBLIC_GROUP_SIZE}).
        </div>
      </div>
    </div>
  );
};
