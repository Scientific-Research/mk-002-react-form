import { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import * as tools from "./tools";
const url = "https://edwardtanguay.vercel.app/share/germanNouns.json";

interface INoun {
  article: string;
  singular: string;
  plural: string;
  isOpen: boolean;
  isLearned: boolean;
}

function App() {
  // const [count, setCount] = useState(0)
  const [nouns, setNouns] = useState<INoun[]>([]);
  // const [nouns, setNouns] = useState([]);

  useEffect(() => {
    (async () => {
      // setNouns((await axios.get(url)).data);

      let _nouns: INoun[] = [];
      const localStorageString = localStorage.getItem("german-noun-game-state");

      if (localStorageString !== null) {
        _nouns = JSON.parse(localStorageString);
      } else {
        let rawNouns = [];
        rawNouns = (await axios.get(url)).data;
        rawNouns = tools.randomize(rawNouns);
        rawNouns.forEach((rawNouns: any) => {
          const _noun: INoun = {
            ...rawNouns,
            isOpen: false,
            isLearned: false,
          };
          _nouns.push(_noun);
        });
      }
      console.log(_nouns);
      setNouns(_nouns);
    })();
  }, []);

  const handleResetGameButton = () => {
    localStorage.removeItem("german-noun-game-state");
    window.location.reload();
  };
  const saveNouns = () => {
    setNouns([...nouns]);
    localStorage.setItem("german-noun-game-state", JSON.stringify(nouns));
  };

  const handleFlashcardClick = (noun: INoun) => {
    noun.isOpen = !noun.isOpen;
    setNouns([...nouns]);
    saveNouns();
  };

  const handleMarkAsLearned = (noun: INoun) => {
    noun.isLearned = !noun.isLearned;
    setNouns([...nouns]);
    saveNouns();
  };

  return (
    <div className="App">
      <h1>German Noun Game</h1>
      <h2>
        You have learned{" "}
        {nouns.reduce((total, noun) => total + (noun.isLearned ? 1 : 0), 0)} of{" "}
        {nouns.length} nouns.
        <button onClick={handleResetGameButton}>Reset game</button>
      </h2>
      <div className="nouns">
        {nouns.map((noun) => {
          return (
            <div className="noun" key={noun.singular}>
              <div className="front" onClick={() => handleFlashcardClick(noun)}>
                {noun.singular}
              </div>

              {noun.isOpen && (
                <div className="back">
                  <div className="singular">
                    {noun.article} {noun.singular}
                  </div>

                  <div className="plural">{noun.plural}</div>

                  <button onClick={() => handleMarkAsLearned(noun)}>
                    Mark as learned
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
