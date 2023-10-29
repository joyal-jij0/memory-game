//eslint-disable-next-line
import { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
    // const [count, setCount] = useState(0)
    const [statePokeInfo, setStatePokeInfo] = useState([]);
    const [clickedArr, setClickedArr]= useState([]);
    const [highScoreArr, setHighScoreArr]= useState([]);
    const [loading, setLoading]= useState(true);

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=12", { mode: "cors" })
            .then((response) => response.json())
            .then((allPokemon) => {
                // Create an array of promises for each fetch request
                const promises = allPokemon.results.map((pokemon) => {
                    return fetch(pokemon.url, { mode: "cors" }).then((response) =>
                        response.json()
                    );
                });

                // Wait for all promises to resolve
                Promise.all(promises)
                    .then((pokemonInfoList) => {
                        const updatedState = pokemonInfoList.map((pokemonInfo) => {
                            return {
                                pokeName: pokemonInfo.name,
                                pokePic: pokemonInfo.sprites.other.dream_world.front_default,
                                pokeKey: pokemonInfo.id,
                            };
                        });
                        setStatePokeInfo(updatedState);
                    })
                    .catch((error) => console.error(error));
            })
            .catch((error) => console.error(error));

        setTimeout(()=>{
            setLoading(false);
        }, 4000);
    }, []);

    // console.log(statePokeInfo);

    function updateScore(event){
        event.target.tagName === "IMG"
            ? clickedArr.includes(event.target.nextSibling.textContent)
                ? setClickedArr([])
                : setClickedArr([...clickedArr, event.target.nextSibling.textContent]) //clicked on img
            : clickedArr.includes(event.target.textContent)
                ? setClickedArr([])
                : setClickedArr([...clickedArr, event.target.textContent]); //clicked on content

        event.target.tagName === "IMG"
            ? highScoreArr.includes(event.target.nextSibling.textContent)
                ? null
                : setHighScoreArr([...highScoreArr, event.target.nextSibling.textContent]) //clicked on img
            : highScoreArr.includes(event.target.textContent)
                ? null
                : setHighScoreArr([...highScoreArr, event.target.textContent]); //clicked on content

        for (let i = statePokeInfo.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let k = statePokeInfo[i];
            statePokeInfo[i] = statePokeInfo[j];
            statePokeInfo[j] = k;
        }
    }

    function replayGame(){
        return window.location.reload();
    }

    return (
        <div className="page-container">
            {loading && (
                <div className="preloader">
                    <div className="preloader-img"></div>
                </div>
            )}

            {clickedArr.length === 12 && (
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
                <div>Current Score: {clickedArr.length}</div>
                <div>High Score: {highScoreArr.length}</div>
                {/* {clickedArr.length >= 2 && <div>Hello world</div>} */}
            </div>
            <div className="page-content">
                <div className="allCards">
                    {statePokeInfo.map((info) => {
                        return (
                            <div
                                className="card-container"
                                key={info.pokeKey}
                                onClick={updateScore}
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