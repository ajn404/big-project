import { gql } from '@apollo/client';

export const UI_COMPONENT_FRAGMENT = gql`
  fragment UIComponentFragment on UIComponent {
    id
    name
    description
    category
    template
    preview
    version
    author
    status
    props
    propsSchema
    documentation
    examples
    tags {
      id
      name
      color
    }
    createdAt
    updatedAt
  }
`;

export const GET_UI_COMPONENTS = gql`
  ${UI_COMPONENT_FRAGMENT}
  query GetUIComponents {
    uiComponents {
      ...UIComponentFragment
    }
  }
`;

export const GET_UI_COMPONENT = gql`
  ${UI_COMPONENT_FRAGMENT}
  query GetUIComponent($id: ID!) {
    uiComponent(id: $id) {
      ...UIComponentFragment
    }
  }
`;

export const GET_UI_COMPONENT_BY_NAME = gql`
  ${UI_COMPONENT_FRAGMENT}
  query GetUIComponentByName($name: String!) {
    uiComponentByName(name: $name) {
      ...UIComponentFragment
    }
  }
`;

export const SEARCH_UI_COMPONENTS = gql`
  ${UI_COMPONENT_FRAGMENT}
  query SearchUIComponents(
    $query: String
    $category: ComponentCategory
    $tagNames: [String!]
    $status: ComponentStatus
  ) {
    searchUIComponents(
      query: $query
      category: $category
      tagNames: $tagNames
      status: $status
    ) {
      ...UIComponentFragment
    }
  }
`;

export const GET_UI_COMPONENTS_BY_CATEGORY = gql`
  ${UI_COMPONENT_FRAGMENT}
  query GetUIComponentsByCategory($category: ComponentCategory!) {
    uiComponentsByCategory(category: $category) {
      ...UIComponentFragment
    }
  }
`;

export const GET_UI_COMPONENTS_BY_STATUS = gql`
  ${UI_COMPONENT_FRAGMENT}
  query GetUIComponentsByStatus($status: ComponentStatus!) {
    uiComponentsByStatus(status: $status) {
      ...UIComponentFragment
    }
  }
`;

export const GET_UI_COMPONENTS_BY_TAGS = gql`
  ${UI_COMPONENT_FRAGMENT}
  query GetUIComponentsByTags($tagNames: [String!]!) {
    uiComponentsByTags(tagNames: $tagNames) {
      ...UIComponentFragment
    }
  }
`;

export const GET_COMPONENT_CATEGORIES = gql`
  query GetComponentCategories {
    componentCategories
  }
`;

export const GET_COMPONENT_STATUSES = gql`
  query GetComponentStatuses {
    componentStatuses
  }
`;

export const GET_COMPONENT_STATS = gql`
  query GetComponentStats {
    componentStats {
      total
      active
      inactive
      deprecated
      byCategory {
        category
        count
      }
    }
  }
`;

export const CREATE_UI_COMPONENT = gql`
  ${UI_COMPONENT_FRAGMENT}
  mutation CreateUIComponent($input: CreateUIComponentInput!) {
    createUIComponent(createUIComponentInput: $input) {
      ...UIComponentFragment
    }
  }
`;

export const UPDATE_UI_COMPONENT = gql`
  ${UI_COMPONENT_FRAGMENT}
  mutation UpdateUIComponent($input: UpdateUIComponentInput!) {
    updateUIComponent(updateUIComponentInput: $input) {
      ...UIComponentFragment
    }
  }
`;

export const DELETE_UI_COMPONENT = gql`
  mutation DeleteUIComponent($id: ID!) {
    removeUIComponent(id: $id)
  }
`;