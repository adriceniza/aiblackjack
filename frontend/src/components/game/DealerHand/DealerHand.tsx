import { useGame } from "@/context/GameContext";
import React from "react";
import styles from "./DealerHand.module.css";
import HandCards from "../HandCards/HandCards";

export default function DealerHand() {
  const { dealer } = useGame();

  console.log(dealer);

  if (!dealer) {
    return null;
  }

  return (
    <div className={styles.dealerContainer}>
      <HandCards player={dealer} />
    </div>
  );
}
