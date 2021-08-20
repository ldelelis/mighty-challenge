describe('Post API routes test cases', () => {
  // CRUD
  test('should require a post description on creation', () => {

  });

  // authz/authn
  test('should disallow post lists for unauthenticated grammers', () => {

  });

  test('should disallow retrieving individual posts as an unaithenticated grammer', () => {

  });

  test('should disallow modifying other grammer\'s posts', () => {

  });

  test('should disallow deleting other grammer\'s posts', () => {

  });

  // pagination
  test('should return a pagination structure on listing posts', () => {

  });

  // maybe extract this to core pagination?
  test('should not show more posts per page than configurable maximum', () => {

  });
});
