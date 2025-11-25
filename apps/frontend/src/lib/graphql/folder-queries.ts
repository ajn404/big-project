import { gql } from '@apollo/client';

export const GET_FOLDERS = gql`
  query GetFolders($parentId: ID) {
    folders(parentId: $parentId) {
      id
      name
      description
      parentId
      color
      createdAt
      updatedAt
      children {
        id
        name
        color
      }
    }
  }
`;

export const GET_FOLDER = gql`
  query GetFolder($id: ID!) {
    folder(id: $id) {
      id
      name
      description
      parentId
      color
      createdAt
      updatedAt
      parent {
        id
        name
      }
      children {
        id
        name
        description
        color
        createdAt
      }
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      id
      name
      description
      parentId
      color
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FOLDER = gql`
  mutation UpdateFolder($input: UpdateFolderInput!) {
    updateFolder(input: $input) {
      id
      name
      description
      color
      updatedAt
    }
  }
`;

export const REMOVE_FOLDER = gql`
  mutation RemoveFolder($id: ID!) {
    removeFolder(id: $id)
  }
`;

export const MOVE_ASSET_TO_FOLDER = gql`
  mutation MoveAssetToFolder($input: MoveAssetToFolderInput!) {
    moveAssetToFolder(input: $input) {
      id
      name
      folderId
      folder {
        id
        name
      }
    }
  }
`;

export const MOVE_ASSETS_TO_FOLDER = gql`
  mutation MoveAssetsToFolder($input: MoveMassiveInput!) {
    moveAssetsToFolder(input: $input) {
      id
      name
      folderId
    }
  }
`;

export const GET_FOLDER_PATH = gql`
  query GetFolderPath($folderId: ID!) {
    getFolderPath(folderId: $folderId) {
      id
      name
    }
  }
`;

export const GET_FOLDER_ASSET_COUNT = gql`
  query GetFolderAssetCount($folderId: ID) {
    assets(folderId: $folderId, limit: 1000) {
      id
    }
  }
`;