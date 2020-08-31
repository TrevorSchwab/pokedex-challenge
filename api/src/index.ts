import { ApolloServer, gql, IResolvers } from 'apollo-server'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import pokemon from './pokemon.json'

/* I tried a couple other 'fuzzy search' API's, but each of them wrapped the  
data structure and would have forced more changes to get to the same result*/
const fuzzysearch = require('fuzzysearch')

interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}

const typeDefs = gql`
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type Query {
    pokemonMany(
      search: String
      types: [String]
      weaknesses: [String]
      skip: Int
      limit: Int
    ): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
  }
`

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: {
    pokemonMany(
      _,
      {
        search = '',
        types = [],
        weaknesses = [],
        skip = 0,
        limit = 999,
      }: {
        search?: string
        types?: string[]
        weaknesses?: string[]
        skip?: number
        limit?: number
      }
    ): Pokemon[] {
      const pokemonFiltered = Object.values(pokemon).filter(
        (pokemon: Pokemon) => {
          const pokemonByType = types.every(type =>
            pokemon.types.includes(type)
          )
          const pokemonByWeakness = weaknesses.every(type =>
            pokemon.weaknesses.includes(type)
          )
          const textSearch = fuzzysearch(
            search.toLowerCase(),
            pokemon.name.toLowerCase()
          )
          return pokemonByType && pokemonByWeakness && textSearch
        }
      )
      return sortBy(pokemonFiltered, poke => parseInt(poke.id, 10)).slice(
        skip,
        limit + skip
      )
    },
    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
