import {Post, PostImage} from "../models";

describe("Post model test cases", () => {
  test('should require a description', () => {

  });

  test('should not be visible without images', () => {

  });

  test('should be created with 0 likes', () => {

  });
});

describe("Post Image model test case", () => {
  test('should be unique for post and order', () => {
    let post = new Post();
    let image1 = new PostImage();
    image1.post = post;
    image1.order = 1;
    let image2 = new PostImage();
    image2.post = post;
    image2.order = 1;
  });

  test('should start image order at 1', () => {

  });

  test('should require an image', () => {

  });

  test('should not require an image caption', () => {

  });
});
