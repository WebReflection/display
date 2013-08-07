var expect = chai.expect;

describe('display', function () {
  it('it has at least width, height, and ratio', function () {
    expect(typeof display.width).to.equal('number');
    expect(typeof display.height).to.equal('number');
    expect(typeof display.ratio).to.equal('number');
    expect(0 < display.width).to.equal(true);
    expect(0 < display.height).to.equal(true);
    expect(0 < display.ratio).to.equal(true);
  });
});
