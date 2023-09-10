import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon.js';
import Card from './components/card/Card';
import Navbar from './components/Navbar/Navbar';

function App() {
   const initialURL='https://pokeapi.co/api/v2/pokemon';
   //ローディング中かどうかの状態変数を定義する（最初は、true：ロ－ディング中）
   const [loading,setLoading]=useState(true);
   const [pokemonData,setPokemonData]=useState([]);
   const [nextURL,setNextURL]=useState("");
   const [prevURL,setPrevURL]=useState("");

   useEffect(() =>{
      const fetchPokemonData = async() => {
        //すべてのポケモンデータを非同期で取得 ----------------------------①
        let res = await getAllPokemon(initialURL);
        console.log(res);
        //各ポケモンの詳細データを非同期で取得----------------------------②
        loadPokemon(res.results);
        //console.log(res.results);
    　　
        //次の20個のポケモンを取得するためのエンドポイント取得して状態変数「nextURL」へ格納---------------③
        setNextURL(res.next);
        //前の20個のポケモンを取得するためのエンドポイント取得して状態変数「prevURL」へ格納（最初はnullになる）---------------④
        setPrevURL(res.previous);
        //console.log(res.next);
        //ローディングが完了したら、loadingの状態変数をfalseにする
        setLoading(false);
      };
      fetchPokemonData();
   },[]);

   //各ポケモンの詳細データを非同期で取得----------------------------②
  const loadPokemon=async(data)=>{
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        //console.log(pokemon);
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };
  //console.log(pokemonData);

  // 次へボタン押下で取得した状態変数「nextURL」から非同期で次のポケモンデータを取得----------------------------③
  const handleNextPage=async()=>{
    setLoading(true);

    //各ポケモンの詳細データを非同期で取得
    let data = await getAllPokemon(nextURL)
    await loadPokemon(data.results);
    //さらに次の20個のポケモンを取得するためのエンドポイント取得して状態変数「nextURL」を更新--------------------③´
    setNextURL(data.next);
    //前の20個のポケモンを取得するためのエンドポイント取得して状態変数「prevURL」を更新--------------------④´
    setPrevURL(data.previous);

    setLoading(false);
  };

  // 前へボタン押下で取得した状態変数「prevURL」から非同期で次のポケモンデータを取得----------------------------④
  const handlePrevPage=async()=>{
    //最初のページは、前のページのURLがnullのため、単純にreturnで返す
    if(!prevURL)return;
    setLoading(true);

    //各ポケモンの詳細データを非同期で取得
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    //前のページに遷移したら、前後のページのポケモンを取得するためのエンドポイント取得して状態変数「nextURL」「prevURL」を更新
    setNextURL(data.next);
    setPrevURL(data.previous);　

    setLoading(false);
  };

   //useStateと三項演算子でロード中の表記切り替えが可能
  return (
    <>
    <Navbar />
    <div className="App">
      {loading?(
        <h1>ロード中・・・</h1>
      ):(
        <>
        <div className="pokemonCardContainer">
           {pokemonData.map((pokemon,i) => {
              return<Card key={i} pokemon={pokemon} />;
            })}
        </div>
        <div className="btn">
          <button onClick={handlePrevPage}>前へ</button>
          <button onClick={handleNextPage}>次へ</button>
        </div>
        </>
        )}
    </div>
    </>
  )
  }

export default App;
