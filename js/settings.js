class Settings {
  constructor(point = 10, levels = 5, percentages = [0.3, 0.3, 0.3, 0.3, 0.3]) {
    this.point = point;
    this.levels = levels;
    this.percentages = percentages;
  }

  //METHODS *******************************************

  //SETTERS *******************************************

  /**
   * @param {number} value
   */
  set pointValue(value) {
    this.point = value;
  }

  /**
   * @param {number} value
   */
  set levelsValue(value) {
    this.levels = value;
  }

  /**
   * @param {number[]} value
   */
  set percentagesValue(value) {
    this.percentages = value;
  }

  //GETTERS *******************************************
  get pointValue() {
    return this.point;
  }

  get levelsValue() {
    return this.levels;
  }

  get percentagesValue() {
    return this.percentages;
  }
}
