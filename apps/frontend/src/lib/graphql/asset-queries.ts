import { gql } from '@apollo/client';

// 不再使用GraphQL上传，已改为REST API
// export const UPLOAD_ASSET = gql`...`

export const GET_ASSETS = gql`
  query GetAssets($type: AssetType, $search: String, $limit: Int, $offset: Int) {
    assets(type: $type, search: $search, limit: $limit, offset: $offset) {
      id
      name
      originalName
      url
      mimeType
      size
      type
      description
      alt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ASSET = gql`
  query GetAsset($id: ID!) {
    asset(id: $id) {
      id
      name
      originalName
      url
      mimeType
      size
      type
      description
      alt
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($input: UpdateAssetInput!) {
    updateAsset(input: $input) {
      id
      name
      description
      alt
      updatedAt
    }
  }
`;

export const REMOVE_ASSET = gql`
  mutation RemoveAsset($id: ID!) {
    removeAsset(id: $id)
  }
`;

export const GET_ASSET_STATS = gql`
  query GetAssetStats {
    assetStats {
      total
      totalSize
      byType {
        image
        video
        audio
        document
        other
      }
    }
  }
`;