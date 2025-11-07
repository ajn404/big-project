import { gql } from '@apollo/client'

export const CREATE_PRACTICE_NODE = gql`
  mutation CreatePracticeNode($input: CreatePracticeNodeInput!) {
    createPracticeNode(createPracticeNodeInput: $input) {
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

export const UPDATE_PRACTICE_NODE = gql`
  mutation UpdatePracticeNode($input: UpdatePracticeNodeInput!) {
    updatePracticeNode(updatePracticeNodeInput: $input) {
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

export const DELETE_PRACTICE_NODE = gql`
  mutation DeletePracticeNode($id: ID!) {
    removePracticeNode(id: $id)
  }
`