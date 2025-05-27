import { useGame } from "@/context/GameContext";
import React, { useEffect, useState } from "react";
import styles from "./BettingScreen.module.css";
import useSound from "use-sound";
import { Coins } from "@/constants";
import { WSOutcomingMessageType } from "@/types/game";
function BettingScreen() {
  const { sendMessage, player } = useGame();
  const [betAmount, setBetAmount] = React.useState<number>(0);
  const [coinsAdded, setCoinsAdded] = React.useState<number[]>([]);
  const [placed, setPlaced] = useState<boolean>(false);

  const handlePlaceBet = () => {
    if (player) {
      sendMessage({
        type: WSOutcomingMessageType.PLACE_BET,
        bet: betAmount,
      });

      setPlaced(true);
    }
  };

  const handleAddCoin = (coin: number) => {
    setCoinsAdded((prev) => [...prev, coin]);
  };

  const handleRemoveCoin = (coin: number) => {
    setCoinsAdded((prev) => {
      const index = prev.lastIndexOf(coin);
      if (index !== -1) {
        const newCoins = [...prev];
        newCoins.splice(index, 1);
        return newCoins;
      }
      return prev;
    });
  };

  useEffect(() => {
    const newAmount = coinsAdded.reduce((acc, coin) => acc + coin, 0);
    setBetAmount(newAmount);
  }, [coinsAdded]);

  if (!player) {
    return <div className={styles.bettingScreen}>Loading...</div>;
  }

  if (placed) {
    return <div>Wating for other players</div>;
  }

  return (
    <div className={styles.bettingScreen}>
      <span className={styles.bet}>{betAmount}</span>
      <button
        className={styles.submit}
        onClick={handlePlaceBet}
        disabled={betAmount <= 0}
      >
        GO
      </button>
      <RenderCoins
        betAmount={betAmount}
        player={player}
        handleAddCoin={handleAddCoin}
      />
      <AddedCoins coins={coinsAdded} onClick={handleRemoveCoin} />
    </div>
  );
}

export default BettingScreen;

interface RenderCoinsProps {
  handleAddCoin: (coin: number) => void;
  betAmount: number;
  player: {
    id: number;
    balance: number;
  };
}

const RenderCoins = ({
  betAmount = 0,
  player,
  handleAddCoin,
}: RenderCoinsProps) => {
  return (
    <div className={styles.coinsContainer}>
      {Coins.map((coin) => (
        <Card
          key={coin}
          coin={coin}
          handleAddCoin={handleAddCoin}
          betAmount={betAmount}
          player={player}
        />
      ))}
    </div>
  );
};

const Card = ({
  coin,
  betAmount,
  player,
  handleAddCoin,
}: {
  coin: number;
  handleAddCoin: (coin: number) => void;
  betAmount: number;
  player: {
    id: number;
    balance: number;
  };
}) => {
  const [playCoinHover] = useSound("/assets/sounds/chip.mp3", {
    volume: 0.5,
  });
  const [playCoinClick] = useSound("/assets/sounds/chip_drop.mp3", {
    volume: 0.5,
  });

  const handleClick = () => {
    handleAddCoin(coin);
    playCoinClick();
  };

  return (
    <button
      onMouseEnter={() => playCoinHover()}
      className={`${styles.coinButton} ${styles[`coin${coin}`]}`}
      onClick={handleClick}
      disabled={coin + betAmount > player.balance}
    >
      {coin}
    </button>
  );
};
//

const AddedCoins = ({
  coins,
  onClick,
}: {
  coins: number[];
  onClick: (coin: number) => void;
}) => {
  return (
    <div className={styles.addedCoinsContainer}>
      {coins.map((coin, index) => (
        <div
          key={index}
          className={`${styles.coinPreview} ${styles[`coin${coin}`]}`}
          onClick={() => onClick(coin)}
        >
          {coin}
        </div>
      ))}
    </div>
  );
};
