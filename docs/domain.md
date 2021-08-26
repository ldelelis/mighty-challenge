# MightyGram domain model

## Authentication model

Logical user (`AuthUser` entity) and application end-user (`Grammer` entity) were separated for two reasons:

1. Separating logical concerns (authentication) with aesthetic concerns (user presence and identity, although not a requirement)
2. Calling an identity simply a `User` has multiple [underlying issues](https://codewithoutrules.com/2018/09/21/users-considered-harmful/).

## Post and multiple images

Going beyond initial requirements, posts were modelled to support multiple images. These images can be arbitrarily re-ordered via an `order` column, validated to that no two images from the same post can have the same order

The current REST API layer is specified to create single-image posts, so management of multi-image posts in that layer should be done in a v2 namespaced endpoint

## Post visibility

Although not requested initially, posts allow for visibility conditions, should a soft-delete mechanism be required in the future.

Database queries for end-user content are already configured to only deal with visible posts.

## Post likes

Likes are handled as a "weak" entity; a sort of half-implemented Many-to-many relation, as to not duplicate the existing author/post one.

The existence of a grammer_id/post_id relation in the `PostLike` table is enough to constitute a like.
