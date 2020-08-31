import React,{useState, useEffect} from 'react';
import {from, BehaviorSubject} from 'rxjs';
import {filter, mergeMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';

const getPokemonByName = async name=>{
  const {results:allPokemons} = await fetch('https://pokeapi.co/api/v2/pokemon?offset=300&limit=100').then(result=>result.json());
  return allPokemons.filter(pokemon=>pokemon.name.includes(name));
}

let searchSubject = new BehaviorSubject("");

//Bulbasour

let searchResultObservable = searchSubject.pipe(
  filter(val=>val.length>1),
  debounceTime(750),
  distinctUntilChanged(),

  // mergeMap(val=> from(getPokemonByName(val)) )
)

// 750 ms Bulbosour

searchResultObservable.subscribe()



const useObservable= (observable, setter)=>{
  useEffect(() => {
    let subscription = observable.subscribe((val)=>setter(val));

    return ()=> subscription.unsubscribe();
  }, [observable,setter])
}


function App() {
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  useObservable(searchResultObservable, setResults);

 

  const onInputChange = (e)=>{
    const newValue=e.target.value;
    setName(newValue);
    searchSubject.next(newValue);
  }

  return (
    <div>
      <input type="text" placeholder="Enter a name" onChange={onInputChange}></input>
  <p>Here is the number: {name}</p>

  {results.map(pokemon=> (<div key={pokemon.name}>
    {pokemon.name}
  </div>))}
  </div>
  );
}

export default App;
