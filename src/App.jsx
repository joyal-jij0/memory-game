import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
    // const [count, setCount] = useState(0)
    const [statePokeInfo, setStatePokeInfo] = useState([]);
    const [currentScore, setCurrentScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [pokeArray, setPokeArray] = useState([]);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=15")
            .then((response) => response.json())
            .then((allPokemon) => {
                const promises = allPokemon.results.map((pokemon) => {
                    return fetch(pokemon.url).then((response) =>
                        response.json()
                    );
                });

                Promise.all(promises)
                    .then((pokemonInfoList) => {
                        const updatedState = pokemonInfoList.map((pokemonInfo) => {
                            return {
                                pokeName: pokemonInfo.name,
                                pokePic: pokemonInfo.sprites.other.dream_world.front_default,
                                pokeKey: pokemonInfo.id,
                            };
                        });

                        // Randomize the array using Fisher-Yates shuffle
                        const shuffledArray = [...updatedState];
                        for (let i = shuffledArray.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
                        }

                        setStatePokeInfo(shuffledArray);
                    })
                    .catch((error) => console.error(error))
            })
            .catch((error) => console.error(error));
    }, [currentScore]);
    

    function updateScore(information){
        if(!(pokeArray.includes(information))){
            pokeArray.push(information);
            setCurrentScore((score)=> score+1);
            console.log(pokeArray);
        } else{
            console.log("Information already in pokeArray")
            if(currentScore > highScore){
                setHighScore(currentScore)
            }
            setPokeArray([]);
            setCurrentScore(0);
        }

    }

    function replayGame(){
        return window.location.reload();
    }

    return (
        <div className="page-container">

            {pokeArray.length === 15 && (
                <>
                    <div className="overlay"></div>
                    <div className="win-banner">
                        <div className="win-title">Congratulations!</div>
                        <div className="win-caption">You Beat The Game.</div>
                        <button className="play-again-btn" onClick={replayGame}>
                            Play Again!
                        </button>
                    </div>
                </>
            )}

            <div className="header">
                <div className="page-title">Memory Card Game</div>
                <div>Current Score: {currentScore}</div>
                <div>High Score: {highScore}</div>
                {/* {clickedArr.length >= 2 && <div>Hello world</div>} */}
            </div>
            <div className="page-content">
                <div className="allCards">
                    {statePokeInfo.map((info) => {
                        return (
                            <div
                                className="card-container"
                                key={info.pokeKey}
                                onClick={()=>updateScore(info.pokeName)}
                            >
                                <img src={info.pokePic} alt="No image available" />
                                <div className="caption">{info.pokeName}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}