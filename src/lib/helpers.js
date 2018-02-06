export default {
  next: function (theArray, index) {
    if (index + 1 >= theArray.length) {
      return theArray[0]
    }

    return theArray[index + 1]
  },

  prev: function (theArray, index) {
    if (index - 1 < 0) {
      return theArray[theArray.length - 1]
    }

    return theArray[index - 1]
  }
}
