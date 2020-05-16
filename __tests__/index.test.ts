const handler = require('../index');

test('test refresh', async () => {
    await handler.refresh({}, {});
});