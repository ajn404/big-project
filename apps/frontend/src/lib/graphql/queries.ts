import { gql } from '@apollo/client'

export const GET_PRACTICE_NODES = gql`
  query GetPracticeNodes {
    practiceNodes {
      id
      title
      description
      content
      date
      difficulty
      estimatedTime
      contentType
      componentName
      prerequisites
      category {
        id
        name
        color
      }
      tags {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PRACTICE_NODE = gql`
  query GetPracticeNode($id: ID!) {
    practiceNode(id: $id) {
      id
      title
      description
      content
      date
      difficulty
      estimatedTime
      contentType
      componentName
      prerequisites
      category {
        id
        name
        color
      }
      tags {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  }
`

export const SEARCH_PRACTICE_NODES = gql`
  query SearchPracticeNodes($query: String, $categoryName: String, $tagNames: [String!]) {
    searchPracticeNodes(query: $query, categoryName: $categoryName, tagNames: $tagNames) {
      id
      title
      description
      content
      date
      difficulty
      estimatedTime
      contentType
      componentName
      prerequisites
      category {
        id
        name
        color
      }
      tags {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      color
      icon
      order
      practiceNodes {
        id
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      color
      practiceNodes {
        id
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PRACTICE_NODES_BY_CATEGORY = gql`
  query GetPracticeNodesByCategory($categoryName: String!) {
    practiceNodesByCategory(categoryName: $categoryName) {
      id
      title
      description
      content
      date
      difficulty
      estimatedTime
      contentType
      componentName
      prerequisites
      category {
        id
        name
        color
      }
      tags {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_PRACTICE_NODES_BY_TAGS = gql`
  query GetPracticeNodesByTags($tagNames: [String!]!) {
    practiceNodesByTags(tagNames: $tagNames) {
      id
      title
      description
      content
      date
      difficulty
      estimatedTime
      contentType
      componentName
      prerequisites
      category {
        id
        name
        color
      }
      tags {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  }
`