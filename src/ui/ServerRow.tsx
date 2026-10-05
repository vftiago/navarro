import { ALL_SERVERS } from "../state/server";
import { IceRow } from "./IceRow";

/**
 * The corp's board: one wall per server, side by side, HQ in the middle.
 * Order comes from ALL_SERVERS (Archives, HQ, R&D).
 */
export const ServerRow = () => (
  <div className="flex justify-center gap-6">
    {ALL_SERVERS.map((server) => (
      <IceRow key={server} server={server} />
    ))}
  </div>
);
