export default class AverageCounter {
  private total = 0;
  private count = 0;

  public push(n: number) {
    this.count++;
    this.total += n;
  }

  public calculate() {
    return this.total / this.count;
  }
}
