import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer } from 'nes-react'

const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 25%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  > *:first-child {
    margin-right: 1rem;
  }
`

const POKEMON_MANY = gql`
  query(
    $search: String
    $types: [String]
    $weaknesses: [String]
    $skip: Int
    $limit: Int
  ) {
    pokemonMany(
      search: $search
      types: $types
      weaknesses: $weaknesses
      skip: $skip
      limit: $limit
    ) {
      id
      name
      num
      img
    }
  }
`

const Pokemon: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  const [search, setSearch] = useState<string>('')
  const [types, setTypes] = useState<Array<string>>([])
  const [weaknesses, setWeaknesses] = useState<Array<string>>([])

  const { loading, error, data } = useQuery(POKEMON_MANY, {
    variables: { search, types, weaknesses },
  })

  let pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemonList) {
    return <p>Error!</p>
  }

  const typesWeaknessesOptions = [
    { key: 'Grass', text: 'Grass', value: 'Grass' },
    { key: 'Poison', text: 'Poison', value: 'Poison' },
    { key: 'Fire', text: 'Fire', value: 'Fire' },
    { key: 'Flying', text: 'Flying', value: 'Flying' },
    { key: 'Water', text: 'Water', value: 'Water' },
    { key: 'Bug', text: 'Bug', value: 'Bug' },
    { key: 'Normal', text: 'Normal', value: 'Normal' },
    { key: 'Electric', text: 'Electric', value: 'Electric' },
    { key: 'Ground', text: 'Ground', value: 'Ground' },
    { key: 'Fighting', text: 'Fighting', value: 'Fighting' },
    { key: 'Psychic', text: 'Psychic', value: 'Psychic' },
    { key: 'Rock', text: 'Rock', value: 'Rock' },
    { key: 'Ice', text: 'Ice', value: 'Ice' },
    { key: 'Ghost', text: 'Ghost', value: 'Ghost' },
    { key: 'Dragon', text: 'Dragon', value: 'Dragon' },
    { key: 'Steel', text: 'Steel', value: 'Steel' },
  ]

  const typesDropdown = (
    e: React.SyntheticEvent<HTMLElement>,
    { value }: any
  ) => {
    e.preventDefault()
    setTypes(value)
  }

  const weaknessesDropdown = (
    e: React.SyntheticEvent<HTMLElement>,
    { value }: any
  ) => {
    e.preventDefault()
    setWeaknesses(value)
  }

  const searchPoke = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearch((e.target as HTMLInputElement).value)
  }

  return (
    <Container rounded>
      <div>Search for Pokemon</div>
      <input
        autoFocus={true}
        placeholder="Search Pokemon"
        value={search}
        onChange={e => searchPoke(e)}
      />
      <div>Filter by types</div>
      <Dropdown
        placeholder="Types"
        fluid
        multiple
        selection
        options={typesWeaknessesOptions}
        onChange={typesDropdown}
        value={types}
      />
      <div>Filter by weaknesses</div>
      <Dropdown
        placeholder="Weaknesses"
        fluid
        multiple
        selection
        options={typesWeaknessesOptions}
        onChange={weaknessesDropdown}
        value={weaknesses}
      />
      <List>
        {pokemonList.map(pokemon => (
          <Link to={pokemon.id} onMouseDown={clickLink as any}>
            <ListItem>
              <img src={pokemon.img} />
              {pokemon.name} - {pokemon.num}
            </ListItem>
          </Link>
        ))}
      </List>
    </Container>
  )
}

export default Pokemon
