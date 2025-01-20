export const initialState = {
    make: "Any Make",
    model: "Any Model",
    price: [50000, 100000],
    year: [2017, 2024],
    features: [],
    filtered: [],
    currentPage: 1,
    itemPerPage: 6,
  };
  
  export function reducer(state, action) {
    switch (action.type) {
      case "SET_MAKE":
      case "SET_MODEL":
        return { ...state, [action.type.split("_")[1].toLowerCase()]: action.payload };
      case "SET_PRICE":
      case "SET_YEAR":
        return { ...state, [action.type.split("_")[1].toLowerCase()]: action.payload };
      case "SET_FEATURES":
        return { ...state, features: action.payload };
      case "SET_FILTERED":
        return { ...state, filtered: action.payload };
      case "SET_CURRENT_PAGE":
        return { ...state, currentPage: action.payload };
      default:
        return state;
    }
  }
  